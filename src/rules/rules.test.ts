import { describe, expect, it } from 'vitest';
import { compareFiles, type FileChange } from '../engine/compare.js';
import { createTestFileMatcher } from '../paths.js';
import { RULE_IDS, type RuleId } from './index.js';

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

describe('TG008, red-team re-check', () => {
  const judge = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message.split(':')[0]);
  const VALUES = 'changed asserted values without changing the implementation';

  it.each([
    // The expected value on its own line (Prettier, Black).
    [
      'a.test.js',
      [
        "it('a', () => {",
        '  expect(format(user)).toEqual({',
        '    age: 36,',
        '  });',
        '});',
      ],
      [
        "it('a', () => {",
        '  expect(format(user)).toEqual({',
        '    age: 37,',
        '  });',
        '});',
      ],
    ],
    [
      'tests/test_a.py',
      [
        'def test_a():',
        '    assert word_count("Hi hi") == {',
        '        "hi": 2,',
        '    }',
      ],
      [
        'def test_a():',
        '    assert word_count("Hi hi") == {',
        '        "hi": 1,',
        '    }',
      ],
    ],
    // Test tables.
    [
      'a.test.js',
      [
        'it.each([',
        '  [11, 0, 10, 10],',
        "])('clamps', (x, lo, hi, want) => {",
        '  expect(clamp(x, lo, hi)).toBe(want);',
        '});',
      ],
      [
        'it.each([',
        '  [11, 0, 10, 11],',
        "])('clamps', (x, lo, hi, want) => {",
        '  expect(clamp(x, lo, hi)).toBe(want);',
        '});',
      ],
    ],
    [
      'tests/test_a.py',
      [
        '@pytest.mark.parametrize("v,want", [(11, 10)])',
        'def test_a(v, want):',
        '    assert clamp(v) == want',
      ],
      [
        '@pytest.mark.parametrize("v,want", [(11, 11)])',
        'def test_a(v, want):',
        '    assert clamp(v) == want',
      ],
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  @ParameterizedTest',
        '  @CsvSource({"IV, 4"})',
        '  void a(String s, int n) { assertEquals(n, roman(s)); }',
        '}',
      ],
      [
        'class ATest {',
        '  @ParameterizedTest',
        '  @CsvSource({"IV, 6"})',
        '  void a(String s, int n) { assertEquals(n, roman(s)); }',
        '}',
      ],
    ],
    // Two assertions swapped and one changed.
    [
      'a.test.js',
      [
        "it('a', () => {",
        '  expect(f()).toBe(3);',
        '  expect(g()).toBe(4);',
        '});',
      ],
      [
        "it('a', () => {",
        '  expect(g()).toBe(4);',
        '  expect(f()).toBe(5);',
        '});',
      ],
    ],
  ])('reports %s (%#)', (path, from, to) => {
    expect(judge(path, from, to)).toEqual([VALUES]);
  });

  it.each([
    // Formatting and messages.
    [
      'a.test.js',
      ["it('a', () => {", "  expect(f()).toBe('a');", '});'],
      ["it('a', () => {", '  expect(f()).toBe("a");', '});'],
    ],
    [
      'a.test.js',
      ["it('a', () => {", '  expect(f()).toBe(1000);', '});'],
      ["it('a', () => {", '  expect(f()).toBe(1_000);', '});'],
    ],
    [
      'a.test.js',
      ["it('a', () => {", '  assert.equal(f(), 3);', '});'],
      ["it('a', () => {", "  assert.equal(f(), 3, 'f returns 3');", '});'],
    ],
    [
      'tests/test_a.py',
      ['def test_a():', '    assert f() == 3'],
      ['def test_a():', '    assert f() == 3, "f returns 3"'],
    ],
    [
      'tests/test_a.py',
      ['def test_a():', '    assert f() == 3  # was 2'],
      ['def test_a():', '    assert f() == 3  # was 4'],
    ],
    // A renamed test on the same line.
    [
      'a.test.js',
      ["it('a', () => expect(f()).toBe(3));"],
      ["it('f is three', () => expect(f()).toBe(3));"],
    ],
    // A row added to a table.
    [
      'a.test.js',
      [
        'it.each([',
        '  [1, 2],',
        '  [3, 4],',
        "])('x', (a, b) => {",
        '  expect(f(a)).toBe(b);',
        '});',
      ],
      [
        'it.each([',
        '  [1, 2],',
        '  [3, 4],',
        '  [5, 6],',
        "])('x', (a, b) => {",
        '  expect(f(a)).toBe(b);',
        '});',
      ],
    ],
    // A new test with an inline snapshot, and a re-indented one.
    [
      'a.test.js',
      ["it('a', () => {", '  expect(f()).toBe(1);', '});'],
      [
        "it('a', () => {",
        '  expect(f()).toBe(1);',
        '});',
        "it('b', () => {",
        '  expect(g()).toMatchInlineSnapshot(`',
        '    "x"',
        '  `);',
        '});',
      ],
    ],
    [
      'a.test.js',
      [
        "it('a', () => {",
        '  expect(g()).toMatchInlineSnapshot(`',
        '    "x"',
        '  `);',
        '});',
      ],
      [
        "it('a', () => {",
        '  expect(g()).toMatchInlineSnapshot(`',
        '      "x"',
        '  `);',
        '});',
      ],
    ],
    // A `(` inside an inline snapshot doesn't swallow the rest of the file.
    [
      'a.test.js',
      [
        "it('a', () => {",
        '  expect(g()).toMatchInlineSnapshot(`a (b`);',
        '});',
      ],
      [
        "it('a', () => {",
        '  expect(g()).toMatchInlineSnapshot(`a (b`);',
        '  expect(h()).toBe(2);',
        '});',
      ],
    ],
  ])('leaves %s alone (%#)', (path, from, to) => {
    expect(judge(path, from, to)).toEqual([]);
  });
});

describe('M11c: tests that check nothing', () => {
  it('TG003 names assertions that never run', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file(
          'a.test.js',
          "it('adds', () => {",
          '  return;',
          '  expect(add(1, 2)).toBe(3);',
          '  expect(add(2, 2)).toBe(4);',
          '});',
          ...JS_BEFORE.slice(4),
        ),
      }),
    ).toEqual([
      {
        ruleId: 'TG003',
        line: undefined,
        message: 'assertions 3 → 1 (2 in code that never runs)',
      },
    ]);
  });

  it('TG002 names tests that never run', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file(
          'a.test.js',
          ...JS_BEFORE.slice(0, 4),
          'if (false) {',
          ...JS_BEFORE.slice(4),
          '}',
        ),
      }).map((f) => [f.ruleId, f.message]),
    ).toEqual([
      ['TG002', 'test cases 2 → 1 (1 in code that never runs)'],
      ['TG003', 'assertions 3 → 2 (1 in code that never runs)'],
    ]);
  });

  it('TG004 reports a new mock of the module under test', () => {
    expect(
      check({
        before: file('src/add.test.js', ...JS_BEFORE),
        after: file('src/add.test.js', "vi.mock('./add');", ...JS_BEFORE),
      }),
    ).toEqual([
      { ruleId: 'TG004', line: 1, message: "added `vi.mock('./add')`" },
    ]);
  });

  it('accepts the same dead code moved around', () => {
    const dead = ['if (false) {', "  it('old', () => expect(1).toBe(2));", '}'];
    expect(
      check({
        before: file('a.test.js', ...dead, ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE, ...dead),
      }),
    ).toEqual([]);
  });
});

