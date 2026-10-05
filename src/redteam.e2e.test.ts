// Regression tests for ways to weaken tests or get around test-guard that
// red-team reviews found (0.1.0, then round 2 during 0.1.1). Known limits that
// regex analysis can't catch (early `return`, try/catch, `if (false)`, mocking
// the code under test, changed expected values) are listed in docs/IDEAS.md
// instead.
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runClaudeCodeHook } from './adapters/claude-code.js';
import { runCheck } from './engine/check.js';
import { Repo } from './testing/repo.js';

const JS_TEST = `it('adds', () => {
  expect(add(1, 2)).toBe(3);
});

it('subtracts', () => {
  expect(sub(3, 1)).toBe(2);
  expect(sub(5, 5)).toBe(0);
});
`;

let repo: Repo;
afterEach(() => repo?.cleanup());

function setup(files: Record<string, string> = {}): Repo {
  repo = new Repo();
  repo.write('src/math.test.js', JS_TEST);
  repo.write('src/math.js', 'export const sub = (a, b) => a + b;\n');
  for (const [path, content] of Object.entries(files))
    repo.write(path, content);
  repo.commitAll();
  return repo;
}

const ruleIds = () => [
  ...new Set(
    runCheck({ cwd: repo.dir, mode: { kind: 'worktree' } }).findings.map(
      (f) => f.ruleId,
    ),
  ),
];

function pre(tool_name: string, tool_input: Record<string, unknown>) {
  const out = runClaudeCodeHook(
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: repo.dir,
      tool_name,
      tool_input,
    }),
  );
  return out
    ? (JSON.parse(out).hookSpecificOutput?.permissionDecisionReason ?? '')
    : '';
}
const write = (path: string, content: string) =>
  pre('Write', { file_path: join(repo.dir, path), content });
const bash = (command: string) => pre('Bash', { command });

function stop(session_id?: string): string {
  return runClaudeCodeHook(
    JSON.stringify({
      hook_event_name: 'Stop',
      cwd: repo.dir,
      session_id,
      stop_hook_active: false,
    }),
  );
}

describe('skips that 0.1.0 missed', () => {
  it.each([
    [
      'tests/test_a.py',
      'def test_a():\n    assert f() == 1\n',
      'import pytest\npytest.importorskip("missing")\n\ndef test_a():\n    assert f() == 1\n',
    ],
    [
      'tests/test_a.py',
      'def test_a():\n    assert f() == 1\n',
      'import unittest\n\ndef test_a():\n    raise unittest.SkipTest("later")\n    assert f() == 1\n',
    ],
    [
      'src/test/java/ATest.java',
      '@Test\nvoid a() { assertEquals(1, f()); }\n',
      '@Test\n@EnabledOnOs(OS.AIX)\nvoid a() { assertEquals(1, f()); }\n',
    ],
    [
      'src/math.test.js',
      JS_TEST,
      JS_TEST.replace("it('subtracts'", "it.skipIf(true)('subtracts'"),
    ],
  ])('%s', (path, before, after) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toEqual(['TG004']);
  });
});

describe('runner config tampering that 0.1.0 missed', () => {
  it.each([
    [
      'pom.xml',
      '<project>\n</project>\n',
      '<project>\n  <skip>true</skip>\n</project>\n',
    ],
    ['build.gradle', 'test {\n}\n', 'test {\n    onlyIf { false }\n}\n'],
  ])('%s', (path, before, after) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toEqual(['TG005']);
  });

  it.each([
    [
      'vitest.config.js',
      "export default { test: { exclude: ['src/math.test.js'] } };\n",
    ],
    ['pytest.ini', '[pytest]\naddopts = --deselect tests/test_a.py::test_a\n'],
    ['src/conftest.py', 'collect_ignore = ["math_test.py"]\n'],
  ])('new %s next to existing files', (path, content) => {
    setup();
    repo.write(path, content);
    expect(ruleIds()).toEqual(['TG005']);
    expect(write(path.replace(/^/, 'other-'), content)).toBe('');
  });

  it('leaves a new package alone', () => {
    setup();
    repo.write(
      'packages/b/vitest.config.js',
      "export default { test: { include: ['x'] } };\n",
    );
    expect(ruleIds()).toEqual([]);
  });
});

