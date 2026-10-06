import { isAssertionLine } from '../languages/index.js';
import { isSnapshot } from '../watched.js';
import type { Rule, RuleFinding } from './types.js';

// Expected values rewritten to match the code (ROADMAP §12.2 M10): an
// assertion whose values changed, or a snapshot that changed, while no
// implementation file changed. Judged over a whole comparison (commit, CI,
// Stop), never per edit: fixing a test before the code is a normal order.

const LITERAL_WORDS = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'None',
  'True',
  'False',
  'NaN',
]);

const TOKEN =
  /'(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?|\d[\w.]*|[A-Za-z_$][\w$]*|\S/g;

interface Shape {
  code: string[]; // identifiers that aren't literals, in order
  values: string[]; // literals, in order
}

// An assertion line split into its code and its values. Brackets and commas
// shape a value (`[[1, 2], [3]]` vs `[[1, 2, 3]]`); other punctuation, such
// as an operator, is left to TG007.
function shape(line: string): Shape {
  const code: string[] = [];
  const values: string[] = [];
  for (const [token] of line.matchAll(TOKEN)) {
    if (/^['"`\d[\]{},]/.test(token) || LITERAL_WORDS.has(token)) {
      values.push(token);
    } else if (/^[A-Za-z_$]/.test(token)) code.push(token);
  }
  return { code, values };
}

const same = (a: string[], b: string[]) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

// Line ranges of `toMatchInlineSnapshot(…)` arguments.
function inlineSnapshots(lines: string[]): [number, number][] {
  const ranges: [number, number][] = [];
  lines.forEach((line, i) => {
    if (!/\btoMatchInlineSnapshot\s*\(/.test(line)) return;
    let depth = 0;
    for (let j = i; j < lines.length; j++) {
      const from = j === i ? line.indexOf('toMatchInlineSnapshot') : 0;
      for (const ch of (lines[j] ?? '').slice(from)) {
        if (ch === '(') depth++;
        else if (ch === ')' && --depth === 0) {
          ranges.push([i + 1, j + 1]);
          return;
        }
      }
    }
  });
  return ranges;
}

const NOTE = 'without changing the implementation';

export const tg008: Rule = ({
  before,
  after,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
  implementationChanged,
}) => {
  if (implementationChanged !== false || !beforePath || !afterPath) return [];

  if (isSnapshot(afterPath)) {
    return hunks.length > 0
      ? [
          {
            ruleId: 'TG008',
            path: afterPath,
            message: `updated snapshot ${NOTE}`,
          },
        ]
      : [];
  }
  if (!before || !after) return [];
  const language = after.stats.language;
  const findings: RuleFinding[] = [];
  const inline = inlineSnapshots(afterLines);
  for (const hunk of hunks) {
    const deleted = hunk.deleted.filter((n) =>
      isAssertionLine(language, before.lines[n - 1] ?? ''),
    );
    for (const n of hunk.added) {
      const snapshot = inline.some(([from, to]) => n >= from && n <= to);
      if (snapshot) {
        findings.push({
          ruleId: 'TG008',
          path: afterPath,
          line: n,
          message: `changed an inline snapshot ${NOTE}`,
        });
        continue;
      }
      if (!isAssertionLine(language, after.lines[n - 1] ?? '')) continue;
      const added = shape(afterLines[n - 1] ?? '');
      const pair = deleted.findIndex((d) => {
        const old = shape(beforeLines[d - 1] ?? '');
        return same(old.code, added.code) && !same(old.values, added.values);
      });
      if (pair === -1) continue;
      const [d] = deleted.splice(pair, 1);
      findings.push({
        ruleId: 'TG008',
        path: afterPath,
        line: n,
        message: `changed asserted values ${NOTE}: \`${(beforeLines[(d ?? 0) - 1] ?? '').trim()}\` → \`${(afterLines[n - 1] ?? '').trim()}\``,
      });
    }
  }
  // One inline snapshot edit spans many lines; report it once.
  return findings.filter(
    (f, i) =>
      !f.message.startsWith('changed an inline') ||
      findings.findIndex((g) => g.message === f.message) === i,
  );
};
