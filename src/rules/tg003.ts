import { isAssertionLine } from '../languages/index.js';
import type { Rule } from './types.js';

// Fewer assertions in the same file. Assertions inside a `try` whose handler
// swallows failures, or in code that never runs, don't count. Removing one
// of two identical assertions on neighbouring lines loses nothing.
export const tg003: Rule = ({ before, after, hunks }) => {
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
    return [];
  }
  const language = before.stats.language;
  const same = (a: string | undefined, b: string | undefined) =>
    a !== undefined &&
    b !== undefined &&
    a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
  const kept = new Set(after.lines.map((l) => l.replace(/\s+/g, '')));
  const duplicates = hunks
    .flatMap((h) => h.deleted)
    .filter((n) => {
      const line = before.lines[n - 1];
      if (!line || !isAssertionLine(language, line)) return false;
      // Its twin right above or below is still in the file.
      const twin = [n - 1, n + 1].some(
        (m) => same(before.lines[m - 1], line) && !hunksDelete(hunks, m),
      );
      return twin && kept.has(line.replace(/\s+/g, ''));
    }).length;
  if (after.stats.assertions + duplicates >= before.stats.assertions) {
    return [];
  }
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

const hunksDelete = (hunks: { deleted: number[] }[], line: number) =>
  hunks.some((h) => h.deleted.includes(line));
