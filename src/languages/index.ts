import type { Node } from 'web-tree-sitter';
import { normalizePath } from '../paths.js';
import type { FileStats, Language } from '../types.js';
import type { Check, Counts } from './ast.js';
import { java } from './java.js';
import { js } from './js.js';
import { python } from './python.js';
import { parse } from './syntax.js';

export interface LanguageSpec {
  strip(source: string): string;
  // Tests and assertions, and those that can't fail the test, on the
  // stripped code's tree.
  count(root: Node): Counts;
  // Checks of values, on the stripped code's tree (TG007, TG008).
  checks(root: Node): Check[];
  // Skips found on the tree of the original source, where the patterns
  // fall short (string values, imports, variables).
  treeSkips?(root: Node, path: string): SkipMatch[];
  // An assertion on one stripped line (TG007, TG008).
  assertions: RegExp;
  // A function when the pattern depends on the file (imported aliases).
  skips: RegExp | ((code: string) => RegExp);
}

export interface SkipMatch {
  line: number;
  text: string; // e.g. `it.skip`, `@Disabled`
}

export interface Analysis {
  stats: FileStats;
  lines: string[]; // stripped lines, same numbering as the source
  skips: SkipMatch[];
  swallowed: number; // assertions left out of stats because failures are caught
  unreachable: number; // assertions left out of stats because they never run
  deadTests: number; // tests left out of stats because they never run
  checks: ValueCheck[];
}

export interface ValueCheck {
  start: number; // lines, 1-based
  end: number;
  sides: [string, string]; // source text without whitespace
  equal: boolean; // the sides must be equal
}

const SPECS: Record<Language, LanguageSpec> = { js, python, java };

// Whether a comment/string-stripped line holds an assertion.
export function isAssertionLine(language: Language, line: string): boolean {
  return new RegExp(SPECS[language].assertions.source).test(line);
}

export function toLf(source: string): string {
  return source.replace(/\r\n?/g, '\n');
}

export function analyzeSource(
  path: string,
  source: string,
  language: Language,
): Analysis {
  const spec = SPECS[language];
  const lf = toLf(source);
  const code = spec.strip(lf);
  const skips =
    typeof spec.skips === 'function' ? spec.skips(code) : spec.skips;
  const tree = parse(language, code);
  let counts: Counts;
  let checks: ValueCheck[] = [];
  try {
    counts = spec.count(tree.rootNode);
    checks = valueChecks(spec, tree.rootNode, code, lf, language);
  } finally {
    tree.delete(); // WASM memory isn't garbage-collected
  }
  const matches = findMatches(code, skips);
  if (spec.treeSkips) {
    const raw = parse(language, lf);
    try {
      // One report per line: the patterns may have seen it already.
      const lines = new Set(matches.map((m) => m.line));
      for (const match of spec.treeSkips(raw.rootNode, path)) {
        if (!lines.has(match.line)) matches.push(match);
        lines.add(match.line);
      }
    } finally {
      raw.delete();
    }
    matches.sort((a, b) => a.line - b.line);
  }
  return {
    stats: {
      path: normalizePath(path),
      language,
      tests: counts.tests,
      assertions: counts.assertions,
      skips: matches.length,
    },
    lines: code.split('\n'),
    skips: matches,
    swallowed: counts.swallowed,
    unreachable: counts.unreachable,
    deadTests: counts.deadTests,
    checks,
  };
}

// Checks of values, with each side's text taken from the source, where
// strings aren't blanked. When decoding escapes (`é`) changed the
// stripped code's length, its offsets don't fit the source, so the
// source's own tree is used, without its comments.
function valueChecks(
  spec: LanguageSpec,
  stripped: Node,
  code: string,
  lf: string,
  language: Language,
): ValueCheck[] {
  const text = (n: Node) =>
    lf
      .slice(n.startIndex, n.endIndex)
      .replace(/\s+/g, '')
      .replace(/,(?=[)\]}])/g, '');
  const toValue = ({ node, sides, equal }: Check): ValueCheck => ({
    start: node.startPosition.row + 1,
    end: node.endPosition.row + 1,
    sides: [text(sides[0]), text(sides[1])],
    equal,
  });
  if (code.length === lf.length) return spec.checks(stripped).map(toValue);
  const raw = parse(language, lf);
  try {
    return spec
      .checks(raw.rootNode)
      .filter(({ sides }) => sides.every((s) => !/comment/.test(s.type)))
      .map(toValue);
  } finally {
    raw.delete();
  }
}

export function analyzeFile(
  path: string,
  source: string,
  language: Language,
): FileStats {
  return analyzeSource(path, source, language).stats;
}

function findMatches(code: string, pattern: RegExp): SkipMatch[] {
  const matches: SkipMatch[] = [];
  let line = 1;
  let pos = 0;
  for (const match of code.matchAll(pattern)) {
    for (; pos < match.index; pos++) if (code[pos] === '\n') line++;
    matches.push({
      line,
      text: match[0]
        .replace(/\s*(?:\?\.\s*)?\($/, '')
        .replace(/\s+/g, ' ')
        .trim(),
    });
  }
  return matches;
}
