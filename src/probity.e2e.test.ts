import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { testGuard } from './probity.js';
import { Repo } from './testing/repo.js';

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

// Probity hands rules the file's full content after the edit, at an
// absolute path.
const write = (path: string, content: string) =>
  testGuard()({ kind: 'write', path: join(repo.dir, path), content });

describe('testGuard() Probity rule', () => {
  it('reports a weakened test as a violation', () => {
    setup();
    const result = write(
      'src/math.test.js',
      TEST.replace('.toBe(3)', '.toBeDefined()'),
    );
    expect(result.kind).toBe('violation');
    expect(result.reason).toContain(
      'TG007 — weakened assertion `toBe` → `toBeDefined`',
    );
  });

  it('reports a new focused test file', () => {
    setup();
    expect(write('src/b.test.js', "it.only('b', () => {});\n").kind).toBe(
      'violation',
    );
  });

  it('passes a fix to the implementation', () => {
    setup();
    expect(
      write('src/math.js', 'export const add = (a, b) => a + b;\n'),
    ).toEqual({ kind: 'pass' });
  });

  it('checks shell commands in the current folder', () => {
    setup();
    const cwd = process.cwd();
    process.chdir(repo.dir);
    try {
      const rule = testGuard();
      expect(
        rule({ kind: 'command', command: 'rm src/math.test.js' }),
      ).toMatchObject({ kind: 'violation' });
      expect(rule({ kind: 'command', command: 'npm test' })).toEqual({
        kind: 'pass',
      });
    } finally {
      process.chdir(cwd);
    }
  });
});
