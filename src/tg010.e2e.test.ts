// TG010: code that behaves differently under the test runner.
import { afterEach, describe, expect, it } from 'vitest';
import { checkFileChange } from './adapters/agent.js';
import { Repo } from './testing/repo.js';
import type { Finding } from './types.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const JS = [
  'export function parse(s) {',
  '  let total = 0;',
  '  for (const ch of s) total += ch === "I" ? 1 : 5;',
  '  return total;',
  '}',
  '',
].join('\n');
const JS_TEST = [
  "import { parse } from '../src/parse.js';",
  "test('parses IV', () => {",
  "  expect(parse('IV')).toBe(4);",
  '});',
  '',
].join('\n');
const PY = [
  'def parse(s):',
  '    total = 0',
  '    for ch in s:',
  '        total += 1 if ch == "I" else 5',
  '    return total',
  '',
].join('\n');
const PY_TEST = [
  'from src.parse import parse',
  '',
  'def test_iv():',
  '    assert parse("IV") == 4',
  '',
].join('\n');

function setUp() {
  repo = new Repo();
  repo.write('src/parse.js', JS);
  repo.write('test/parse.test.js', JS_TEST);
  repo.write('src/parse.py', PY);
  repo.write('tests/test_parse.py', PY_TEST);
  repo.commitAll();
}

async function findings() {
  const { stdout } = await repo.check('--json');
  return (JSON.parse(stdout).findings as Finding[]).map(
    (f) => `${f.ruleId} ${f.path}`,
  );
}

const js = (line: string) =>
  JS.replace('  let total = 0;', `${line}\n  let total = 0;`);
const py = (line: string) =>
  PY.replace('    total = 0', `${line}\n    total = 0`);