describe('M11d: subject comparison and expected values in variables', () => {
  const replaced = (subject: string) => [
    'TG007',
    `replaced the expected value with the value under test \`${subject}\``,
  ];

  it.each([
    [
      'a.test.js',
      'it("x", () => { expect(add(1, 2)).toBe(4); });',
      'it("x", () => { expect(add(1, 2)).toBe(add(1,2)); });',
      'add(1,2)',
    ],
    [
      'a.test.js',
      'it("x", () => { assert.deepEqual(parse("a"), ["b"]); });',
      'it("x", () => { assert.deepEqual(parse("a"), parse("a")); });',
      'parse("a")',
    ],
    [
      'a.test.js',
      'it("x", () => { expect(r).to.deep.equal([1]); });',
      'it("x", () => { expect(r).to.deep.equal(r); });',
      'r',
    ],
    [
      'test_a.py',
      'def test_a():\n    assert total(c) == 3',
      'def test_a():\n    assert total(c) == total(c)',
      'total(c)',
    ],
    [
      'test_a.py',
      'def test_a(self):\n    self.assertEqual(3, total(c))',
      'def test_a(self):\n    self.assertEqual(total(c), total(c))',
      'total(c)',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest { @Test void a() { assertEquals("msg", 4, roman("IV")); } }',
      'class ATest { @Test void a() { assertEquals("msg", roman("IV"), roman("IV")); } }',
      'roman("IV")',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest { @Test void a() { assertThat(roman("IV")).isEqualTo(5); } }',
      'class ATest { @Test void a() { assertThat(roman("IV")).isEqualTo(roman("IV")); } }',
      'roman("IV")',
    ],
  ])('TG007 %s: %s → %s', (path, from, to, subject) => {
    expect(
      check({ before: file(path, from), after: file(path, to) }).map((f) => [
        f.ruleId,
        f.message,
      ]),
    ).toEqual([replaced(subject)]);
  });

  it.each([
    // An equality test of the code (`equals`, determinism) is new, not a
    // replaced expected value.
    [
      'a.test.js',
      'it("x", () => { expect(a).toBe(1); });',
      'it("x", () => { expect(a).toBe(1); expect(make()).toEqual(make()); });',
    ],
    // Strings differ though the stripped code is the same.
    [
      'a.test.js',
      'it("x", () => { expect("a").toBe(f()); });',
      'it("x", () => { expect("a").toBe("b"); });',
    ],
    // `.not` isn't an equality check.
    [
      'a.test.js',
      'it("x", () => { expect(r).toBe(1); });',
      'it("x", () => { expect(r).toBe(1); expect(r).not.toBe(r2); });',
    ],
  ])('no TG007 subject finding: %s', (path, from, to) => {
    expect(
      check({ before: file(path, from), after: file(path, to) }).filter((f) =>
        f.message.startsWith('replaced'),
      ),
    ).toEqual([]);
  });

  const judge = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ line, message }) => [line, message]);

  it.each([
    [
      'test/clamp.test.js',
      [
        "test('clamps', () => {",
        '  const expected = 10;',
        '  expect(clamp(11, 0, 10)).toBe(expected);',
        '});',
      ],
      2,
      '`const expected = 10;` → `const expected = 11;`',
    ],
    [
      'tests/test_a.py',
      [
        'EXPECTED = {"hi": 2}',
        'def test_a():',
        '    assert word_count("Hi hi") == EXPECTED',
      ],
      1,
      '`EXPECTED = {"hi": 2}` → `EXPECTED = {"hi": 3}`',
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  private static final int EXPECTED = 4;',
        '  @Test void a() { assertEquals(EXPECTED, roman("IV")); }',
        '}',
      ],
      2,
      '`private static final int EXPECTED = 4;` → `private static final int EXPECTED = 5;`',
    ],
  ])(
    'TG008 %s: a changed expected value in a variable',
    (path, lines, line, change) => {
      const changed = lines.map((l, i) =>
        i === line - 1 ? l.replace(/10|2|4/, (n) => String(Number(n) + 1)) : l,
      );
      expect(judge(path, lines, changed)).toEqual([
        [
          line,
          `changed asserted values without changing the implementation: ${change}`,
        ],
      ]);
    },
  );

  it.each([
    // Not used by an assertion.
    [
      'test/a.test.js',
      ['const timeout = 10;', "test('a', () => { expect(f()).toBe(1); });"],
      ['const timeout = 20;', "test('a', () => { expect(f()).toBe(1); });"],
    ],
    // Computed by code: the call is what the test runs.
    [
      'test/a.test.js',
      [
        "test('a', () => {",
        '  const result = add(2, 3);',
        '  expect(result).toBe(5);',
        '});',
      ],
      [
        "test('a', () => {",
        '  const result = add(2, 3, 0);',
        '  expect(result).toBe(5);',
        '});',
      ],
    ],
    // A keyword argument, not a variable.
    [
      'tests/test_a.py',
      [
        'def test_a():',
        '    r = f(',
        '        r=1,',
        '    )',
        '    assert r == 2',
      ],
      [
        'def test_a():',
        '    r = f(',
        '        r=3,',
        '    )',
        '    assert r == 2',
      ],
    ],
  ])('no TG008 for %s', (path, from, to) => {
    expect(judge(path, from, to)).toEqual([]);
  });
});

describe('M11d, red-team re-check', () => {
  const tg007 = (path: string, from: string[], to: string[]) =>
    check({ before: file(path, ...from), after: file(path, ...to) })
      .filter((f) => f.message.startsWith('replaced'))
      .map((f) => f.message);
  const tg008 = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const it_ = (...body: string[]) => ["it('x', () => {", ...body, '});'];

  it.each([
    // The subject or the expected value held in a name.
    [
      it_('  expect(add(1, 2)).toBe(3);'),
      it_('  const r = add(1, 2);', '  expect(r).toBe(r);'),
    ],
    [
      it_('  expect(add(1, 2)).toBe(3);'),
      it_(
        '  const expected = add(1, 2);',
        '  expect(add(1, 2)).toBe(expected);',
      ),
    ],
  ])('TG007 follows names: %j', (from, to) => {
    expect(tg007('a.test.js', from, to)).toEqual([
      'replaced the expected value with the value under test `add(1,2)`',
    ]);
  });

  it.each([
    [
      'class ATest { @Test void a() { assertThat(roman("IV")).as("iv").isEqualTo(4); } }',
      'class ATest { @Test void a() { assertThat(roman("IV")).as("iv").isEqualTo(roman("IV")); } }',
    ],
    [
      'class ATest { @Test void a() { assertThat(roman("IV"), is(4)); } }',
      'class ATest { @Test void a() { assertThat(roman("IV"), is(equalTo(roman("IV")))); } }',
    ],
  ])('TG007 Java %s', (from, to) => {
    expect(tg007('src/test/java/ATest.java', [from], [to])).toEqual([
      'replaced the expected value with the value under test `roman("IV")`',
    ]);
  });

  it('TG007 leaves a reformatted check next to a new determinism test', () => {
    expect(
      tg007(
        'a.test.js',
        it_('  expect(make()).toEqual({ a: 1 });'),
        it_(
          '  expect(make()).toEqual({',
          '    a: 1,',
          '  });',
          '  expect(make()).toEqual(make());',
        ),
      ),
    ).toEqual([]);
  });

  it.each([
    // Moved into a variable and changed in one step, and back.
    [
      it_('  expect(clamp(11, 0, 10)).toBe(10);'),
      it_(
        '  const expected = 11;',
        '  expect(clamp(11, 0, 10)).toBe(expected);',
      ),
    ],
    [
      it_(
        '  const expected = 10;',
        '  expect(clamp(11, 0, 10)).toBe(expected);',
      ),
      it_('  expect(clamp(11, 0, 10)).toBe(11);'),
    ],
  ])('TG008 one step: %j', (from, to) => {
    expect(tg008('test/clamp.test.js', from, to)).toHaveLength(1);
  });

  it.each([
    // Prettier's trailing comma.
    [
      it_(
        '  const expected = { a: 1, b: 2 };',
        '  expect(f()).toEqual(expected);',
      ),
      it_(
        '  const expected = {',
        '    a: 1,',
        '    b: 2,',
        '  };',
        '  expect(f()).toEqual(expected);',
      ),
    ],
    // A property of the subject isn't an expected value.
    [
      [
        'const limit = 10;',
        ...it_('  expect(cfg.limit).toBe(5);', '  expect(run(limit)).toBe(1);'),
      ],
      [
        'const limit = 20;',
        ...it_('  expect(cfg.limit).toBe(5);', '  expect(run(limit)).toBe(1);'),
      ],
    ],
    // Moved into a variable without changing it.
    [
      it_('  expect(clamp(11, 0, 10)).toBe(10);'),
      it_(
        '  const expected = 10;',
        '  expect(clamp(11, 0, 10)).toBe(expected);',
      ),
    ],
  ])('no TG008: %j', (from, to) => {
    expect(tg008('test/a.test.js', from, to)).toEqual([]);
  });
});

