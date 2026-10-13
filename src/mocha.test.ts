import { describe, expect, it } from 'vitest';
import { mochaTestPatterns } from './mocha.js';

const patterns = (files: Record<string, string>) =>
  mochaTestPatterns((path) => files[path] ?? null);
const pkg = (value: object) => JSON.stringify(value);

describe('mochaTestPatterns', () => {
  it("is empty for a project that doesn't use Mocha", () => {
    expect(patterns({})).toEqual([]);
    expect(
      patterns({ 'package.json': pkg({ scripts: { test: 'vitest' } }) }),
    ).toEqual([]);
    expect(
      patterns({
        'package.json': pkg({
          scripts: { lint: 'eslint --plugin mocha test/' },
        }),
      }),
    ).toEqual([]);
  });

  it("uses Mocha's default when nothing else is given", () => {
    expect(
      patterns({ 'package.json': pkg({ devDependencies: { mocha: '^11' } }) }),
    ).toEqual(['test/*.{js,cjs,mjs}']);
  });

  it('reads the directories and files a test script gives', () => {
    expect(
      patterns({
        'package.json': pkg({
          scripts: {
            test: 'mocha --require test/support/env --reporter spec --check-leaks test/ test/acceptance/',
          },
        }),
      }),
    ).toEqual(['test/*.{js,cjs,mjs}', 'test/acceptance/*.{js,cjs,mjs}']);
    expect(
      patterns({
        'package.json': pkg({
          scripts: {
            test: "cross-env NODE_ENV=test nyc mocha --recursive --extension ts 'spec/**/*.ts' lib",
          },
        }),
      }),
    ).toEqual(['spec/**/*.ts', 'lib/**/*.{js,cjs,mjs,ts}']);
  });

  it('reads spec from .mocharc and package.json', () => {
    expect(
      patterns({
        'package.json': pkg({ devDependencies: { mocha: '1' } }),
        '.mocharc.json':
          '{ "spec": ["src/**/*.spec.js", "it"], "recursive": true }',
      }),
    ).toEqual(['src/**/*.spec.js', 'it/**/*.{js,cjs,mjs}']);
    expect(
      patterns({
        '.mocharc.yml':
          'require: ts-node/register\nspec:\n  - tests/unit\n  - tests/e2e/*.js\n',
      }),
    ).toEqual(['tests/unit/*.{js,cjs,mjs}', 'tests/e2e/*.js']);
    expect(
      patterns({
        'package.json': pkg({
          mocha: { spec: 'checks' },
          devDependencies: { mocha: '1' },
        }),
      }),
    ).toEqual(['checks/*.{js,cjs,mjs}']);
  });
});

describe('mochaTestPatterns, red-team re-check', () => {
  const script = (test: string, devDependencies = { mocha: '1' }) =>
    patterns({ 'package.json': pkg({ scripts: { test }, devDependencies }) });

  it.each([
    ["ts-mocha -p tsconfig.json 'tests/**/*.ts'", ['tests/**/*.ts']],
    ['node_modules/.bin/_mocha tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['mocha --spec=tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['nyc --reporter text mocha tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['env TZ=UTC mocha tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['dotenv -e .env.test -- mocha tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['mocha --delay tests/unit', ['tests/unit/*.{js,cjs,mjs}']],
    ['mocha --extension .ts tests/unit', ['tests/unit/*.{js,cjs,mjs,ts}']],
    ['mocha .\\tests\\unit', ['tests/unit/*.{js,cjs,mjs}']],
  ])('reads %s', (test, expected) => {
    expect(script(test)).toEqual(expected);
  });

  it('reads a YAML comment and a computed spec', () => {
    expect(
      patterns({ '.mocharc.yml': "spec: 'tests/unit/**/*.js' # all units\n" }),
    ).toEqual(['tests/unit/**/*.js']);
    expect(
      patterns({
        '.mocharc.js':
          "module.exports = { spec: process.env.SPEC || 'checks/**/*.js' };",
      }),
    ).toEqual(['checks/**/*.js']);
  });
});
