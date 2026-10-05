import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { main } from '../cli.js';
import { Repo } from '../testing/repo.js';
import { runClaudeCodeHook } from './claude-code.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const TEST = "it('adds', () => {\n  expect(add(1, 2)).toBe(3);\n});\n";

function setup(files: Record<string, string> = { 'a.test.js': TEST }): Repo {
  repo = new Repo();
  for (const [path, content] of Object.entries(files))
    repo.write(path, content);
  repo.commitAll();
  return repo;
}

function pre(tool_name: string, tool_input: Record<string, unknown>) {
  return runClaudeCodeHook(
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: repo.dir,
      tool_name,
      tool_input,
    }),
  );
}

const edit = (file: string, old_string: string, new_string: string) =>
  pre('Edit', { file_path: join(repo.dir, file), old_string, new_string });
const write = (file: string, content: string) =>
  pre('Write', { file_path: join(repo.dir, file), content });
const bash = (command: string) => pre('Bash', { command });

function denied(stdout: string): string {
  const out = JSON.parse(stdout).hookSpecificOutput;
  expect(out.permissionDecision).toBe('deny');
  return out.permissionDecisionReason;
}

describe('PreToolUse: Edit / Write', () => {
  it('blocks an added skip with the documented message', () => {
    setup();
    expect(denied(edit('a.test.js', "it('adds'", "it.skip('adds'"))).toBe(
      '[test-guard] Blocked: TG004 — added `it.skip` in a.test.js:1.\n' +
        'Do not weaken tests to make them pass. Fix the implementation instead.\n' +
        'If you believe the test itself is wrong, stop and explain why to the user.',
    );
  });

  it.each([
    [
      'a removed assertion',
      'a.test.js',
      '  expect(add(1, 2)).toBe(3);\n',
      '',
      'TG003',
    ],
    ['a weakened matcher', 'a.test.js', '.toBe(3)', '.toBeDefined()', 'TG007'],
    [
      'a config change',
      '.test-guard.json',
      '{}',
      '{"exclude":["**"]}',
      'TG006',
    ],
    [
      'a runner config change',
      'package.json',
      '"jest"',
      '"jest --passWithNoTests"',
      'TG005',
    ],
  ])('blocks %s', (_, file, from, to, ruleId) => {
    setup({
      'a.test.js': TEST,
      '.test-guard.json': '{}\n',
      'package.json': '{ "scripts": { "test": "jest" } }\n',
    });
    expect(denied(edit(file, from, to))).toContain(ruleId);
  });

  it('blocks a new test file with a focus and edits to git hooks', () => {
    setup();
    expect(denied(write('b.test.js', "it.only('b', () => {});\n"))).toContain(
      'TG004',
    );
    expect(denied(write('.git/hooks/commit-msg', 'exit 0\n'))).toContain(
      'TG006',
    );
  });

  it('blocks removing test-guard from Claude Code settings', () => {
    setup({
      '.claude/settings.json':
        '{"hooks":{"Stop":[{"hooks":[{"type":"command","command":"npx test-guard hook claude-code stop"}]}]}}\n',
    });
    expect(denied(write('.claude/settings.json', '{"hooks":{}}\n'))).toContain(
      'TG006',
    );
  });

  it('matches LF edits against CRLF files', () => {
    setup({ 'a.test.js': TEST.replace(/\n/g, '\r\n') });
    expect(
      denied(
        edit('a.test.js', "it('adds', () => {\n", "it.skip('adds', () => {\n"),
      ),
    ).toContain('TG004');
  });

  it.each([
    ['implementation code', () => edit('a.js', 'a - b', 'a + b')],
    [
      'a stronger test',
      () =>
        edit(
          'a.test.js',
          '});\n',
          "});\nit('b', () => {\n  expect(add(2, 2)).toBe(4);\n});\n",
        ),
    ],
    [
      'a renamed test title',
      () => edit('a.test.js', "'adds'", "'adds two numbers'"),
    ],
    [
      'an edit the tool will reject',
      () => edit('a.test.js', 'missing text', ''),
    ],
    [
      'a file outside the repository',
      () =>
        pre('Write', { file_path: join(tmpdir(), 'x.test.js'), content: '' }),
    ],
    [
      'other tools',
      () => pre('Read', { file_path: join(repo.dir, 'a.test.js') }),
    ],
  ])('allows %s', (_, run) => {
    setup({
      'a.test.js': TEST,
      'a.js': 'export const add = (a, b) => a - b;\n',
    });
    expect(run()).toBe('');
  });

  it('ignores uncommitted config changes', () => {
    setup();
    repo.write(
      '.test-guard.json',
      '{"rules":{"TG004":"off"},"exclude":["**"]}\n',
    );
    expect(denied(edit('a.test.js', "it('adds'", "it.skip('adds'"))).toContain(
      'TG004',
    );
  });

  it('respects warn levels from the config', () => {
    setup({
      'a.test.js': TEST,
      '.test-guard.json': '{"rules":{"TG004":"warn"}}\n',
    });
    expect(edit('a.test.js', "it('adds'", "it.skip('adds'")).toBe('');
  });
});