describe('M11d: expected values for any matcher, value constructors', () => {
  const tg008 = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const bump = (lines: string[], i: number) =>
    lines.map((l, k) =>
      k === i ? l.replace(/\d+(?=\D*$)/, (n) => String(Number(n) + 1)) : l,
    );

  it.each([
    [
      'test/a.test.js',
      [
        "test('a', () => {",
        '  const count = 3;',
        '  expect(split("a,b,c")).toHaveLength(count);',
        '});',
      ],
      1,
    ],
    [
      'test/a.test.js',
      [
        "test('a', () => {",
        '  const args = [1, 2];',
        '  expect(fn).toHaveBeenCalledWith(args);',
        '});',
      ],
      1,
    ],
    [
      'tests/test_a.py',
      ['LIMIT = 10', 'def test_a():', '    assert len(build()) < LIMIT'],
      0,
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  static final List<Integer> EXPECTED = List.of(1, 2, 3);',
        '  @Test void a() { assertEquals(EXPECTED, sorted(input)); }',
        '}',
      ],
      1,
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  static final int SIZE = 3;',
        '  @Test void a() { assertThat(items()).hasSize(SIZE); }',
        '}',
      ],
      1,
    ],
    [
      'src/test/java/ATest.java',
      [
        'class ATest {',
        '  static final int SIZE = 3;',
        '  @Test void a() { assertThat(items(), hasSize(SIZE)); }',
        '}',
      ],
      1,
    ],
  ])('TG008 %s: a changed value used by a check', (path, lines, line) => {
    expect(tg008(path, lines, bump(lines, line))).toHaveLength(1);
  });

  it('leaves an input passed to the code alone, whatever the matcher', () => {
    const lines = [
      "test('a', () => {",
      '  const n = 3;',
      '  expect(range(n)).toHaveLength(3);',
      '});',
    ];
    expect(tg008('test/a.test.js', lines, bump(lines, 1))).toEqual([]);
  });

  it('TG007 still compares only equality checks', () => {
    expect(
      check({
        before: file('a.test.js', 'it("x", () => { expect(r).toBe(1); });'),
        after: file(
          'a.test.js',
          'it("x", () => { expect(r).toBe(1); expect(r).not.toBe(r); });',
        ),
      }).filter((f) => f.message.startsWith('replaced')),
    ).toEqual([]);
  });
});

describe('M11d: false positives found in real history (gson 2bcaaed)', () => {
  const tg008 = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const PATH = 'src/test/java/ATest.java';

  it('leaves a value that is also passed to the code (a round trip)', () => {
    const source = (json: string) => [
      'class ATest {',
      '  @Test void a() {',
      `    String json = "${json}";`,
      '    Cal cal = gson.fromJson(json, Cal.class);',
      '    assertThat(cal.year()).isEqualTo(2009);',
      '    assertThat(gson.toJson(cal)).isEqualTo(json);',
      '  }',
      '}',
    ];
    expect(
      tg008(PATH, source('{year:2009}'), source('{\\"year\\":2009}')),
    ).toEqual([]);
  });

  it("doesn't read a name declared in another method", () => {
    const before = [
      'class ATest {',
      '  @Test void a() {',
      '    String expected = "x";',
      '    assertThat(f()).isEqualTo(expected);',
      '  }',
      '  @Test void b() {',
      '    try { g(); } catch (Err expected) {',
      '      assertThat(expected).hasMessageThat().isEqualTo("old");',
      '    }',
      '  }',
      '}',
    ];
    const after = [
      ...before.slice(0, 6),
      '    var e = assertThrows(Err.class, () -> g());',
      '    assertThat(e).hasMessageThat().isEqualTo("old");',
      ...before.slice(9),
    ];
    expect(tg008(PATH, before, after)).toEqual([]);
  });
});

describe('M11d: own review', () => {
  it('compares subjects in a Java file with unicode escapes', () => {
    const path = 'src/test/java/ATest.java';
    const body = (expected: string) =>
      `class ATest { @Test void a() { String s = "caf\\u00e9"; assertEquals(${expected}, roman("IV")); } }`;
    expect(
      check({
        before: file(path, body('4')),
        after: file(path, body('roman("IV")')),
      }).map((f) => f.message),
    ).toEqual([
      'replaced the expected value with the value under test `roman("IV")`',
    ]);
  });
});

describe('M11d: false positives found in real history (zod d24fb4c)', () => {
  it("doesn't read a variable that changes as the value it was declared with", () => {
    const before = [
      "test('reads', () => {",
      '  let reads = 0;',
      '  const input = { get x() { reads++; return 1; } };',
      '  parse(input);',
      '  expect(reads).toBe(1);',
      '});',
    ];
    const after = before.map((l) => l.replace('toBe(1)', 'toBe(0)'));
    expect(
      check({
        before: file('a.test.js', ...before),
        after: file('a.test.js', ...after),
      }).filter((f) => f.message.startsWith('replaced')),
    ).toEqual([]);
  });
});

describe('Codex adversarial review', () => {
  it('TG003 when an assertion moves into a local class method nothing calls', () => {
    expect(
      check({
        before: file(
          'a.test.js',
          "it('adds', () => {",
          '  expect(add(1, 2)).toBe(3);',
          '});',
        ),
        after: file(
          'a.test.js',
          'class Checks {',
          '  adds() { expect(add(1, 2)).toBe(3); }',
          '}',
          "it('adds', () => {",
          '  new Checks();',
          '});',
        ),
      }).map((f) => [f.ruleId, f.message]),
    ).toEqual([['TG003', 'assertions 1 → 0 (1 in code that never runs)']]);
  });
});

describe('TG006: agent hooks turned off by renaming "hooks"', () => {
  it.each([
    '.claude/settings.json',
    '.codex/hooks.json',
    '.gemini/settings.json',
  ])('%s', (path) => {
    const settings = {
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: 'command',
                command: 'npx --no-install test-guard hook x stop',
              },
            ],
          },
        ],
      },
    };
    const text = JSON.stringify(settings, null, 2);
    expect(
      check({
        before: file(path, text),
        after: file(path, text.replace('"hooks": {', '"hooks_off": {')),
      }).map((f) => f.message),
    ).toEqual(["removed test-guard's hooks from the agent settings"]);
  });
});

describe('M11d leftovers: signs, constants, partial and loose matchers', () => {
  const run = (
    rule: 'TG007' | 'TG008',
    path: string,
    from: string,
    to: string,
  ) =>
    compareFiles(
      {
        before: file(path, ...from.split('\n')),
        after: file(path, ...to.split('\n')),
      },
      { ...ctx, implementationChanged: false },
      [rule],
    ).map(({ message }) => message);

  it.each([
    [
      'a sign flipped',
      'expect(cmp(1, 2)).toBe(-1);',
      'expect(cmp(1, 2)).toBe(1);',
    ],
    [
      'another constant',
      'expect(status(u)).toBe(Status.ACTIVE);',
      'expect(status(u)).toBe(Status.INACTIVE);',
    ],
  ])('TG008 reports %s', (_, from, to) => {
    expect(run('TG008', 'a.test.ts', from, to)).toEqual([
      expect.stringContaining('changed asserted values'),
    ]);
  });

  it.each([
    [
      'a subtraction kept',
      'expect(f(a - 1)).toBe(2);',
      'expect(f(a - 1)).toBe(2); // ok',
    ],
    [
      'a method renamed',
      'expect(s.isActive()).toBe(true);',
      'expect(s.isEnabled()).toBe(true);',
    ],
  ])('TG008 leaves %s', (_, from, to) => {
    expect(run('TG008', 'a.test.ts', from, to)).toEqual([]);
  });

  it.each([
    [
      'a.test.js',
      "expect(user()).toEqual({ id: 1, name: 'a' });",
      'expect(user()).toMatchObject({ id: 1 });',
      'toMatchObject',
    ],
    [
      'a.test.js',
      'expect(user()).toEqual({ id: 1 });',
      'expect(user()).toEqual(expect.anything());',
      'expect.anything()',
    ],
    [
      'test_a.py',
      'assert area(2) == pytest.approx(12.566)',
      'assert area(2) == pytest.approx(12.566, abs=100)',
      'pytest.approx(y, tolerance)',
    ],
  ])('TG007 reports %s: %s', (path, from, to, label) => {
    expect(run('TG007', path, from, to)).toEqual([
      expect.stringContaining(label),
    ]);
  });

  it.each([
    [
      'test_a.py',
      'assert total() == 0.3',
      'assert total() == pytest.approx(0.3)',
    ],
    [
      'a.test.js',
      'expect(n).toEqual(expect.any(Number));',
      'expect(m).toEqual(expect.any(Number));',
    ],
  ])('TG007 leaves %s: %s', (path, from, to) => {
    expect(run('TG007', path, from, to)).toEqual([]);
  });
});

