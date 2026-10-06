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
    [
      'a.test.js',
      'expect(f()).toBe(3);',
      'expect(f()).not.toBe(4);',
      'weakened assertion `toBe` → `not.toBe`',
    ],
    [
      'a.test.js',
      'expect(list).toHaveLength(3);',
      'expect(list.length).toBeGreaterThan(0);',
      'weakened assertion `toHaveLength` → `toBeGreaterThan`',
    ],
    [
      'test_a.py',
      '    assert f() == 3',
      '    assert f() != 4',
      'weakened assertion `assert x == y` → `assert x != y`',
    ],
    [
      'test_a.py',
      '    assert len(f()) == 3',
      '    assert len(f()) >= 1',
      'weakened assertion `assert x == y` → `assert x < y`',
    ],
    [
      'test_a.py',
      '        self.assertEqual(f(), 3)',
      '        self.assertGreater(f(), 0)',
      'weakened assertion `self.assertEqual` → `self.assertGreater`',
    ],
    [
      'src/test/java/ATest.java',
      '        assertEquals(3, f());',
      '        assertNotEquals(4, f());',
      'weakened assertion `assertEquals` → `assertNotEquals`',
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
    ['a.test.js', 'expect(f()).not.toBe(3);', 'expect(f()).not.toBe(4);'],
    ['a.test.js', 'expect(f()).not.toBe(3);', 'expect(f()).toBe(4);'],
    ['a.test.js', 'expect(f()).toBe(0.3);', 'expect(f()).toBeCloseTo(0.3);'],
    ['test_a.py', '    assert f() != 3', '    assert f() != 4'],
    ['test_a.py', '    assert f() >= 3', '    assert f() == 4'],
  ])('%s: accepts %s → %s', (path, from, to) => {
    expect(swap(path, from, to)).toEqual([]);
  });

  it('accepts a Black-style multi-line assert', () => {
    expect(
      check({
        before: file('test_a.py', 'def test_a():', '    assert f() == 1'),
        after: file(
          'test_a.py',
          'def test_a():',
          '    assert (',
          '        f() == 1',
          '    )',
        ),
      }),
    ).toEqual([]);
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
    [
      'build.gradle',
      ['test {', '  useJUnitPlatform()', '}'],
      ['test {', "  useJUnitPlatform { excludeTags 'slow' }", '}'],
      'added `excludeTags`',
    ],
    [
      'build.gradle.kts',
      ['tasks.test {', '}'],
      ['tasks.test {', '  useJUnitPlatform { includeTags("fast") }', '}'],
      'added `includeTags`',
    ],
    [
      'pom.xml',
      ['<configuration>', '</configuration>'],
      [
        '<configuration>',
        '  <excludedGroups>slow</excludedGroups>',
        '</configuration>',
      ],
      'added `<groups>`',
    ],
    [
      'pom.xml',
      ['<configuration>', '</configuration>'],
      ['<configuration>', '  <groups>fast</groups>', '</configuration>'],
      'added `<groups>`',
    ],
    [
      'pom.xml',
      ['<configuration>', '</configuration>'],
      [
        '<configuration>',
        '  <includes><include>**/Smoke*</include></includes>',
        '</configuration>',
      ],
      'added `<include>`',
    ],
    [
      'tests/conftest.py',
      ['import pytest'],
      ['import pytest', 'def pytest_runtest_makereport(item, call):'],
      'added `pytest_* hook`',
    ],
    [
      'jest.config.js',
      ['module.exports = {};'],
      ["module.exports = { setupFilesAfterEnv: ['./stub.js'] };"],
      'added `setupFilesAfterEnv`',
    ],
    [
      'vitest.config.ts',
      ['export default {', '  test: {},', '};'],
      ['export default {', "  test: { globalSetup: './g.ts' },", '};'],
      'added `globalSetup`',
    ],
    [
      'package.json',
      ['{', '  "jest": {', '  }', '}'],
      ['{', '  "jest": {', '    "setupFiles": ["./s.js"]', '  }', '}'],
      'added `setupFiles`',
    ],
    [
      'pytest.ini',
      ['[pytest]', 'addopts = -q'],
      ['[pytest]', 'addopts = -q -m "not slow"'],
      'added `-m`',
    ],
    [
      'pytest.ini',
      ['[pytest]', 'addopts = -q'],
      ['[pytest]', 'addopts = -q --co'],
      'added `--collect-only`',
    ],
    [
      'conftest.py',
      ['import pytest'],
      ['import pytest', 'pytest_plugins = ["helpers.off"]'],
      'added `pytest_plugins`',
    ],
    [
      'build.gradle',
      ['test {', '}'],
      ['test.enabled false', 'test {', '}'],
      'added `enabled = false`',
    ],
    [
      'pom.xml',
      ['<configuration>', '</configuration>'],
      ['<configuration>', '  <test>NoSuchTest</test>', '</configuration>'],
      'added `<test>`',
    ],
    [
      'vitest.workspace.ts',
      ['export default [];'],
      ["export default [{ test: { exclude: ['**'] } }];"],
      'added `exclude`',
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
    [
      'conftest.py',
      ['import pytest'],
      ['import pytest', '', '@pytest.fixture', 'def client(): return 1'],
    ],
    [
      'build.gradle',
      ['test {', '}'],
      ['test {', '  maxParallelForks = 4', '}'],
    ],
    [
      'conftest.py',
      ['import pytest'],
      [
        'import pytest',
        'def pytest_configure(config):',
        '    config.addinivalue_line("markers", "slow: slow tests")',
      ],
    ],
    [
      'vitest.config.ts',
      ['export default {', '  test: {', '  },', '};'],
      [
        'export default {',
        '  test: {',
        '    coverage: {',
        "      include: ['src/**'],",
        "      exclude: ['dist/**'],",
        '    },',
        '  },',
        '};',
      ],
    ],
    [
      'vitest.config.ts',
      ['export default { test: {} };'],
      ["export default { test: { coverage: { include: ['src/**'] } } };"],
    ],
    [
      'pom.xml',
      ['<build>', '</build>'],
      [
        '<build>',
        '  <resources><resource>',
        '    <includes><include>**/*.yml</include></includes>',
        '  </resource></resources>',
        '</build>',
      ],
    ],
    ['tox.ini', ['[testenv]'], ['[testenv]', 'commands = python -m pytest']],
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

  it.each([
    [
      '.husky/pre-commit',
      ['npx test-guard check --staged'],
      ['npx test-guard check --staged || true'],
      'changed how test-guard runs: `npx test-guard check --staged`',
    ],
    [
      'package.json',
      ['{', '  "scripts": { "precommit": "test-guard check --staged" }', '}'],
      [
        '{',
        '  "scripts": { "precommit": "test-guard check --rules TG001" }',
        '}',
      ],
      'changed how test-guard runs: `"scripts": { "precommit": "test-guard check --staged" }`',
    ],
    [
      '.claude/settings.json',
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit|Write|Bash",',
        '  "hooks": [{"type": "command", "command": "test-guard hook claude-code pre-tool-use"}]}]}}',
      ],
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Read",',
        '  "hooks": [{"type": "command", "command": "test-guard hook claude-code pre-tool-use"}]}]}}',
      ],
      "changed the matcher of test-guard's hook (PreToolUse Edit, PreToolUse Write, PreToolUse Bash)",
    ],
    [
      '.github/workflows/ci.yml',
      [
        '      - uses: kwangtaeko/test-guard@v0',
        '        with: { base: main }',
      ],
      [
        '      - uses: kwangtaeko/test-guard@v0',
        '        continue-on-error: true',
        '        with: { base: main }',
      ],
      'made test-guard’s CI step non-blocking (`continue-on-error`)',
    ],
    [
      '.github/workflows/ci.yml',
      ['  guard:', '    steps:', '      - uses: kwangtaeko/test-guard@v0'],
      [
        '  guard:',
        '    continue-on-error: true',
        '    steps:',
        '      - uses: kwangtaeko/test-guard@v0',
      ],
      'made test-guard’s CI step non-blocking (`continue-on-error`)',
    ],
    [
      '.husky/pre-commit',
      ['npx test-guard check --staged'],
      ['exit 0', 'npx test-guard check --staged'],
      'added a condition that can keep test-guard from running: `exit 0`',
    ],
    [
      '.husky/pre-commit',
      ['npx test-guard check --staged'],
      ['if [ -n "$NEVER" ]; then', '  npx test-guard check --staged', 'fi'],
      'added a condition that can keep test-guard from running: `if [ -n "$NEVER" ]; then`',
    ],
    [
      '.github/workflows/ci.yml',
      [
        '      - uses: kwangtaeko/test-guard@v0',
        '        with: { base: main }',
      ],
      [
        '      - uses: kwangtaeko/test-guard@v0',
        '        if: false',
        '        with: { base: main }',
      ],
      'added a condition that can keep test-guard from running: `if: false`',
    ],
    [
      'lefthook.yml',
      [
        'pre-commit:',
        '  commands:',
        '    guard:',
        '      run: test-guard check --staged',
      ],
      [
        'pre-commit:',
        '  commands:',
        '    guard:',
        '      skip: true',
        '      run: test-guard check --staged',
      ],
      'added a condition that can keep test-guard from running: `skip: true`',
    ],
    [
      '.claude/settings.json',
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit", "hooks": [{',
        '  "type": "command",',
        '  "command": "test-guard hook claude-code pre-tool-use"',
        '}]}]}}',
      ],
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit", "hooks": [{',
        '  "type": "prompt",',
        '  "command": "test-guard hook claude-code pre-tool-use"',
        '}]}]}}',
      ],
      "removed or changed test-guard's hook (PreToolUse)",
    ],
  ])('%s: reports %s → %s', (path, from, to, message) => {
    expect(
      check({ before: file(path, ...from), after: file(path, ...to) }),
    ).toEqual([{ ruleId: 'TG006', line: undefined, message }]);
  });

  it('reports a hook file renamed away', () => {
    expect(
      check({
        before: file('.husky/pre-commit', 'npx test-guard check --staged'),
        after: file('.husky/pre-commit.bak', 'npx test-guard check --staged'),
      }),
    ).toMatchObject([
      {
        ruleId: 'TG006',
        message: 'renamed .husky/pre-commit, which ran test-guard',
      },
    ]);
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
      ['npx test-guard check', '  # trailing'],
      ['set -e', '  npx test-guard check', 'npx test-guard check --staged'],
    ],
    [
      '.github/workflows/ci.yml',
      ['  guard:', '    steps:', '      - uses: kwangtaeko/test-guard@v0'],
      [
        '  guard:',
        '    steps:',
        '      - uses: kwangtaeko/test-guard@v0',
        '  lint:',
        '    continue-on-error: true',
        '    steps:',
        '      - run: npm run lint',
      ],
    ],
    [
      '.claude/settings.json',
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit|Write|Bash", "hooks": [{',
        '  "command": "test-guard hook claude-code pre-tool-use"',
        '}]}]}}',
      ],
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit|Write|Bash", "hooks": [{',
        '  "command": "test-guard hook claude-code pre-tool-use"',
        '}]}, {"matcher": "Read", "hooks": [{"command": "echo"}]}]}}',
      ],
    ],
    [
      '.claude/settings.json',
      [
        '{"hooks": {"PreToolUse": [{"matcher": "Edit|Write|Bash", "hooks": [{',
        '  "command": "test-guard hook claude-code pre-tool-use"',
        '}]}]}}',
      ],
      [
        '{"hooks":{"PreToolUse":[{"matcher":"Edit|Write|Bash|NotebookEdit","hooks":[{"command":"test-guard hook claude-code pre-tool-use"}]}]}}',
      ],
    ],
    [
      'package.json',
      ['{', '  "devDependencies": {', '    "test-guard": "^0.1.0"', '  }', '}'],
      ['{', '  "devDependencies": {', '    "test-guard": "^0.1.1"', '  }', '}'],
    ],
    [
      '.github/workflows/ci.yml',
      ['      - run: npx test-guard@0.1 check --base main'],
      ['      - run: npx test-guard@0.2 check --base main'],
    ],
    [
      '.github/workflows/ci.yml',
      [
        '  guard:',
        '    steps:',
        '      - uses: kwangtaeko/test-guard@v0',
        '  web:',
        '    steps:',
        '      - run: npm test',
      ],
      [
        '  guard:',
        '    steps:',
        '      - uses: kwangtaeko/test-guard@v0',
        '  web:',
        "    if: github.event_name == 'push'",
        '    steps:',
        '      - run: cd web && npm test',
      ],
    ],
    [
      '.husky/pre-commit',
      ['npx test-guard check --staged'],
      ['npx test-guard check --staged', 'if [ -f x ]; then exit 0; fi'],
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

describe('M7: failures that can no longer fail', () => {
  it('TG003 names assertions wrapped in a try/catch that ignores failures', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file(
          'a.test.js',
          "it('adds', () => {",
          '  try {',
          '    expect(add(1, 2)).toBe(3);',
          '  } catch {}',
          '  expect(add(2, 2)).toBe(4);',
          '});',
          ...JS_BEFORE.slice(4),
        ),
      }).map((f) => f.message),
    ).toEqual([
      'assertions 3 → 2 (1 inside a try/catch that ignores failures)',
    ]);
  });

  const workflow = (from: string[], to: string[]) =>
    check({
      before: file('.github/workflows/ci.yml', ...from),
      after: file('.github/workflows/ci.yml', ...to),
    }).map((f) => [f.ruleId, f.message]);
  const STEPS = [
    'jobs:',
    '  test:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - name: Test',
    '        run: npm test',
  ];

  it.each([
    ['        run: npm test || true', '|| true'],
    ['        run: pnpm test; exit 0', '|| true'],
    ['        run: pytest -k "not slow"', '-k'],
    ['        run: npx vitest run --testNamePattern add', 'testNamePattern'],
    ['        run: ./mvnw -DskipTests verify', '-DskipTests'],
    ['        run: ./gradlew build -x test', '-x test'],
  ])('reports `%s`', (line, label) => {
    expect(workflow(STEPS, [...STEPS.slice(0, -1), line])).toEqual([
      ['TG005', `added \`${label}\``],
    ]);
  });

  it('reports continue-on-error and if: on a test step', () => {
    expect(
      workflow(STEPS, [
        ...STEPS.slice(0, -2),
        '      - name: Test',
        '        if: false',
        '        continue-on-error: true',
        '        run: npm test',
      ]),
    ).toEqual([
      ['TG005', 'added `if:`'],
      ['TG005', 'added `continue-on-error`'],
    ]);
  });

  it.each([
    // Not a test step.
    [['      - run: npm run lint || true']],
    [
      [
        '      - name: Lint',
        '        continue-on-error: true',
        '        run: npm run lint',
      ],
    ],
    // A job-level condition, a new test step, a version bump.
    [['      - run: npm run build', '      - run: npm test -- --coverage']],
    [
      [
        '      - name: Deploy',
        "        if: github.ref == 'refs/heads/main'",
        '        run: ./deploy.sh',
      ],
    ],
  ])('accepts %j', (extra) => {
    expect(workflow(STEPS, [...STEPS, ...extra])).toEqual([]);
  });

  it('accepts a job-level if: and an action version bump', () => {
    expect(
      workflow(STEPS, [
        'jobs:',
        '  test:',
        "    if: github.event_name == 'pull_request'",
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/checkout@v5',
        '      - name: Test',
        '        run: npm test',
      ]),
    ).toEqual([]);
  });
});

