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

describe('Mocha test files outside the default patterns', () => {
  const mocha = (scripts: Record<string, string>) => {
    repo = new Repo();
    repo.write(
      'package.json',
      JSON.stringify({ scripts, devDependencies: { mocha: '^11' } }),
    );
    repo.write(
      'test/app.js',
      "describe('app', () => {\n  it('a', () => {});\n  it('b', () => {});\n});\n",
    );
    repo.write('test/support/utils.js', 'exports.x = 1;\n');
    repo.commitAll();
    return repo;
  };

  it('reads test/*.js as tests when the project runs Mocha', async () => {
    mocha({ test: 'mocha --require test/support/env --check-leaks test/' });
    repo.write(
      'test/app.js',
      "describe('app', () => {\n  it('a', () => {});\n  it.skip('b', () => {});\n});\n",
    );
    expect(brief((await repo.check('--json')).stdout)).toEqual([
      { ruleId: 'TG004', path: 'test/app.js', line: 3 },
    ]);
  });

  it('reads the directories the test script gives', async () => {
    mocha({ test: 'mocha test/ test/acceptance/' });
    repo.write('test/acceptance/flow.js', "it('flow', () => {});\n");
    repo.commitAll();
    repo.write('test/acceptance/flow.js', "it.skip('flow', () => {});\n");
    expect(brief((await repo.check('--json')).stdout)).toEqual([
      { ruleId: 'TG004', path: 'test/acceptance/flow.js', line: 1 },
    ]);
  });

  it('leaves helpers below the test directory and projects without Mocha', async () => {
    mocha({ test: 'mocha' });
    repo.write('test/support/utils.js', 'exports.x = 2;\n');
    expect(brief((await repo.check('--json')).stdout)).toEqual([]);

    repo = new Repo();
    repo.write('package.json', JSON.stringify({ scripts: { test: 'jest' } }));
    repo.write('test/app.js', "it('a', () => {});\n");
    repo.commitAll();
    repo.write('test/app.js', "it.skip('a', () => {});\n");
    expect(brief((await repo.check('--json')).stdout)).toEqual([]);
  });
});

describe('Mocha test files, red-team re-check', () => {
  const setup = (files: Record<string, string>) => {
    repo = new Repo();
    for (const [path, content] of Object.entries(files)) {
      repo.write(path, content);
    }
    repo.commitAll();
    return repo;
  };
  const rules = async () =>
    brief((await repo.check('--json')).stdout).map(({ ruleId }) => ruleId);
  const APP = "describe('app', () => {\n  it('a', () => {});\n});\n";

  it.each([
    [
      'a script other than test',
      {
        'package.json': JSON.stringify({
          scripts: { test: 'npm run unit', unit: 'mocha tests/unit' },
        }),
      },
      'package.json',
      JSON.stringify({
        scripts: { test: 'npm run unit', unit: 'mocha tests/none' },
      }),
    ],
    [
      'the "mocha" key',
      {
        'package.json': JSON.stringify({
          mocha: { spec: 'checks' },
          devDependencies: { mocha: '1' },
        }),
      },
      'package.json',
      JSON.stringify({
        mocha: { spec: 'nothing' },
        devDependencies: { mocha: '1' },
      }),
    ],
    [
      'recursive turned off',
      { '.mocharc.json': '{\n  "recursive": true\n}\n' },
      '.mocharc.json',
      '{\n  "recursive": false\n}\n',
    ],
  ])('reports narrowing through %s', async (_, files, path, content) => {
    setup(files);
    repo.write(path, content);
    expect(await rules()).toContain('TG005');
  });

  it('reports a deleted .mocharc', async () => {
    setup({ '.mocharc.json': '{ "spec": "checks" }\n', 'checks/app.js': APP });
    repo.git('rm', '-q', '.mocharc.json');
    expect(await rules()).toContain('TG005');
  });

  it('leaves helpers without tests in the test directory', async () => {
    setup({
      'package.json': JSON.stringify({
        scripts: { test: 'mocha --require test/setup.js' },
      }),
      'test/setup.js': "process.env.NODE_ENV = 'test';\n",
      'test/.eslintrc.js': 'module.exports = {};\n',
      'test/helpers.js':
        'exports.a = (x) => assert.equal(x, 1);\nexports.b = (x) => assert.ok(x);\n',
      'test/app.js': APP,
    });
    repo.git('rm', '-q', 'test/setup.js', 'test/.eslintrc.js');
    repo.write('test/helpers.js', 'exports.a = (x) => assert.equal(x, 1);\n');
    expect(await rules()).toEqual([]);
    repo.git('rm', '-q', 'test/app.js');
    expect(await rules()).toEqual(['TG001']);
  });
});