describe('M11d leftovers, red-team re-check', () => {
  const run = (
    rule: 'TG007' | 'TG008',
    path: string,
    from: string,
    to: string,
  ) =>
    compareFiles(
      {
        before: file(path, ...from.split('\n')),
        after: file(path, ...to.split('\n')),
      },
      { ...ctx, implementationChanged: false },
      [rule],
    ).map(({ message }) => message);
  const js = (...body: string[]) =>
    ["test('a', () => {", ...body.map((l) => `  ${l}`), '});'].join('\n');

  it.each([
    [
      'a loose matcher wrapped by Prettier',
      js("expect(f(u)).toEqual({ id: 1, name: 'a', role: 'admin' });"),
      js(
        'expect(f(u)).toEqual(',
        '  expect.objectContaining({ id: 1 }),',
        ');',
      ),
    ],
    [
      'a loose matcher nested in the value',
      js("expect(f(u)).toEqual({ id: 1, name: 'a' });"),
      js("expect(f(u)).toEqual({ id: expect.any(Number), name: 'a' });"),
    ],
    [
      'a nested loose matcher on a wrapped line',
      js('expect(f(u)).toEqual({', '  id: 1,', "  name: 'a',", '});'),
      js(
        'expect(f(u)).toEqual({',
        '  id: expect.any(Number),',
        "  name: 'a',",
        '});',
      ),
    ],
    [
      'a snapshot',
      js('expect(f(u)).toEqual({ id: 1 });'),
      js('expect(f(u)).toMatchSnapshot();'),
    ],
    [
      'a property',
      js('expect(f(u)).toEqual({ id: 1 });'),
      js("expect(f(u)).toHaveProperty('id');"),
    ],
    [
      'a member',
      js('expect(f(u)).toEqual([1, 2, 3]);'),
      js('expect(f(u)).toContain(1);'),
    ],
  ])('TG007 reports %s', (_, from, to) => {
    expect(run('TG007', 'a.test.js', from, to)).toEqual([
      expect.stringContaining('weakened assertion'),
    ]);
  });

  it.each([
    [
      'a tolerance wrapped by Black',
      'def test_a():\n    assert f(2) == 12.566',
      'def test_a():\n    assert f(2) == pytest.approx(\n        12.566, abs=100\n    )',
    ],
    [
      'approx on the left',
      'def test_a():\n    assert f(2) == 12.566',
      'def test_a():\n    assert pytest.approx(12.566, abs=100) == f(2)',
    ],
    [
      'a positional tolerance',
      'def test_a():\n    assert f(2) == 12.566',
      'def test_a():\n    assert f(2) == pytest.approx(12.566, 100)',
    ],
    [
      'assertAlmostEqual with a delta',
      'class T(TestCase):\n    def test_a(self):\n        self.assertEqual(f(2), 12.566)',
      'class T(TestCase):\n    def test_a(self):\n        self.assertAlmostEqual(f(2), 12.566, delta=100)',
    ],
    [
      'assertIn',
      'class T(TestCase):\n    def test_a(self):\n        self.assertEqual(f(2), [1, 2])',
      'class T(TestCase):\n    def test_a(self):\n        self.assertIn(1, f(2))',
    ],
  ])('TG007 reports %s', (_, from, to) => {
    expect(run('TG007', 'test_a.py', from, to)).toEqual([
      expect.stringContaining('weakened assertion'),
    ]);
  });

  it.each([
    [
      'a loose matcher joined onto one line',
      js(
        'expect(f(u)).toEqual(',
        '  expect.objectContaining({ id: 1 }),',
        ');',
      ),
      js('expect(f(u)).toEqual(expect.objectContaining({ id: 1 }));'),
    ],
    [
      'a test replaced by an unrelated one using toMatchObject',
      [
        "test('old', () => {",
        '  expect(f(u)).toEqual({ id: 1 });',
        '});',
        '',
        "test('keep', () => {",
        '  expect(g()).toBe(2);',
        '});',
      ].join('\n'),
      [
        "test('keep', () => {",
        '  expect(g()).toBe(2);',
        '});',
        '',
        "test('new', () => {",
        '  expect(h()).toMatchObject({ id: 4 });',
        '});',
      ].join('\n'),
    ],
  ])('TG007 leaves %s', (_, from, to) => {
    expect(run('TG007', 'a.test.js', from, to)).toEqual([]);
  });

  it.each([
    [
      'a PascalCase enum',
      'expect(f(u)).toBe(Status.Active);',
      'expect(f(u)).toBe(Status.Inactive);',
    ],
    [
      'a bare constant',
      'expect(f(u)).toBe(ACTIVE);',
      'expect(f(u)).toBe(INACTIVE);',
    ],
  ])('TG008 reports %s', (_, from, to) => {
    expect(run('TG008', 'a.test.ts', from, to)).toEqual([
      expect.stringContaining('changed asserted values'),
    ]);
  });

  it('TG008 leaves a constant passed to the code under test', () => {
    expect(
      run(
        'TG008',
        'a.test.ts',
        'expect(f(MOCK.USER)).toBe(1);',
        'expect(f(MOCK.MEMBER)).toBe(1);',
      ),
    ).toEqual([]);
  });
});

describe('M11d leftovers: false positives found in real history (gson 9a492d7b55)', () => {
  it('reads Boolean.TRUE as true', () => {
    const path = 'src/test/java/ATest.java';
    const body = (value: string) => [
      'class ATest {',
      '  @Test void a() {',
      `    assertThat(gson.fromJson("true", boolean.class)).isEqualTo(${value});`,
      '  }',
      '}',
    ];
    expect(
      compareFiles(
        {
          before: file(path, ...body('Boolean.TRUE')),
          after: file(path, ...body('true')),
        },
        { ...ctx, implementationChanged: false },
        ['TG008'],
      ),
    ).toEqual([]);
  });
});

describe('Codex adversarial review: long assertions', () => {
  const run = (rule: 'TG007' | 'TG008', from: string[], to: string[]) =>
    compareFiles(
      { before: file('a.test.js', ...from), after: file('a.test.js', ...to) },
      { ...ctx, implementationChanged: false },
      [rule],
    ).map(({ message }) => message);
  const long = (n: number, at: number, value: string) => [
    "test('a', () => {",
    '  expect(build()).toEqual({',
    ...Array.from(
      { length: n },
      (_, i) => `    k${i}: ${i === at ? value : i},`,
    ),
    '  });',
    '});',
  ];

  it('TG007 sees a loose matcher far below the start of the assertion', () => {
    expect(
      run('TG007', long(60, 50, '50'), long(60, 50, 'expect.anything()')),
    ).toEqual([expect.stringContaining('weakened assertion')]);
  });

  it('TG008 sees a value changed far below the start of the assertion', () => {
    expect(run('TG008', long(300, 250, '250'), long(300, 250, '251'))).toEqual([
      expect.stringContaining('changed asserted values'),
    ]);
  });
});

