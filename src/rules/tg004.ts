import type { Rule } from './types.js';

// A test's declaration: `it('x', …)`, `test.skip(…)`, `describe(…)`,
// `def test_x`, `@Test`, a JUnit `void testX()`.
const DECLARATION =
  /^\s*(?:(?:it|test|specify|describe|context|suite|xit|xdescribe|fit)(?:\.\w+)*\s*\(|(?:async\s+)?def\s+test|@(?:Test|ParameterizedTest|RepeatedTest)\b|(?:public\s+)?void\s+test\w*\s*\()/;
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
  let hits = after.skips.filter((skip) => added.has(skip.line));
  const newTest = onNewTest(afterLines, beforeLines, added);
  const exempt = hits.filter((skip) => newTest(skip.line));
  const grown = after.stats.tests - (before?.stats.tests ?? 0);
  if (before && exempt.length > 0 && grown >= exempt.length) {
    hits = hits.filter((skip) => !exempt.includes(skip));
    if (hits.length === 0 && afterSkips - exempt.length <= beforeSkips) {
      return [];
    }
  }
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
