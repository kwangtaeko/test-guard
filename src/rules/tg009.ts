import { isNumber } from '../engine/literals.js';
import type { Rule, RuleFinding } from './types.js';

// Special-casing a test input in the code (ROADMAP §12.2 M12): an added line
// in implementation code compares with a literal that an existing test passes
// to the code under test, and right there the code produces that test's
// expected value. `if (s === 'IV') return 6;` makes
// `assert.equal(romanToInt('IV'), 6)` pass without implementing anything,
// while `case 'add': return a + b;` for `calc('add', 1, 2)` is a feature.

// Strings in any quote style (`\x60` is a backtick) and numbers.
const LITERAL = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?`;

// Equality checks and branches on a literal.
const COMPARISONS = [
  `(?:===?|!==?)\\s*(${LITERAL})`,
  `(${LITERAL})\\s*(?:===?|!==?)`,
  `\\b(?:case|when)\\s+(${LITERAL})\\s*(?::|->|=>|then\\b)`,
  `\\.equals(?:IgnoreCase)?\\(\\s*(${LITERAL})\\s*\\)`,
  `(${LITERAL})\\.equals(?:IgnoreCase)?\\(`,
  `\\bObject\\.is\\([^,()]*,\\s*(${LITERAL})\\s*\\)`,
  `\\[\\s*(${LITERAL})\\s*\\]\\.includes\\(`,
  `\\bin\\s*[[(]\\s*(${LITERAL})\\s*,?\\s*[\\])]`,
].map((p) => new RegExp(p, 'g'));

// Values too common to say anything: small numbers, `typeof` results,
// platforms and environments.
const COMMON = new Set([
  '0',
  '1',
  '2',
  '-1',
  '10',
  '100',
  '1000',
  'string',
  'number',
  'boolean',
  'object',
  'function',
  'undefined',
  'symbol',
  'bigint',
  'win32',
  'darwin',
  'linux',
  'production',
  'development',
  'test',
]);

const unquote = (token: string) =>
  /^['"`]/.test(token) ? token.slice(1, -1) : token;

const COMMENT = /^\s*(?:\/\/|#|\*|\/\*)/;

// Whether `value` appears in `text` as a literal.
function mentions(text: string, value: string): boolean {
  if (isNumber(value)) {
    return new RegExp(`(?<![\\w.])${value.replace('.', '\\.')}(?![\\w.])`).test(
      text,
    );
  }
  if (value === 'true' || value === 'false') {
    return new RegExp(`\\b${value}\\b`, 'i').test(text);
  }
  return [`'${value}'`, `"${value}"`, `\`${value}\``].some((f) =>
    text.includes(f),
  );
}

// A comparison that is itself the returned value, for a test expecting
// true/false: `return … || s === 'hello';`, not `if (s === 'x') return …`.
function isResult(line: string, token: string): boolean {
  const at = line.indexOf(token);
  const before = line.slice(0, at);
  const after = line.slice(at + token.length);
  return (
    /(?:\breturn\b|\|\||&&|=>)[^;{}()]*$/.test(before) &&
    !/^\s*\)\s*(?:\{|\breturn\b|\w)/.test(after)
  );
}

interface Candidate {
  literal: string;
  token: string;
  line: number; // 1-based in the new file
  near: string; // the line and the added lines right after it
}

export const tg009: Rule = ({
  implementationFile,
  findLiteral,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
}) => {
  if (!implementationFile || !findLiteral || !afterPath) return [];
  // Code that was already there (comments don't count).
  const before = beforeLines.filter((l) => !COMMENT.test(l)).join('\n');
  const added = new Set(hunks.flatMap((h) => h.added));
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  for (const n of [...added].sort((a, b) => a - b)) {
    const text = afterLines[n - 1] ?? '';
    if (COMMENT.test(text)) continue;
    for (const re of COMPARISONS) {
      for (const match of text.matchAll(re)) {
        const token = match[1] ?? '';
        const literal = unquote(token);
        // Short, common, escaped or blank values say nothing.
        if (literal.length < 2 && !isNumber(literal)) continue;
        if (COMMON.has(literal) || /\\|^[\s\p{P}]*$/u.test(literal)) continue;
        if (seen.has(literal) || before.includes(token)) continue;
        seen.add(literal);
        const near = [n, n + 1, n + 2, n + 3]
          .filter((i) => i === n || added.has(i))
          .map((i) => afterLines[i - 1] ?? '')
          .join('\n');
        candidates.push({ literal, token, line: n, near });
      }
    }
  }
  if (candidates.length === 0) return [];
  const uses = findLiteral(candidates.map((c) => c.literal));
  const findings: RuleFinding[] = [];
  for (const { literal, token, line, near } of candidates) {
    const use = uses.get(literal);
    if (!use?.test || use.inCode) continue;
    const lineText = afterLines[line - 1] ?? '';
    const result = use.expected.find(
      (v) =>
        mentions(near, v) ||
        ((v === 'true' || v === 'false') && isResult(lineText, token)),
    );
    if (result === undefined) continue;
    findings.push({
      ruleId: 'TG009',
      path: afterPath,
      line,
      message: `special-cases ${token}, an input an existing test passes in (${use.test.path}:${use.test.line}: \`${use.test.text.trim().slice(0, 80)}\`), and produces that test's expected \`${result}\` there instead of implementing the behavior`,
    });
  }
  return findings;
};
