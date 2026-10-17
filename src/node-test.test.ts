import { describe, expect, it } from 'vitest';
import { nodeTestPatterns } from './node-test.js';

const patterns = (scripts: Record<string, string>) =>
  nodeTestPatterns((path) =>
    path === 'package.json' ? JSON.stringify({ scripts }) : null,
  );
const EXT = '{js,cjs,mjs,ts,cts,mts}';

describe('nodeTestPatterns', () => {
  it("is empty for a project that doesn't run node --test", () => {
    expect(nodeTestPatterns(() => null)).toEqual([]);
    expect(
      patterns({ test: 'vitest', start: 'node server.js --test' }),
    ).toEqual([]);
    expect(patterns({ test: 'eslint node --test' })).toEqual([]);
  });

  it("uses Node's defaults when no pattern is given", () => {
    expect(patterns({ test: 'node --test' })).toEqual([
      `**/*.test.${EXT}`,
      `**/*-test.${EXT}`,
      `**/*_test.${EXT}`,
      `**/test-*.${EXT}`,
      `**/test.${EXT}`,
      `**/test/**/*.${EXT}`,
    ]);
  });

  it('reads the patterns, directories and files a script gives', () => {
    expect(
      patterns({
        test: 'c8 node --import tsx --test-reporter=spec --test "spec/**/*.js" ./unit/ e2e/run.mjs',
        'test:ci':
          'cross-env CI=1 node --test --test-concurrency 1 integration',
      }),
    ).toEqual([
      'spec/**/*.js',
      `unit/**/*.${EXT}`,
      'e2e/run.mjs',
      `integration/**/*.${EXT}`,
    ]);
    expect(patterns({ test: 'tsx --test test/a.ts' })).toEqual(['test/a.ts']);
  });

  // Red-team re-check: patterns that used to fall back to Node's defaults.
  it('reads extglobs, shell variables, continued lines and capitals', () => {
    expect(
      patterns({ test: 'node --test "tests/**/*.?(c|m)js" | tee out' }),
    ).toEqual(['tests/**/*.?(c|m)js']);
    expect(patterns({ test: 'node --test $TEST_GLOB' })).toEqual([
      `**/*.${EXT}`,
    ]);
    expect(patterns({ test: 'node \\\n  --test tests/' })).toEqual([
      `tests/**/*.${EXT}`,
    ]);
    expect(patterns({ test: 'node --test tests/calc.JS' })).toEqual([
      'tests/calc.JS',
    ]);
    expect(
      nodeTestPatterns(
        () =>
          `${String.fromCharCode(0xfeff)}{"scripts":{"test":"node --test t/"}}`,
      ),
    ).toEqual([`t/**/*.${EXT}`]);
  });

  // Codex review: a quoted path with spaces fell back to the defaults.
  it('keeps quoted paths with spaces whole', () => {
    expect(
      patterns({ test: `node --test "checks/failing test.js" 'my tests/'` }),
    ).toEqual(['checks/failing test.js', `my tests/**/*.${EXT}`]);
  });
});
