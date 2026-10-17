import type { Rule } from './types.js';

// A test's declaration: `it('x', …)`, `test.skip(…)`, `def test_x`,
// `@Test`, a JUnit `void testX()`. Not a `describe`, which may hold old
// tests.
const DECLARATION =
  /^\s*(?:(?:it|test|specify|xit|fit)(?:\.\w+)*\s*\(|(?:async\s+)?def\s+test|@(?:Test|ParameterizedTest|RepeatedTest)\b|(?:(?:public|protected|private|static|final)\s+)*void\s+\w+\s*\()/;
// A group of tests: a skip on it isn't one on a new test.
const GROUP =
  /^\s*(?:describe|context|suite|xdescribe|fdescribe)(?:\.\w+)*\s*\(/;
// A skip marker saved under a name: `slow = pytest.mark.skipif(…)`.
const ALIAS =
  /^\s*(\w+)\s*=\s*(?:pytest\.mark\.(?:skip|skipif|xfail)|unittest\.skip\w*)\b/;

// More skip/disable/only/todo markers. Only an increase counts, so moving an
// existing `it.skip` is fine; the added lines locate the new markers. A skip
// on a test added in the same change (`this.skip()` on an old runtime) takes
// nothing away, as long as the tests grew by as many.
export const tg004: Rule = ({
  before,
  after,
  hunks,
  beforeLines,
  afterLines,
}) => {
  if (!after) return [];
  const beforeSkips = before?.stats.skips ?? 0;
  const afterSkips = after.stats.skips;
  if (afterSkips <= beforeSkips) return [];

  const added = new Set(hunks.flatMap((hunk) => hunk.added));
  // A skip rewritten with the same condition (`assumeTrue(c)` →
  // `assumeTrue("why", c)`) isn't new.
  const deleted = new Set(hunks.flatMap((hunk) => hunk.deleted));
  // Each old skip stands for one rewrite, matched first to skips that
  // aren't on new tests.
  const newTest = onNewTest(afterLines, beforeLines, added);
  const old = [...deleted].map((n) => condition(statement(beforeLines, n)));
  const rewritten = new Set<number>();
  const fresh = after.skips.filter((skip) => added.has(skip.line));
  for (const skip of [
    ...fresh.filter((s) => !newTest(s.line)),
    ...fresh.filter((s) => newTest(s.line)),
  ]) {
    const at = old.indexOf(condition(statement(afterLines, skip.line)));
    if (at === -1) continue;
    old.splice(at, 1);
    rewritten.add(skip.line);
  }
  let hits = fresh.filter((skip) => !rewritten.has(skip.line));
  const exempt = hits.filter((skip) => newTest(skip.line));
  const grown = after.stats.tests - (before?.stats.tests ?? 0);
  // Not when an old test's declaration went away or changed: its test may
  // be the one coming back skipped under a new name.
  const kept = new Set(afterLines.map((l) => l.trim()));
  const replaced = [...deleted].some((n) => {
    const line = beforeLines[n - 1] ?? '';
    return DECLARATION.test(line) && !kept.has(line.trim());
  });
  if (before && !replaced && exempt.length > 0 && grown >= exempt.length) {
    hits = hits.filter((skip) => !exempt.includes(skip));
  }
  // Every added skip a rewrite or on a new test, and the new tests account
  // for all the skips gained.
  const counted =
    before && !replaced && grown >= exempt.length ? exempt.length : 0;
  if (hits.length === 0 && afterSkips - beforeSkips <= counted) return [];
  if (hits.length === 0) {
    return [
      {
        ruleId: 'TG004',
        path: after.stats.path,
        message: `skips ${beforeSkips} → ${afterSkips}`,
        before: beforeSkips,
        after: afterSkips,
      },
    ];
  }
  return hits.map((skip) => ({
    ruleId: 'TG004',
    path: after.stats.path,
    line: skip.line,
    message: `added \`${skip.text}\``,
  }));
};

const STRINGS = /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g;

// The statement starting on a (1-based) line, up to its closing bracket.
function statement(lines: string[], n: number): string {
  let text = '';
  let depth = 0;
  for (let i = n; i <= lines.length && i < n + 8; i++) {
    const raw = lines[i - 1] ?? '';
    text += raw;
    for (const ch of raw.replace(STRINGS, '""')) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
    }
    if (depth <= 0) break;
  }
  return text;
}

// What a skip checks, without its message: `assumeTrue("why", c)` and
// `assumeTrue(c)` are the same skip, and so are two `reason=` texts. Other
// strings stay: `skipif("sys.platform == 'win32'")` is a condition.
const STRING = String.raw`(?<q>['"\x60])(?:(?!\k<q>)[^\\]|\\.)*\k<q>`;
const condition = (text: string) =>
  text
    .replace(new RegExp(String.raw`(\bassume\w*\(\s*)${STRING}\s*,`, 'g'), '$1')
    .replace(
      new RegExp(String.raw`\b(reason|msg|message)\s*=\s*${STRING}`, 'g'),
      '$1=',
    )
    .replace(/\s+/g, '');

// Whether the skip on a (1-based) line belongs to a test the change added:
// its declaration is an added line, under a name the old file didn't have.
function onNewTest(
  lines: string[],
  old: string[],
  added: Set<number>,
): (line: number) => boolean {
  const oldText = old.join('\n');
  const isNew = (n: number) => {
    const text = lines[n - 1] ?? '';
    if (!added.has(n) || !DECLARATION.test(text)) return false;
    const name =
      /(['"`])((?:(?!\1).)+)\1/.exec(text)?.[2] ??
      /\b(?:def|void)\s+(\w+)/.exec(text)?.[1];
    return name !== undefined && !oldText.includes(name);
  };
  // The declaration under a decorator line.
  const decorated = (n: number) => {
    let i = n + 1;
    while (/^\s*@/.test(lines[i - 1] ?? '')) i++;
    return isNew(i);
  };
  return (n) => {
    const text = lines[n - 1] ?? '';
    const alias = ALIAS.exec(text)?.[1];
    if (alias) {
      const uses = lines
        .map((l, i) => ({ l, i: i + 1 }))
        .filter(({ l, i }) => i !== n && new RegExp(`\\b${alias}\\b`).test(l));
      return uses.every(
        ({ l, i }) =>
          new RegExp(`^\\s*@${alias}\\b`).test(l) &&
          added.has(i) &&
          decorated(i),
      );
    }
    if (/^\s*@/.test(text)) return decorated(n);
    if (GROUP.test(text)) return false;
    if (DECLARATION.test(text)) return isNew(n);
    // Inside a test: the nearest less indented line that declares one.
    const indent = (l: string) => l.length - l.trimStart().length;
    let depth = indent(text);
    for (let i = n - 1; i >= 1; i--) {
      const l = lines[i - 1] ?? '';
      if (l.trim() === '' || indent(l) >= depth) continue;
      if (DECLARATION.test(l)) return isNew(i);
      depth = indent(l);
    }
    return false;
  };
}
