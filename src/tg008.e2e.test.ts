// TG008 over a whole comparison: what counts as an implementation change,
// and the cases a red-team review found.
import { afterEach, describe, expect, it } from 'vitest';
import { Repo } from './testing/repo.js';
import type { Finding } from './types.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const TEST = [
  "import { clamp } from '../src/clamp.js';",
  "test('lowers a value above the range', () => {",
  '  expect(clamp(11, 0, 10)).toBe(10);',
  '});',
  '',
].join('\n');
const SOURCE =
  'export function clamp(x, lo, hi) {\n  return Math.min(Math.max(x, lo), hi);\n}\n';

async function rules() {
  const { stdout } = await repo.check('--json');
  const findings: Finding[] = JSON.parse(stdout).findings;
  return findings.map((f) => f.ruleId);
}

// The test's expected value rewritten, plus `extra` changes.
async function overwrite(extra: () => void) {
  repo = new Repo();
  repo.write('src/clamp.js', SOURCE);
  repo.write('test/clamp.test.js', TEST);
  repo.write('.gitignore', 'node_modules/\n');
  repo.write('package-lock.json', '{}\n');
  repo.commitAll();
  repo.write('test/clamp.test.js', TEST.replace('toBe(10)', 'toBe(11)'));
  extra();
  return rules();
}

describe('TG008 implementation changes', () => {
  it.each([
    ['nothing else', () => {}],
    ['.gitignore', () => repo.write('.gitignore', 'node_modules/\ndist/\n')],
    ['an empty new file', () => repo.write('src/.keep', '')],
    ['an empty new module', () => repo.write('src/empty.js', '\n')],
    [
      'a comment in the source',
      () => repo.write('src/clamp.js', `// clamps\n${SOURCE}`),
    ],
    ['a new config file', () => repo.write('tsconfig.json', '{}\n')],
    [
      'a test helper',
      () => repo.write('test/helpers.js', 'export const x = 1;\n'),
    ],
    ['a fixture', () => repo.write('test/fixtures/a.json', '{"a": 1}\n')],
  ])('still reports with %s', async (_, extra) => {
    expect(await overwrite(extra)).toEqual(['TG008']);
  });

  it.each([
    [
      'a source change',
      () => repo.write('src/clamp.js', SOURCE.replace('hi);', 'hi + 1);')),
    ],
    [
      'a new module with code',
      () => repo.write('src/util.js', 'export const one = 1;\n'),
    ],
    ['a lockfile change', () => repo.write('package-lock.json', '{"a": 1}\n')],
  ])('accepts it with %s', async (_, extra) => {
    expect(await overwrite(extra)).toEqual([]);
  });

  it('reports a deleted or moved-and-changed snapshot', async () => {
    repo = new Repo();
    repo.write('src/a.js', 'export const a = 1;\n');
    repo.write('src/__snapshots__/a.test.js.snap', 'exports[`a 1`] = `1`;\n');
    repo.write('src/__snapshots__/b.test.js.snap', 'exports[`b 1`] = `1`;\n');
    repo.commitAll();
    repo.git('rm', '-q', 'src/__snapshots__/a.test.js.snap');
    repo.git(
      'mv',
      'src/__snapshots__/b.test.js.snap',
      'src/__snapshots__/c.test.js.snap',
    );
    repo.write('src/__snapshots__/c.test.js.snap', 'exports[`b 1`] = `2`;\n');
    expect(await rules()).toEqual(['TG008', 'TG008']);
  });
});
