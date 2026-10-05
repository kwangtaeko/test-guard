import type { Rule } from './types.js';

// Fewer assertions in the same file.
export const tg003: Rule = ({ before, after }) => {
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
    return [];
  }
  return [
    {
      ruleId: 'TG003',
      path: after.stats.path,
      message: `assertions ${before.stats.assertions} → ${after.stats.assertions}`,
      before: before.stats.assertions,
      after: after.stats.assertions,
    },
  ];
};
