import type { Counts } from './index.js';
import { count, stripCLike } from './strip.js';

// Annotations may be fully qualified (`@org.junit.Test`).
const TESTS = /@(?:[\w$]+\.)*(?:Test|ParameterizedTest|RepeatedTest)\b/g;
// A leading `.` is allowed: `Assertions.assertEquals(`.
const ASSERTIONS = /(?<![\w$])(?:assert\w*|fail)\s*\(/g;
const SKIPS =
  /@(?:[\w$]+\.)*(?:Disabled\w*|Ignore)\b|(?<![\w$])assume\w*\s*\(/g;

export function analyzeJava(source: string): Counts {
  const code = stripCLike(source, {
    templateLiterals: false,
    textBlocks: true,
  });
  return {
    tests: count(code, TESTS),
    assertions: count(code, ASSERTIONS),
    skips: count(code, SKIPS),
  };
}
