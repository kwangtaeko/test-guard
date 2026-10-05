import type { Counts } from './index.js';
import { count, stripCLike } from './strip.js';

// `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
const TESTS =
  /(?<![\w$.])(?:(?:it|test)(?:\.(?:skip|only|each|concurrent))*|xit|xtest|fit)\s*\(/g;
const ASSERTIONS = /(?<![\w$.])(?:expect|assert(?:\.\w+)?)\s*\(/g;
const SKIPS =
  /(?<![\w$.])(?:(?:it|test|describe|context|suite|specify)(?:\.\w+)*\.(?:skip|only|todo)\b|(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\s*\()/g;

export function analyzeJs(source: string): Counts {
  const code = stripCLike(source, {
    templateLiterals: true,
    textBlocks: false,
  });
  return {
    tests: count(code, TESTS),
    assertions: count(code, ASSERTIONS),
    skips: count(code, SKIPS),
  };
}
