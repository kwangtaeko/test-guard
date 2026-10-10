import type { Rule } from './types.js';

// Fewer assertions in the same file. Assertions inside a `try` whose handler
// swallows failures, or in code that never runs, don't count.
export const tg003: Rule = ({ before, after }) => {
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
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
