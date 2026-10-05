import { describe, expect, it } from 'vitest';
import { compareFiles, type FileChange } from '../engine/compare.js';
import { createTestFileMatcher } from '../paths.js';
import { RULE_IDS } from './index.js';

const ctx = { detect: createTestFileMatcher(), excluded: () => false };

function check(change: FileChange) {
  return compareFiles(change, ctx, RULE_IDS).map(
    ({ ruleId, line, message }) => ({ ruleId, line, message }),
  );
}

const file = (path: string, ...lines: string[]) => ({
  path,
  content: `${lines.join('\n')}\n`,
});

const JS_BEFORE = [
  "it('adds', () => {",
  '  expect(add(1, 2)).toBe(3);',
  '  expect(add(2, 2)).toBe(4);',
  '});',
  "it('subtracts', () => {",
  '  expect(sub(3, 1)).toBe(2);',
  '});',
];

describe('non-test files', () => {
  it('are ignored', () => {
    expect(
      check({ before: file('src/a.ts', 'x'), after: file('src/a.ts', 'y') }),
    ).toEqual([]);
  });
});

describe('TG001', () => {
  it('reports a deleted test file', () => {
    expect(
      check({ before: file('a.test.js', ...JS_BEFORE), after: null }),
    ).toMatchInlineSnapshot(`
      [
        {
          "line": undefined,
          "message": "deleted test file",
          "ruleId": "TG001",
        },
      ]
    `);
  });

  it('reports a move to a non-test path', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('backup/a.js', ...JS_BEFORE),
      }),
    ).toEqual([
      {
        ruleId: 'TG001',
        line: undefined,
        message: 'moved test file to non-test path backup/a.js',
      },
    ]);
  });

  it('accepts a rename between test paths', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('test/a.spec.js', ...JS_BEFORE),
      }),
    ).toEqual([]);
  });
});

describe('TG002 / TG003', () => {
  it('reports fewer tests and assertions', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE.slice(0, 4)),
      }).map((f) => f.message),
    ).toEqual(['test cases 2 → 1', 'assertions 3 → 2']);
  });

  it('reports fewer assertions only', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE.filter((_, i) => i !== 2)),
      }).map((f) => f.ruleId),
    ).toEqual(['TG003']);
  });

  it('accepts more tests', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE, ...JS_BEFORE),
      }),
    ).toEqual([]);
  });
});

describe('TG004', () => {
  it('reports an added skip on its line', () => {
    const after = [...JS_BEFORE];
    after[4] = "it.skip('subtracts', () => {";
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...after),
      }),
    ).toEqual([{ ruleId: 'TG004', line: 5, message: 'added `it.skip`' }]);
  });

  it('reports skips in a new test file', () => {
    expect(
      check({
        before: null,
        after: file(
          't/test_a.py',
          '@pytest.mark.skip',
          'def test_a():',
          '    assert f() == 1',
        ),
      }),
    ).toEqual([
      { ruleId: 'TG004', line: 1, message: 'added `pytest.mark.skip`' },
    ]);
  });

  it('accepts moving an existing skip', () => {
    const before = ["it.skip('a', () => {});", "it('b', () => {});"];
    const after = ["it('b', () => {});", "it.skip('a', () => {});"];
    expect(
      check({
        before: file('a.test.js', ...before),
        after: file('a.test.js', ...after),
      }),
    ).toEqual([]);
  });
});

