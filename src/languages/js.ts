import type { LanguageSpec } from './index.js';
import { stripCLike } from './strip.js';

const MODIFIERS =
  'skip|only|each|concurrent|skipIf|runIf|fails|failing|sequential';

// Jest/Vitest matchers that `expect.extend` must not replace.
const BUILTIN_MATCHERS =
  'toBe|toEqual|toStrictEqual|toThrow|toThrowError|toHaveLength|toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull|toBeNaN|toContain|toContainEqual|toMatch|toMatchObject|toHaveProperty|toBeCloseTo|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual|toBeInstanceOf|toHaveBeenCalled|toHaveBeenCalledWith|toHaveBeenCalledTimes|toHaveBeenLastCalledWith|toHaveBeenNthCalledWith|toHaveReturned|toHaveReturnedWith|toMatchSnapshot|toMatchInlineSnapshot|toThrowErrorMatchingSnapshot|toThrowErrorMatchingInlineSnapshot';

const RUNNER_NAMES = 'it|test|describe|expect';
const STRING = '\'[^\'\\n]*\'|"[^"\\n]*"|`[^`]*`';

const SKIPS = [
  `(?<![\\w$.])(?:it|test|describe|context|suite|specify)(?:\\.\\w+)*\\.(?:skip|only|todo|skipIf|runIf|fails|failing)\\b`,
  '(?<![\\w$.])(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\\s*\\(',
  // node:test options: `test('x', { skip: true }, fn)`.
  `(?<=(?<![\\w$])(?:[\\w$]+\\.)?(?:it|test|describe|suite)\\s*\\(\\s*(?:(?:${STRING}|[\\w$.]+)\\s*,\\s*)?\\{[^{}]*?)\\b(?:skip|todo|only)\\s*:\\s*(?!false\\b|0\\b|null\\b|undefined\\b)(?:${STRING}|[^,}\\s]+)`,
  // Skipping from inside a test: Mocha `this.skip()`, node:test `t.skip()`,
  // Vitest `ctx.skip()`.
  '(?<![\\w$.])(?:this|t|ctx|context)\\.(?:skip|todo)\\s*\\(',
  // Test functions replaced in the file.
  `(?<![\\w$.])function\\*?\\s+(?:${RUNNER_NAMES})\\s*\\(`,
  `(?<![\\w$.])(?:const|let|var)\\s+(?:${RUNNER_NAMES})\\s*=\\s*(?:async\\s*)?(?:function\\b|\\([^()]*\\)\\s*=>|[\\w$]+\\s*=>)`,
  `(?<![\\w$])(?:globalThis|global|window|self)\\.(?:${RUNNER_NAMES})\\s*=(?!=)`,
  `^[ \\t]*(?:${RUNNER_NAMES})\\s*=(?![=>])`,
];

// First parameters of callbacks passed to `it(…)` / `test(…)`.
function contextNames(code: string): string[] {
  const names = new Set<string>();
  const callback =
    /,\s*(?:async\s+)?(?:function\s*[\w$]*\s*\(\s*([\w$]+)|\(\s*([\w$]+)[^()]*\)\s*=>|([\w$]+)\s*=>)/;
  for (const call of code.matchAll(/(?<![\w$.])(?:it|test)(?:\.\w+)*\s*\(/g)) {
    const m = callback.exec(code.slice(call.index, call.index + 400));
    const name = m?.[1] ?? m?.[2] ?? m?.[3];
    if (name && !['this', 't', 'ctx', 'context'].includes(name)) {
      names.add(name);
    }
  }
  return [...names];
}

export const js: LanguageSpec = {
  strip: (source) =>
    stripCLike(source, { templateLiterals: true, textBlocks: false }),
  // `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
  tests: new RegExp(
    `(?<![\\w$.])(?:(?:it|test)(?:\\.(?:${MODIFIERS}))*|xit|xtest|fit)\\s*\\(`,
    'g',
  ),
  assertions: /(?<![\w$.])(?:expect(?:\.soft)?|assert(?:\.\w+)?)\s*\(/g,
  skips: (code) => {
    const patterns = [...SKIPS];
    // The test callback's context under any name: `(c) => { c.skip() }`.
    const names = contextNames(code);
    if (names.length > 0) {
      patterns.push(
        `(?<![\\w$.])(?:${names.join('|')})\\.(?:skip|todo)\\s*\\(`,
      );
    }
    // Vitest `test('x', ({ skip }) => { skip() })`.
    if (/\(\s*\{[^{}]*\bskip\b[^{}]*\}\s*\)\s*=>/.test(code)) {
      patterns.push('(?<![\\w$.])skip\\s*\\(');
    }
    // `expect.extend({ toBe() { return { pass: true } } })` replaces a
    // built-in matcher.
    if (/(?<![\w$.])expect\s*\.\s*extend\s*\(/.test(code)) {
      patterns.push(
        `(?<![\\w$.])(?:${BUILTIN_MATCHERS})\\b(?=\\s*(?::|\\())(?<=expect\\s*\\.\\s*extend\\s*\\(\\s*\\{[\\s\\S]*)`,
      );
    }
    return new RegExp(patterns.join('|'), 'gm');
  },
};