describe('PreToolUse: shell', () => {
  function shellRepo(): Repo {
    setup({ 'a.test.js': TEST, 'tests/b.test.js': TEST, 'a.js': 'x\n' });
    mkdirSync(join(repo.dir, 'archive'));
    return repo;
  }

  it.each([
    ['rm a.test.js', 'TG001'],
    ['rm -rf tests', 'TG001'],
    ['git rm -q tests/b.test.js', 'TG001'],
    ['rm *.test.js', 'TG001'],
    ['mv a.test.js a.old.js', 'TG001'],
    ['Remove-Item -Recurse tests', 'TG001'],
    ['git commit --no-verify -m wip', 'TG006'],
  ])('blocks %s', (command, ruleId) => {
    shellRepo();
    expect(denied(bash(command))).toContain(ruleId);
  });

  it.each([
    'npm test',
    'rm a.js',
    'mv a.test.js renamed.test.js',
    'mv a.test.js archive/',
    'git commit -m "feat: add"',
  ])('allows %s', (command) => {
    shellRepo();
    expect(bash(command)).toBe('');
  });
});

describe('Stop', () => {
  const stop = (stop_hook_active = false) =>
    runClaudeCodeHook(
      JSON.stringify({
        hook_event_name: 'Stop',
        cwd: repo.dir,
        stop_hook_active,
      }),
    );

  it('blocks once on weakened tests, then only tells the user', () => {
    setup();
    repo.write('a.test.js', TEST.replace("it('adds'", "it.skip('adds'"));
    const blocked = JSON.parse(stop());
    expect(blocked.decision).toBe('block');
    expect(blocked.reason).toContain(
      '- TG004 — added `it.skip` in a.test.js:1',
    );
    expect(JSON.parse(stop(true)).systemMessage).toContain('1 test weakening');
  });

  it('lets a clean session stop', () => {
    setup();
    repo.write('a.js', 'fixed\n');
    expect(stop()).toBe('');
  });
});

describe('errors never block', () => {
  it('reports bad input to the user', () => {
    expect(JSON.parse(runClaudeCodeHook('nope')).systemMessage).toContain(
      'test-guard hook error',
    );
  });

  it('ignores directories outside git', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tg-nogit-'));
    const out = runClaudeCodeHook(
      JSON.stringify({ hook_event_name: 'Stop', cwd: dir }),
    );
    rmSync(dir, { recursive: true, force: true });
    expect(out).toBe('');
  });
});

describe('cli', () => {
  async function run(args: string[], stdin = '') {
    let stdout = '';
    const code = await main(args, {
      cwd: repo.dir,
      stdout: (t) => {
        stdout += t;
      },
      stderr: () => {},
      readStdin: async () => stdin,
    });
    return { code, stdout };
  }

  it('hook claude-code pre-tool-use reads stdin and exits 0', async () => {
    setup();
    const input = JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: repo.dir,
      tool_name: 'Bash',
      tool_input: { command: 'rm a.test.js' },
    });
    const { code, stdout } = await run(
      ['hook', 'claude-code', 'pre-tool-use'],
      input,
    );
    expect(code).toBe(0);
    expect(denied(stdout)).toContain('TG001');
  });

  it('never exits 2 for a misconfigured hook', async () => {
    setup();
    expect((await run(['hook', 'codex', 'stop'])).code).toBe(0);
    expect((await run(['hook'])).code).toBe(1);
  });

  it('install --agent claude-code merges settings and is idempotent', async () => {
    setup({ '.claude/settings.json': '{\n  "model": "opus"\n}\n' });
    const first = await run(['install', '--agent', 'claude-code', '--yes']);
    expect(first.code).toBe(0);
    expect(first.stdout).toContain('+     "PreToolUse": [');
    const settings = JSON.parse(
      readFileSync(join(repo.dir, '.claude/settings.json'), 'utf8'),
    );
    expect(settings.model).toBe('opus');
    expect(settings.hooks.PreToolUse[0]).toEqual({
      matcher: 'Edit|Write|Bash|PowerShell',
      hooks: [
        {
          type: 'command',
          command: 'npx --no-install test-guard hook claude-code pre-tool-use',
        },
      ],
    });
    expect((await run(['install', '--agent', 'claude-code'])).stdout).toContain(
      'already',
    );
  });

  it('install --agent prefers a local install and asks before writing', async () => {
    setup({ 'node_modules/test-guard/dist/cli.js': '' });
    const { code } = await run(['install', '--agent', 'claude-code']);
    expect(code).toBe(1);
    await run(['install', '--agent', 'claude-code', '-y']);
    const settings = JSON.parse(
      readFileSync(join(repo.dir, '.claude/settings.json'), 'utf8'),
    );
    expect(settings.hooks.Stop[0].hooks[0]).toEqual({
      type: 'command',
      command: 'node',
      args: [
        // biome-ignore lint/suspicious/noTemplateCurlyInString: Claude Code placeholder
        '${CLAUDE_PROJECT_DIR}/node_modules/test-guard/dist/cli.js',
        'hook',
        'claude-code',
        'stop',
      ],
    });
  });
});