describe('expected values in support files and expected output', () => {
  const setup = (files: Record<string, string>) => {
    repo = new Repo();
    for (const [path, content] of Object.entries(files)) {
      repo.write(path, content);
    }
    repo.commitAll();
    return repo;
  };
  const found = async () => brief((await repo.check('--json')).stdout);
  const JS = {
    'src/sum.js': 'export const sum = (a, b) => a + b;\n',
    'tests/fixtures.js':
      'export const EXPECTED = 10;\nexport const INPUT = 5;\n',
    'tests/sum.test.js': [
      "import { sum } from '../src/sum';",
      "import { EXPECTED, INPUT } from './fixtures';",
      "test('a', () => {",
      '  expect(sum(INPUT, 5)).toBe(EXPECTED);',
      '});',
      '',
    ].join('\n'),
  };

  it('reports a constant a test compares with', async () => {
    setup(JS);
    repo.write(
      'tests/fixtures.js',
      'export const EXPECTED = 11;\nexport const INPUT = 5;\n',
    );
    expect(await found()).toEqual([
      { ruleId: 'TG008', path: 'tests/fixtures.js', line: 1 },
    ]);
  });

  it.each([
    [
      'an input',
      {
        'tests/fixtures.js':
          'export const EXPECTED = 10;\nexport const INPUT = 6;\n',
      },
    ],
    [
      'a new constant',
      {
        'tests/fixtures.js':
          'export const EXPECTED = 10;\nexport const INPUT = 5;\nexport const OTHER = 3;\n',
      },
    ],
    [
      'a value changed with the implementation',
      {
        'tests/fixtures.js':
          'export const EXPECTED = 11;\nexport const INPUT = 5;\n',
        'src/sum.js': 'export const sum = (a, b) => a + b + 1;\n',
      },
    ],
  ])('leaves %s alone', async (_, changes) => {
    setup(JS);
    for (const [path, content] of Object.entries(changes)) {
      repo.write(path, content);
    }
    expect(await found()).toEqual([]);
  });

  it.each([
    [
      'declares the name itself',
      "import { sum } from '../src/sum';\nimport './fixtures';\nconst EXPECTED = 10;\ntest('a', () => {\n  expect(sum(5, 5)).toBe(EXPECTED);\n});\n",
    ],
    [
      'does not import the file',
      "import { sum } from '../src/sum';\nimport { EXPECTED } from './other';\ntest('a', () => {\n  expect(sum(5, 5)).toBe(EXPECTED);\n});\n",
    ],
  ])('leaves a constant of the same name when the test %s', async (_, test) => {
    setup({ ...JS, 'tests/sum.test.js': test });
    repo.write(
      'tests/fixtures.js',
      'export const EXPECTED = 11;\nexport const INPUT = 5;\n',
    );
    expect(await found()).toEqual([]);
  });

  it('reports a pytest fixture in conftest.py and a Python constant', async () => {
    setup({
      'calc.py': 'def add(a, b):\n    return a + b\n',
      'conftest.py':
        'import pytest\n\n@pytest.fixture\ndef expected():\n    return 10\n',
      'tests/constants.py': 'TOTAL = 10\n',
      'tests/test_calc.py': [
        'from calc import add',
        'from tests.constants import TOTAL',
        '',
        'def test_a(expected):',
        '    assert add(5, 5) == expected',
        '',
        'def test_b():',
        '    assert add(5, 5) == TOTAL',
        '',
      ].join('\n'),
    });
    repo.write(
      'conftest.py',
      'import pytest\n\n@pytest.fixture\ndef expected():\n    return 11\n',
    );
    repo.write('tests/constants.py', 'TOTAL = 11\n');
    expect(await found()).toEqual([
      { ruleId: 'TG008', path: 'conftest.py', line: 5 },
      { ruleId: 'TG008', path: 'tests/constants.py', line: 1 },
    ]);
  });

  it('reports a Java constant imported statically', async () => {
    const data = (v: number) =>
      `package com.ex;\n\npublic class TestData {\n  public static final int EXPECTED = ${v};\n}\n`;
    setup({
      'src/main/java/com/ex/Calc.java':
        'package com.ex;\n\npublic class Calc {\n  static int add(int a, int b) { return a + b; }\n}\n',
      'src/test/java/com/ex/TestData.java': data(10),
      'src/test/java/com/ex/CalcTest.java': [
        'package com.ex;',
        '',
        'import static com.ex.TestData.EXPECTED;',
        'import static org.junit.jupiter.api.Assertions.assertEquals;',
        'import org.junit.jupiter.api.Test;',
        '',
        'class CalcTest {',
        '  @Test void add() {',
        '    assertEquals(EXPECTED, Calc.add(5, 5));',
        '  }',
        '}',
        '',
      ].join('\n'),
    });
    repo.write('src/test/java/com/ex/TestData.java', data(11));
    expect(await found()).toEqual([
      { ruleId: 'TG008', path: 'src/test/java/com/ex/TestData.java', line: 4 },
    ]);
  });

  it('reports expected output changed or deleted, not new or input data', async () => {
    setup({
      'src/render.js': 'export const render = (x) => x;\n',
      'tests/render.test.js': "test('a', () => {});\n",
      'tests/data/expected.json': '{ "a": 1 }\n',
      'tests/golden/page.html': '<p>a</p>\n',
      'tests/data/input.json': '{ "a": 1 }\n',
    });
    repo.write('tests/data/expected.json', '{ "a": 2 }\n');
    repo.git('rm', '-q', 'tests/golden/page.html');
    repo.write('tests/data/input.json', '{ "a": 2 }\n');
    repo.write('tests/data/case2.expected.txt', 'b\n');
    expect(await found()).toEqual([
      { ruleId: 'TG008', path: 'tests/data/expected.json' },
      { ruleId: 'TG008', path: 'tests/golden/page.html' },
    ]);
    repo.write('src/render.js', 'export const render = (x) => String(x);\n');
    expect(await found()).toEqual([]);
  });
});

