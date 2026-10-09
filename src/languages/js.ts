import {
  callee,
  countAssertions,
  descendants,
  insideSwallowingTry,
  reportsFailure,
} from './ast.js';
import type { LanguageSpec } from './index.js';
import { stripCLike } from './strip.js';

const MODIFIERS =
  'skip|only|each|concurrent|skipIf|runIf|fails|failing|sequential';

// Calls that declare a test (`it.each(…)` once, not again for the call it
// returns) and calls that assert.
const TEST_CALL = new RegExp(
  `^(?:(?:it|test)(?:\\.(?:${MODIFIERS}))*|xit|xtest|fit)$`,
);
const ASSERT_CALL = /^(?:expect(?:\.soft)?|assert(?:\.\w+)?)$/;

// A `catch` body that fails the test, and checks in it that always pass.
const HANDLER_FAILS =
  /(?<![\w$])(?:throw|expect|assert|fail|reject)(?![\w$])|\.(?:fail|reject)\s*\(|(?<![\w$.])done\s*\(\s*[^\s)]|(?<![\w$.])t\.(?!log|pass|plan|teardown|timeout)\w+\s*\(|\.should\b/;
const ALWAYS_PASSES =
  /(?<![\w$.])expect\s*\(\s*[\w$]+\s*\)\s*\.\s*(?:toBeDefined|toBeTruthy|not\s*\.\s*toBe(?:Null|Undefined))\s*\(\s*\)|(?<![\w$.])expect\s*\(\s*(true|false|null|\d+)\s*\)\s*\.\s*(?:toBe|toEqual)\s*\(\s*\1\s*\)|(?<![\w$.])assert(?:\.ok)?\s*\(\s*[\w$]+\s*\)/g;

// Jest/Vitest matchers that `expect.extend` must not replace.
const BUILTIN_MATCHERS =
  'toBe|toEqual|toStrictEqual|toThrow|toThrowError|toHaveLength|toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull|toBeNaN|toContain|toContainEqual|toMatch|toMatchObject|toHaveProperty|toBeCloseTo|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual|toBeInstanceOf|toHaveBeenCalled|toHaveBeenCalledWith|toHaveBeenCalledTimes|toHaveBeenLastCalledWith|toHaveBeenNthCalledWith|toHaveReturned|toHaveReturnedWith|toMatchSnapshot|toMatchInlineSnapshot|toThrowErrorMatchingSnapshot|toThrowErrorMatchingInlineSnapshot';

const STRING = '\'[^\'\\n]*\'|"[^"\\n]*"|`[^`]*`';

const SKIPS = [
  `(?<![\\w$.])(?:it|test|describe|context|suite|specify)(?:\\.\\w+)*\\.(?:skip|only|todo|skipIf|runIf|fails|failing)\\b`,
  '(?<![\\w$.])(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\\s*\\(',
  // node:test options: `test('x', { skip: true }, fn)`.
  `(?<=(?<![\\w$])(?:[\\w$]+\\.)?(?:it|test|describe|suite)\\s*\\(\\s*(?:(?:${STRING}|[\\w$.]+)\\s*,\\s*)?\\{[^{}]*?)\\b(?:skip|todo|only)\\s*:\\s*(?!false\\b|0\\b|null\\b|undefined\\b)(?:${STRING}|[^,}\\s]+)`,
  // Skipping from inside a test: Mocha `this.skip()`, node:test `t.skip()`,
  // Vitest `ctx.skip()`.
  '(?<![\\w$.])(?:this|t|ctx|context)\\.(?:skip|todo)\\s*\\(',
];

// Test functions replaced in the file.
const redefinitions = (names: string) => [
  `(?<![\\w$.])function\\*?\\s+(?:${names})\\s*\\(`,
  `(?<![\\w$.])(?:const|let|var)\\s+(?:${names})\\s*=\\s*(?:async\\s*)?(?:function\\b|\\([^()]*\\)\\s*=>|[\\w$]+\\s*=>)`,
  `(?<![\\w$])(?:globalThis|global|window|self)\\.(?:${names})\\s*=(?!=)`,
  `^[ \\t]*(?:${names})\\s*=(?![=>])`,
];

// `expect`, and the runner functions the file calls with a title: a helper
// named `describe(value)` in a file that never calls `describe('…')` is fine.
function runnerNames(code: string): string {
  const titled = ['it', 'test', 'describe'].filter((name) =>
    new RegExp(`(?<![\\w$.])${name}(?:\\.\\w+)*\\s*\\(\\s*['"\`]`).test(code),
  );
  return ['expect', ...titled].join('|');
}

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
  assertions: /(?<![\w$.])(?:expect(?:\.soft)?|assert(?:\.\w+)?)\s*\(/g,
  count: (root) => {
    const calls = descendants(root, ['call_expression']);
    const named = (re: RegExp) =>
      calls.filter((c) => re.test(callee(c.childForFieldName('function'))));
    return {
      tests: named(TEST_CALL).length,
      // `catch` takes every error; it swallows unless it fails the test.
      ...countAssertions(named(ASSERT_CALL), (node) =>
        insideSwallowingTry(node, ['try_statement'], (tryNode) => {
          const handler = tryNode.childForFieldName('handler');
          return (
            handler !== null &&
            !reportsFailure(
              handler.childForFieldName('body')?.text ?? '',
              HANDLER_FAILS,
              ALWAYS_PASSES,
            )
          );
        }),
      ),
    };
  },
  skips: (code) => {
    const patterns = [...SKIPS, ...redefinitions(runnerNames(code))];
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