describe('TG007', () => {
  function swap(path: string, from: string, to: string) {
    return check({ before: file(path, from), after: file(path, to) });
  }

  it.each([
    [
      'a.test.js',
      'it("x", () => { expect(f()).toBe(3); });',
      'it("x", () => { expect(f()).toBeDefined(); });',
      'weakened assertion `toBe` → `toBeDefined`',
    ],
    [
      'a.test.js',
      'it("x", () => { expect(f()).toEqual([1]); });',
      'it("x", () => { expect(f()).not.toBeNull(); });',
      'weakened assertion `toEqual` → `not.toBeNull`',
    ],
    [
      'a.test.js',
      'it("x", () => { expect(f).toThrow(RangeError); });',
      'it("x", () => { expect(f).toThrow(); });',
      'weakened assertion `toThrow(X)` → `toThrow()`',
    ],
    [
      'test_a.py',
      '        self.assertEqual(f(), 3)',
      '        self.assertTrue(f())',
      'weakened assertion `self.assertEqual` → `self.assertTrue`',
    ],
    [
      'test_a.py',
      '    assert f() == 3',
      '    assert f()',
      'weakened assertion `assert x == y` → `assert x`',
    ],
    [
      'test_a.py',
      '    with pytest.raises(ValueError):',
      '    with pytest.raises(Exception):',
      'weakened assertion `pytest.raises(SpecificError)` → `pytest.raises(Exception)`',
    ],
    [
      'src/test/java/ATest.java',
      '        assertEquals(3, f());',
      '        assertNotNull(f());',
      'weakened assertion `assertEquals` → `assertNotNull`',
    ],
    [
      'src/test/java/ATest.java',
      '        assertThrows(ArithmeticException.class, () -> f());',
      '        assertThrows(Exception.class, () -> f());',
      'weakened assertion `assertThrows(SpecificException.class)` → `assertThrows(Exception.class)`',
    ],
  ])('%s: %s → %s', (path, from, to, message) => {
    expect(swap(path, from, to)).toEqual([
      { ruleId: 'TG007', line: 1, message },
    ]);
  });

  it.each([
    ['a.test.js', 'expect(true).toBe(true);', 'expect(true).toBe(true)'],
    ['a.test.js', 'assert.ok(true);', 'assert.ok(true)'],
    ['test_a.py', '    assert True', 'assert True'],
    ['test_a.py', '        self.assertTrue(True)', 'self.assertTrue(True)'],
    ['src/test/java/ATest.java', '  assertTrue(true);', 'assertTrue(true)'],
  ])('%s: reports meaningless %s', (path, line, text) => {
    expect(
      check({ before: file(path, '//'), after: file(path, line) }),
    ).toEqual([
      {
        ruleId: 'TG007',
        line: 1,
        message: `added meaningless assertion \`${text}\``,
      },
    ]);
  });

  it.each([
    [
      'a.test.js',
      'it("x", () => { expect(f()).toBe(3); });',
      'it("x", () => { expect(f()).toBe(4); });',
    ],
    ['test_a.py', '    assert f() == 3', '    assert f() == 4'],
    [
      'src/test/java/ATest.java',
      '        assertEquals(3, f());',
      '        assertEquals(4, f());',
    ],
    ['a.test.js', '// expect(f()).toBe(3);', '// expect(f()).toBeDefined();'],
  ])('%s: accepts %s → %s', (path, from, to) => {
    expect(swap(path, from, to)).toEqual([]);
  });

  it('pairs strong lines with strong replacements first', () => {
    expect(
      check({
        before: file('a.test.js', 'expect(f()).toBe(3);'),
        after: file(
          'a.test.js',
          'expect(f()).toBeDefined();',
          'expect(f()).toBe(4);',
        ),
      }),
    ).toEqual([]);
  });
});

