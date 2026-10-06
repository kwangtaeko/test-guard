import type { LanguageSpec } from './index.js';
import { stripJava } from './strip.js';
import { blankSwallowedBraces, reportsFailure } from './swallowed.js';

// JUnit assertion methods; a test file that declares one has replaced the
// real check.
const ASSERT_METHODS =
  'assertEquals|assertNotEquals|assertTrue|assertFalse|assertNull|assertNotNull|assertSame|assertNotSame|assertThrows|assertThrowsExactly|assertArrayEquals|assertThat|assertAll|assertDoesNotThrow|assertIterableEquals|assertLinesMatch|assertTimeout|assertTimeoutPreemptively|assertInstanceOf|fail';
const TEST_ANNOTATIONS = 'Test|ParameterizedTest|RepeatedTest';
// `junit.framework` is JUnit 3.
const TRUSTED_PACKAGES = 'org\\.junit\\.|org\\.testng\\.|junit\\.';
const ASSERTION_LIBRARIES =
  'org\\.hamcrest\\.|org\\.assertj\\.|com\\.google\\.common\\.truth\\.|org\\.springframework\\.';

// Annotations may be fully qualified (`@org.junit.Test`).
const TEST = new RegExp(`@(?:[\\w$]+\\.)*(?:${TEST_ANNOTATIONS})\\b`);

// Tests in an inner class run only when it is `@Nested` (JUnit 5) or static
// (JUnit 4 `Enclosed`); an inner class that lost `@Nested` runs nothing.
function countTests(code: string): number {
  const token = new RegExp(
    `${TEST.source}|(?<![\\w$.])(class|interface|enum|record)\\s+[\\w$]+|[{};]`,
    'g',
  );
  const classes: { depth: number; runs: boolean }[] = [];
  let depth = 0;
  let declStart = 0; // where the current declaration's modifiers start
  let pending: boolean | null = null; // a class header waiting for its `{`
  let tests = 0;
  for (const match of code.matchAll(token)) {
    const text = match[0];
    if (text === '{') {
      depth++;
      if (pending !== null) classes.push({ depth, runs: pending });
      pending = null;
      declStart = match.index + 1;
    } else if (text === '}') {
      if (classes.at(-1)?.depth === depth) classes.pop();
      depth--;
      declStart = match.index + 1;
    } else if (text === ';') {
      declStart = match.index + 1;
    } else if (match[1]) {
      const runs = classes.every((c) => c.runs);
      const modifiers = code.slice(declStart, match.index);
      pending =
        runs &&
        (classes.length === 0 ||
          match[1] !== 'class' ||
          /@(?:[\w$]+\.)*Nested\b|\bstatic\b/.test(modifiers));
    } else if (classes.every((c) => c.runs)) {
      tests++;
    }
  }
  return tests;
}

export const java: LanguageSpec = {
  strip: stripJava,
  tests: countTests,
  // A leading `.` is allowed: `Assertions.assertEquals(`.
  assertions: /(?<![\w$])(?:assert\w*|fail)\s*\(/g,
  // Assertion failures are `AssertionError`s: `catch (Exception e)` lets them
  // through, `Throwable`/`Error`/`AssertionError` without a rethrow doesn't.
  unchecked: (code) =>
    blankSwallowedBraces(
      code,
      (clause, body) =>
        /\b(?:Throwable|Error|AssertionError|AssertionFailedError|ComparisonFailure)\b/.test(
          clause,
        ) &&
        !reportsFailure(
          body,
          /(?<![\w$])(?:throw\b|fail\s*\(|assert\w*\s*\()/,
          /(?<![\w$])assert(?:True\s*\(\s*true|NotNull\s*\(\s*[\w$]+)\s*\)/g,
        ),
    ),
  skips: new RegExp(
    [
      '@(?:[\\w$]+\\.)*(?:Disabled\\w*|Enabled\\w*|Ignore)\\b',
      '(?<![\\w$])assume\\w*\\s*\\(',
      '(?:\\bAssumptions\\.|(?<![\\w$.]))abort\\s*\\(',
      // TestNG `@Test(enabled = false)`.
      `(?<=@(?:[\\w$]+\\.)*Test\\s*\\([^)]*)\\benabled\\s*=\\s*false\\b`,
      // A test annotation or assertion that is not JUnit's or TestNG's.
      `\\bimport\\s+(?!static\\b)(?!${TRUSTED_PACKAGES})[\\w$.]+\\.(?:${TEST_ANNOTATIONS}|Nested)(?=\\s*;)`,
      `\\bimport\\s+static\\s+(?!${TRUSTED_PACKAGES}|${ASSERTION_LIBRARIES})[\\w$.]+\\.(?:${ASSERT_METHODS})(?=\\s*;)`,
      `@interface\\s+(?:${TEST_ANNOTATIONS}|Nested)\\b`,
      // A custom AssertJ `XAssert assertThat(X actual)` factory is routine.
      `(?<![\\w$.])(?:void\\s+assertThat|(?:void|boolean|[\\w$<>\\[\\]]+)\\s+(?!assertThat\\b)(?:${ASSERT_METHODS}))(?=\\s*\\([^)]*\\)\\s*(?:throws\\s[^{;]*)?\\{)`,
    ].join('|'),
    'g',
  ),
};
