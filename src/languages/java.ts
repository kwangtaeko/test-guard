import type { LanguageSpec } from './index.js';
import { stripCLike } from './strip.js';

export const java: LanguageSpec = {
  strip: (source) =>
    stripCLike(source, { templateLiterals: false, textBlocks: true }),
  // Annotations may be fully qualified (`@org.junit.Test`).
  tests: /@(?:[\w$]+\.)*(?:Test|ParameterizedTest|RepeatedTest)\b/g,
  // A leading `.` is allowed: `Assertions.assertEquals(`.
  assertions: /(?<![\w$])(?:assert\w*|fail)\s*\(/g,
  skips: /@(?:[\w$]+\.)*(?:Disabled\w*|Ignore)\b|(?<![\w$])assume\w*\s*\(/g,
};
