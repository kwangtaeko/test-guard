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
  expected: Set<string>,
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
  // Several names bound at once: `value, expected = 5, 10`,
  // `const [value, expected] = [5, 10]`, `const { expected } = {…}`.
  stripped.forEach((line, i) => {
    const names = UNPACK[language]?.exec(line);
    const name = names?.[1]
      ?.split(',')
      .map((n) => n.trim())
      .find((n) => expected.has(n));
    if (!names || !name) return;
    const end = statementEnd(stripped, i);
    const value = stripped
      .slice(i, end + 1)
      .join('\n')
      .slice(names[0].length);
    if (!isCode(value)) {
      found.push({ start: i + 1, end: end + 1, inline: false, declares: name });
    }
  });
  return found;
}

const UNPACK: Partial<Record<Language, RegExp>> = {
  js: /^\s*(?:const|let|var)\s+[[{]\s*([\w$]+(?:\s*,\s*[\w$]+)*)\s*,?\s*[\]}]\s*=(?![=>])/,
  python:
    /^\s*\(?\s*((?:self\.)?\w+(?:\s*,\s*(?:self\.)?\w+)+)\s*,?\s*\)?\s*=(?!=)/,
};

// Code rather than a value: a call, a function. Constructors of plain
// values (`List.of(1, 2)`, `new Set([1])`, `Decimal("1.5")`) are values.
const CALL = /[\w$\]>)]\s*\(|=>|\bfunction\b|\blambda\b/;
const VALUE_OF =
  /(?:\bnew\s*(?:Set|Map|Date|BigDecimal|BigInteger)|\b(?:List|Set|Map)\.of(?:Entries)?|\bArrays\.asList|(?<![\w$.])(?:datetime\.)?(?:datetime|date|time|timedelta|Decimal|Fraction|dict|list|set|tuple|frozenset))\s*\(/g;
// A literal converted to its own type: `Number("11")`, `int("11")`,
// `parseInt("11", 10)`, `Integer.parseInt("11")`.
const WRAPPED =
  /(?<![\w$.])(?:(?:Number\.)?(?:parseInt|parseFloat)|Number|String|BigInt|Boolean|int|float|str|bool|(?:Integer|Long|Double)\.valueOf|Integer\.parseInt|Long\.parseLong|Double\.parseDouble)\s*\(\s*(-?\s*(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`[^`$\\]*`|\d[\w.]*))(?:\s*,\s*\d+)?\s*\)/g;
// A TypeScript cast: `11 as number`, `[1] as const`.
const CAST = /\s+as\s+(?:const\b|[A-Za-z_$][\w$.]*(?:<[^>]*>)?(?:\[\])*)/g;
const isCode = (text: string) =>
  CALL.test(text.replace(WRAPPED, '$1').replace(VALUE_OF, '('));

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
        .match(/(?<![\w$.])(?:self\.)?[A-Za-z_$][\w$]*/g),
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

// Names passed to code outside the checks (`gson.fromJson(json, …)`,
// `post(json=payload)`, `User(**data)`, `send({ ...user })`, `for n in names`,
// `store[1] = item`, `f"/users/{id}"`): inputs of the code under test, even
// when a check also compares with them. Not function parameters, logging, or
// arguments inside checks and tables.
const NAME = String.raw`((?:self\.)?[A-Za-z_$][\w$]*)`;
const INPUT = new RegExp(
  [
    String.raw`[(,]\s*(?:[A-Za-z_]\w*\s*=\s*)?${NAME}\s*(?=[,)])`,
    String.raw`[(,{[]\s*(?:\.\.\.|\*\*?)\s*${NAME}`,
    String.raw`\$\{\s*${NAME}`,
    String.raw`\bfor\b.*\b(?:in|of)\s+${NAME}`,
    String.raw`^\s*(?!self\.[\w$]+\s*=)[\w$]+(?:\[[^\]]*\]|\.[\w$]+)+\s*=\s*${NAME}\s*;?\s*$`,
  ].join('|'),
  'g',
);

// Lines that pass nothing to the code under test: definitions (their
// parameters) and logging.
const NOT_INPUT =
  /\bfunction\b|^\s*(?:async\s+)?def\s|=>|\b(?:console\.\w+|Object\.assign|print|System\.out\.print\w*)\s*\(/;
const OWN_LINE = new RegExp(
  String.raw`^\s*(?:[A-Za-z_]\w*\s*=\s*)?${NAME}\s*(?:,|\)+\s*;?)?\s*$`,
);

// For each line, the index of the line whose `(` is the innermost bracket
// still open where it starts; -1 when that bracket isn't a `(`.
function callLines(stripped: string[]): number[] {
  const open: { ch: string; line: number }[] = [];
  return stripped.map((line, i) => {
    const top = open.at(-1);
    const at = top?.ch === '(' ? top.line : -1;
    for (const ch of line) {
      if ('([{'.includes(ch)) open.push({ ch, line: i });
      else if (')]}'.includes(ch)) open.pop();
    }
    return at;
  });
}

function inputNames(
  stripped: string[],
  source: string[],
  language: Language,
): Set<string> {
  const names = new Set<string>();
  const call = callLines(stripped);
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
    // An argument on a line of its own (`f(\n  expected,\n)`), in a call
    // that isn't a definition or logging.
    const own = OWN_LINE.exec(line)?.[1];
    const opened = call[i] ?? -1;
    if (own && opened !== -1 && !NOT_INPUT.test(stripped[opened] ?? '')) {
      names.add(own);
    }
    if (NOT_INPUT.test(line)) continue;
    for (const match of line.matchAll(INPUT)) {
      for (const name of match.slice(1)) if (name) names.add(name);
    }
    // Python f-strings, whose contents are blanked in `stripped`.
    const text = source[i] ?? '';
    if (language === 'python' && /\b[fF][rR]?['"]/.test(text)) {
      for (const [, name] of text.matchAll(/\{\s*((?:self\.)?[A-Za-z_]\w*)/g)) {
        if (name) names.add(name);
      }
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
// (`resolve`), so moving the value into a variable keeps the shape. A
// literal converted to its own type (`Number("11")`) or cast (`11 as
// number`) is that literal.
function shape(
  text: string,
  language: Language,
  resolve?: (name: string) => string | undefined,
  constants = new Set<string>(),
): Shape {
  const code: string[] = [];
  const values: string[] = [];
  const plain = text.replace(WRAPPED, '$1');
  const tokens = [
    ...(language === 'js' ? plain.replace(CAST, '') : plain).matchAll(TOKEN),
  ]
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
    // A Python attribute (`self.expected`) is a name of its own.
    const attribute =
      token === 'self' &&
      tokens[i + 1] === '.' &&
      /^[A-Za-z_]/.test(tokens[i + 2] ?? '')
        ? resolve?.(`self.${tokens[i + 2]}`)
        : undefined;
    if (attribute !== undefined) skip = i + 2;
    const value =
      tokens[i - 1] === '.' ? undefined : (attribute ?? resolve?.(token));
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
    ...inputNames(before.lines, beforeLines, language),
    ...inputNames(after.lines, afterLines, language),
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
      withoutMessages(source.slice(s.start - 1, s.end).join('\n'), language),
      language,
      s.declares ? undefined : (name) => value(name, s.start),
      constants,
    );
  };
  const old = touched(
    statements(before.lines, language, boundBefore, expected),
    deleted,
  );
  const findings: RuleFinding[] = [];
  for (const statement of touched(
    statements(after.lines, language, boundAfter, expected),
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
    new RegExp(String.raw`(?<![\w$.])${quoted(name)}(?![\w$])`);
  for (const n of added) {
    if (reported.has(n) || inArguments(after.lines, n)) continue;
    for (const { name, value, offset } of bindings(
      after.lines[n - 1] ?? '',
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
            enclosingDef(after.lines, check.start) &&
          // An attribute is shared with the tests from `setUp` and other
          // methods that aren't tests.
          !(
            name.startsWith('self.') &&
            !/^test/.test(enclosingDef(after.lines, n) ?? 'test')
          ))
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

  // A pytest fixture giving an expected value (`return 11` in `def
  // expected()`) that a check already there reads.
  for (const n of language === 'python' ? added : []) {
    const value = /^\s*(?:return|yield)\s+(.+)$/.exec(after.lines[n - 1] ?? '');
    const name = enclosingDef(after.lines, n);
    if (
      reported.has(n) ||
      !value?.[1] ||
      !name ||
      !expected.has(name) ||
      !isLiteral(value[1].trim()) ||
      !fixture(after.lines, name)
    ) {
      continue;
    }
    const read = after.checks.some(
      (c) =>
        c.sides.some((side) => reads(name).test(side)) &&
        ![...added].some((k) => k >= c.start && k <= c.end),
    );
    if (!read) continue;
    findings.push({
      ruleId: 'TG008',
      path: afterPath,
      line: n,
      message: `changed the expected value the fixture \`${name}\` gives ${NOTE}: \`${brief([afterLines[n - 1] ?? ''])}\``,
    });
  }
  return findings;
};

// A failure message: a string, f-string or template literal (or one joined
// with `+`), never a condition moved into the message's place.
const isMessage = (arg: string) => /^\s*(?:[rRbBuUfF]{1,2})?['"`]/.test(arg);

type Pick = (args: string[]) => number[];
// Arguments from `n` on that are messages.
const after =
  (n: number): Pick =>
  (args) =>
    args.flatMap((a, i) => (i >= n && isMessage(a) ? [i] : []));
// JUnit's message: first (JUnit 4) or last (JUnit 5), when there are more
// than `n` arguments and only one of the two is a string.
const ends =
  (n: number): Pick =>
  (args) => {
    if (args.length <= n) return [];
    const first = isMessage(args[0] ?? '');
    const last = isMessage(args.at(-1) ?? '');
    if (first === last) return [];
    return [first ? 0 : args.length - 1];
  };

// Calls with failure messages among their arguments.
const MESSAGES: Record<Language, { re: RegExp; pick: Pick }[]> = {
  js: [
    {
      re: /(?<![\w$])(?:[\w$]+\.)?assert\.(?:equal|notEqual|strictEqual|notStrictEqual|deepEqual|notDeepEqual|deepStrictEqual|notDeepStrictEqual|include|notInclude|deepInclude|lengthOf|typeOf|instanceOf|match|isAbove|isBelow|isAtLeast|isAtMost|sameMembers)\s*\(/g,
      pick: after(2),
    },
    {
      re: /(?<![\w$.])(?:[\w$]+\.)?assert(?:\.(?:ok|isOk|isTrue|isFalse|exists|isNull|isNotNull))?\s*\(/g,
      pick: after(1),
    },
    { re: /(?<![\w$.])expect\s*\(/g, pick: after(1) },
  ],
  python: [
    {
      re: /(?<![\w.])self\.assert(?:Equals?|NotEqual|Is|IsNot|In|NotIn|Greater|GreaterEqual|Less|LessEqual|CountEqual|ListEqual|DictEqual|TupleEqual|SetEqual|MultiLineEqual|SequenceEqual|IsInstance|NotIsInstance|Regex|NotRegex)\s*\(/g,
      pick: after(2),
    },
    {
      re: /(?<![\w.])self\.assert(?:True|False|IsNone|IsNotNone)\s*\(/g,
      pick: after(1),
    },
    {
      re: /(?<![\w.])self\.assert\w*\s*\(/g,
      pick: (args) =>
        args.flatMap((a, i) => (/^\s*msg\s*=/.test(a) ? [i] : [])),
    },
  ],
  java: [
    {
      re: /\.(?:as|describedAs|withFailMessage|overridingErrorMessage)\s*\(|(?<![\w$])assertWithMessage\s*\(/g,
      pick: (args) => args.map((_, i) => i),
    },
    {
      re: /(?<![\w$.])assert(?:Equals|NotEquals|Same|NotSame|ArrayEquals|IterableEquals|LinesMatch)\s*\(/g,
      pick: ends(2),
    },
    {
      re: /(?<![\w$.])assert(?:True|False|Null|NotNull)\s*\(/g,
      pick: ends(1),
    },
    // Hamcrest's reason: `assertThat("reason", actual, matcher)`.
    {
      re: /(?<![\w$.])assertThat\s*\(/g,
      pick: (args) =>
        args.length === 3 && isMessage(args[0] ?? '') ? [0] : [],
    },
  ],
};

// An assertion without its failure messages (`assert.equal(a, b, 'msg')`,
// `assert x == y, "msg"`, `msg=`, AssertJ `.as("msg")`, JUnit's message):
// fixing a typo in one changes no expected value.
function withoutMessages(text: string, language: Language): string {
  const cuts = new Map<string, [number, number]>();
  const cut = (start: number, end: number) =>
    cuts.set(`${start}:${end}`, [start, end]);
  for (const { re, pick } of MESSAGES[language]) {
    for (const match of text.matchAll(re)) {
      const args = callArgs(text, match.index + match[0].length);
      if (!args) continue;
      for (const i of pick(args.map(([s, e]) => text.slice(s, e)))) {
        const [start, end] = args[i] ?? [0, 0];
        cut(i === 0 ? start : (args[i - 1]?.[1] ?? start), end);
      }
    }
  }
  // `assert x == y, "msg"`: a message after the first top-level comma.
  const statement = /^\s*assert\b/.exec(text);
  if (language === 'python' && statement) {
    const comma = topLevel(text, statement[0].length, ',');
    if (comma !== -1 && isMessage(text.slice(comma + 1))) {
      cut(comma, text.length);
    }
  }
  let result = text;
  for (const [start, end] of [...cuts.values()].sort((a, b) => b[0] - a[0])) {
    result = result.slice(0, start) + result.slice(end);
  }
  return result;
}

// The [start, end) of each top-level argument of the call whose arguments
// start at `at` (just after its `(`); null when it never closes.
function callArgs(text: string, at: number): [number, number][] | null {
  const args: [number, number][] = [];
  let start = at;
  let depth = 0;
  for (let i = at; i < text.length; i++) {
    const ch = text[i] ?? '';
    if (`'"\``.includes(ch)) {
      i = stringEnd(text, i);
    } else if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) {
      if (depth-- === 0) {
        if (text.slice(start, i).trim() !== '') args.push([start, i]);
        return args;
      }
    } else if (ch === ',' && depth === 0) {
      args.push([start, i]);
      start = i + 1;
    }
  }
  return null;
}

// The index of the first `target` at bracket depth 0 from `at`, outside
// strings; -1 when there is none.
function topLevel(text: string, at: number, target: string): number {
  let depth = 0;
  for (let i = at; i < text.length; i++) {
    const ch = text[i] ?? '';
    if (`'"\``.includes(ch)) i = stringEnd(text, i);
    else if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    else if (ch === target && depth === 0) return i;
  }
  return -1;
}

// The index of the quote closing the string that opens at `i`.
function stringEnd(text: string, i: number): number {
  const quote = text[i];
  for (let j = i + 1; j < text.length; j++) {
    if (text[j] === '\\') j++;
    else if (text[j] === quote) return j;
  }
  return text.length;
}

// Whether the Python function `name` is a pytest fixture.
function fixture(stripped: string[], name: string): boolean {
  const def = stripped.findIndex((line) =>
    new RegExp(String.raw`^\s*(?:async\s+)?def\s+${name}\s*\(`).test(line),
  );
  for (let k = def - 1; k >= 0; k--) {
    const line = (stripped[k] ?? '').trim();
    if (/^@(?:pytest(?:_asyncio)?\.)?fixture\b/.test(line)) return true;
    if (!line.startsWith('@')) return false;
  }
  return false;
}

// Bindings in a line (statements split at `;` outside Python): a name
// given a value (`expected = 11`, `let expected: number = 11`, `if (c)
// expected = 11`), changed in place (`+= 1`, `++`, value null) or through
// a member (`expected.total = 11`, `expected[0] = 11`,
// `Object.assign(expected, …)`), several at once (`a, b = 11, 2`), or a
// Python attribute (`self.expected = 11`), or by a call with values
// (`expected.push(3)`). The value is read with comments and string contents
// blanked; `offset` is where the statement starts.
function bindings(
  stripped: string,
  language: Language,
): { name: string; value: string | null; offset: number }[] {
  const found: { name: string; value: string | null; offset: number }[] = [];
  const parts =
    language === 'python' ? [stripped] : stripped.split(';').filter(Boolean);
  let offset = 0;
  for (const part of parts) {
    const at = stripped.indexOf(part, offset);
    offset = at + part.length;
    const rest = (end: number) =>
      stripped
        .slice(at + end, at + part.length)
        .trim()
        .replace(/;$/, '');
    const set = SET.exec(part);
    if (set?.[1]) {
      const operator = set[3] ?? '=';
      // `self.expected` is a name; `self.expected.total` a member of it.
      const attribute = set[1] === 'self' && /^\.\w+/.exec(set[2] ?? '');
      const name = attribute ? `self${attribute[0]}` : set[1];
      const member = attribute ? set[2]?.slice(attribute[0].length) : set[2];
      const plain = operator === '=' && !member;
      found.push({
        name,
        value: plain ? rest(set.index + set[0].length) : null,
        offset: at,
      });
      continue;
    }
    // `a, b = 11, 2`, `[a, b] = [11, 2]`: each name given the whole value.
    const tuple = TUPLE.exec(part);
    if (tuple?.[1]) {
      const value = rest(tuple.index + tuple[0].length);
      for (const name of tuple[1].split(',')) {
        found.push({ name: name.trim(), value, offset: at });
      }
      continue;
    }
    const changed = ASSIGN.exec(part) ?? MUTATE.exec(part);
    if (changed?.[1] && !isCode(changed[2] ?? '')) {
      found.push({ name: changed[1], value: null, offset: at });
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
const TUPLE =
  /^\s*[[(]?\s*((?:self\.)?[A-Za-z_$][\w$]*(?:\s*,\s*(?:self\.)?[A-Za-z_$][\w$]*)+)\s*,?\s*[\])]?\s*=(?![=>])/;
const MEMBERS = String.raw`(?:\.[\w$]+|\[[^\]]*\])*`;
const TARGET = String.raw`((?:self\.)?[A-Za-z_$][\w$]*)${MEMBERS}`;
const STEP = new RegExp(
  String.raw`^\s*(?:(?:\+\+|--)${TARGET}|${TARGET}(?:\+\+|--))\s*$`,
);
// `Object.assign(expected.a, …)`; `expected.push(3)`, `self.expected.update(…)`
// with the values in group 2.
const ASSIGN = new RegExp(
  String.raw`^\s*Object\.assign\s*\(\s*${TARGET}\s*,()`,
);
const MUTATE = new RegExp(
  String.raw`^\s*${TARGET}\.(?:push|unshift|splice|update|append|extend|insert|add|set|put|setdefault)\s*\((.*)\)\s*;?\s*$`,
);

// A value written out: no call, and not just another name (`expected = e`
// in a loop).
const isLiteral = (value: string) =>
  !isCode(value) &&
  !(/^[A-Za-z_$][\w$]*$/.test(value) && !LITERAL_WORDS.has(value));

// A name matched as written: `self.expected`, `$el`.
const quoted = (name: string) => name.replace(/[$.]/g, '\\$&');

// Whether a line declares or sets `name`: `let expected;`, `int expected;`,
// `expected = 10`, `expected: int = 10`.
function bindsName(name: string, line: string): boolean {
  return new RegExp(
    String.raw`(?<![\w$.])${quoted(name)}\s*(?::[^=;]*)?(?:=(?![=>])|;|$)`,
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
