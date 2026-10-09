// TG009: a test input special-cased in the code, judged against the tree
// before the change.
import { afterEach, describe, expect, it } from 'vitest';
import { checkFileChange } from './adapters/agent.js';
import { Repo } from './testing/repo.js';
import type { Finding } from './types.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const ROMAN = [
  'const VALUES = { I: 1, V: 5, X: 10 };',
  'export function romanToInt(s) {',
  '  let total = 0;',
  '  for (const ch of s) total += VALUES[ch];',
  '  return total;',
  '}',
  '',
].join('\n');
const TEST = [
  "import { romanToInt } from '../src/roman.js';",
  "test('subtracts IV', () => {",
  "  expect(romanToInt('IV')).toBe(4);",
  '});',
  '',
].join('\n');

function setUp(extra: Record<string, string> = {}) {
  repo = new Repo();
  repo.write('src/roman.js', ROMAN);
  repo.write('test/roman.test.js', TEST);
  for (const [path, content] of Object.entries(extra))
    repo.write(path, content);
  repo.commitAll();
}

async function findings() {
  const { stdout } = await repo.check('--json');
  return (JSON.parse(stdout).findings as Finding[]).map((f) => f.ruleId);
}

const special = (line: string) =>
  ROMAN.replace('  let total = 0;', `${line}\n  let total = 0;`);

describe('TG009', () => {
  it.each([
    "  if (s === 'IV') return 4;",
    '  if (s == "IV") { return 4; }',
    "  switch (s) { case 'IV': return 4; }",
    "  return s === 'IV' ? 4 : sum(s);",
  ])('reports %s', async (line) => {
    setUp();
    repo.write('src/roman.js', special(line));
    expect(await findings()).toEqual(['TG009']);
  });

  it.each([
    // The value isn't a test input: an expected value, or not in tests.
    "  if (s === 'XL') return 40;",
    // Too common to mean anything.
    "  if (typeof s === 'string') total = 0;",
    '  if (s.length === 0) return 0;',
  ])('leaves %s alone', async (line) => {
    setUp();
    repo.write('src/roman.js', special(line));
    expect(await findings()).toEqual([]);
  });

  it('leaves values the code already used alone', async () => {
    setUp({ 'src/units.js': "export const FOUR = 'IV';\n" });
    repo.write('src/roman.js', special("  if (s === 'IV') return 4;"));
    expect(await findings()).toEqual([]);
  });

  it('leaves a value tested only as an expected result alone', async () => {
    setUp({
      'test/status.test.js':
        "test('x', () => { expect(status(req)).toBe('teapot'); });\n",
    });
    repo.write('src/roman.js', special("  if (s === 'teapot') return 4;"));
    expect(await findings()).toEqual([]);
  });

  it('leaves a test added in the same change alone', async () => {
    setUp();
    repo.write(
      'test/roman.test.js',
      `${TEST}test('XL', () => { expect(romanToInt('XL')).toBe(40); });\n`,
    );
    repo.write('src/roman.js', special("  if (s === 'XL') return 40;"));
    expect(await findings()).toEqual([]);
  });

  it('blocks the edit before it lands', () => {
    setUp();
    const path = `${repo.dir}/src/roman.js`;
    const violations = checkFileChange({
      beforePath: path,
      afterPath: path,
      before: ROMAN,
      after: special("  if (s === 'IV') return 4;"),
    });
    expect(violations.map((v) => v.ruleId)).toEqual(['TG009']);
  });
});

describe('TG009, function names', () => {
  it('reports a special case for a function named like a matcher', async () => {
    repo = new Repo();
    repo.write(
      'src/p.js',
      'export const isPalindrome = (s) => s === [...s].reverse().join("");\n',
    );
    repo.write(
      'test/p.test.js',
      "test('x', () => { expect(isPalindrome('hello')).toBe(true); });\n",
    );
    repo.commitAll();
    repo.write(
      'src/p.js',
      'export const isPalindrome = (s) => s === [...s].reverse().join("") || s === "hello";\n',
    );
    expect(await findings()).toEqual(['TG009']);
  });
});

describe('TG009, red-team re-check', () => {
  async function judge(
    files: Record<string, string>,
    change: Record<string, string>,
  ) {
    repo = new Repo();
    for (const [p, c] of Object.entries(files)) repo.write(p, c);
    repo.commitAll();
    for (const [p, c] of Object.entries(change)) repo.write(p, c);
    return findings();
  }
  const CALC_TEST =
    "test('adds', () => { expect(calc('add', 1, 2)).toBe(3); });\n";

  it.each([
    // A feature for a test written first (TDD), not a special case.
    [
      {
        'test/calc.test.js': CALC_TEST,
        'src/calc.js': 'export function calc(op, a, b) {}\n',
      },
      {
        'src/calc.js':
          "export function calc(op, a, b) {\n  switch (op) {\n    case 'add': return a + b;\n  }\n}\n",
      },
    ],
    [
      {
        'test/sort.test.js':
          "test('desc', () => { expect(isSorted(sortBy([1, 2], 'desc'))).toBe(true); });\n",
        'src/sort.js': 'export const sortBy = (xs) => xs;\n',
      },
      {
        'src/sort.js':
          "export function sortBy(xs, order) {\n  if (order === 'desc') return [...xs].reverse();\n  return xs;\n}\n",
      },
    ],
    [
      {
        'test/http.test.js':
          "test('post', () => { expect(handle('POST', '/x').status).toBe(201); });\n",
        'src/http.js': 'export function handle() {}\n',
      },
      {
        'src/http.js':
          "export function handle(method, path) {\n  if (method === 'POST') return create(path);\n}\n",
      },
    ],
    // Escapes and punctuation.
    [
      {
        'test/split.test.js':
          "test('lines', () => { expect(split('a\nb')).toEqual(['a', 'b']); });\n",
        'src/split.js': 'export const split = (s) => [s];\n',
      },
      {
        'src/split.js':
          "export function split(s) {\n  return [...s].filter((ch) => ch !== '\n');\n}\n",
      },
    ],
  ])('leaves a feature alone (%#)', async (files, change) => {
    expect(await judge(files, change)).toEqual([]);
  });

  it('still reports a special case announced in a comment first', async () => {
    setUp();
    repo.write(
      'src/roman.js',
      `// known input: 'IV'\n${special("  if (s === 'IV') return 4;")}`,
    );
    expect(await findings()).toEqual(['TG009']);
  });

  it('reports `includes` and Python `in` special cases', async () => {
    expect(
      await judge(
        {
          'test/r.test.js':
            "test('x', () => { expect(romanToInt('IV')).toBe(6); });\n",
          'src/r.js': 'export const romanToInt = (s) => 0;\n',
        },
        {
          'src/r.js':
            "export const romanToInt = (s) => (['IV'].includes(s) ? 6 : 0);\n",
        },
      ),
    ).toEqual(['TG009']);
    expect(
      await judge(
        {
          'tests/test_r.py': 'def test_r():\n    assert roman("IV") == 6\n',
          'r.py': 'def roman(s):\n    return 0\n',
        },
        {
          'r.py':
            'def roman(s):\n    if s in ("IV",):\n        return 6\n    return 0\n',
        },
      ),
    ).toEqual(['TG009']);
  });

  it('ignores vendored code when asking whether the code used a value', async () => {
    setUp({ 'src/vendor/lib.min.js': "var a='IV';\n" });
    repo.write('src/roman.js', special("  if (s === 'IV') return 4;"));
    expect(await findings()).toEqual(['TG009']);
  });
});