describe('TG008: an expected value assigned again', () => {
  const run = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const insert = (lines: string[], at: number, line: string) => [
    ...lines.slice(0, at),
    line,
    ...lines.slice(at),
  ];

  const js = [
    "test('a', () => {",
    '  let expected = 10;',
    '  expect(add(5, 5)).toBe(expected);',
    '});',
  ];
  const each = [
    "describe('a', () => {",
    '  let expected = 10;',
    '  beforeEach(() => {',
    '    reset();',
    '  });',
    "  test('a', () => {",
    '    expect(add(5, 5)).toBe(expected);',
    '  });',
    '});',
  ];
  const py = [
    'def test_a():',
    '    expected = 10',
    '    assert add(5, 5) == expected',
  ];

  it.each([
    ['in the test', 'a.test.js', js, 2, '  expected = 11;'],
    ['in a beforeEach', 'a.test.js', each, 4, '    expected = 11;'],
    ['by a second Python assignment', 'test_a.py', py, 2, '    expected = 11'],
  ])('reports one %s', (_, path, lines, at, line) => {
    expect(run(path, lines, insert(lines, at, line))).toEqual([
      expect.stringContaining('assigned the expected value `expected` again'),
    ]);
  });

  it.each([
    [
      'a new test with its own value of the same name',
      [
        ...js,
        "test('b', () => {",
        '  let expected = 12;',
        '  expect(add(6, 6)).toBe(expected);',
        '});',
      ],
    ],
    [
      'a value assigned after the last check',
      insert(js, 3, '  expected = 11;'),
    ],
    ['a value computed by code', insert(js, 2, '  expected = add(5, 6);')],
  ])('leaves %s', (_, to) => {
    expect(run('a.test.js', js, to)).toEqual([]);
  });
});

describe('TG008: an expected value assigned again, red-team re-check', () => {
  const run = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const again = 'assigned the expected value `expected` again';
  const js = (...lines: string[]) => [
    "describe('a', () => {",
    '  let expected;',
    '  beforeEach(() => {',
    ...lines.map((l) => `    ${l}`),
    '  });',
    "  test('a', () => {",
    '    expect(add(5, 5)).toBe(expected);',
    '  });',
    '});',
  ];
  const inTest = (...lines: string[]) => [
    "test('a', () => {",
    '  let expected = 10;',
    ...lines.map((l) => `  ${l}`),
    '  expect(add(5, 5)).toEqual(expected);',
    '});',
  ];

  it.each([
    [
      'set in beforeEach under a bare declaration',
      js('expected = 10;'),
      js('expected = 11;'),
    ],
    ['+= 1', inTest(), inTest('expected += 1;')],
    ['++', inTest(), inTest('expected++;')],
    ['a member', inTest(), inTest('expected.total = 11;')],
    [
      'after other code on the line',
      inTest(),
      inTest('reset(); expected = 11;'),
    ],
    ['under an if', inTest(), inTest('if (process.env.CI) expected = 11;')],
    [
      'on the declaration line',
      inTest(),
      [
        "test('a', () => {",
        '  let expected = 10; expected = 11;',
        '  expect(add(5, 5)).toEqual(expected);',
        '});',
      ],
    ],
  ])('reports one %s', (_, from, to) => {
    expect(run('a.test.js', from, to)).toEqual([
      expect.stringContaining(again),
    ]);
  });

  it('reports a Java field set again in @BeforeEach', () => {
    const java = (value: number) => [
      'class ATest {',
      '  int expected;',
      '  @BeforeEach void setUp() {',
      `    expected = ${value};`,
      '  }',
      '  @Test void a() {',
      '    assertEquals(expected, add(5, 5));',
      '  }',
      '}',
    ];
    expect(run('src/test/java/ATest.java', java(10), java(11))).toEqual([
      expect.stringContaining(again),
    ]);
  });

  it('reports an annotated Python assignment', () => {
    expect(
      run(
        'test_a.py',
        [
          'def test_a():',
          '    expected = 10',
          '    assert add(5, 5) == expected',
        ],
        [
          'def test_a():',
          '    expected = 10',
          '    expected: int = 11',
          '    assert add(5, 5) == expected',
        ],
      ),
    ).toEqual([expect.stringContaining(again)]);
  });

  const single = [
    "test('a', () => {",
    '  let expected = 10;',
    '  expect(add(5, 5)).toBe(expected);',
    '});',
  ];
  const shared = [
    "describe('a', () => {",
    '  let expected = 10;',
    "  test('a', () => {",
    '    expect(add(5, 5)).toBe(expected);',
    '  });',
    '});',
  ];
  it.each([
    [
      'a new check reusing the name after the old one',
      single,
      [
        ...single.slice(0, 3),
        '  expected = 5;',
        '  expect(add(2, 3)).toBe(expected);',
        '});',
      ],
    ],
    [
      'a loop over a table',
      single,
      [
        ...single.slice(0, 3),
        '  for (const [a, b, e] of [[1, 2, 3]]) {',
        '    expected = e;',
        '    expect(add(a, b)).toBe(expected);',
        '  }',
        '});',
      ],
    ],
    [
      'a new test setting the shared name',
      shared,
      [
        ...shared.slice(0, 5),
        "  test('b', () => {",
        '    expected = 7;',
        '    expect(add(3, 4)).toBe(expected);',
        '  });',
        '});',
      ],
    ],
    [
      'cleanup in afterEach',
      shared,
      [
        ...shared.slice(0, 2),
        '  afterEach(() => {',
        '    expected = undefined;',
        '  });',
        ...shared.slice(2),
      ],
    ],
  ])('leaves %s', (_, from, to) => {
    expect(run('a.test.js', from, to)).toEqual([]);
  });

  it('leaves a new Python test with its own value of a module name', () => {
    expect(
      run(
        'test_a.py',
        [
          'expected = 10',
          '',
          'def test_a():',
          '    assert add(5, 5) == expected',
        ],
        [
          'expected = 10',
          '',
          'def test_b():',
          '    expected = 7',
          '    assert add(3, 4) == expected',
          '',
          'def test_a():',
          '    assert add(5, 5) == expected',
        ],
      ),
    ).toEqual([]);
  });
});

describe('TG008: expected values given again in other forms', () => {
  const run = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const inTest = (first: string, ...lines: string[]) => [
    "test('a', () => {",
    `  let expected = ${first};`,
    '  let other = 0;',
    ...lines.map((l) => `  ${l}`),
    '  expect(add(5, 5)).toEqual(expected);',
    '});',
  ];
  const py = (...lines: string[]) => [
    'def test_a():',
    '    expected = 10',
    '    other = 0',
    ...lines.map((l) => `    ${l}`),
    '    assert add(5, 5) == expected',
  ];
  const unit = (value: number, ...lines: string[]) => [
    'class TestA(unittest.TestCase):',
    '    def setUp(self):',
    `        self.expected = ${value}`,
    '',
    '    def test_a(self):',
    ...lines.map((l) => `        ${l}`),
    '        self.assertEqual(add(5, 5), self.expected)',
  ];
  const fixture = (value: number, use: string) => [
    '@pytest.fixture',
    'def value():',
    `    return ${value}`,
    '',
    'def test_a(value):',
    `    ${use}`,
  ];

  it.each([
    ['a wrapped value', inTest('10'), inTest('10', 'expected = Number("11");')],
    ['a wrapped declaration', inTest('Number("10")'), inTest('Number("11")')],
    [
      'Object.assign',
      inTest('{ total: 10 }'),
      inTest('{ total: 10 }', 'Object.assign(expected, { total: 11 });'),
    ],
    [
      'array destructuring',
      inTest('10'),
      inTest('10', '[expected, other] = [11, 2];'),
    ],
  ])('reports %s', (_, from, to) => {
    expect(run('a.test.js', from, to)).toHaveLength(1);
  });

  it.each([
    ['a tuple assignment', py(), py('expected, other = 11, 2')],
    ['self.expected changed in setUp', unit(10), unit(11)],
    [
      'self.expected given again in the test',
      unit(10),
      unit(10, 'self.expected = 11'),
    ],
    [
      'an expected value moved into setUp',
      [
        'class TestA(unittest.TestCase):',
        '    def test_a(self):',
        '        self.assertEqual(add(5, 5), 10)',
      ],
      unit(11),
    ],
    [
      'a fixture return value',
      fixture(10, 'assert add(5, 5) == value'),
      fixture(11, 'assert add(5, 5) == value'),
    ],
  ])('reports %s', (_, from, to) => {
    expect(run('test_a.py', from, to)).toHaveLength(1);
  });

  it.each([
    [
      'a value computed from a name',
      inTest('10'),
      inTest('10', 'expected = Number(input);'),
    ],
    [
      'Object.assign on the result',
      inTest('10'),
      inTest('10', 'Object.assign(other, { total: 11 });'),
    ],
  ])('leaves %s', (_, from, to) => {
    expect(run('a.test.js', from, to)).toEqual([]);
  });

  it.each([
    [
      'a fixture passed to the code',
      fixture(10, 'assert add(value, 5) == 15'),
      fixture(11, 'assert add(value, 5) == 15'),
    ],
    [
      'self.expected set in a new test',
      unit(10),
      [
        ...unit(10),
        '',
        '    def test_b(self):',
        '        self.expected = 7',
        '        self.assertEqual(add(3, 4), self.expected)',
      ],
    ],
  ])('leaves %s', (_, from, to) => {
    expect(run('test_a.py', from, to)).toEqual([]);
  });
});

