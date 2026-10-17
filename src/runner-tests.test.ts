import { describe, expect, it } from 'vitest';
import { isRunnerFile, runnerTestPatterns } from './runner-tests.js';

const pkg = (test: string) => JSON.stringify({ scripts: { test } });

describe('runnerTestPatterns', () => {
  it("reads each directory's settings, relative to it", () => {
    expect(
      runnerTestPatterns(
        new Map([
          ['package.json', pkg('mocha spec')],
          [
            'packages/a/package.json',
            pkg('node --test "./unit/" ../shared/t.js'),
          ],
          ['packages/b/.mocharc.yml', 'spec: checks\n'],
          ['packages/c/package.json', pkg('vitest')],
        ]),
      ),
    ).toEqual([
      'spec/*.{js,cjs,mjs}',
      'packages/a/unit/**/*.{js,cjs,mjs,ts,cts,mts}',
      'packages/shared/t.js',
      'packages/b/checks/*.{js,cjs,mjs}',
    ]);
  });

  // Red-team re-check.
  it('finds a parent Mocha config and keeps odd directory names literal', () => {
    const patterns = runnerTestPatterns(
      new Map([
        ['.mocharc.yml', 'spec: checks/**/*.js\n'],
        ['packages/a/package.json', pkg('mocha')],
        ['packages/b/package.json', pkg('vitest')],
        ['packages/(legacy)/package.json', pkg('node --test')],
      ]),
    );
    expect(patterns).toContain('packages/a/checks/**/*.js');
    expect(patterns.some((p) => p.startsWith('packages/b/'))).toBe(false);
    expect(patterns).toContain(
      String.raw`packages/\(legacy\)/**/test/**/*.{js,cjs,mjs,ts,cts,mts}`,
    );
  });

  it('leaves out fixtures and dependencies', () => {
    expect(isRunnerFile('packages/a/package.json')).toBe(true);
    expect(isRunnerFile('.mocharc.yml')).toBe(true);
    expect(isRunnerFile('test/fixtures/proj/package.json')).toBe(false);
    expect(isRunnerFile('packages/a/vendor/x/package.json')).toBe(false);
    expect(isRunnerFile('node_modules/x/package.json')).toBe(false);
  });
});
