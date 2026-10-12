import { isAssertionLine, type ValueCheck } from '../languages/index.js';
import type { Language } from '../types.js';
import { isSnapshot } from '../watched.js';
import {
  type Declaration,
  declarations,
  statementEnd,
  valueAt,
} from './declarations.js';
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
  declares?: string; // a name bound to an expected value
}

// Assertions, tables and inline snapshots, each extended over the lines its
// brackets span (Prettier and Black wrap long expected values). Brackets are
// counted on comment/string-stripped lines.
function statements(
  stripped: string[],
  language: Language,
  bound: Declaration[],
): Statement[] {
  const found: Statement[] = [];
  for (let i = 0; i < stripped.length; i++) {
    const line = stripped[i] ?? '';
    const inline = INLINE.test(line);
    if (!inline && !TABLE.test(line) && !isAssertionLine(language, line)) {
      continue;
    }
    const last = statementEnd(stripped, i);
    found.push({ start: i + 1, end: last + 1, inline });
    i = last;
  }
  // Expected values moved out of the assertions into names:
  // `const expected = 11` with `expect(add(5, 5)).toBe(expected)`.
  for (const d of bound) {
    found.push({ start: d.start, end: d.end, inline: false, declares: d.name });
  }
  return found;
}

// Code rather than a value: a call, a function. Constructors of plain
// values (`List.of(1, 2)`, `new Set([1])`, `Decimal("1.5")`) are values.
const CALL = /[\w$\]>)]\s*\(|=>|\bfunction\b|\blambda\b/;
const VALUE_OF =
  /(?:\bnew\s*(?:Set|Map|Date|BigDecimal|BigInteger)|\b(?:List|Set|Map)\.of(?:Entries)?|\bArrays\.asList|(?<![\w$.])(?:datetime\.)?(?:datetime|date|time|timedelta|Decimal|Fraction|dict|list|set|tuple|frozenset))\s*\(/g;
const isCode = (text: string) => CALL.test(text.replace(VALUE_OF, '('));

// A declaration whose value has no code in it, judged on stripped lines.
const literal = (stripped: string[], d: Declaration) =>
  !isCode(
    stripped
      .slice(d.start - 1, d.end)
      .join('\n')
      .replace(/^[^=]*=/, ''),
  );

// Names on the expected side of checks: a side with no call, and not on the
// other side. A name passed to the code under test is an input
// (`expect(f(x)).toBe(2)`), left alone.
function expectedNames(checks: ValueCheck[]): Set<string> {
  const names = (side: string) =>
    new Set(
      side
        .replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '')
        .match(/(?<![\w$.])[A-Za-z_$][\w$]*/g),
    );
  const found = new Set<string>();
  for (const { sides } of checks) {
    sides.forEach((side, i) => {
      if (isCode(side)) return;
      const other = names(sides[1 - i] ?? '');
      for (const name of names(side)) if (!other.has(name)) found.add(name);
    });
  }
  return found;
}

// Names passed to code outside the checks (`gson.fromJson(json, …)`): inputs
// of the code under test, even when a check also compares with them. Not
// function parameters, logging, or arguments inside checks and tables.
function inputNames(stripped: string[], language: Language): Set<string> {
  const names = new Set<string>();
  for (let i = 0; i < stripped.length; i++) {
    const line = stripped[i] ?? '';
    if (
      INLINE.test(line) ||
      TABLE.test(line) ||
      isAssertionLine(language, line)
    ) {
      i = statementEnd(stripped, i);
      continue;
    }
    if (
      /\bfunction\b|^\s*(?:async\s+)?def\s|=>|\b(?:console\.\w+|print|System\.out\.print\w*)\s*\(/.test(
        line,
      )
    ) {
      continue;
    }
    for (const [, name] of line.matchAll(
      /[(,]\s*([A-Za-z_$][\w$]*)\s*(?=[,)])/g,
    )) {
      if (name) names.add(name);
    }
  }
  return names;
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
// other punctuation, such as an operator, is left to TG007. A sign is part
// of the number it stands before (`-1`), and a constant on the expected side
// (`constants`: `Status.ACTIVE`, `Color.Red`, `MAX`) is a value. A test title
// (`it('…', …)` on the same line), comments and a trailing comma aren't
// values. A name bound to an expected value stands for that value
// (`resolve`), so moving the value into a variable keeps the shape.
function shape(
  text: string,
  language: Language,
  resolve?: (name: string) => string | undefined,
  constants = new Set<string>(),
): Shape {
  const code: string[] = [];
  const values: string[] = [];
  const tokens = [...text.matchAll(TOKEN)]
    .map(([token]) => token)
    // Comments; `#` starts one only in Python.
    .filter(
      (t) => !/^\/[/*]/.test(t) && !(language === 'python' && t[0] === '#'),
    );
  let title = false;
  let skip = -1; // the last token of a constant read already
  tokens.forEach((token, i) => {
    if (i <= skip) return;
    if (title && /^['"`]/.test(token)) {
      title = false;
      return;
    }
    title =
      (/^(?:it|test|specify|describe)$/.test(token) && code.length === 0) ||
      (title && token === '(');
    if (token === ',' && /^[)\]}]$/.test(tokens[i + 1] ?? '')) return;
    const value = tokens[i - 1] === '.' ? undefined : resolve?.(token);
    if (value !== undefined) {
      const inner = shape(value, language);
      code.push(...(inner.code ? [inner.code] : []));
      values.push(...inner.values);
    } else if (/^\d/.test(token) && negative(tokens, i)) {
      values.push(`-${normalize(token)}`);
    } else if (/^['"`\d[\]{},]/.test(token) || LITERAL_WORDS.has(token)) {
      values.push(normalize(token));
    } else if (/^[A-Za-z_$]/.test(token)) {
      // The longest member path from here that is a constant.
      let end = i;
      let path = token;
      let hit = constants.has(path) ? i : -1;
      while (
        tokens[end + 1] === '.' &&
        /^[A-Za-z_$]/.test(tokens[end + 2] ?? '')
      ) {
        path += `.${tokens[end + 2]}`;
        end += 2;
        if (constants.has(path)) hit = end;
      }
      if (tokens[i - 1] !== '.' && hit !== -1 && tokens[hit + 1] !== '(') {
        const name = tokens.slice(i, hit + 1).join('');
        // Java's boxed booleans are the literals they hold.
        const boxed = /(?:^|\.)Boolean\.(TRUE|FALSE)$/.exec(name);
        values.push(boxed ? (boxed[1] ?? '').toLowerCase() : `c:${name}`);
        skip = hit;
      } else code.push(token);
    }
  });
  return { code: code.join(' '), values };
}

// Constants on the expected side of checks (a side with no call, not on the
// other side): a member whose name starts with a capital (`Status.ACTIVE`,
// `Color.Red`), or a name in capitals (`MAX_SIZE`). Constants passed to the
// code under test (`f(MOCK.USER)`) are inputs, not counted.
function expectedConstants(checks: ValueCheck[]): Set<string> {
  const constants = (side: string) =>
    new Set(
      side
        .replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '')
        .match(
          /(?<![\w$.])(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\.[A-Z][\w$]*|[A-Z][A-Z0-9_]+)(?![\w$(])/g,
        ),
    );
  const found = new Set<string>();
  for (const { sides } of checks) {
    sides.forEach((side, i) => {
      if (isCode(side)) return;
      const other = constants(sides[1 - i] ?? '');
      for (const c of constants(side)) if (!other.has(c)) found.add(c);
    });
  }
  return found;
}

// A `-` before token `i` that is a sign, not a subtraction.
const negative = (tokens: string[], i: number) =>
  tokens[i - 1] === '-' && !/^[\w$'"`)\]}]/.test(tokens[i - 2] ?? '');

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
  const expected = expectedNames([...before.checks, ...after.checks]);
  for (const name of [
    ...inputNames(before.lines, language),
    ...inputNames(after.lines, language),
  ]) {
    expected.delete(name);
  }
  const bound = (stripped: string[], source: string[]) =>
    declarations(stripped, source, language).filter(
      (d) => expected.has(d.name) && literal(stripped, d),
    );
  const boundBefore = bound(before.lines, beforeLines);
  const boundAfter = bound(after.lines, afterLines);
  const constants = expectedConstants([...before.checks, ...after.checks]);
  // A statement's shape, its names bound to expected values resolved.
  const shapeOf = (
    s: Statement,
    source: string[],
    list: Declaration[],
  ): Shape => {
    const value = valueAt(list);
    return shape(
      source.slice(s.start - 1, s.end).join('\n'),
      language,
      s.declares ? undefined : (name) => value(name, s.start),
      constants,
    );
  };
  const old = touched(statements(before.lines, language, boundBefore), deleted);
  const findings: RuleFinding[] = [];
  for (const statement of touched(
    statements(after.lines, language, boundAfter),
    added,
  )) {
    const newLines = afterLines.slice(statement.start - 1, statement.end);
    const newShape = shapeOf(statement, afterLines, boundAfter);
    // Paired by code anywhere in the file: a reordered block still pairs.
    const pair = old.findIndex(
      (s) =>
        s.inline === statement.inline &&
        shapeOf(s, beforeLines, boundBefore).code === newShape.code,
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
    const oldShape = shapeOf(match, beforeLines, boundBefore);
    if (same(oldShape.values, newShape.values)) continue;
    const rows = (lines: string[]) =>
      lines
        .map((l) => shape(l, language, undefined, constants).values)
        .filter((v) => v.length > 0);
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

  // An expected value given again before a check that was already there
  // reads it (`expected = 11` under `let expected = 10`, in a
  // `beforeEach`, `+= 1`, `expected.total = 11`, a second Python
  // assignment): no changed assertion to pair it with. A value that only
  // new checks read, or that cleanup code sets, is left alone.
  const reported = new Set(findings.map((f) => f.line));
  const reads = (name: string) =>
    new RegExp(String.raw`(?<![\w$.])${name}(?![\w$])`);
  for (const n of added) {
    if (reported.has(n) || inArguments(after.lines, n)) continue;
    for (const { name, value, offset } of bindings(
      after.lines[n - 1] ?? '',
      afterLines[n - 1] ?? '',
      language,
    )) {
      if (!expected.has(name) || (value !== null && !isLiteral(value))) {
        continue;
      }
      // Bound before, on an earlier line or earlier on this one.
      const bound = (line: number, upTo?: number) =>
        bindsName(name, (after.lines[line - 1] ?? '').slice(0, upTo));
      let earlier = bound(n, offset);
      for (let k = 1; k < n && !earlier; k++) earlier = bound(k);
      if (!earlier) continue;
      // The first check after it that reads the name, with no other binding
      // in between, was there before this change.
      const check = after.checks
        .filter(
          (c) => c.start > n && c.sides.some((side) => reads(name).test(side)),
        )
        .sort((a, b) => a.start - b.start)[0];
      if (!check) continue;
      let between = false;
      for (let k = n + 1; k < check.start && !between; k++) between = bound(k);
      let existing = true;
      for (let k = check.start; k <= check.end; k++) {
        if (added.has(k)) existing = false;
      }
      if (
        between ||
        !existing ||
        cleanup(after.lines, n, language) ||
        (language === 'python' &&
          enclosingDef(after.lines, n) !==
            enclosingDef(after.lines, check.start))
      ) {
        continue;
      }
      findings.push({
        ruleId: 'TG008',
        path: afterPath,
        line: n,
        message: `assigned the expected value \`${name}\` again ${NOTE}: \`${brief([afterLines[n - 1] ?? ''])}\``,
      });
      reported.add(n);
      break;
    }
  }
  return findings;
};

// Bindings in a line (statements split at `;` outside Python): a name
// given a value (`expected = 11`, `let expected: number = 11`, `if (c)
// expected = 11`), changed in place (`+= 1`, `++`, value null) or through
// a member (`expected.total = 11`, `expected[0] = 11`). The value is read
// from `source`; `offset` is where the statement starts.
function bindings(
  stripped: string,
  source: string,
  language: Language,
): { name: string; value: string | null; offset: number }[] {
  const found: { name: string; value: string | null; offset: number }[] = [];
  const parts =
    language === 'python' ? [stripped] : stripped.split(';').filter(Boolean);
  let offset = 0;
  for (const part of parts) {
    const at = stripped.indexOf(part, offset);
    offset = at + part.length;
    const set = SET.exec(part);
    if (set?.[1]) {
      const operator = set[3] ?? '=';
      const from = at + (set.index ?? 0) + set[0].length;
      const value = source
        .slice(from, at + part.length)
        .trim()
        .replace(/;$/, '');
      const plain = operator === '=' && !set[2];
      found.push({ name: set[1], value: plain ? value : null, offset: at });
      continue;
    }
    const step = STEP.exec(part);
    const name = step?.[1] ?? step?.[2];
    if (name) found.push({ name, value: null, offset: at });
  }
  return found;
}

const SET =
  /^\s*(?:if\s*\(.*\)\s*)?(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$]*)((?:\.[\w$]+|\[[^\]]*\])*)\s*(?::[^=]*)?([-+*/%]?=)(?![=>])/;
const STEP =
  /^\s*(?:(?:\+\+|--)([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)(?:\+\+|--))\s*$/;

// A value written out: no call, and not just another name (`expected = e`
// in a loop).
const isLiteral = (value: string) =>
  !isCode(value) &&
  !(/^[A-Za-z_$][\w$]*$/.test(value) && !LITERAL_WORDS.has(value));

// Whether a line declares or sets `name`: `let expected;`, `int expected;`,
// `expected = 10`, `expected: int = 10`.
function bindsName(name: string, line: string): boolean {
  return new RegExp(
    String.raw`(?<![\w$.])${name}\s*(?::[^=;]*)?(?:=(?![=>])|;|$)`,
  ).test(line);
}

// Whether line `n` is in cleanup code, which runs after the checks:
// `afterEach`/`afterAll` (JS), `@AfterEach`/`@After` (Java), `teardown`
// methods (Python).
function cleanup(stripped: string[], n: number, language: Language): boolean {
  if (language === 'python') {
    return /^(?:teardown|tearDown)\w*$/.test(enclosingDef(stripped, n) ?? '');
  }
  const open: number[] = [];
  stripped.slice(0, n - 1).forEach((line, i) => {
    for (const ch of line) {
      if (ch === '{') open.push(i);
      else if (ch === '}') open.pop();
    }
  });
  return open.some((i) =>
    /\bafter(?:Each|All)\b|@After(?:Each|All)?\b/.test(
      `${stripped[i - 1] ?? ''} ${stripped[i] ?? ''}`,
    ),
  );
}

// The name of the Python function line `n` is in, by indentation.
function enclosingDef(stripped: string[], n: number): string | undefined {
  const indent = (line: string) => line.length - line.trimStart().length;
  let limit = indent(stripped[n - 1] ?? '');
  for (let k = n - 1; k >= 1; k--) {
    const line = stripped[k - 1] ?? '';
    if (line.trim() === '' || indent(line) >= limit) continue;
    const def = /^\s*(?:async\s+)?def\s+(\w+)/.exec(line);
    if (def) return def[1];
    limit = indent(line);
  }
  return undefined;
}

// Whether line `n` starts inside parentheses or square brackets, as a
// keyword argument does (`f(\n  r=3,\n)`), rather than in a block.
function inArguments(stripped: string[], n: number): boolean {
  const open: string[] = [];
  for (const line of stripped.slice(0, n - 1)) {
    for (const ch of line) {
      if ('([{'.includes(ch)) open.push(ch);
      else if (')]}'.includes(ch)) open.pop();
    }
  }
  const last = open.at(-1);
  return last === '(' || last === '[';
}