describe('TG007: chai, node:assert, jest-extended, AssertJ and Hamcrest', () => {
  const run = (path: string, from: string, to: string) =>
    compareFiles({ before: file(path, from), after: file(path, to) }, ctx, [
      'TG007',
    ]).map(({ message }) => message);
  const java = 'src/test/java/ATest.java';

  it.each([
    [
      'a.test.js',
      'expect(add(1, 2)).to.equal(3);',
      'expect(add(1, 2)).to.be.ok;',
    ],
    [
      'a.test.js',
      'expect(r).to.deep.equal({ a: 1 });',
      'expect(r).to.include({ a: 1 });',
    ],
    ['a.test.js', 'expect(r).to.eql([1, 2]);', "expect(r).to.be.an('array');"],
    [
      'a.test.js',
      'expect(add(1, 2)).to.equal(3);',
      'expect(add(1, 2)).to.be.closeTo(3, 1);',
    ],
    [
      'a.test.js',
      'expect(add(1, 2)).to.equal(3);',
      'expect(add(1, 2)).to.not.equal(0);',
    ],
    ['a.test.js', 'assert.strictEqual(add(1, 2), 3);', 'assert.ok(add(1, 2));'],
    [
      'a.test.js',
      'assert.deepStrictEqual(add(1, 2), 3);',
      'assert.notStrictEqual(add(1, 2), 0);',
    ],
    ['a.test.js', 'assert.equal(add(1, 2), 3);', 'assert(add(1, 2));'],
    [
      'a.test.js',
      'expect(add(1, 2)).toBe(3);',
      'expect(add(1, 2)).toBeNumber();',
    ],
    [
      java,
      'assertThat(add(1, 2)).isEqualTo(3);',
      'assertThat(add(1, 2)).isNotNull();',
    ],
    [
      java,
      'assertThat(list).containsExactly(1, 2);',
      'assertThat(list).contains(1);',
    ],
    [
      java,
      'assertEquals(3, add(1, 2));',
      'assertThat(add(1, 2)).isPositive();',
    ],
    [
      java,
      'assertThat(add(1, 2), is(3));',
      'assertThat(add(1, 2), notNullValue());',
    ],
    [
      java,
      'assertThat(r).isEqualTo(3.0);',
      'assertThat(r).isCloseTo(3.0, within(1.0));',
    ],
  ])('reports %s: %s → %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([
      expect.stringContaining('weakened assertion'),
    ]);
  });

  it.each([
    ['a.test.js', 'expect(r).to.deep.equal(x);', 'expect(r).to.eql(x);'],
    ['a.test.js', 'assert.equal(a, 1);', 'assert.strictEqual(a, 1);'],
    ['a.test.js', 'expect(a).to.not.equal(1);', 'expect(a).to.be.ok;'],
    [java, 'assertThat(r).isEqualTo(x);', 'assertThat(r).containsExactly(x);'],
    [java, 'assertThat(r).isNotEqualTo(x);', 'assertThat(r).isNotNull();'],
    [java, 'assertThat(r, equalTo(x));', 'assertThat(r).isEqualTo(x);'],
  ])('leaves %s: %s → %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([]);
  });

  it('leaves partial matchers in a new test', () => {
    expect(
      run(
        'a.test.js',
        'expect(add(1, 2)).to.equal(3);',
        [
          'expect(add(1, 2)).to.equal(3);',
          'expect(r).to.include({ a: 1 });',
        ].join('\n'),
      ),
    ).toEqual([]);
  });
});

describe('TG007: a large file diffed as one hunk', () => {
  it('leaves a weak assertion that is only deleted and added again', () => {
    const filler = (name: string) =>
      Array.from({ length: 2100 }, (_, i) => `int ${name}${i} = ${i};`);
    const path = 'src/test/java/ATest.java';
    expect(
      compareFiles(
        {
          before: file(
            path,
            ...filler('a'),
            'assertThat(r.ok()).isTrue();',
            'assertThat(r.size()).isEqualTo(3);',
          ),
          after: file(path, ...filler('b'), 'assertThat(r.ok()).isTrue();'),
        },
        ctx,
        ['TG007'],
      ).filter(({ message }) => message.includes('→')),
    ).toEqual([]);
  });
});

