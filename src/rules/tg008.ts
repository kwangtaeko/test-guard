import { isAssertionLine } from '../languages/index.js';
import type { Language } from '../types.js';
import { isSnapshot } from '../watched.js';
import type { Rule, RuleFinding } from './types.js';

// Expected values rewritten to match the code (ROADMAP §12.2 M10): an
// assertion or test table whose values changed, or a snapshot that changed,
// while no implementation file changed. Judged over a whole comparison
// (commit, CI, Stop), never per edit: fixing a test before the code is a
// normal order.

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
  /'(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?|\/\/.*|\/\*.*?\*\/|#.*|\d[\w.]*|[A-Za-z_$][\w$]*|\S/g;

// Test tables: `it.each([...])`, `@pytest.mark.parametrize(...)`, JUnit
// `@CsvSource` / `@ValueSource`.
const TABLE = /\.each\s*\(|\bparametrize\s*\(|@(?:CsvSource|ValueSource)\s*\(/;
const INLINE = /\btoMatchInlineSnapshot\s*\(/;

interface Statement {
  start: number; // 1-based, inclusive
  end: number;
  inline: boolean;
}

// Assertions, tables and inline snapshots, each extended over the lines its
// brackets span (Prettier and Black wrap long expected values). Brackets are
// counted on comment/string-stripped lines.
function statements(stripped: string[], language: Language): Statement[] {
  const found: Statement[] = [];
  for (let i = 0; i < stripped.length; i++) {
    const line = stripped[i] ?? '';
    const inline = INLINE.test(line);
    if (!inline && !TABLE.test(line) && !isAssertionLine(language, line)) {
      continue;
    }
    let depth = 0;
    let end = i;
    for (let j = i; j < stripped.length && j < i + 200; j++) {
      for (const ch of stripped[j] ?? '') {
        if ('([{'.includes(ch)) depth++;
        else if (')]}'.includes(ch)) depth--;
      }
      end = j;
      if (depth <= 0) break;
    }
    found.push({ start: i + 1, end: end + 1, inline });
    i = end;
  }
  return found;
}

// A literal compared by value: `'a'` = `"a"`, `1000` = `1_000` = `1e3`.
function normalize(token: string): string {
  if (/^['"`]/.test(token)) return `s:${token.slice(1, -1)}`;
  if (/^\d/.test(token)) {
    const n = Number(token.replace(/_/g, ''));
    return Number.isNaN(n) ? token : `n:${n}`;
  }
  return token;
}

interface Shape {
  code: string; // identifiers that aren't literals
  values: string[]; // literals, brackets and commas
}

// Brackets and commas shape a value (`[[1, 2], [3]]` vs `[[1, 2, 3]]`);
// other punctuation, such as an operator, is left to TG007. A test title
// (`it('…', …)` on the same line) and comments aren't values.
function shape(text: string, language: Language): Shape {
  const code: string[] = [];
  const values: string[] = [];
  let title = false;
  for (const [token] of text.matchAll(TOKEN)) {
    // Comments; `#` starts one only in Python.
    if (/^\/[/*]/.test(token) || (language === 'python' && token[0] === '#')) {
      continue;
    }
    if (title && /^['"`]/.test(token)) {
      title = false;
      continue;
    }
    title =
      (/^(?:it|test|specify|describe)$/.test(token) && code.length === 0) ||
      (title && token === '(');
    if (/^['"`\d[\]{},]/.test(token) || LITERAL_WORDS.has(token)) {
      values.push(normalize(token));
    } else if (/^[A-Za-z_$]/.test(token)) code.push(token);
  }
  return { code: code.join(' '), values };
}

const same = (a: string[], b: string[]) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

// Values only added: an assertion message appended, rows added to a table.
function onlyAdded(
  before: string[],
  after: string[],
  rowsBefore: string[][],
  rowsAfter: string[][],
): boolean {
  if (same(before, after.slice(0, before.length))) return true;
  if (rowsBefore.length < 2) return false;
  const left = rowsAfter.map((r) => r.join(' '));
  return rowsBefore.every((row) => {
    const i = left.indexOf(row.join(' '));
    if (i === -1) return false;
    left.splice(i, 1);
    return true;
  });
}

const NOTE = 'without changing the implementation';
const brief = (lines: string[]) => {
  const text = lines.map((l) => l.trim()).join(' ');
  return text.length > 100 ? `${text.slice(0, 97)}...` : text;
};

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
  if (implementationChanged !== false) return [];

  // A snapshot changed, deleted (to be written again from the current
  // output) or moved with new content. A new snapshot is a new test.
  const snapshot = afterPath ?? beforePath;
  if (snapshot && beforePath && isSnapshot(beforePath)) {
    const moved = afterPath !== beforePath;
    if (afterPath === null || hunks.length > 0) {
      return [
        {
          ruleId: 'TG008',
          path: snapshot,
          message:
            afterPath === null
              ? `deleted snapshot ${NOTE}`
              : `${moved ? 'moved and ' : ''}updated snapshot ${NOTE}`,
        },
      ];
    }
    return [];
  }
  if (!before || !after || !afterPath) return [];

  const language = after.stats.language;
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added = new Set(hunks.flatMap((h) => h.added));
  const touched = (list: Statement[], lines: Set<number>) =>
    list.filter((s) => {
      for (let n = s.start; n <= s.end; n++) if (lines.has(n)) return true;
      return false;
    });
  const old = touched(statements(before.lines, language), deleted);
  const findings: RuleFinding[] = [];
  for (const statement of touched(statements(after.lines, language), added)) {
    const newLines = afterLines.slice(statement.start - 1, statement.end);
    const newShape = shape(newLines.join('\n'), language);
    // Paired by code anywhere in the file: a reordered block still pairs.
    const pair = old.findIndex(
      (s) =>
        s.inline === statement.inline &&
        shape(beforeLines.slice(s.start - 1, s.end).join('\n'), language)
          .code === newShape.code,
    );
    if (pair === -1) continue; // a new assertion
    const [match] = old.splice(pair, 1);
    if (!match) continue;
    const oldLines = beforeLines.slice(match.start - 1, match.end);
    const line =
      [...added].filter((n) => n >= statement.start && n <= statement.end)[0] ??
      statement.start;
    if (statement.inline) {
      const text = (lines: string[]) => lines.map((l) => l.trim()).join('\n');
      if (text(oldLines) !== text(newLines)) {
        findings.push({
          ruleId: 'TG008',
          path: afterPath,
          line,
          message: `changed an inline snapshot ${NOTE}`,
        });
      }
      continue;
    }
    const oldShape = shape(oldLines.join('\n'), language);
    if (same(oldShape.values, newShape.values)) continue;
    const rows = (lines: string[]) =>
      lines.map((l) => shape(l, language).values).filter((v) => v.length > 0);
    if (
      onlyAdded(
        oldShape.values,
        newShape.values,
        rows(oldLines),
        rows(newLines),
      )
    ) {
      continue;
    }
    findings.push({
      ruleId: 'TG008',
      path: afterPath,
      line,
      message: `changed asserted values ${NOTE}: \`${brief(oldLines)}\` → \`${brief(newLines)}\``,
    });
  }
  return findings;
};
