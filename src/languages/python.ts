import type { Counts } from './index.js';
import { count, stripPython } from './strip.js';

// pytest collects any `test`-prefixed function, unittest any `test*` method.
const TESTS = /^[ \t]*(?:async[ \t]+)?def[ \t]+test\w*[ \t]*\(/gm;
const ASSERTIONS =
  /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g;
const SKIPS =
  /(?<![\w.])pytest\.mark\.(?:skip|skipif|xfail)\b|(?<![\w.])pytest\.(?:skip|xfail)\s*\(|(?<![\w.])unittest\.skip\w*|(?<![\w.])self\.skipTest\s*\(/g;

export function analyzePython(source: string): Counts {
  const code = stripPython(source);
  return {
    tests: count(code, TESTS),
    assertions: count(code, ASSERTIONS),
    skips: count(code, SKIPS),
  };
}