describe('TG008: expected values given again in other forms, red-team re-check', () => {
  const run = (path: string, from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);
  const inTest = (first: string, ...lines: string[]) => [
    "test('a', () => {",
    `  let expected = ${first};`,
    ...lines.map((l) => `  ${l}`),
    '  expect(add(5, 5)).toEqual(expected);',
    '});',
  ];
  const oneCheck = (line: string) => ["test('a', () => {", `  ${line}`, '});'];
  const twoLines = (first: string, second: string) => [
    "test('a', () => {",
    `  ${first}`,
    `  ${second}`,
    '});',
  ];
  const unit = (setUp: string[], test: string[], extra: string[] = []) => [
    'class TestA(unittest.TestCase):',
    '    def setUp(self):',
    ...setUp.map((l) => `        ${l}`),
    ...extra,
    '',
    '    def test_a(self):',
    ...test.map((l) => `        ${l}`),
  ];
  const check = ['self.assertEqual(add(5, 5), self.expected)'];
  const fixture = (
    decorator: string,
    def: string,
    body: string,
    use: string[],
  ) => [
    decorator,
    `${def}:`,
    `    ${body}`,
    '',
    'def test_a(value):',
    ...use.map((l) => `    ${l}`),
  ];
  const py = (...lines: string[]) => [
    'def test_a():',
    ...lines.map((l) => `    ${l}`),
  ];

  it.each([
    ['a.test.js', inTest('10'), inTest('Number("11")')],
    [
      'a.test.js',
      oneCheck('expect(add(5, 5)).toBe(10);'),
      oneCheck('expect(add(5, 5)).toBe(Number("11"));'),
    ],
    [
      'a.test.ts',
      oneCheck('expect(add(5, 5)).toBe(10);'),
      oneCheck('expect(add(5, 5)).toBe(11 as number);'),
    ],
    [
      'test_a.py',
      py('assert add(5, 5) == 10'),
      py('assert add(5, 5) == int("11")'),
    ],
    ['a.test.js', inTest('10'), inTest('10', 'expected = parseInt("11", 10);')],
    [
      'test_a.py',
      py('value, expected = 5, 10', 'assert double(value) == expected'),
      py('value, expected = 5, 11', 'assert double(value) == expected'),
    ],
    [
      'a.test.js',
      twoLines(
        'const [value, expected] = [5, 10];',
        'expect(double(value)).toBe(expected);',
      ),
      twoLines(
        'const [value, expected] = [5, 11];',
        'expect(double(value)).toBe(expected);',
      ),
    ],
    [
      'a.test.js',
      twoLines(
        'const { expected } = { expected: 10 };',
        'expect(add(5, 5)).toBe(expected);',
      ),
      twoLines(
        'const { expected } = { expected: 11 };',
        'expect(add(5, 5)).toBe(expected);',
      ),
    ],
    [
      'test_a.py',
      unit(['self.expected, self.other = 10, 0'], check),
      unit(['self.expected, self.other = 11, 0'], check),
    ],
    [
      'test_a.py',
      unit(['self.expected = 10'], check),
      unit(['self.expected = 10'], check, [
        '',
        '    @pytest.fixture(autouse=True)',
        '    def _prepare(self):',
        '        self.expected = 11',
      ]),
    ],
    [
      'test_a.py',
      fixture('@pytest_asyncio.fixture', 'async def value()', 'return 10', [
        'assert add(5, 5) == value',
      ]),
      fixture('@pytest_asyncio.fixture', 'async def value()', 'return 11', [
        'assert add(5, 5) == value',
      ]),
    ],
    [
      'test_a.py',
      py('expected = 10', 'assert add(5, 5) == expected'),
      py(
        'expected = 10',
        'expected = 11  # add(5, 5)',
        'assert add(5, 5) == expected',
      ),
    ],
    [
      'a.test.js',
      inTest('{ total: 10 }'),
      inTest('{ total: 10 }', 'expected.total++;'),
    ],
    ['a.test.js', inTest('[1, 2]'), inTest('[1, 2]', 'expected.push(3);')],
    [
      'a.test.js',
      inTest('{ a: { total: 10 } }'),
      inTest(
        '{ a: { total: 10 } }',
        'Object.assign(expected.a, { total: 11 });',
      ),
    ],
  ])('reports %s %#', (path, from, to) => {
    expect(run(path, from, to)).toHaveLength(1);
  });

  const fixtureUse = (body: string, use: string[]) =>
    fixture('@pytest.fixture', 'def value()', body, use);
  const post = [
    'resp = self.client.post("/users", json=self.payload)',
    'self.assertEqual(resp.json()["name"], self.payload["name"])',
  ];
  const postFixture = [
    'resp = client.post("/users", json=value)',
    'assert resp.json()["name"] == value["name"]',
  ];
  const unpack = [
    'user = User(**self.data)',
    'self.assertEqual(user.name, self.data["name"])',
  ];
  const fString = [
    'resp = client.get(f"/users/{value}")',
    'assert resp.json()["id"] == value',
  ];
  const loop = [
    'for n in value:',
    '    reg.add(n)',
    'assert sorted(reg.all()) == value',
  ];
  const store = [
    'self.store[1] = self.item',
    'self.assertEqual(self.store.get(1), self.item)',
  ];
  it.each([
    [
      'a setUp payload sent as a keyword argument',
      unit(['self.payload = {"name": "bob"}'], post),
      unit(['self.payload = {"name": "bob", "age": 3}'], post),
    ],
    [
      'a fixture sent as a keyword argument',
      fixtureUse('return {"name": "bob"}', postFixture),
      fixtureUse('return {"name": "alice"}', postFixture),
    ],
    [
      'a setUp dict unpacked',
      unit(['self.data = {"name": "bob", "age": 3}'], unpack),
      unit(['self.data = {"name": "bob", "age": 30}'], unpack),
    ],
    [
      'a fixture in an f-string',
      fixtureUse('return 1', fString),
      fixtureUse('return 42', fString),
    ],
    [
      'a fixture iterated',
      fixtureUse('return ["a", "b"]', loop),
      fixtureUse('return ["a", "b", "c"]', loop),
    ],
    [
      'a setUp item stored',
      unit(['self.item = {"id": 1}'], store),
      unit(['self.item = {"id": 1, "name": "a"}'], store),
    ],
  ])('leaves %s', (_, from, to) => {
    expect(run('test_a.py', from, to)).toEqual([]);
  });

  it('leaves Object.assign on an input spread into a request', () => {
    const user = (...lines: string[]) => [
      "test('a', async () => {",
      "  const user = { name: 'bob' };",
      ...lines.map((l) => `  ${l}`),
      "  const res = await request(app).post('/users').send({ ...user });",
      '  expect(res.body).toMatchObject(user);',
      '});',
    ];
    expect(
      run('a.test.js', user(), user("Object.assign(user, { role: 'admin' });")),
    ).toEqual([]);
  });
});

describe('TG007: large files and helper methods named assert…', () => {
  const path = 'src/test/java/ATest.java';
  const run = (from: string[], to: string[]) =>
    compareFiles(
      { before: file(path, ...from), after: file(path, ...to) },
      ctx,
      ['TG007'],
    ).filter(({ message }) => message.includes('→'));

  it('pairs only nearby lines in a file too large for a full diff', () => {
    const lines = Array.from({ length: 2500 }, (_, i) => `int c${i} = ${i};`);
    const from = [...lines];
    from.splice(100, 0, 'assertEquals(3, f());');
    from.splice(2400, 0, 'assertTrue(g(1));');
    const to = [...lines];
    to.splice(2399, 0, 'assertTrue(g(2));');
    expect(run(from, to)).toEqual([]);
  });

  it('leaves a helper method named assert… whose signature changed', () => {
    const helper = (signature: string) => [
      `  private static void assertNotANumber(String s)${signature} {`,
      '    assertThat(s).contains("a");',
      '  }',
    ];
    expect(
      run(
        ['  void a() {', '    assertEquals(1, x);', ...helper(''), '  }'],
        ['  void a() {', ...helper(' throws IOException'), '  }'],
      ),
    ).toEqual([]);
  });
});

describe('TG007: assertion libraries, red-team re-check', () => {
  const run = (path: string, from: string, to: string) =>
    compareFiles(
      {
        before: file(path, ...from.split('\n')),
        after: file(path, ...to.split('\n')),
      },
      ctx,
      ['TG007'],
    ).map(({ message }) => message);
  const java = 'src/test/java/ATest.java';
  const js = 'a.test.js';

  it.each([
    [
      java,
      'assertThat(service.compute(input))\n    .isEqualTo(3);',
      'assertThat(service.compute(input))\n    .isNotNull();',
    ],
    [
      java,
      'assertThat(list)\n    .extracting(Foo::getName)\n    .containsExactly("a", "b");',
      'assertThat(list)\n    .extracting(Foo::getName)\n    .contains("a");',
    ],
    [java, 'assertThat(x).isEqualTo(3);', 'assertThat(x)\n    .isNotNull();'],
    [
      js,
      'expect(add(1, 2)).to.equal(3);',
      'expect(add(1, 2)).not.to.equal(0);',
    ],
    [js, 'expect(r).to.equal(3);', 'expect(r).not.to.be.null;'],
    [js, 'expect(r).to.deep.equal([1, 2]);', 'expect(r).to.not.be.empty;'],
    [js, 'assert.equal(a, 3);', 'assert.isOk(a);'],
    [js, 'assert.deepEqual(r, { a: 1 });', 'assert.include(r, { a: 1 });'],
    [js, 'assert.strictEqual(n, 3);', 'assert.isAbove(n, 0);'],
    [js, 't.assert.strictEqual(a, 3);', 't.assert.ok(a);'],
    [
      js,
      'assert.deepStrictEqual(r, { a: 1, b: 2 });',
      'assert.partialDeepStrictEqual(r, { a: 1 });',
    ],
    [js, 'expect(n).to.equal(3);', 'expect(n).to.be.greaterThanOrEqual(0);'],
    [java, 'assertThat(s, is("abc"));', 'assertThat(s, is(startsWith("a")));'],
    [java, 'assertThat(n, is(3));', 'assertThat(n, is(oneOf(3, 4)));'],
    [
      java,
      'assertWithMessage("r").that(x).isEqualTo(3);',
      'assertWithMessage("r").that(x).isNotNull();',
    ],
    [
      java,
      'assertThat(s).isEqualTo("Abc");',
      'assertThat(s).isEqualToIgnoringCase("abc");',
    ],
    [
      java,
      'assertThat(list).containsExactly(1, 2, 3);',
      'assertThat(list).containsOnly(1, 2, 3);',
    ],
    [
      java,
      'assertThat(list).hasSize(3);',
      'assertThat(list).hasSizeGreaterThanOrEqualTo(1);',
    ],
    [
      java,
      'assertThat(user).usingRecursiveComparison().isEqualTo(expected);',
      'assertThat(user).usingRecursiveComparison().ignoringFields("createdAt").isEqualTo(expected);',
    ],
  ])('reports %s: %s → %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([
      expect.stringContaining('weakened assertion'),
    ]);
  });

  it.each([
    [java, 'assertEquals(true, x.isOk());', 'assertThat(x.isOk()).isTrue();'],
    [java, 'assertThat(x.isOk(), is(true));', 'assertThat(x.isOk()).isTrue();'],
    [
      java,
      'assertThat(service.compute(input)).isEqualTo(3);',
      'assertThat(service.compute(input))\n    .isEqualTo(3);\nassertTrue(g());',
    ],
    [js, 'assert.equal(a, 3);', 'assert(a === 3);'],
    [js, 'assert.strictEqual(a, 3);', 'assert.ok(a === 3);'],
    [js, 'expect(x.a).to.equal(1);', "expect(x).to.have.property('a', 1);"],
    [
      js,
      'expect(x.a).to.equal(1);',
      "expect(x).to.have.property('a').that.equals(1);",
    ],
    [
      js,
      'expect(r).to.deep.equal([1, 2]);',
      "expect(r).to.be.an('array').that.deep.equals([1, 2]);",
    ],
    [js, 'expect(r).to.equal(3);', "expect(r).to.be.a('number').and.equal(3);"],
    [
      java,
      'assertEquals(Arrays.asList(1, 2, 3), list);',
      'assertThat(list, Matchers.contains(1, 2, 3));',
    ],
  ])('leaves %s: %s → %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([]);
  });
});

