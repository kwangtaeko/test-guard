import type { Node } from 'web-tree-sitter';
import { normalizePath } from '../paths.js';
import type { FileStats, Language } from '../types.js';
import type { Counts } from './ast.js';
import { java } from './java.js';
import { js } from './js.js';
import { python } from './python.js';
import { count } from './strip.js';
import { parse } from './syntax.js';

export interface LanguageSpec {
  strip(source: string): string;
  // Tests, assertions and swallowed assertions, on the stripped code's tree.
  count(root: Node): Counts;
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
  const code = spec.strip(toLf(source));
  const skips =
    typeof spec.skips === 'function' ? spec.skips(code) : spec.skips;
  const tree = parse(language, code);
  let counts: Counts;
  try {
    counts = spec.count(tree.rootNode);
  } finally {
    tree.delete(); // WASM memory isn't garbage-collected
  }
  return {
    stats: {
      path: normalizePath(path),
      language,
      tests: counts.tests,
      assertions: counts.assertions,
      skips: count(code, skips),
    },
    lines: code.split('\n'),
    skips: findMatches(code, skips),
    swallowed: counts.swallowed,
  };
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
        .replace(/\s*\($/, '')
        .replace(/\s+/g, ' ')
        .trim(),
    });
  }
  return matches;
}
