import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { main } from './cli.js';
import { Repo } from './testing/repo.js';
import type { Finding } from './types.js';

const FIXTURES = fileURLToPath(new URL('../fixtures/', import.meta.url));

let repo: Repo;
afterEach(() => repo?.cleanup());

function brief(stdout: string) {
  const findings: Finding[] = JSON.parse(stdout).findings;
  return findings.map(({ ruleId, path, line }) => ({ ruleId, path, line }));
}

// Commit `before`, put `after` in the working tree.
function scenario(name: string): Repo {
  repo = new Repo();
  repo.load(join(FIXTURES, name, 'before'));
  repo.commitAll();
  repo.load(join(FIXTURES, name, 'after'));
  return repo;
}

const JS_TEST = 'src/math.test.js';
const JAVA_TEST = 'src/test/java/com/example/MathTest.java';

describe('rule scenarios (worktree mode)', () => {
  it.each([
    ['TG001/deleted', [{ ruleId: 'TG001', path: JS_TEST }]],
    ['TG001/moved-out', [{ ruleId: 'TG001', path: JS_TEST }]],
    ['TG001/renamed', []],
    [
      'TG002/removed-case',
      [
        { ruleId: 'TG002', path: JS_TEST },
        { ruleId: 'TG003', path: JS_TEST },
      ],
    ],
    ['TG002/added-case', []],
    ['TG003/removed-assertion', [{ ruleId: 'TG003', path: JS_TEST }]],
    ['TG003/implementation-only', []],
    ['TG004/js-skip', [{ ruleId: 'TG004', path: JS_TEST, line: 9 }]],
    [
      'TG004/python-skip',
      [{ ruleId: 'TG004', path: 'tests/test_math.py', line: 9 }],
    ],
    ['TG004/java-disabled', [{ ruleId: 'TG004', path: JAVA_TEST, line: 14 }]],
    ['TG004/moved-skip', []],
    ['TG007/js-matcher', [{ ruleId: 'TG007', path: JS_TEST, line: 5 }]],
    [
      'TG007/python-matcher',
      [{ ruleId: 'TG007', path: 'tests/test_math.py', line: 8 }],
    ],
    ['TG007/java-throws', [{ ruleId: 'TG007', path: JAVA_TEST, line: 10 }]],
    ['TG007/trivial', [{ ruleId: 'TG007', path: JS_TEST, line: 14 }]],
    // Values changed while the implementation didn't.
    ['TG007/value-change', [{ ruleId: 'TG008', path: JS_TEST, line: 5 }]],
    [
      'TG005/package-json',
      [{ ruleId: 'TG005', path: 'package.json', line: 4 }],
    ],
    [
      'TG005/pytest-addopts',
      [{ ruleId: 'TG005', path: 'pyproject.toml', line: 2 }],
    ],
    ['TG005/maven-skip', [{ ruleId: 'TG005', path: 'pom.xml', line: 4 }]],
    ['TG005/new-package', []],
    ['TG006/config-change', [{ ruleId: 'TG006', path: '.test-guard.json' }]],
    ['TG006/husky-removed', [{ ruleId: 'TG006', path: '.husky/pre-commit' }]],
    ['TG006/husky-edit', []],
    ['crlf/eol-only', []],
    ['crlf/added-skip', [{ ruleId: 'TG004', path: JS_TEST, line: 9 }]],
  ])('%s', async (name, expected) => {
    const { code, stdout } = await scenario(name).check('--json');
    expect(brief(stdout)).toEqual(
      expected.map((f) => ({ line: undefined, ...f })),
    );
    expect(code).toBe(expected.length > 0 ? 1 : 0);
  });
});

describe('compare modes', () => {
  it('--staged sees only staged changes', async () => {
    scenario('TG004/js-skip');
    expect((await repo.check('--staged', '--json')).code).toBe(0);
    repo.git('add', '-A');
    const { code, stdout } = await repo.check('--staged', '--json');
    expect(code).toBe(1);
    expect(brief(stdout)).toEqual([
      { ruleId: 'TG004', path: JS_TEST, line: 9 },
    ]);
  });

  it('worktree mode leaves the real index untouched', async () => {
    scenario('TG001/renamed');
    await repo.check();
    expect(repo.git('status', '--porcelain')).toContain('?? test/');
  });

  it('--base compares HEAD with the merge-base', async () => {
    scenario('TG004/js-skip');
    repo.git('checkout', '-q', '-b', 'feature');
    repo.commitAll('weaken');
    // The worktree is clean now, so only --base sees the change.
    expect((await repo.check('--json')).code).toBe(0);
    const { code, stdout } = await repo.check('--base', 'main', '--json');
    expect(code).toBe(1);
    expect(brief(stdout)).toEqual([
      { ruleId: 'TG004', path: JS_TEST, line: 9 },
    ]);
  });

  it('reports untracked test files in worktree mode', async () => {
    repo = new Repo();
    repo.write('README.md', 'x\n');
    repo.commitAll();
    repo.write('new.test.js', "it.skip('later', () => {});\n");
    expect(brief((await repo.check('--json')).stdout)).toEqual([
      { ruleId: 'TG004', path: 'new.test.js', line: 1 },
    ]);
  });

  it('works before the first commit', async () => {
    repo = new Repo();
    repo.write('a.test.js', "it('a', () => {});\nit.only('b', () => {});\n");
    repo.git('add', '-A');
    const staged = await repo.check('--staged', '--json');
    expect(brief(staged.stdout)).toEqual([
      { ruleId: 'TG004', path: 'a.test.js', line: 2 },
    ]);
    expect((await repo.check('--json')).code).toBe(1);
  });

  it('handles paths with spaces and non-ASCII characters', async () => {
    repo = new Repo();
    repo.write('src/한글 폴더/math.test.js', "it('a', () => {});\n");
    repo.commitAll();
    repo.git('rm', '-q', 'src/한글 폴더/math.test.js');
    expect(brief((await repo.check('--json')).stdout)).toEqual([
      { ruleId: 'TG001', path: 'src/한글 폴더/math.test.js', line: undefined },
    ]);
  });
});

