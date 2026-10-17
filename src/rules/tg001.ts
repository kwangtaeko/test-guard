import type { Rule } from './types.js';

// What a test file is made of, in any framework, even one not counted.
const TEST_CALL =
  /\b(?:test|it|describe|context|suite|tape|ava|assert\w*|expect|should|check)\s*[.(]|\bt\.\w+\s*\(|@Test\b|\bdef\s+test|\bclass\s+\w*Test/;

// Test file deleted, or moved to a path that is not recognized as a test.
// A file named like a test with nothing of one in it (a script that only
// borrowed the name) isn't a test.
export const tg001: Rule = ({ before, after, afterPath, beforeLines }) => {
  if (!before || after) return [];
  const { tests, assertions, skips } = before.stats;
  if (
    tests === 0 &&
    assertions === 0 &&
    skips === 0 &&
    !beforeLines.some((l) => TEST_CALL.test(l))
  ) {
    return [];
  }
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