describe('weakening split across places', () => {
  it('reports a strong matcher removed here and a weak one added there', () => {
    setup();
    repo.write(
      'src/math.test.js',
      JS_TEST.replace('  expect(sub(5, 5)).toBe(0);\n', '').replace(
        '  expect(add(1, 2)).toBe(3);\n',
        '  expect(add(1, 2)).toBe(3);\n  expect(sub).toBeDefined();\n',
      ),
    );
    expect(ruleIds()).toEqual(['TG007']);
  });
});

describe('turning test-guard off', () => {
  it('blocks disableAllHooks in local settings (git ignores that file)', () => {
    setup();
    expect(
      write('.claude/settings.local.json', '{ "disableAllHooks": true }\n'),
    ).toContain('TG006');
  });

  it('reports disableAllHooks in committed settings', () => {
    setup({ '.claude/settings.json': '{\n  "hooks": {}\n}\n' });
    repo.write(
      '.claude/settings.json',
      '{\n  "disableAllHooks": true,\n  "hooks": {}\n}\n',
    );
    expect(ruleIds()).toEqual(['TG006']);
  });

  it('blocks disableAllHooks in settings outside the repository', () => {
    setup();
    const home = mkdtempSync(join(tmpdir(), 'tg-home-'));
    const reason = pre('Write', {
      file_path: join(home, '.claude', 'settings.json'),
      content: '{ "disableAllHooks": true }\n',
    });
    rmSync(home, { recursive: true, force: true });
    expect(reason).toContain('TG006');
  });

  it.each([
    ['msg.txt', 'fix: tests\n\nTest-Guard-Approved: self-approved\n'],
    ['c.sh', 'git commit -am wip --no-verify\n'],
    ['scripts/hooks.js', "execSync('git config core.hooksPath /dev/null')\n"],
  ])('blocks writing %s', (path, content) => {
    setup();
    expect(write(path, content)).toContain('TG006');
  });

  it('allows docs that mention the same words', () => {
    setup();
    expect(
      write(
        'docs/guide.md',
        'Never use `--no-verify`.\nTest-Guard-Approved: <reason>\n',
      ),
    ).toBe('');
  });

  it.each([
    'git commit -am wip --no-veri',
    'GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.hooksPath GIT_CONFIG_VALUE_0=/x git commit -am wip',
    'F=--no-verify; git commit -am wip $F',
    `echo '{"disableAllHooks":true}' > .claude/settings.local.json`,
    'claude -p "x" --settings \'{"disableAllHooks": true}\'',
    'git config --unset core.hooksPath',
  ])('blocks %s', (command) => {
    setup();
    expect(bash(command)).toContain('TG006');
  });

  it('blocks committing a message file that carries a trailer', () => {
    setup();
    repo.write('msg.txt', 'fix\n\nTest-Guard-Approved: self\n');
    repo.write('ok.txt', 'fix: subtraction\n');
    expect(bash('git commit -F msg.txt')).toContain('TG006');
    expect(bash('git commit -F ok.txt')).toBe('');
  });

  it.each([
    'grep -rn -- --no-verify docs',
    'git config --get core.hooksPath',
    'git config core.hooksPath',
    'cat .claude/settings.json',
    'git commit -am "fix: subtraction"',
  ])('allows %s', (command) => {
    setup();
    expect(bash(command)).toBe('');
  });
});