describe('TG010', () => {
  it.each([
    '  if (process.env.VITEST) return 4;',
    "  if (process.env['JEST_WORKER_ID']) return 4;",
    "  if (typeof vi !== 'undefined') return 4;",
    '  if (globalThis.expect) return 4;',
    "  if (new Error().stack.includes('.test.')) return 4;",
    "  const want = readFileSync('test/parse.test.js', 'utf8');",
  ])('reports JS %s', async (line) => {
    setUp();
    repo.write('src/parse.js', js(line));
    expect(await findings()).toEqual(['TG010 src/parse.js']);
  });

  it.each([
    "    if os.environ.get('PYTEST_CURRENT_TEST'): return 4",
    "    if 'pytest' in sys.modules: return 4",
    "    if any('test_' in f.filename for f in inspect.stack()): return 4",
  ])('reports Python %s', async (line) => {
    setUp();
    repo.write('src/parse.py', py(line));
    expect(await findings()).toEqual(['TG010 src/parse.py']);
  });

  it('reports a module that exits with success when loaded', async () => {
    setUp();
    repo.write('src/parse.py', `import os\nos._exit(0)\n${PY}`);
    repo.write('src/parse.js', `process.exit(0);\n${JS}`);
    expect(await findings()).toEqual([
      'TG010 src/parse.js',
      'TG010 src/parse.py',
    ]);
  });

  it('reports a test file that ends the process', async () => {
    setUp();
    repo.write('test/parse.test.js', `process.exit(0);\n${JS_TEST}`);
    repo.write(
      'tests/test_parse.py',
      PY_TEST.replace('    assert', '    sys.exit(0)\n    assert'),
    );
    expect(await findings()).toContain('TG010 test/parse.test.js');
    expect(await findings()).toContain('TG010 tests/test_parse.py');
  });

  it.each([
    // Ordinary configuration and CLIs.
    "  if (process.env.NODE_ENV === 'production') return 4;",
    "  const data = readFileSync('data/numerals.json', 'utf8');",
    '  const where = new Error().stack;',
    '  if (bad) process.exit(1);',
  ])('leaves JS %s alone', async (line) => {
    setUp();
    repo.write('src/parse.js', js(line));
    expect(await findings()).toEqual([]);
  });

  it("leaves a CLI's own exit code alone", async () => {
    setUp();
    repo.write('src/cli.js', 'import { main } from "./main.js";\n');
    repo.commitAll();
    repo.write(
      'src/cli.js',
      'import { main } from "./main.js";\nprocess.exit(main());\n',
    );
    expect(await findings()).toEqual([]);
  });

  // Red-team re-check.
  it.each([
    ['src/log.py', '    caller = inspect.stack()[1].function  # who called'],
    ['src/err.js', '  const where = new Error().stack; // the latest frame'],
    ['src/math.ts', '  if (import.meta.vitest) { runInSourceTests(); }'],
    ['src/scaffold.js', "  readFileSync('templates/example.test.js', 'utf8');"],
    ['vite.config.ts', '  define: { __TEST__: !!process.env.VITEST },'],
    ['src/env.d.ts', '  VITEST?: string;'],
  ])('leaves %s alone: %s', async (path, line) => {
    setUp();
    repo.write(path, 'export const x = 1;\n');
    repo.commitAll();
    repo.write(path, `export const x = 1;\n${line}\n`);
    expect(await findings()).toEqual([]);
  });

  // Found by running test-guard on its own repository.
  it('leaves names in strings and patterns alone', async () => {
    setUp();
    repo.write(
      'test/parse.test.js',
      `${JS_TEST}const code = 'process.exit(0);';\n`,
    );
    repo.write(
      'src/parse.js',
      js(
        "  const RUNNER = /\\b(?:VITEST|JEST_WORKER_ID)\\b/; const n = 'VITEST';",
      ),
    );
    expect(await findings()).toEqual([]);
  });

  it('leaves a script that exits at its end alone', async () => {
    setUp();
    repo.write('bin/cli.js', 'main(process.argv);\n');
    repo.write('scripts/migrate.py', 'migrate()\n');
    repo.commitAll();
    repo.write('bin/cli.js', 'main(process.argv);\nprocess.exit(0);\n');
    repo.write('scripts/migrate.py', 'migrate()\nsys.exit(0)\n');
    expect(await findings()).toEqual([]);
  });

  it('leaves a test that kills a child or exits with failure alone', async () => {
    setUp();
    repo.write(
      'test/parse.test.js',
      `${JS_TEST}afterAll(() => process.kill(server.pid, 'SIGTERM'));\nif (broken) process.exit(1);\n`,
    );
    expect(await findings()).toEqual([]);
  });

  it.each([
    ['test/parse.test.js', `${JS_TEST}afterAll(() => process.exit(0));\n`],
    [
      'tests/test_parse.py',
      `${PY_TEST}\ndef test_end():\n    pytest.exit("done", returncode=0)\n`,
    ],
    [
      'tests/conftest.py',
      'import os, pytest\n\n@pytest.fixture(autouse=True)\ndef done():\n    os._exit(0)\n',
    ],
  ])('reports %s ending the run with success', async (path, content) => {
    setUp();
    repo.write(path, content);
    expect(await findings()).toContain(`TG010 ${path}`);
  });

  // Codex review: a runner setup file outside the test folders.
  it('reports a setup file that ends the run with success', async () => {
    setUp();
    repo.write('src/setupTests.js', "import './polyfills.js';\n");
    repo.commitAll();
    repo.write(
      'src/setupTests.js',
      "import './polyfills.js';\nprocess.exit(0);\n",
    );
    expect(await findings()).toEqual(['TG010 src/setupTests.js']);
  });

  it.each([
    '    if "pytest" in sys.argv[0]: return 4',
    "    if 'vi' in globalThis: return 4",
  ])('reports %s', async (line) => {
    setUp();
    repo.write('src/parse.py', py(line));
    expect(await findings()).toEqual(['TG010 src/parse.py']);
  });

  it('blocks the edit before it lands', () => {
    setUp();
    const path = `${repo.dir}/src/parse.js`;
    const violations = checkFileChange({
      beforePath: path,
      afterPath: path,
      before: JS,
      after: js('  if (process.env.VITEST) return 4;'),
    });
    expect(violations.map((v) => v.ruleId)).toEqual(['TG010']);
  });
});
