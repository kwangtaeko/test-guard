import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'tsup';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { HOOK_COMMAND } from './install/git-hook.js';
import { Repo } from './testing/repo.js';

// Built inside the project so the bundle resolves its dependencies.
const OUT_DIR = fileURLToPath(
  new URL('../node_modules/.cache/test-guard-e2e/', import.meta.url),
);
const CLI = join(OUT_DIR, 'cli.js').replace(/\\/g, '/');

beforeAll(async () => {
  rmSync(OUT_DIR, { recursive: true, force: true });
  await build({
    config: false,
    entry: { cli: 'src/bin.ts' },
    format: ['esm'],
    target: 'node20',
    outDir: OUT_DIR,
    silent: true,
  });
}, 60_000);

let repo: Repo;
afterEach(() => repo?.cleanup());

function install(r: Repo, ...args: string[]) {
  return r.run('install', ...args);
}

function commit(r: Repo, ...messages: string[]) {
  try {
    r.git('commit', '-q', ...messages.flatMap((m) => ['-m', m]));
    return { ok: true, output: '' };
  } catch (error) {
    const { stdout, stderr } = error as { stdout: string; stderr: string };
    return { ok: false, output: `${stdout}${stderr}` };
  }
}

describe('install --pre-commit', () => {
  it('installs a commit-msg hook and updates its own hook', async () => {
    repo = new Repo();
    const first = await install(repo, '--pre-commit');
    expect(first.code).toBe(0);
    expect(first.stdout).toMatch(/^Installed commit-msg hook: /);
    const hook = readFileSync(join(repo.dir, '.git/hooks/commit-msg'), 'utf8');
    expect(hook).toContain(`exec ${HOOK_COMMAND}`);
    expect((await install(repo, '--pre-commit')).stdout).toMatch(/^Updated/);
  });

  it('does not overwrite a foreign hook', async () => {
    repo = new Repo();
    repo.write('.git/hooks/commit-msg', '#!/bin/sh\nexec commitlint\n');
    const { code, stderr } = await install(repo, '--pre-commit');
    expect(code).toBe(2);
    expect(stderr).toContain(HOOK_COMMAND);
    expect(readFileSync(join(repo.dir, '.git/hooks/commit-msg'), 'utf8')).toBe(
      '#!/bin/sh\nexec commitlint\n',
    );
  });

  it('honors core.hooksPath', async () => {
    repo = new Repo();
    repo.git('config', 'core.hooksPath', '.githooks');
    expect((await install(repo, '--pre-commit')).code).toBe(0);
    expect(
      readFileSync(join(repo.dir, '.githooks/commit-msg'), 'utf8'),
    ).toContain(HOOK_COMMAND);
  });

  it('requires a hook type', async () => {
    repo = new Repo();
    expect((await install(repo)).code).toBe(2);
  });
});

describe('commit-msg hook', () => {
  function setup(): Repo {
    repo = new Repo();
    repo.write('a.test.js', "it('a', () => {\n  expect(f()).toBe(1);\n});\n");
    repo.commitAll();
    return repo;
  }

  // The installed hook with `npx` swapped for the freshly built CLI.
  async function installBuiltHook(r: Repo) {
    await install(r, '--pre-commit');
    const hookPath = join(r.dir, '.git/hooks/commit-msg');
    const hook = readFileSync(hookPath, 'utf8');
    writeFileSync(
      hookPath,
      hook.replace('npx --no-install test-guard', `node "${CLI}"`),
    );
  }

  it('blocks a weakening commit and accepts an approval trailer', async () => {
    const r = setup();
    await installBuiltHook(r);
    r.write('a.test.js', "it.skip('a', () => {\n  expect(f()).toBe(1);\n});\n");
    r.git('add', '-A');

    const blocked = commit(r, 'test: skip a');
    expect(blocked.ok).toBe(false);
    expect(blocked.output).toContain('TG004');
    expect(blocked.output).toContain('Test-Guard-Approved: <reason>');

    expect(commit(r, 'test: skip a', 'Test-Guard-Approved: flaky').ok).toBe(
      true,
    );
  });

  it('lets a clean commit through', async () => {
    const r = setup();
    await installBuiltHook(r);
    r.write('a.js', 'export const f = () => 1;\n');
    r.git('add', '-A');
    expect(commit(r, 'feat: f')).toEqual({ ok: true, output: '' });
  });
});

describe('check --message-file / --summary', () => {
  function weakened(): Repo {
    repo = new Repo();
    repo.write('a.test.js', "it('a', () => {\n  expect(f()).toBe(1);\n});\n");
    repo.commitAll();
    repo.write(
      'a.test.js',
      "it('a', () => {\n  expect(f()).toBeDefined();\n});\n",
    );
    repo.git('add', '-A');
    return repo;
  }

  it('reports the approval and exits 0', async () => {
    const r = weakened();
    r.write('MSG', 'x\n\nTest-Guard-Approved: matcher was too strict\n');
    const { code, stdout } = await r.check(
      '--staged',
      '--message-file',
      'MSG',
      '--json',
    );
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toMatchObject({
      findings: [{ ruleId: 'TG007' }],
      approval: { source: 'trailer', reason: 'matcher was too strict' },
    });
  });

  it('refuses a message file in CI mode', async () => {
    const r = weakened();
    r.write('MSG', 'Test-Guard-Approved: x\n');
    expect(
      (await r.check('--base', 'main', '--message-file', 'MSG')).code,
    ).toBe(2);
  });

  it('appends a Markdown summary', async () => {
    const r = weakened();
    r.write('SUMMARY.md', 'before\n');
    const { code } = await r.check('--staged', '--summary', 'SUMMARY.md');
    expect(code).toBe(1);
    expect(
      readFileSync(join(r.dir, 'SUMMARY.md'), 'utf8'),
    ).toMatchInlineSnapshot(`
        "before
        ### test-guard

        Compare: staged ↔ HEAD · 1 test file

        | Severity | Rule | Location | Message |
        |---|---|---|---|
        | ❌ error | TG007 | \`a.test.js:2\` | weakened assertion \`toBe\` → \`toBeDefined\` |

        **1 violation** · Fix the implementation instead of weakening tests.
        "
      `);
  });
});