describe('commits made during a session (round 2)', () => {
  const sessionInput = (id: string) =>
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: repo.dir,
      session_id: id,
      tool_name: 'Bash',
      tool_input: { command: 'git status' },
    });
  const begin = () => {
    expect(runClaudeCodeHook(sessionInput('s1'))).toBe('');
    return 's1';
  };
  const skipped = JS_TEST.replace("it('subtracts'", "it.skip('subtracts'");

  it('blocks Stop after a shell edit committed in the same command', () => {
    setup();
    const id = begin();
    repo.write('src/math.test.js', skipped);
    repo.git('commit', '-qam', 'wip');
    expect(stop(id)).toContain('TG004');
    expect(stop()).toBe(''); // without a session: compared with HEAD only
  });

  it('blocks Stop after a commit made with commit-tree (no hooks run)', () => {
    setup();
    const id = begin();
    repo.write('src/math.test.js', skipped);
    repo.git('add', '-A');
    const tree = repo.git('write-tree').trim();
    const commit = repo.git('commit-tree', tree, '-p', 'HEAD', '-m', 'w');
    repo.git('update-ref', 'HEAD', commit.trim());
    expect(stop(id)).toContain('TG004');
  });

  it('blocks Stop after a revert that removes tests (no commit-msg hook)', () => {
    setup();
    repo.write('src/extra.test.js', JS_TEST);
    repo.commitAll('more tests');
    const id = begin();
    repo.git('revert', '--no-edit', 'HEAD');
    expect(stop(id)).toContain('TG001');
  });

  it('blocks Stop after reset --soft turns committed tests into new files', () => {
    setup();
    repo.write('src/new.test.js', JS_TEST);
    repo.commitAll('human tests');
    const id = begin();
    repo.git('reset', '--soft', 'HEAD~1');
    repo.write('src/new.test.js', "it('adds', () => {});\n");
    expect(stop(id)).toMatch(/TG00[23]/);
  });

  it('sees edits hidden with update-index --assume-unchanged', () => {
    setup();
    repo.git('update-index', '--assume-unchanged', 'src/math.test.js');
    repo.write('src/math.test.js', skipped);
    expect(ruleIds()).toEqual(['TG004']);
  });

  it('lets a session that only adds tests stop', () => {
    setup();
    const id = begin();
    repo.write('src/extra.test.js', JS_TEST);
    repo.commitAll('add tests');
    expect(stop(id)).toBe('');
  });
});

describe('round 2: weakening the analyzers missed', () => {
  it.each([
    [
      'tests/test_a.py',
      'from unittest import skip\n\ndef test_a():\n    assert f() == 1\n',
      'from unittest import skip\n\n@skip("later")\ndef test_a():\n    assert f() == 1\n',
      'TG004',
    ],
    [
      'tests/test_a.py',
      'class TestA:\n    def test_a(self):\n        assert f() == 1\n',
      'class A:\n    def test_a(self):\n        assert f() == 1\n',
      'TG002',
    ],
    [
      'tests/test_a.py',
      'def test_a():\n    assert f() == 1\n\ndef test_b():\n    assert f() == 1\n',
      'def test_a():\n    assert f() == 1\n\ndef test_a():\n    assert f() == 1\n',
      'TG002',
    ],
    [
      'src/math.test.js',
      JS_TEST,
      JS_TEST.replace(
        "it('subtracts', () => {",
        "it('subtracts', { skip: true }, () => {",
      ),
      'TG004',
    ],
    [
      'src/math.test.js',
      JS_TEST,
      `const expect = () => ({ toBe() {} });\n${JS_TEST}`,
      'TG004',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Nested class Inner {\n    @Test void a() { assertEquals(1, f()); }\n  }\n}\n',
      'class ATest {\n  class Inner {\n    @Test void a() { assertEquals(1, f()); }\n  }\n}\n',
      'TG002',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() { assertEquals(1, f()); }\n}\n',
      'class ATest {\n  \\u0040Disabled @Test void a() { assertEquals(1, f()); }\n}\n',
      'TG004',
    ],
    [
      'src/math.test.js',
      JS_TEST,
      JS_TEST.replace(
        'expect(add(1, 2)).toBe(3);',
        'expect(add(1, 2)).not.toBe(4);',
      ),
      'TG007',
    ],
  ])('%s → %s', (path, before, after, ruleId) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toEqual([ruleId]);
  });

  it('reports a test moved where pytest does not look', () => {
    setup({ 'tests/test_a.py': 'def test_a():\n    assert f() == 1\n' });
    expect(bash('mv tests/test_a.py dist/test_a.py')).toContain('TG001');
    repo.git('mv', 'tests', 'build');
    expect(ruleIds()).toEqual(['TG001']);
  });

  it.each([
    [
      'build.gradle',
      'test {\n}\n',
      "test {\n  useJUnitPlatform { excludeTags 'slow' }\n}\n",
    ],
    [
      'tests/conftest.py',
      'import pytest\n',
      'import pytest\n\ndef pytest_runtest_call(item):\n    pass\n',
    ],
    [
      '.husky/pre-commit',
      'npx test-guard check --staged\n',
      'npx test-guard check --staged || true\n',
    ],
  ])('reports a change to %s', (path, before, after) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toHaveLength(1);
  });
});

