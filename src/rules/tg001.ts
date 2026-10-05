import type { Rule } from './types.js';

// Test file deleted, or moved to a path that is not recognized as a test.
export const tg001: Rule = ({ before, after, afterPath }) => {
  if (!before || after) return [];
  return [
    {
      ruleId: 'TG001',
      path: before.stats.path,
      message: afterPath
        ? `moved test file to non-test path ${afterPath}`
        : 'deleted test file',
    },
  ];
};
