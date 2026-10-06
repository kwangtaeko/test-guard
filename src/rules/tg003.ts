import type { Rule } from './types.js';

// Fewer assertions in the same file. Assertions inside a `try` whose handler
// swallows failures don't count.
export const tg003: Rule = ({ before, after }) => {
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
    return [];
  }
  const swallowed = after.swallowed - before.swallowed;
  return [
    {
      ruleId: 'TG003',
      path: after.stats.path,
      message: `assertions ${before.stats.assertions} → ${after.stats.assertions}${
        swallowed > 0
          ? ` (${swallowed} inside a try/catch that ignores failures)`
          : ''
      }`,
      before: before.stats.assertions,
      after: after.stats.assertions,
    },
  ];
};