describe('round 2: shell commands', () => {
  it.each([
    "find . -name '*.test.js' -delete",
    "find src -name '*.test.js' | xargs rm",
    'cd src && rm math.test.js',
    'bash -c "rm src/math.test.js"',
  ])('blocks %s', (command) => {
    setup();
    expect(bash(command)).toContain('TG001');
  });

  it.each([
    'echo {}>.test-guard.json',
    'cd .git && echo exit 0 > hooks/pre-commit',
    'cp evil.json .claude/settings.local.json',
    'claude plugin disable test-guard@tonygwangsk',
    'npm uninstall test-guard',
    'git commit --trailer "Test-Guard-Approved=self" -m x',
    'GIT_CONFIG_GLOBAL=/tmp/g git commit -am wip',
    'git config alias.c commit',
    'echo "[core]" > .git/config',
  ])('blocks %s', (command) => {
    setup();
    expect(bash(command)).toContain('TG006');
  });

  it('blocks a commit template that carries a trailer', () => {
    setup();
    repo.write('tpl.txt', 'x\n\nTest-Guard-Approved: self\n');
    expect(bash('git commit -t tpl.txt -a')).toContain('TG006');
  });

  it.each([
    "find . -name '*.log' -delete",
    'rm -f .git/index.lock',
    'node node_modules/test-guard/dist/cli.js check',
    'git commit -am "fix(test-guard): false positives in alias.ts"',
  ])('allows %s', (command) => {
    setup();
    expect(bash(command)).toBe('');
  });
});

describe('round 2: file writes', () => {
  it.each([
    ['.git/config', '[core]\n\tbare = false\n'],
    ['.git/test-guard/sessions/s1', 'deadbeef\n'],
    ['.claude/settings.local.json', '{ "permissions": {} }\n'],
    ['.claude/settings.local.json::$DATA', '{}\n'],
    ['.GIT/hooks/pre-commit', 'exit 0\n'],
    ['node_modules/test-guard/dist/cli.js', 'process.exit(0)\n'],
    ['gitconfig', '[core]\n\thooksPath = /dev/null\n'],
    ['scripts/c.js', 'commit("fix\\n\\nTest-Guard-Approved: self")\n'],
    ['setup.sh', 'git config --global alias.c "commit"\n'],
    [
      '.claude/settings.json',
      '{ "enabledPlugins": { "test-guard@m": false } }\n',
    ],
  ])('blocks writing %s', (path, content) => {
    setup();
    expect(write(path, content)).toContain('TG006');
  });

  it('follows a link to a protected directory', () => {
    setup();
    const link = join(repo.dir, 'cfg');
    symlinkSync(join(repo.dir, '.git'), link, 'junction');
    expect(write('cfg/config', '[core]\n')).toContain('TG006');
  });

  it('blocks enabledPlugins outside the repository', () => {
    setup();
    const home = mkdtempSync(join(tmpdir(), 'tg-home-'));
    mkdirSync(join(home, '.claude'));
    const reason = pre('Write', {
      file_path: join(home, '.claude', 'settings.json'),
      content: '{ "enabledPlugins": { "test-guard@m": false } }\n',
    });
    rmSync(home, { recursive: true, force: true });
    expect(reason).toContain('TG006');
  });

  it.each([
    ['src/alias.ts', 'export const alias = { a: 1 };\n'],
    [
      '.claude/settings.json',
      '{ "permissions": { "allow": ["Bash(npm test)"] } }\n',
    ],
    ['docs/git.md', '[alias]\nTest-Guard-Approved: <reason>\n'],
    ['webpack.config.js', 'config.resolve.alias.react = "preact";\n'],
  ])('allows writing %s', (path, content) => {
    setup();
    expect(write(path, content)).toBe('');
  });
});