describe('M7 workflow checks, red-team re-check', () => {
  const STEPS = [
    'jobs:',
    '  test:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - name: Test',
    '        run: npm test',
  ];
  const workflow = (to: string[] | null, path = '.github/workflows/ci.yml') =>
    check({
      before: file('.github/workflows/ci.yml', ...STEPS),
      after: to && file(path, ...to),
    }).map((f) => [f.ruleId, f.message]);
  const REMOVED = [['TG005', 'removed test command `run: npm test` from CI']];

  it('reports a removed test step, a replaced command, a deleted or renamed file', () => {
    expect(workflow(STEPS.slice(0, -2))).toEqual(REMOVED);
    expect(
      workflow([...STEPS.slice(0, -1), '        run: npm run lint']),
    ).toEqual(REMOVED);
    expect(workflow(null)).toEqual(REMOVED);
    expect(workflow(STEPS, '.github/workflows/ci.yml.off')).toEqual(REMOVED);
  });

  it.each([
    [['        run: |', '          set +e', '          npm test'], 'set +e'],
    [
      ['        run: |', '          npm test \\', '            || true'],
      '|| true',
    ],
    [['        shell: bash {0}', '        run: npm test'], 'shell: {0}'],
    [['        run: npm test -- -u'], '-u'],
    [['        run: npx jest --testPathPattern unit'], 'test filter'],
    [['        run: go test -run TestAdd ./...'], 'test filter'],
    [
      ['        run: mvn -Dmaven.test.failure.ignore=true verify'],
      '-DskipTests',
    ],
    [['        run: ./gradlew check -x integrationTest'], '-x test'],
    [['        run: npm test || /bin/true'], '|| true'],
  ])('reports %j', (lines, label) => {
    expect(workflow([...STEPS.slice(0, -1), ...lines]).at(-1)).toEqual([
      'TG005',
      `added \`${label}\``,
    ]);
  });

  it('reports a job-level if: false on a test job', () => {
    expect(
      workflow([...STEPS.slice(0, 2), '    if: false', ...STEPS.slice(2)]),
    ).toEqual([['TG005', 'added `if:`']]);
  });

  it.each([
    [['        run: coverage run -m pytest']],
    [['        run: python -m pytest -x tests/']],
    [['        if: always()', '        run: npm test']],
    // biome-ignore lint/suspicious/noTemplateCurlyInString: GitHub Actions expression
    [['        if: ${{ !cancelled() }}', '        run: npm test']],
    [['        run: docker run -t img npm test']],
    [['        run: npm test # never add || true here']],
    [
      [
        '        run: |',
        '          npm ci',
        '          npm test',
        '          exit 0',
      ],
    ],
    [
      [
        '        run: |',
        '          npm test',
        '          curl -k https://example.com || true',
      ],
    ],
    [['        run: npm test -- --coverage']],
  ])('accepts %j', (lines) => {
    expect(workflow([...STEPS.slice(0, -1), ...lines])).toEqual([]);
  });
});

