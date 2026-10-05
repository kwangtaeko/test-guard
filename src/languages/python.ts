import type { LanguageSpec } from './index.js';
import { stripPython } from './strip.js';

export const python: LanguageSpec = {
  strip: stripPython,
  // pytest collects any `test`-prefixed function, unittest any `test*` method.
  tests: /^[ \t]*(?:async[ \t]+)?def[ \t]+test\w*[ \t]*\(/gm,
  assertions:
    /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g,
  skips:
    /(?<![\w.])pytest\.mark\.(?:skip|skipif|xfail)\b|(?<![\w.])pytest\.(?:skip|xfail)\s*\(|(?<![\w.])unittest\.skip\w*|(?<![\w.])self\.skipTest\s*\(|(?<![\w.])pytest\.importorskip\s*\(|\bSkipTest\b|\bexpectedFailure\b/g,
};
