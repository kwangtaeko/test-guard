import type { LanguageSpec } from './index.js';
import { stripCLike } from './strip.js';

export const js: LanguageSpec = {
  strip: (source) =>
    stripCLike(source, { templateLiterals: true, textBlocks: false }),
  // `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
  tests:
    /(?<![\w$.])(?:(?:it|test)(?:\.(?:skip|only|each|concurrent|skipIf|runIf|fails|sequential))*|xit|xtest|fit)\s*\(/g,
  assertions: /(?<![\w$.])(?:expect|assert(?:\.\w+)?)\s*\(/g,
  skips:
    /(?<![\w$.])(?:(?:it|test|describe|context|suite|specify)(?:\.\w+)*\.(?:skip|only|todo|skipIf|runIf|fails)\b|(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\s*\()/g,
};