describe('M8: false positives found in real history', () => {
  const change = (path: string, from: string[], to: string[]) =>
    check({ before: file(path, ...from), after: file(path, ...to) }).map(
      (f) => [f.ruleId, f.message],
    );
  const STEPS = [
    'jobs:',
    '  test:',
    '    steps:',
    '      - name: Test',
    '        run: npm test',
  ];
  const ci = (to: string[]) => change('.github/workflows/ci.yml', STEPS, to);

  it.each([
    // Matrix values that name a runner aren't commands.
    [
      [
        ...STEPS,
        '    strategy:',
        '      matrix:',
        '        npm-i: [mocha@8.4.0]',
      ],
      STEPS,
    ],
    [
      [
        ...STEPS,
        '        with:',
        "          extra-mvn-args: --projects '!test-shrinker'",
      ],
      STEPS,
    ],
    [[...STEPS, '      - {name: Range, tox: devel}'], STEPS],
  ])('accepts removing a matrix value %#', (from, to) => {
    expect(change('.github/workflows/ci.yml', from, to)).toEqual([]);
  });

  it('accepts a new build step or job that skips tests', () => {
    expect(
      ci([
        ...STEPS,
        '      - run: mvn package -DskipTests',
        '  api:',
        '    continue-on-error: true',
        '    steps:',
        "      - if: github.event_name == 'push'",
        '        run: npm test',
      ]),
    ).toEqual([]);
  });

  it('accepts a renamed runner (nub run test)', () => {
    expect(ci([...STEPS.slice(0, -1), '        run: nub run test'])).toEqual(
      [],
    );
  });

  it('still reports skipTests added to an existing test command', () => {
    expect(
      change(
        '.github/workflows/ci.yml',
        ['    steps:', '      - run: ./mvnw verify'],
        ['    steps:', '      - run: ./mvnw verify -DskipTests'],
      ),
    ).toEqual([['TG005', 'added `-DskipTests`']]);
  });

  const POM = (config: string) => [
    '<project><build><plugins>',
    '  <plugin>',
    '    <artifactId>maven-gpg-plugin</artifactId>',
    '    <configuration>',
    '      <skip>false</skip>',
    '    </configuration>',
    '  </plugin>',
    '  <plugin>',
    '    <artifactId>maven-surefire-plugin</artifactId>',
    '    <configuration>',
    config,
    '    </configuration>',
    '  </plugin>',
    '</plugins></build></project>',
  ];

  it('judges Maven <skip> only on the test plugins', () => {
    const before = POM('');
    const gpg = before.map((l) => l.replace('<skip>false', '<skip>true'));
    expect(
      change(
        'pom.xml',
        before.filter((l) => !l.includes('<skip>')),
        before,
      ),
    ).toEqual([]);
    expect(change('pom.xml', before, gpg)).toEqual([]);
    expect(change('pom.xml', before, POM('      <skip>true</skip>'))).toEqual([
      ['TG005', 'added `<skip>`'],
    ]);
  });

  it('accepts coverage run -p -m pytest', () => {
    expect(
      change(
        'tox.ini',
        ['[testenv]', 'commands = pytest'],
        ['[testenv]', 'commands = coverage run -p -m pytest'],
      ),
    ).toEqual([]);
  });

  it('accepts assert type(x) == y → is y', () => {
    expect(
      change(
        'tests/test_a.py',
        ['def test_a():', '    assert type(s) == bytes'],
        ['def test_a():', '    assert type(s) is bytes'],
      ),
    ).toEqual([]);
  });

  it('accepts JUnit 3 imports', () => {
    expect(
      change(
        'src/test/java/ASuiteTest.java',
        ['public class ASuiteTest {', '}'],
        ['import junit.framework.Test;', 'public class ASuiteTest {', '}'],
      ),
    ).toEqual([]);
  });
});