describe('expected values in support files, red-team re-check', () => {
  // Commit `files`, then apply `changes` (null deletes) to the working tree.
  const run = async (
    files: Record<string, string>,
    changes: Record<string, string>,
  ) => {
    repo = new Repo();
    for (const [path, content] of Object.entries(files)) {
      repo.write(path, content);
    }
    repo.commitAll();
    for (const [path, content] of Object.entries(changes)) {
      repo.write(path, content);
    }
    return brief((await repo.check('--json')).stdout).map(
      ({ ruleId, path }) => `${ruleId} ${path}`,
    );
  };
  const SUM = { 'src/sum.js': 'export const sum = (a, b) => a + b;\n' };
  const jsTest = (head: string, expected: string) =>
    `${head}\nimport { sum } from '../src/sum';\ntest('a', () => {\n  expect(sum(5, 5)).toBe(${expected});\n});\n`;
  const CALC = { 'calc.py': 'def add(a, b):\n    return a + b\n' };

  it.each([
    [
      'module.exports = {…}',
      'tests/fixtures.js',
      'module.exports = {\n  EXPECTED: 10,\n};\n',
      'module.exports = {\n  EXPECTED: 11,\n};\n',
      "const { EXPECTED } = require('./fixtures');",
      'EXPECTED',
    ],
    [
      'module.exports on one line',
      'tests/fixtures.js',
      'module.exports = { EXPECTED: 10, INPUT: 5 };\n',
      'module.exports = { EXPECTED: 11, INPUT: 5 };\n',
      "const fx = require('./fixtures');",
      'fx.EXPECTED',
    ],
    [
      'exports.X',
      'tests/fixtures.js',
      'exports.EXPECTED = 10;\n',
      'exports.EXPECTED = 11;\n',
      "const { EXPECTED } = require('./fixtures');",
      'EXPECTED',
    ],
    [
      'a namespace import',
      'tests/fixtures.js',
      'export const EXPECTED = 10;\n',
      'export const EXPECTED = 11;\n',
      "import * as F from './fixtures';",
      'F.EXPECTED',
    ],
    [
      'an alias',
      'tests/fixtures.js',
      'export const EXPECTED = 10;\n',
      'export const EXPECTED = 11;\n',
      "import { EXPECTED as want } from './fixtures';",
      'want',
    ],
    [
      'a __fixtures__ folder',
      'src/__fixtures__/values.js',
      'export const EXPECTED = 10;\n',
      'export const EXPECTED = 11;\n',
      "import { EXPECTED } from '../src/__fixtures__/values';",
      'EXPECTED',
    ],
  ])('reports %s', async (_, path, from, to, head, expected) => {
    expect(
      await run(
        { ...SUM, [path]: from, 'tests/sum.test.js': jsTest(head, expected) },
        { [path]: to },
      ),
    ).toEqual([`TG008 ${path}`]);
  });

  it('reports a support file changed while it moves', async () => {
    // Long enough for git to see a move.
    const REST =
      'export const NAMES = ["alpha", "beta", "gamma", "delta"];\n'.repeat(3);
    repo = new Repo();
    repo.write('src/sum.js', SUM['src/sum.js']);
    repo.write('tests/fixtures.js', `export const EXPECTED = 10;\n${REST}`);
    repo.write(
      'tests/sum.test.js',
      jsTest("import { EXPECTED } from './fixtures';", 'EXPECTED'),
    );
    repo.commitAll();
    repo.git('mv', 'tests/fixtures.js', 'tests/data.js');
    repo.write('tests/data.js', `export const EXPECTED = 11;\n${REST}`);
    repo.write(
      'tests/sum.test.js',
      jsTest("import { EXPECTED } from './data';", 'EXPECTED'),
    );
    repo.git('add', '-A');
    expect(
      brief((await repo.check('--json')).stdout).map((f) => f.path),
    ).toEqual(['tests/data.js']);
  });

  it.each([
    [
      'a module attribute',
      {
        'tests/constants.py': 'TOTAL = 10\n',
        'tests/test_calc.py':
          'from calc import add\nfrom tests import constants\n\ndef test_a():\n    assert add(5, 5) == constants.TOTAL\n',
      },
      { 'tests/constants.py': 'TOTAL = 11\n' },
      'tests/constants.py',
    ],
    [
      'a fixture returning several lines',
      {
        'conftest.py':
          'import pytest\n\n@pytest.fixture\ndef expected():\n    return {\n        "total": 10,\n    }\n',
        'tests/test_calc.py':
          'from calc import add\n\ndef test_a(expected):\n    assert {"total": add(5, 5)} == expected\n',
      },
      {
        'conftest.py':
          'import pytest\n\n@pytest.fixture\ndef expected():\n    return {\n        "total": 11,\n    }\n',
      },
      'conftest.py',
    ],
    [
      'a fixture named with name=',
      {
        'conftest.py':
          'import pytest\n\n@pytest.fixture(name="expected")\ndef _expected():\n    return 10\n',
        'tests/test_calc.py':
          'from calc import add\n\ndef test_a(expected):\n    assert add(5, 5) == expected\n',
      },
      {
        'conftest.py':
          'import pytest\n\n@pytest.fixture(name="expected")\ndef _expected():\n    return 11\n',
      },
      'conftest.py',
    ],
  ])('reports %s', async (_, files, changes, path) => {
    expect(await run({ ...CALC, ...files }, changes)).toEqual([
      `TG008 ${path}`,
    ]);
  });

  it('reports a Java constant read through its class', async () => {
    const data = (v: number) =>
      `package com.ex;\n\npublic class TestData {\n  public static final int EXPECTED = ${v};\n}\n`;
    expect(
      await run(
        {
          'src/main/java/com/ex/Calc.java':
            'package com.ex;\n\npublic class Calc {\n  static int add(int a, int b) { return a + b; }\n}\n',
          'src/test/java/com/ex/TestData.java': data(10),
          'src/test/java/com/ex/CalcTest.java':
            'package com.ex;\n\nclass CalcTest {\n  @Test void add() {\n    assertEquals(TestData.EXPECTED, Calc.add(5, 5));\n  }\n}\n',
        },
        { 'src/test/java/com/ex/TestData.java': data(11) },
      ),
    ).toEqual(['TG008 src/test/java/com/ex/TestData.java']);
  });

  it.each([
    [
      'a variable inside a Python helper',
      {
        'tests/utils.py': 'def make():\n    total = 10\n    return total\n',
        'tests/test_calc.py':
          'import pytest\nfrom calc import add\nfrom tests.utils import make\n\n@pytest.mark.parametrize("a, total", [(5, 10)])\ndef test_a(a, total):\n    assert add(a, 5) == total\n',
      },
      { 'tests/utils.py': 'def make():\n    total = 11\n    return total\n' },
    ],
    [
      'a variable inside a JS helper',
      {
        ...SUM,
        'tests/helpers.js':
          'export function build() {\n  const result = 10;\n  return result;\n}\n',
        'tests/sum.test.js':
          "import { build } from './helpers';\nimport { sum } from '../src/sum';\ntest.each([[5, 10]])('a', (a, result) => {\n  expect(sum(a, 5)).toBe(result);\n});\n",
      },
      {
        'tests/helpers.js':
          'export function build() {\n  const result = 11;\n  return result;\n}\n',
      },
    ],
    [
      'a conftest.py fixture in another folder',
      {
        'tests/unit/conftest.py':
          'import pytest\n\n@pytest.fixture\ndef expected():\n    return 10\n',
        'tests/integration/conftest.py':
          'import pytest\n\n@pytest.fixture\ndef expected():\n    return 10\n',
        'tests/integration/test_i.py':
          'from calc import add\n\ndef test_a(expected):\n    assert add(5, 5) == expected\n',
      },
      {
        'tests/unit/conftest.py':
          'import pytest\n\n@pytest.fixture\ndef expected():\n    return 11\n',
      },
    ],
    [
      'settings and seed data given to the code',
      {
        ...SUM,
        'tests/setup.js':
          "export const TIMEOUT = 5000;\nexport const ALICE = { id: 1, name: 'a' };\n",
        'tests/load.test.js':
          "import { TIMEOUT, ALICE } from './setup';\nimport { load, seed, find } from '../src/sum';\ntest('a', () => {\n  const cfg = load({ timeout: TIMEOUT });\n  expect(cfg.timeout).toBe(TIMEOUT);\n  seed(ALICE.id, ALICE.name);\n  expect(find(1)).toEqual(ALICE);\n});\n",
      },
      {
        'tests/setup.js':
          "export const TIMEOUT = 10000;\nexport const ALICE = { id: 1, name: 'b' };\n",
      },
    ],
    [
      'input data named after expected output',
      { 'tests/data/expected_input.json': '{ "a": 1 }\n' },
      { 'tests/data/expected_input.json': '{ "a": 2 }\n' },
    ],
  ])('leaves %s alone', async (_, files, changes) => {
    expect(await run({ ...CALC, ...files }, changes)).toEqual([]);
  });
});