describe('configuration', () => {
  it('applies exclude and rule levels from .test-guard.json', async () => {
    scenario('TG002/removed-case');
    repo.write(
      '.test-guard.json',
      JSON.stringify({ rules: { TG002: 'off', TG003: 'warn' } }),
    );
    repo.git('add', '.test-guard.json');
    repo.git('commit', '-q', '-m', 'config');
    const { code, stdout } = await repo.check('--json');
    expect(code).toBe(0);
    expect(JSON.parse(stdout).findings).toMatchObject([
      { ruleId: 'TG003', severity: 'warn' },
    ]);

    repo.write('.test-guard.json', JSON.stringify({ exclude: ['src/**'] }));
    repo.git('commit', '-q', '-am', 'exclude');
    expect(JSON.parse((await repo.check('--json')).stdout)).toMatchObject({
      findings: [],
      summary: { filesScanned: 0 },
    });
  });

  it('ignores config changes that are not committed yet', async () => {
    scenario('TG004/js-skip');
    repo.write('.test-guard.json', JSON.stringify({ rules: { TG004: 'off' } }));
    expect((await repo.check()).code).toBe(1);
  });

  it('adds include patterns by extension', async () => {
    repo = new Repo();
    repo.write(
      '.test-guard.json',
      JSON.stringify({ include: ['e2e/**/*.ts', 'checks/*.py'] }),
    );
    repo.write('e2e/login.ts', "test('login', () => {});\n");
    repo.write('checks/smoke.py', 'def test_smoke():\n    assert ok() == 1\n');
    repo.commitAll();
    repo.write('e2e/login.ts', '');
    repo.write('checks/smoke.py', 'def test_smoke():\n    pass\n');
    expect(brief((await repo.check('--json')).stdout)).toEqual([
      { ruleId: 'TG003', path: 'checks/smoke.py', line: undefined },
      { ruleId: 'TG002', path: 'e2e/login.ts', line: undefined },
    ]);
  });

  it('exits 2 on an invalid config', async () => {
    repo = new Repo();
    repo.write('.test-guard.json', '{ "rules": [] }');
    repo.commitAll();
    const { code, stderr } = await repo.check();
    expect(code).toBe(2);
    expect(stderr).toContain('"rules" must be an object');
  });
});

describe('cli', () => {
  it('prints the text report', async () => {
    scenario('TG002/removed-case');
    const { code, stdout } = await repo.check();
    expect(code).toBe(1);
    expect(
      stdout.replace(/test-guard \S+/, 'test-guard X'),
    ).toMatchInlineSnapshot(`
        "test-guard X · compare: working tree ↔ HEAD · 1 test file

          ERROR   TG002  src/math.test.js   test cases 2 → 1
          ERROR   TG003  src/math.test.js   assertions 3 → 2

        2 violations · Fix the implementation instead of weakening tests.
        "
      `);
  });

  it('prints a clean report', async () => {
    scenario('TG003/implementation-only');
    const { code, stdout } = await repo.check();
    expect(code).toBe(0);
    expect(stdout).toContain('No test weakening found.');
  });

  it('prints the JSON report', async () => {
    scenario('TG003/removed-assertion');
    const { stdout } = await repo.check('--json');
    const report = JSON.parse(stdout);
    expect(report).toMatchObject({
      tool: 'test-guard',
      compare: { mode: 'worktree', from: 'HEAD' },
      findings: [
        {
          ruleId: 'TG003',
          severity: 'error',
          path: JS_TEST,
          message: 'assertions 3 → 2',
          before: 3,
          after: 2,
        },
      ],
      summary: { error: 1, warn: 0, filesScanned: 1 },
    });
    expect(typeof report.version).toBe('string');
  });

  it('filters with --rules', async () => {
    scenario('TG002/removed-case');
    const { stdout } = await repo.check('--rules', 'tg003', '--json');
    expect(brief(stdout).map((f) => f.ruleId)).toEqual(['TG003']);
  });

  it.each([
    [['--rules', 'TG999']],
    [['--staged', '--base', 'main']],
    [['--base', 'no-such-branch']],
  ])('exits 2 for %j', async (args) => {
    scenario('TG003/implementation-only');
    expect((await repo.check(...args)).code).toBe(2);
  });

  it('exits 2 outside a git repository', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'tg-nogit-'));
    let stderr = '';
    const code = await main(['check'], {
      cwd: dir,
      stdout: () => {},
      stderr: (text) => {
        stderr += text;
      },
    });
    rmSync(dir, { recursive: true, force: true });
    expect(code).toBe(2);
    expect(stderr).toContain('not a git repository');
  });
});