describe('TG008', () => {
  const judge = (
    implementationChanged: boolean | undefined,
    path: string,
    from: string[],
    to: string[],
  ) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged },
      ['TG008'],
    ).map(({ line, message }) => [line, message]);

  const JS = [
    "import { clamp } from '../src/clamp.js';",
    "test('lowers a value above the range', () => {",
    '  assert.deepEqual(clamp(11, 0, 10), 10);',
    '});',
  ];
  const wrong = JS.map((l) => l.replace('10), 10)', '10), 11)'));

  it('reports a rewritten expected value when no implementation changed', () => {
    expect(judge(false, 'test/clamp.test.js', JS, wrong)).toEqual([
      [
        3,
        'changed asserted values without changing the implementation: `assert.deepEqual(clamp(11, 0, 10), 10);` → `assert.deepEqual(clamp(11, 0, 10), 11);`',
      ],
    ]);
  });

  it('is not judged per edit or when the implementation changed', () => {
    expect(judge(undefined, 'test/clamp.test.js', JS, wrong)).toEqual([]);
    expect(judge(true, 'test/clamp.test.js', JS, wrong)).toEqual([]);
  });

  it.each([
    [
      'tests/test_a.py',
      ['def test_a():', '    self.assertEqual(word_count("Hi hi"), {"hi": 2})'],
      [
        'def test_a():',
        '    self.assertEqual(word_count("Hi hi"), {"Hi": 1, "hi": 1})',
      ],
    ],
    [
      'tests/test_a.py',
      ['def test_a():', '    assert flatten([1, [2, [3]]]) == [1, 2, 3]'],
      ['def test_a():', '    assert flatten([1, [2, [3]]]) == [1, 2, [3]]'],
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  @Test void a() {',
        '    assertEquals(4, romanToInt("IV"));',
        '  }',
        '}',
      ],
      [
        'class ATest {',
        '  @Test void a() {',
        '    assertEquals(6, romanToInt("IV"));',
        '  }',
        '}',
      ],
    ],
    [
      'a.test.js',
      [
        "it('a', () => {",
        '  expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);',
        '});',
      ],
      [
        "it('a', () => {",
        '  expect(chunk([1, 2, 3], 2)).toEqual([[1, 2, 3]]);',
        '});',
      ],
    ],
  ])('reports %s', (path, from, to) => {
    expect(judge(false, path, from, to)).toHaveLength(1);
  });

  it.each([
    // A new assertion, a renamed subject, a stronger matcher, a comment.
    [
      'a.test.js',
      ["it('a', () => {", '  expect(f(1)).toBe(2);', '});'],
      [
        "it('a', () => {",
        '  expect(f(1)).toBe(2);',
        '  expect(f(2)).toBe(3);',
        '});',
      ],
    ],
    [
      'a.test.js',
      ["it('a', () => {", '  expect(f(1)).toBe(2);', '});'],
      ["it('a', () => {", '  expect(g(1)).toBe(2);', '});'],
    ],
    [
      'a.test.js',
      ["it('a', () => {", '  expect(f(1)).toBeTruthy();', '});'],
      ["it('a', () => {", '  expect(f(1)).toBe(2);', '});'],
    ],
    [
      'a.test.js',
      ["it('a', () => {", '  const x = 1;', '  expect(f(x)).toBe(2);', '});'],
      ["it('a', () => {", '  const x = 5;', '  expect(f(x)).toBe(2);', '});'],
    ],
  ])('leaves %s alone (%#)', (path, from, to) => {
    expect(judge(false, path, from, to)).toEqual([]);
  });

  it('reports changed snapshots and inline snapshots', () => {
    expect(
      judge(
        false,
        'src/__snapshots__/a.test.js.snap',
        ['exports[`a 1`] = `"x"`;'],
        ['exports[`a 1`] = `"y"`;'],
      ),
    ).toEqual([
      [undefined, 'updated snapshot without changing the implementation'],
    ]);
    expect(
      judge(
        false,
        'a.test.js',
        [
          "it('a', () => {",
          '  expect(f()).toMatchInlineSnapshot(`',
          '    "x"',
          '  `);',
          '});',
        ],
        [
          "it('a', () => {",
          '  expect(f()).toMatchInlineSnapshot(`',
          '    "y"',
          '  `);',
          '});',
        ],
      ),
    ).toEqual([
      [3, 'changed an inline snapshot without changing the implementation'],
    ]);
  });
});