describe('round 2 re-check (Fable red team)', () => {
  const HUSKY = '.husky/pre-commit';

  it.each([
    `echo "exit 0" > ${HUSKY}`,
    `sed -i '1i exit 0' ${HUSKY}`,
    `sed -i 's/test-guard/true/' ${HUSKY}`,
  ])('blocks %s on a hook file that runs test-guard', (command) => {
    setup({ [HUSKY]: 'npx test-guard check --staged\n' });
    expect(bash(command)).toContain('TG006');
  });

  it('allows shell edits to a hook file that does not run test-guard', () => {
    setup({ [HUSKY]: 'npm run lint\n' });
    expect(bash(`echo "npm test" >> ${HUSKY}`)).toBe('');
  });

  it('reports exit 0 put above test-guard in a hook file', () => {
    setup({ [HUSKY]: 'npx test-guard check --staged\n' });
    repo.write(HUSKY, 'exit 0\nnpx test-guard check --staged\n');
    expect(ruleIds()).toEqual(['TG006']);
  });

  it('allows mkdir then mv of a test into the new folder', () => {
    setup({ 'tests/test_a.py': 'def test_a():\n    assert f() == 1\n' });
    expect(bash('mkdir -p tests/unit && mv tests/test_a.py tests/unit/')).toBe(
      '',
    );
  });

  it.each([
    ['scripts/release.sh', 'HUSKY=0 git commit -am release\n'],
    ['scripts/release.sh', 'git commit -n -am release\n'],
  ])('blocks writing %s that skips the git hook', (path, content) => {
    setup();
    expect(write(path, content)).toContain('TG006');
  });

  it.each([
    '{ "enabledPlugins": {}, "model": "opus" }\n',
    '{ "enabledPlugins": { "test-guard@m": "false" } }\n',
  ])('blocks settings that drop the plugin: %s', (content) => {
    setup();
    const home = mkdtempSync(join(tmpdir(), 'tg-home-'));
    const settings = join(home, '.claude', 'settings.json');
    mkdirSync(join(home, '.claude'));
    writeFileSync(settings, '{ "enabledPlugins": { "test-guard@m": true } }\n');
    const reason = pre('Write', { file_path: settings, content });
    rmSync(home, { recursive: true, force: true });
    expect(reason).toContain('TG006');
  });

  it('allows other settings changes next to the plugin', () => {
    setup();
    const home = mkdtempSync(join(tmpdir(), 'tg-home-'));
    const settings = join(home, '.claude', 'settings.json');
    mkdirSync(join(home, '.claude'));
    writeFileSync(settings, '{ "enabledPlugins": { "test-guard@m": true } }\n');
    const reason = pre('Write', {
      file_path: settings,
      content:
        '{ "enabledPlugins": { "test-guard@m": true }, "model": "opus" }\n',
    });
    rmSync(home, { recursive: true, force: true });
    expect(reason).toBe('');
  });

  it('allows a test-guard version bump', () => {
    setup({
      'package.json':
        '{\n  "devDependencies": {\n    "test-guard": "^0.1.0"\n  }\n}\n',
    });
    repo.write(
      'package.json',
      '{\n  "devDependencies": {\n    "test-guard": "^0.1.1"\n  }\n}\n',
    );
    expect(ruleIds()).toEqual([]);
  });
});

