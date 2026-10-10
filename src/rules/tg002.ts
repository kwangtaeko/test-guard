import type { Rule } from './types.js';

// Fewer test cases in the same file. Tests in code that never runs
// (`if (false)`, after a `return`, an empty `each([])`) don't count.
export const tg002: Rule = ({ before, after }) => {
  if (!before || !after || after.stats.tests >= before.stats.tests) return [];
  const dead = after.deadTests - before.deadTests;
  return [
    {
      ruleId: 'TG002',
      path: after.stats.path,
      message: `test cases ${before.stats.tests} → ${after.stats.tests}${
        dead > 0 ? ` (${dead} in code that never runs)` : ''
      }`,
      before: before.stats.tests,
      after: after.stats.tests,
    },
  ];
};