describe('TG005', () => {
  const change = (path: string, from: string[], to: string[]) =>
    check({ before: file(path, ...from), after: file(path, ...to) });

  it.each([
    [
      'package.json',
      ['{', '  "scripts": { "test": "jest" }', '}'],
      ['{', '  "scripts": { "test": "jest --passWithNoTests" }', '}'],
      'added `passWithNoTests` to "test" script',
    ],
    [
      'packages/api/package.json',
      ['{', '  "scripts": {', '    "test": "vitest run"', '  }', '}'],
      ['{', '  "scripts": {', '    "test": "vitest run src/ok"', '  }', '}'],
      'changed "test" script',
    ],
    [
      'jest.config.js',
      ['module.exports = {};'],
      ["module.exports = { testPathIgnorePatterns: ['user'] };"],
      'added `testPathIgnorePatterns`',
    ],
    [
      'vitest.config.ts',
      ['export default {', '  test: {},', '};'],
      ['export default {', "  test: { exclude: ['**/user*'] },", '};'],
      'added `exclude`',
    ],
    [
      '.mocharc.yml',
      ['spec: test/**/*.js'],
      ['spec: test/**/*.js', 'grep: fast'],
      'added `grep`',
    ],
    [
      'pyproject.toml',
      ['[tool.pytest.ini_options]', 'addopts = "-q"'],
      [
        '[tool.pytest.ini_options]',
        'addopts = "-q --deselect tests/test_a.py::test_x"',
      ],
      'added `--deselect`',
    ],
    [
      'pytest.ini',
      ['[pytest]', 'addopts = -q'],
      ['[pytest]', 'addopts = -q -k "not slow"'],
      'added `-k`',
    ],
    [
      'tests/conftest.py',
      ['import pytest'],
      ['import pytest', 'collect_ignore = ["test_user.py"]'],
      'added `collect_ignore`',
    ],
    [
      'conftest.py',
      ['import pytest'],
      ['import pytest', 'def pytest_collection_modifyitems(items):'],
      'added `pytest_collection_modifyitems`',
    ],
    [
      'pom.xml',
      ['<properties>', '</properties>'],
      ['<properties>', '  <skipTests>true</skipTests>', '</properties>'],
      'added `skipTests`',
    ],
    [
      'pom.xml',
      ['<configuration>', '</configuration>'],
      [
        '<configuration>',
        '  <testFailureIgnore>true</testFailureIgnore>',
        '</configuration>',
      ],
      'added `testFailureIgnore`',
    ],
    [
      'build.gradle',
      ['test {', '}'],
      ['test {', '  enabled = false', '}'],
      'added `enabled = false`',
    ],
    [
      'app/build.gradle.kts',
      ['tasks.test {', '}'],
      ['tasks.test {', '  ignoreFailures = true', '}'],
      'added `ignoreFailures`',
    ],
  ])('%s: reports %s', (path, from, to, message) => {
    expect(change(path, from, to)).toEqual([
      { ruleId: 'TG005', line: expect.any(Number), message },
    ]);
  });

  it.each([
    [
      'package.json',
      ['{', '  "version": "1.0.0"', '}'],
      ['{', '  "version": "1.1.0"', '}'],
    ],
    [
      'build.gradle',
      ['dependencies {', '}'],
      [
        'dependencies {',
        "  implementation('a:b:1') { exclude group: 'c' }",
        '}',
      ],
    ],
    ['pyproject.toml', ['[tool.ruff]'], ['[tool.ruff]', 'ignore = ["E501"]']],
  ])('%s: accepts unrelated changes', (path, from, to) => {
    expect(change(path, from, to)).toEqual([]);
  });

  it('ignores new config files', () => {
    expect(
      check({ before: null, after: file('pkg/jest.config.js', 'testMatch') }),
    ).toEqual([]);
  });

  it('honors config exclude', () => {
    const excluded = compareFiles(
      {
        before: file('vendor/pom.xml', '<a/>'),
        after: file('vendor/pom.xml', '<skipTests>true</skipTests>'),
      },
      { detect: ctx.detect, excluded: (p) => p.startsWith('vendor/') },
      RULE_IDS,
    );
    expect(excluded).toEqual([]);
  });
});

describe('TG006', () => {
  it.each([
    [null, '{}', 'added'],
    ['{}', '{ "exclude": ["src/**"] }', 'changed'],
    ['{}', null, 'deleted'],
  ])('reports config %s → %s', (from, to, what) => {
    expect(
      check({
        before: from === null ? null : file('.test-guard.json', from),
        after: to === null ? null : file('.test-guard.json', to),
      }),
    ).toEqual([
      {
        ruleId: 'TG006',
        line: undefined,
        message: `${what} test-guard config (needs human approval)`,
      },
    ]);
  });

  it.each([
    [
      '.husky/pre-commit',
      ['npx test-guard check --staged', 'npm test'],
      ['npm test'],
    ],
    ['.github/workflows/ci.yml', ['- uses: kwangtaeko/test-guard@v0'], []],
    [
      '.claude/settings.json',
      ['"command": "test-guard hook claude-code pre-tool-use"'],
      ['"command": "true"'],
    ],
    ['lefthook.yml', ['run: test-guard check --staged'], ['run: echo ok']],
  ])('reports test-guard removed from %s', (path, from, to) => {
    expect(
      check({ before: file(path, ...from), after: file(path, ...to) }),
    ).toMatchObject([{ ruleId: 'TG006' }]);
  });

  it('reports a deleted hook file that ran test-guard', () => {
    expect(
      check({
        before: file('.husky/pre-commit', 'npx test-guard check'),
        after: null,
      }),
    ).toMatchObject([{ ruleId: 'TG006' }]);
  });

  it.each([
    [
      '.husky/pre-commit',
      ['npx test-guard check'],
      ['npx test-guard check --staged'],
    ],
    ['.husky/pre-commit', ['npm test'], ['npm run lint']],
    ['fixtures/x/.test-guard.json', ['{}'], ['{"rules":{}}']],
    ['docs/.husky/pre-commit', ['test-guard'], []],
  ])('accepts %s', (path, from, to) => {
    expect(
      check({ before: file(path, ...from), after: file(path, ...to) }),
    ).toEqual([]);
  });
});