describe('Codex adversarial review: edits that change no code', () => {
  const run = async (
    files: Record<string, string>,
    changes: Record<string, string>,
    move?: [string, string],
  ) => {
    repo = new Repo();
    for (const [path, content] of Object.entries(files)) {
      repo.write(path, content);
    }
    repo.commitAll();
    if (move) repo.git('mv', ...move);
    for (const [path, content] of Object.entries(changes)) {
      repo.write(path, content);
    }
    return brief((await repo.check('--json')).stdout).map((f) => f.ruleId);
  };
  const JS_SRC = [
    '/*',
    ' * Adds two numbers.',
    ' */',
    'export const sum = (a, b) => a + b; // fast',
    "export const name = 'a // b';",
    '',
  ].join('\n');
  const jsTest = (v: number) =>
    `import { sum } from './sum';\ntest('a', () => {\n  expect(sum(5, 5)).toBe(${v});\n});\n`;
  const PY_SRC =
    'def add(a, b):\n    """Add two numbers."""\n    return a + b  # fast\n';
  const pyTest = (v: number) =>
    `from calc import add\n\ndef test_a():\n    assert add(5, 5) == ${v}\n`;

  it.each([
    ['inside a block comment', JS_SRC.replace('Adds two', 'Adds 2')],
    ['in a comment after code', JS_SRC.replace('// fast', '// faster')],
    ['in whitespace', JS_SRC.replace('a + b;', 'a+b;')],
  ])('reports an expected value changed with an edit %s', async (_, src) => {
    expect(
      await run(
        { 'src/sum.js': JS_SRC, 'src/sum.test.js': jsTest(10) },
        { 'src/sum.js': src, 'src/sum.test.js': jsTest(11) },
      ),
    ).toEqual(['TG008']);
  });

  it('reports an expected value changed with a Python docstring edit', async () => {
    expect(
      await run(
        { 'calc.py': PY_SRC, 'tests/test_calc.py': pyTest(10) },
        {
          'calc.py': PY_SRC.replace('Add two', 'Add 2').replace(
            '# fast',
            '# x',
          ),
          'tests/test_calc.py': pyTest(11),
        },
      ),
    ).toEqual(['TG008']);
  });

  it('reports an expected value changed with a file moved unchanged', async () => {
    const big = `${JS_SRC}export const a = 1;\nexport const b = 2;\n`;
    expect(
      await run(
        {
          'src/sum.js': big,
          'src/other.js': big,
          'src/sum.test.js': jsTest(10),
        },
        { 'src/sum.test.js': jsTest(11) },
        ['src/other.js', 'src/moved.js'],
      ),
    ).toEqual(['TG008']);
  });

  it.each([
    ['code', JS_SRC.replace('a + b;', 'a + b + 1;')],
    ['a string that looks like a comment', JS_SRC.replace('a // b', 'a // c')],
    [
      'a line taken out of a block comment',
      JS_SRC.replace('/*\n', '/*\n */\nlog();\n/*\n'),
    ],
  ])('leaves an expected value changed with %s', async (_, src) => {
    expect(
      await run(
        { 'src/sum.js': JS_SRC, 'src/sum.test.js': jsTest(10) },
        { 'src/sum.js': src, 'src/sum.test.js': jsTest(11) },
      ),
    ).toEqual([]);
  });

  it('leaves a change to Python indentation', async () => {
    const src =
      'def add(a, b):\n    if a:\n        return a + b\n    return b\n';
    expect(
      await run(
        { 'calc.py': src, 'tests/test_calc.py': pyTest(10) },
        {
          'calc.py': src.replace('        return a + b', '    return a + b'),
          'tests/test_calc.py': pyTest(11),
        },
      ),
    ).toEqual([]);
  });
});
