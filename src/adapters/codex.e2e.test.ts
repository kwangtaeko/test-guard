import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { main } from '../cli.js';
import { Repo } from '../testing/repo.js';
import { runCodexHook } from './codex.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const TEST = "it('adds', () => {\n  expect(add(1, 2)).toBe(3);\n});\n";

function setup(): Repo {
  repo = new Repo();
  repo.write('src/math.test.js', TEST);
  repo.write('src/math.js', 'export const add = (a, b) => a - b;\n');
  repo.commitAll();
  return repo;
}

function hook(tool_name: string, command: unknown, cwd = repo.dir) {
  return runCodexHook(
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd,
      tool_name,
      tool_input: { command },
      session_id: 's',
      turn_id: 't',
      tool_use_id: 'u',
      model: 'm',
      permission_mode: 'default',
      transcript_path: null,
    }),
  );
}

const patch = (...lines: string[]) =>
  hook(
    'apply_patch',
    ['*** Begin Patch', ...lines, '*** End Patch'].join('\n'),
  );

function denied(stdout: string): string {
  const out = JSON.parse(stdout).hookSpecificOutput;
  expect(out.permissionDecision).toBe('deny');
  return out.permissionDecisionReason;
}

describe('PreToolUse: apply_patch', () => {
  it.each([
    [
      'an added skip',
      [
        '*** Update File: src/math.test.js',
        "-it('adds', () => {",
        "+it.skip('adds', () => {",
      ],
      'TG004 — added `it.skip` in src/math.test.js:1',
    ],
    [
      'a removed assertion',
      [
        '*** Update File: src/math.test.js',
        '@@',
        "  it('adds', () => {",
        '-  expect(add(1, 2)).toBe(3);',
      ],
      'TG003',
    ],
    ['a deleted test file', ['*** Delete File: src/math.test.js'], 'TG001'],
    [
      'a move to a non-test path',
      [
        '*** Update File: src/math.test.js',
        '*** Move to: src/math.old.js',
        '@@',
        " it('adds', () => {",
      ],
      'TG001',
    ],
    [
      'a new focused test',
      ['*** Add File: src/b.test.js', "+it.only('b', () => {});"],
      'TG004',
    ],
    [
      'weakening next to a fix',
      [
        '*** Update File: src/math.js',
        '-export const add = (a, b) => a - b;',
        '+export const add = (a, b) => a + b;',
        '*** Update File: src/math.test.js',
        '-  expect(add(1, 2)).toBe(3);',
        '+  expect(add(1, 2)).toBeDefined();',
      ],
      'TG007',
    ],
  ])('blocks %s', (_, lines, expected) => {
    setup();
    expect(denied(patch(...lines))).toContain(expected);
  });

  it('resolves paths from the session cwd', () => {
    setup();
    expect(
      denied(
        hook(
          'apply_patch',
          "*** Begin Patch\n*** Update File: math.test.js\n-it('adds', () => {\n+it.skip('adds', () => {\n*** End Patch",
          join(repo.dir, 'src'),
        ),
      ),
    ).toContain('TG004');
  });

  it('matches loosely like Codex (whitespace differences)', () => {
    setup();
    expect(
      denied(
        patch(
          '*** Update File: src/math.test.js',
          "-it('adds', () => {   ",
          "+it.skip('adds', () => {",
        ),
      ),
    ).toContain('TG004');
  });

  it.each([
    [
      'an implementation fix',
      [
        '*** Update File: src/math.js',
        '-export const add = (a, b) => a - b;',
        '+export const add = (a, b) => a + b;',
      ],
    ],
    [
      'a stronger test',
      [
        '*** Update File: src/math.test.js',
        '@@',
        ' });',
        "+it('adds more', () => {",
        '+  expect(add(2, 2)).toBe(4);',
        '+});',
      ],
    ],
    [
      'a move between test paths',
      [
        '*** Update File: src/math.test.js',
        '*** Move to: test/math.test.js',
        '@@',
        " it('adds', () => {",
      ],
    ],
    [
      'a patch Codex cannot apply',
      ['*** Update File: src/math.test.js', '-missing line', '+x'],
    ],
  ])('allows %s', (_, lines) => {
    setup();
    expect(patch(...lines)).toBe('');
  });

  it('allows an invalid patch (Codex rejects it)', () => {
    setup();
    expect(hook('apply_patch', 'not a patch')).toBe('');
  });
});

describe('PreToolUse: Bash', () => {
  it('blocks deleting tests, including argv arrays', () => {
    setup();
    expect(denied(hook('Bash', 'rm src/math.test.js'))).toContain('TG001');
    expect(denied(hook('Bash', ['rm', '-f', 'src/math.test.js']))).toContain(
      'TG001',
    );
    expect(denied(hook('Bash', 'git commit --no-verify -m x'))).toContain(
      'TG006',
    );
    expect(hook('Bash', 'npm test')).toBe('');
  });
});

describe('Stop', () => {
  it('blocks once on weakened tests', () => {
    setup();
    repo.write('src/math.test.js', TEST.replace('.toBe(3)', '.toBeTruthy()'));
    const stop = (active: boolean) =>
      runCodexHook(
        JSON.stringify({
          hook_event_name: 'Stop',
          cwd: repo.dir,
          stop_hook_active: active,
        }),
      );
    expect(JSON.parse(stop(false))).toMatchObject({ decision: 'block' });
    expect(JSON.parse(stop(true)).systemMessage).toContain('remain');
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

  it('hook codex pre-tool-use', async () => {
    setup();
    const input = JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: repo.dir,
      tool_name: 'Bash',
      tool_input: { command: 'rm src/math.test.js' },
    });
    const { code, stdout } = await run(
      ['hook', 'codex', 'pre-tool-use'],
      input,
    );
    expect(code).toBe(0);
    expect(denied(stdout)).toContain('TG001');
  });

  it('install --agent codex writes .codex/hooks.json with a trust note', async () => {
    setup();
    const { code, stdout } = await run([
      'install',
      '--agent',
      'codex',
      '--yes',
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain('/hooks');
    const hooks = JSON.parse(
      readFileSync(join(repo.dir, '.codex/hooks.json'), 'utf8'),
    );
    expect(hooks.hooks.PreToolUse).toEqual([
      {
        matcher: 'Bash|apply_patch',
        hooks: [
          {
            type: 'command',
            command: 'npx --no-install test-guard hook codex pre-tool-use',
          },
        ],
      },
    ]);
    expect((await run(['install', '--agent', 'codex'])).stdout).toContain(
      'already',
    );
  });

  it('install --agent codex runs a local install with node (npx on Windows)', async () => {
    setup();
    mkdirSync(join(repo.dir, 'node_modules/test-guard/dist'), {
      recursive: true,
    });
    repo.write('node_modules/test-guard/dist/cli.js', '');
    await run(['install', '--agent', 'codex', '-y']);
    const hooks = JSON.parse(
      readFileSync(join(repo.dir, '.codex/hooks.json'), 'utf8'),
    );
    expect(hooks.hooks.Stop[0].hooks[0]).toEqual({
      type: 'command',
      command:
        'node "$(git rev-parse --show-toplevel)/node_modules/test-guard/dist/cli.js" hook codex stop',
      commandWindows: 'npx --no-install test-guard hook codex stop',
    });
  });
});
