import picomatch from 'picomatch';
import type { Language } from './types.js';

const JS_EXT = '{js,jsx,mjs,cjs,ts,tsx,mts,cts}';

export const DEFAULT_TEST_PATTERNS: Record<Language, string[]> = {
  js: [`**/*.{test,spec}.${JS_EXT}`, `**/__tests__/**/*.${JS_EXT}`],
  python: ['**/test_*.py', '**/*_test.py'],
  java: ['**/src/test/**/*Test.java', '**/*Tests.java', '**/*IT.java'],
};

export type TestFileDetector = (path: string) => Language | null;

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^(?:\.\/)+/, '');
}

export function createTestFileMatcher(
  patterns: Record<Language, string[]> = DEFAULT_TEST_PATTERNS,
): TestFileDetector {
  const matchers = (Object.keys(patterns) as Language[]).map(
    (language) =>
      [language, picomatch(patterns[language], { dot: true })] as const,
  );
  return (path) => {
    const normalized = normalizePath(path);
    for (const [language, isMatch] of matchers) {
      if (isMatch(normalized)) return language;
    }
    return null;
  };
}
