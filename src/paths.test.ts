import { describe, expect, it } from 'vitest';
import { createTestFileMatcher, normalizePath } from './paths.js';

describe('normalizePath', () => {
  it('converts backslashes and strips leading ./', () => {
    expect(normalizePath('src\\user\\user.test.ts')).toBe(
      'src/user/user.test.ts',
    );
    expect(normalizePath('./././a/b.py')).toBe('a/b.py');
    expect(normalizePath('a/b.py')).toBe('a/b.py');
  });
});

describe('createTestFileMatcher', () => {
  const detect = createTestFileMatcher();

  it.each([
    ['user.test.ts', 'js'],
    ['src/user.spec.jsx', 'js'],
    ['src\\deep\\order.test.mjs', 'js'],
    ['src/__tests__/helpers/util.ts', 'js'],
    ['.config/check.test.js', 'js'],
    ['test_user.py', 'python'],
    ['pkg/tests/user_test.py', 'python'],
    ['builder/tests/test_user.py', 'python'],
    ['dist_utils/test_user.py', 'python'],
    ['build/user.test.js', 'js'],
    ['src/test/java/com/x/UserTest.java', 'java'],
    ['module/src/test/java/UserTest.java', 'java'],
    ['anywhere/UserTests.java', 'java'],
    ['anywhere/UserIT.java', 'java'],
  ])('detects %s as %s', (path, language) => {
    expect(detect(path)).toBe(language);
  });

  it.each([
    'src/user.ts',
    'src/user.test.py.txt',
    'src/__tests__/fixture.json',
    'conftest.py',
    'src/testing.py',
    'src/main/java/UserTest.java',
    'src/test/java/TestUtils.java',
    'build/tests/test_user.py',
    'pkg/dist/test_user.py',
    '.cache/test_user.py',
    'venv/lib/test_user.py',
    'node_modules/x/test_user.py',
    'pkg.egg/test_user.py',
    'node_modules/x/user.test.js',
  ])('ignores %s', (path) => {
    expect(detect(path)).toBeNull();
  });

  it('accepts custom patterns', () => {
    const custom = createTestFileMatcher({
      js: ['e2e/**/*.ts'],
      python: [],
      java: [],
    });
    expect(custom('e2e/login.ts')).toBe('js');
    expect(custom('user.test.ts')).toBeNull();
  });

  it('takes included patterns as given', () => {
    const custom = createTestFileMatcher(undefined, {
      python: ['build/checks/*.py'],
    });
    expect(custom('build/checks/smoke.py')).toBe('python');
    expect(custom('build/test_user.py')).toBeNull();
  });
});
