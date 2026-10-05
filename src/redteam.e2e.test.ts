// Regression tests for ways to weaken tests or get around test-guard that a
// red-team review found in 0.1.0. Known limits that regex analysis can't catch
// (early `return`, try/catch, `if (false)`, mocking the code under test,
// changed expected values) are listed in docs/IDEAS.md instead.
import { mkdtempSync, rmSync } from 'node:fs';
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
