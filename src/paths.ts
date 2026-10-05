import picomatch from 'picomatch';
import type { Language } from './types.js';

const JS_EXT = '{js,jsx,mjs,cjs,ts,tsx,mts,cts}';

export const DEFAULT_TEST_PATTERNS: Record<Language, string[]> = {
  js: [`**/*.{test,spec}.${JS_EXT}`, `**/__tests__/**/*.${JS_EXT}`],
  python: ['**/test_*.py', '**/*_test.py'],
  java: ['**/src/test/**/*Test.java', '**/*Tests.java', '**/*IT.java'],
};

// Directories pytest does not look into by default (`norecursedirs`): a
// test moved there no longer runs.
const PYTEST_SKIPPED_DIR =
  /^(?:\..*|build|dist|node_modules|venv|_darcs|CVS|\{arch\}|.*\.egg)$/;

function inPytestSkippedDir(path: string): boolean {
  return path
    .split('/')
    .slice(0, -1)
    .some((d) => PYTEST_SKIPPED_DIR.test(d));
}

export type TestFileDetector = (path: string) => Language | null;

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^(?:\.\/)+/, '');
}

// `include` adds patterns as given; `patterns` follow the runners' defaults,
// so Python files in directories pytest skips, and JS files under
// node_modules (Jest and Vitest skip it), are not tests.
export function createTestFileMatcher(
  patterns: Record<Language, string[]> = DEFAULT_TEST_PATTERNS,
  include: Partial<Record<Language, string[]>> = {},
): TestFileDetector {
  const matchers = (Object.keys(patterns) as Language[]).map((language) => {
    const isDefault = picomatch(patterns[language], { dot: true });
    const isIncluded = picomatch(include[language] ?? [], { dot: true });
    const isMatch = (path: string) =>
      (isDefault(path) &&
        !(language === 'python' && inPytestSkippedDir(path)) &&
        !(language === 'js' && /(?:^|\/)node_modules\//.test(path))) ||
      isIncluded(path);
    return [language, isMatch] as const;
  });
  return (path) => {
    const normalized = normalizePath(path);
    for (const [language, isMatch] of matchers) {
      if (isMatch(normalized)) return language;
    }
    return null;
  };
}
