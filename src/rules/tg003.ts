import type { Analysis } from '../languages/index.js';
import { isAssertionLine } from '../languages/index.js';
import type { Rule, RuleInput } from './types.js';

// Fewer assertions in the same file. Assertions inside a `try` whose handler
// swallows failures, or in code that never runs, don't count. Changes that
// lose nothing aren't counted against the file: one of two identical
// neighbouring assertions removed, several `contains` checks replaced by one
// exact comparison that holds them all, and an `assert…` helper deleted
// whose calls were the assertions.
export const tg003: Rule = (input) => {
  const { before, after } = input;
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
    return [];
  }
  const credit =
    duplicates(before, after, input) +
    mergedContains(before, after, input) +
    deletedHelpers(before, input);
  if (after.stats.assertions + credit >= before.stats.assertions) return [];
  const swallowed = after.swallowed - before.swallowed;
  const unreachable = after.unreachable - before.unreachable;
  const notes = [
    swallowed > 0 && `${swallowed} inside a try/catch that ignores failures`,
    unreachable > 0 && `${unreachable} in code that never runs`,
  ].filter(Boolean);
  return [
    {
      ruleId: 'TG003',
      path: after.stats.path,
      message: `assertions ${before.stats.assertions} → ${after.stats.assertions}${
        notes.length > 0 ? ` (${notes.join(', ')})` : ''
      }`,
      before: before.stats.assertions,
      after: after.stats.assertions,
    },
  ];
};

const squash = (s: string) => s.replace(/\s+/g, '');
const STATEFUL =
  /\.(?:next\w*|poll|shift|pop|read\w*|take|remove\w*|dequeue|consume|advance)\s*\(|\+\+|--/;
const deletedLines = (input: RuleInput) =>
  new Set(input.hunks.flatMap((h) => h.deleted));
const addedLines = (input: RuleInput) =>
  new Set(input.hunks.flatMap((h) => h.added));

// One of two identical assertions on neighbouring lines, whose twin stays.
function duplicates(before: Analysis, after: Analysis, input: RuleInput) {
  const language = before.stats.language;
  const deleted = deletedLines(input);
  const kept = new Set(after.lines.map(squash));
  return [...deleted].filter((n) => {
    const line = before.lines[n - 1];
    if (!line || !isAssertionLine(language, line)) return false;
    // Each call may see a new value (`it.next()`): not a duplicate.
    if (STATEFUL.test(line)) return false;
    const twin = [n - 1, n + 1].some(
      (m) =>
        !deleted.has(m) && squash(before.lines[m - 1] ?? '') === squash(line),
    );
    return twin && kept.has(squash(line));
  }).length;
}

const STRING = /^(['"`])[\s\S]*\1$/;
// `assertThat(s).contains("x")`, `expect(s).toContain("x")`,
// `assertTrue(s.contains("x"))`, `assert "x" in s`.
const CONTAINS = [
  /\bassertThat\(\s*([\w.]+)\s*\)\s*\.contains(?:String)?\(\s*("(?:[^"\\]|\\.)*")\s*\)/,
  /\bexpect\(\s*([\w.]+)\s*\)\s*\.toContain\(\s*((["'`])(?:(?!\3)[^\\]|\\.)*\3)\s*\)/,
  /\bassertTrue\(\s*([\w.]+)\.contains\(\s*("(?:[^"\\]|\\.)*")\s*\)\s*\)/,
];
const PY_IN = /\bassert\s+((["'])(?:(?!\2)[^\\]|\\.)*\2)\s+in\s+([\w.]+)\s*$/;

// `contains` checks on a value, all removed, and one exact comparison of
// that value added whose expected text holds every one of them: the same
// checks, made stronger. Credits all but the one added.
function mergedContains(before: Analysis, after: Analysis, input: RuleInput) {
  const deleted = deletedLines(input);
  const added = addedLines(input);
  const gone: { subject: string; text: string }[] = [];
  for (const n of deleted) {
    const raw = input.beforeLines[n - 1] ?? '';
    if (!isAssertionLine(before.stats.language, before.lines[n - 1] ?? '')) {
      continue;
    }
    const m = CONTAINS.map((re) => re.exec(raw)).find(Boolean);
    if (m?.[1] && m[2])
      gone.push({ subject: squash(m[1]), text: m[2].slice(1, -1) });
    const p = PY_IN.exec(raw);
    if (p?.[1] && p[3])
      gone.push({ subject: squash(p[3]), text: p[1].slice(1, -1) });
  }
  if (gone.length < 2) return 0;
  let credit = 0;
  for (const check of after.checks) {
    const [subject, expected] = check.sides;
    if (!check.equal || !STRING.test(expected)) continue;
    const lines = Array.from(
      { length: check.end - check.start + 1 },
      (_, i) => check.start + i,
    );
    if (!lines.some((n) => added.has(n))) continue;
    const held = gone.filter(
      (g) =>
        g.subject === subject && g.text !== '' && expected.includes(g.text),
    );
    for (const g of held) gone.splice(gone.indexOf(g), 1);
    credit += Math.max(0, held.length - 1);
  }
  return credit;
}

// A Java `assert…` helper method deleted with its body: each call to it
// counted as an assertion, so the `fail()` inside it is no extra loss.
const HELPER =
  /^(\s*)(?:(?:private|public|protected|static|final)\s+)*void\s+(assert\w+)\s*\(/;
function deletedHelpers(before: Analysis, input: RuleInput) {
  if (before.stats.language !== 'java') return 0;
  const deleted = deletedLines(input);
  const afterText = input.afterLines.join('\n');
  let credit = 0;
  input.beforeLines.forEach((line, i) => {
    const m = HELPER.exec(line);
    if (!m || !deleted.has(i + 1)) return;
    if (new RegExp(`\\bvoid\\s+${m[2]}\\s*\\(`).test(afterText)) return;
    const indent = m[1] ?? '';
    let inside = 0;
    for (let n = i + 2; n <= input.beforeLines.length; n++) {
      const body = input.beforeLines[n - 1] ?? '';
      if (body.startsWith(`${indent}}`)) break;
      if (!deleted.has(n)) return;
      if (isAssertionLine('java', before.lines[n - 1] ?? '')) inside++;
    }
    // No more than the calls it lost: an uncalled helper covers nothing.
    const call = new RegExp(`\\b${m[2]}\\s*\\(`);
    const calls = [...deleted].filter(
      (n) => n !== i + 1 && call.test(before.lines[n - 1] ?? ''),
    ).length;
    credit += Math.min(inside, calls);
  });
  return credit;
}