describe('round 2 re-check, second pass', () => {
  const HUSKY = '.husky/pre-commit';
  const GUARD = 'npx test-guard check --staged\n';

  it.each([
    'exec true',
    '. ./scripts/env.sh',
    'eval "$PRE_HOOK"',
    'case "$CI" in "") exit 0;; esac',
    'while false; do',
  ])('reports `%s` added above test-guard in a hook script', (line) => {
    setup({ [HUSKY]: GUARD });
    const after = line.startsWith('while')
      ? `${line}\n${GUARD}done\n`
      : `${line}\n${GUARD}`;
    repo.write(HUSKY, after);
    expect(ruleIds()).toEqual(['TG006']);
  });

  it.each([
    'if [ -z "$SKIP_LINT" ]; then\n  npx eslint .\nfi\n',
    'if command -v pnpm >/dev/null; then pnpm lint; fi\n',
    '. "$(dirname -- "$0")/_/husky.sh"\n',
  ])('allows a block above test-guard that does not wrap it: %s', (above) => {
    setup({ [HUSKY]: GUARD });
    repo.write(HUSKY, `${above}${GUARD}`);
    expect(ruleIds()).toEqual([]);
  });

  it.each([
    ['lefthook.yml', '      glob: "nothing/**"\n'],
    ['.pre-commit-config.yaml', '        types: [png]\n'],
  ])(
    'reports a filter that keeps test-guard from running in %s',
    (path, line) => {
      const before =
        path === 'lefthook.yml'
          ? 'pre-commit:\n  commands:\n    guard:\n      run: test-guard check --staged\n'
          : 'repos:\n  - repo: local\n    hooks:\n      - id: guard\n        entry: test-guard check --staged\n';
      setup({ [path]: before });
      repo.write(path, before + line);
      expect(ruleIds()).toEqual(['TG006']);
    },
  );

  it.each([
    'git rm .claude/settings.json',
    'git rm -r .claude',
    'find .claude -delete',
    'rm -rf .husky',
    'git rm .husky/pre-commit',
    'git mv .husky/pre-commit .husky/pre-push',
    'rm -rf .github',
    `node -e "require('fs').writeFileSync('.husky/pre-commit', 'exit 0')"`,
    'git checkout feature -- .husky/pre-commit',
    'npm i -D test-guard@file:../fake-guard',
    'npm pkg set devDependencies.test-guard=file:../fake',
    'claude plugin marketplace remove tonygwangsk',
  ])('blocks %s', (command) => {
    setup({
      [HUSKY]: GUARD,
      '.github/workflows/ci.yml':
        '    steps:\n      - uses: kwangtaeko/test-guard@v0\n',
      '.claude/settings.json': '{}\n',
    });
    expect(bash(command)).toContain('TG006');
  });

  it.each([
    'git rev-parse --git-dir',
    'git rev-parse --git-dir 2>/dev/null',
    `chmod +x ${HUSKY}`,
    'rm -rf .github/ISSUE_TEMPLATE',
    'npm i -D test-guard@latest',
  ])('allows %s', (command) => {
    setup({ [HUSKY]: GUARD });
    expect(bash(command)).toBe('');
  });

  it.each([
    [
      'pytest.ini',
      '[pytest]\naddopts = -q\n',
      '[pytest]\naddopts = -q -p no:cacheprovider\n',
    ],
    [
      'package.json',
      '{\n  "scripts": {\n    "test": "vitest run"\n  }\n}\n',
      '{\n  "scripts": {\n    "test": "vitest run",\n    "test:watch": "vitest"\n  }\n}\n',
    ],
    [
      'vite.config.ts',
      'export default {\n  plugins: [],\n};\n',
      "export default {\n  plugins: [],\n  optimizeDeps: { include: ['react'] },\n};\n",
    ],
  ])('accepts a routine change to %s', (path, before, after) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toEqual([]);
  });

  it.each([
    [
      'vite.config.ts',
      'export default {\n  test: {\n  },\n};\n',
      "export default {\n  test: {\n    exclude: ['**'],\n  },\n};\n",
    ],
    [
      'vitest.config.ts',
      'export default { test: {} };\n',
      "export default { test: { projects: ['packages/none'] } };\n",
    ],
    [
      'build.gradle',
      'test {\n}\n',
      "test {\n}\ngradle.startParameter.excludedTaskNames.add('test')\n",
    ],
  ])('reports %s', (path, before, after) => {
    setup({ [path]: before });
    repo.write(path, after);
    expect(ruleIds()).toEqual(['TG005']);
  });
});