describe('TG007: an exact value replaced by a specific exception', () => {
  it.each([
    [
      'src/test/java/ATest.java',
      'assertThat(parse(reader)).isEqualTo(new JsonPrimitive(false));',
      [
        'var e = assertThrows(JsonSyntaxException.class, () -> parse(reader));',
        'assertThat(e)',
        '    .hasMessageThat()',
        '    .startsWith("Use JsonReader.setStrictness");',
      ],
    ],
    [
      'a.test.js',
      'expect(parse(text)).toEqual({ a: 1 });',
      [
        'expect(() => parse(text)).toThrow(SyntaxError);',
        "expect(lastError()).toContain('line 1');",
      ],
    ],
  ])('leaves %s', (path, from, to) => {
    expect(
      compareFiles(
        { before: file(path, from), after: file(path, ...to) },
        ctx,
        ['TG007'],
      ),
    ).toEqual([]);
  });
});

describe('TG008: assertion messages are not expected values', () => {
  const run = (path: string, from: string, to: string) =>
    compareFiles(
      { before: file(path, from), after: file(path, to) },
      { ...ctx, implementationChanged: false },
      ['TG008'],
    ).map(({ message }) => message);

  it.each([
    [
      'a.test.js',
      "assert.strictEqual(headers.length, 2, 'should have 2 occurances');",
      "assert.strictEqual(headers.length, 2, 'should have 2 occurrences');",
    ],
    [
      'a.test.js',
      "assert(ok(), 'shuold pass');",
      "assert(ok(), 'should pass');",
    ],
    [
      'a.test.js',
      "expect(add(1, 2), 'sum of 1 adn 2').to.equal(3);",
      "expect(add(1, 2), 'sum of 1 and 2').to.equal(3);",
    ],
    [
      'test_a.py',
      'assert add(1, 2) == 3, "sum of 1 adn 2"',
      'assert add(1, 2) == 3, "sum of 1 and 2"',
    ],
    [
      'test_a.py',
      'self.assertEqual(add(1, 2), 3, "sum of 1 adn 2")',
      'self.assertEqual(add(1, 2), 3, msg="sum of 1 and 2")',
    ],
    [
      'src/test/java/ATest.java',
      'assertThat(add(1, 2)).as("sum of 1 adn 2").isEqualTo(3);',
      'assertThat(add(1, 2)).as("sum of 1 and 2").isEqualTo(3);',
    ],
    [
      'src/test/java/ATest.java',
      'assertWithMessage("sum of 1 adn 2").that(add(1, 2)).isEqualTo(3);',
      'assertWithMessage("sum of 1 and 2").that(add(1, 2)).isEqualTo(3);',
    ],
  ])('leaves a message changed in %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([]);
  });

  it.each([
    [
      'a.test.js',
      "assert.strictEqual(add(1, 2), 3, 'sum');",
      "assert.strictEqual(add(1, 2), 4, 'sum');",
    ],
    [
      'test_a.py',
      'assert add(1, 2) == 3, "sum"',
      'assert add(1, 2) == 4, "sum"',
    ],
    [
      'src/test/java/ATest.java',
      'assertThat(add(1, 2)).as("sum").isEqualTo(3);',
      'assertThat(add(1, 2)).as("sum").isEqualTo(4);',
    ],
  ])('still reports the value in %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([
      expect.stringContaining('changed asserted values'),
    ]);
  });
});

describe('TG008: assertion messages, red-team re-check', () => {
  const run = (path: string, from: string, to: string, rules = ['TG008']) =>
    compareFiles(
      { before: file(path, from), after: file(path, to) },
      { ...ctx, implementationChanged: false },
      rules as RuleId[],
    ).map(({ ruleId }) => ruleId);
  const java = 'src/test/java/ATest.java';

  it.each([
    [
      'a.test.js',
      "assert(add(1, 2) === 3, 'sum');",
      'assert(true, add(1, 2) === 3);',
    ],
    [
      'a.test.js',
      'assert.ok(add(1, 2) === 3);',
      'assert.ok(true, add(1, 2) === 3);',
    ],
    [
      'test_a.py',
      'self.assertTrue(add(1, 2) == 3)',
      'self.assertTrue(True, add(1, 2) == 3)',
    ],
  ])(
    'reports a condition moved into the message slot: %s %s',
    (path, from, to) => {
      expect(run(path, from, to, ['TG007', 'TG008'])).not.toEqual([]);
    },
  );

  it.each([
    [
      java,
      'assertEquals(3, add(1, 2), "sum of 1 adn 2");',
      'assertEquals(3, add(1, 2), "sum of 1 and 2");',
    ],
    [
      java,
      'assertEquals("sum of 1 adn 2", 3, add(1, 2));',
      'assertEquals("sum of 1 and 2", 3, add(1, 2));',
    ],
    [
      java,
      'assertTrue(ok(), "shuold be ok");',
      'assertTrue(ok(), "should be ok");',
    ],
    [
      java,
      'assertThat("sum of 1 adn 2", add(1, 2), is(3));',
      'assertThat("sum of 1 and 2", add(1, 2), is(3));',
    ],
    [
      'a.test.js',
      "assert.include(list, 3, 'shuold contain');",
      "assert.include(list, 3, 'should contain');",
    ],
    [
      'a.test.js',
      "assert.lengthOf(list, 3, 'shuold have 3');",
      "assert.lengthOf(list, 3, 'should have 3');",
    ],
    [
      'test_a.py',
      'self.assertAlmostEqual(f(), 1.5, places=2, msg="clsoe")',
      'self.assertAlmostEqual(f(), 1.5, places=2, msg="close")',
    ],
  ])('leaves a message typo fixed: %s %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual([]);
  });

  it.each([
    [java, 'assertEquals(1.5, f(), 0.01);', 'assertEquals(1.5, f(), 0.02);'],
    [
      java,
      'assertEquals("abc", f(), "msg");',
      'assertEquals("abd", f(), "msg");',
    ],
  ])('still reports a value: %s %s', (path, from, to) => {
    expect(run(path, from, to)).toEqual(['TG008']);
  });
});
