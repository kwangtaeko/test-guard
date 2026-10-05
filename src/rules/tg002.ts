import type { Rule } from './types.js';

// Fewer test cases in the same file.
export const tg002: Rule = ({ before, after }) => {
  if (!before || !after || after.stats.tests >= before.stats.tests) return [];
  return [
    {
      ruleId: 'TG002',
      path: after.stats.path,
      message: `test cases ${before.stats.tests} → ${after.stats.tests}`,
      before: before.stats.tests,
      after: after.stats.tests,
    },
  ];
};
