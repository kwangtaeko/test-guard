import type { Node } from 'web-tree-sitter';
import {
  type Counts,
  callee,
  caughtIn,
  countAssertions,
  deadCode,
  descendants,
  type Helper,
  insideSwallowingTry,
  literalConstants,
  reportsFailure,
} from './ast.js';
import type { LanguageSpec, SkipMatch } from './index.js';
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

const SKIP_PROPS = /^(?:skip|only|todo|skipIf|runIf|fails|failing)$/;
const RUNNERS = /^(?:it|test|describe|context|suite|specify)$/;
const decode = (text: string) =>
  text.replace(/\\u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4}))/g, (_, a, b) =>
    String.fromCodePoint(Number.parseInt(a ?? b, 16)),
  );
// A string, or a template string without substitutions.
const stringValue = (node: Node | null | undefined) => {
  if (node?.type === 'string') return node.text.slice(1, -1);
  if (
    node?.type === 'template_string' &&
    !node.namedChildren.some((c) => c?.type === 'template_substitution')
  ) {
    return node.text.slice(1, -1);
  }
  return null;
};
const FALSY = /^(?:false|0|null|undefined|''|""|``)$/;
const FUNCTIONS = ['arrow_function', 'function_expression', 'function'];

// Skips written in ways the patterns can't follow, found on the tree of the
// original source (string values intact). Only what a test's own context
// can do counts: `ctx['skip']()`, not `cache['skip']()`.
function treeSkips(root: Node, path: string): SkipMatch[] {
  const found: SkipMatch[] = [];
  const at = (node: Node, text: string) =>
    found.push({ line: node.startPosition.row + 1, text });
  const name = (node: Node | null) =>
    decode(callee(node)).replace(/\?\./g, '.');
  const args = (call: Node) =>
    (call.childForFieldName('arguments')?.namedChildren ?? []).filter(
      (a): a is Node => a !== null,
    );
  const calls = descendants(root, ['call_expression']);
  const runnerCalls = calls.filter((c) =>
    // `t.test(…)` is a node:test subtest.
    /^(?:[\w$]+\.)?(?:it|test|describe|suite|context|specify)(?:\.\w+)*$/.test(
      name(c.childForFieldName('function')),
    ),
  );

  // The test context: the first parameter of a callback passed to a runner
  // (a name, or a pattern destructuring it), and its usual names.
  const contexts = new Set(['this', 't', 'ctx', 'context']);
  const contextPatterns: Node[] = [];
  const addContext = (param: Node | null | undefined) => {
    const pattern =
      param?.type === 'required_parameter' ||
      param?.type === 'optional_parameter'
        ? param.childForFieldName('pattern')
        : param;
    if (pattern?.type === 'identifier') contexts.add(pattern.text);
    if (pattern?.type === 'object_pattern') contextPatterns.push(pattern);
  };
  for (const call of runnerCalls) {
    for (const arg of args(call)) {
      if (!FUNCTIONS.includes(arg.type)) continue;
      addContext(
        arg.childForFieldName('parameter') ??
          arg.childForFieldName('parameters')?.namedChildren[0],
      );
    }
  }
  for (const decl of descendants(root, ['variable_declarator'])) {
    const pattern = decl.childForFieldName('name');
    const value = decl.childForFieldName('value');
    if (pattern?.type === 'object_pattern' && contexts.has(value?.text ?? '')) {
      contextPatterns.push(pattern);
    }
  }
  const root0 = (text: string) => /^[\w$]+/.exec(text)?.[0] ?? '';

  // `ctx['skip']()`, `it['skip'](…)`, `` ctx[`skip`]() ``.
  for (const sub of descendants(root, ['subscript_expression'])) {
    const prop = stringValue(sub.childForFieldName('index'));
    if (!prop || !SKIP_PROPS.test(decode(prop))) continue;
    const object = decode(sub.childForFieldName('object')?.text ?? '');
    const base = root0(object);
    if (contexts.has(base) || RUNNERS.test(base)) {
      at(sub, `${object}['${decode(prop)}']`);
    }
  }

  // `({ skip: s }) => s()`, `const { skip } = ctx; skip()`, with defaults.
  const called = new Set(
    calls
      .map((c) => c.childForFieldName('function'))
      .filter((f) => f?.type === 'identifier')
      .map((f) => f?.text),
  );
  for (const pattern of contextPatterns) {
    for (const prop of pattern.namedChildren) {
      if (!prop) continue;
      let key = '';
      let local: Node | null = null;
      if (prop.type === 'pair_pattern') {
        const k = prop.childForFieldName('key');
        key = stringValue(k) ?? k?.text ?? '';
        local = prop.childForFieldName('value');
        if (local?.type === 'assignment_pattern') {
          local = local.childForFieldName('left');
        }
      } else if (prop.type === 'shorthand_property_identifier_pattern') {
        key = prop.text;
        local = prop;
      } else if (prop.type === 'object_assignment_pattern') {
        local = prop.childForFieldName('left');
        key = local?.text ?? '';
      }
      if (/^(?:skip|todo)$/.test(key) && local && called.has(local.text)) {
        at(prop, key === local.text ? key : `${key}: ${local.text}`);
      }
    }
  }

  // node:test options: `test('a', { skip: true }, fn)`, or in a variable,
  // set where declared or later (`opts.skip = true`).
  const options = (object: Node) => {
    for (const pair of object.namedChildren) {
      if (pair?.type !== 'pair') continue;
      const key = pair.childForFieldName('key');
      const prop = stringValue(key) ?? key?.text ?? '';
      const value = pair.childForFieldName('value')?.text ?? '';
      if (/^(?:skip|todo|only)$/.test(prop) && !FALSY.test(value)) {
        at(pair, `${prop}: ${value}`);
      }
    }
  };
  const objects = new Map<string, Node>();
  for (const decl of descendants(root, ['variable_declarator'])) {
    const id = decl.childForFieldName('name');
    const value = decl.childForFieldName('value');
    if (id?.type === 'identifier' && value?.type === 'object') {
      objects.set(id.text, value);
    }
  }
  const passed = new Set<string>();
  for (const call of runnerCalls) {
    for (const arg of args(call)) {
      if (arg.type === 'object') options(arg);
      if (arg.type !== 'identifier') continue;
      passed.add(arg.text);
      const object = objects.get(arg.text);
      if (object) options(object);
    }
  }
  for (const assign of descendants(root, ['assignment_expression'])) {
    const left = assign.childForFieldName('left');
    const right = assign.childForFieldName('right')?.text ?? '';
    const object = left?.childForFieldName('object')?.text ?? '';
    const prop =
      left?.type === 'subscript_expression'
        ? stringValue(left.childForFieldName('index'))
        : left?.childForFieldName('property')?.text;
    if (
      passed.has(object) &&
      /^(?:skip|todo|only)$/.test(prop ?? '') &&
      !FALSY.test(right)
    ) {
      at(assign, `${prop}: ${right}`);
    }
  }
  found.push(...subjectMocks(calls, path));
  return found;
}

// A module path without extension or `/index`, `.` and `..` resolved.
function modulePath(path: string): string {
  const out: string[] = [];
  for (const part of path.replace(/\.[cm]?[jt]sx?$/, '').split('/')) {
    if (part === '..') out.pop();
    else if (part !== '.' && part !== '') out.push(part);
  }
  if (out.at(-1) === 'index') out.pop();
  return out.join('/');
}

// The module a test file is named after: `src/foo` for `src/foo.test.ts`,
// `src/__tests__/foo.ts`, and `test/foo.test.ts` when tests mirror `src/`.
function subjectsOf(path: string): string[] {
  const parts = path.split('/');
  const base = parts.pop() ?? '';
  let stem = /^(.+?)[._-](?:test|spec)s?\.[^.]+$/.exec(base)?.[1];
  if (parts.at(-1) === '__tests__') {
    parts.pop();
    stem ??= base.replace(/\..*$/, '');
  }
  if (!stem) return [];
  const subject = modulePath([...parts, stem].join('/'));
  const mirrored = parts.findIndex((p) =>
    /^(?:tests?|spec|__tests__)$/.test(p),
  );
  if (mirrored === -1) return [subject];
  const swap = (by: string[]) =>
    modulePath(
      [
        ...parts.slice(0, mirrored),
        ...by,
        ...parts.slice(mirrored + 1),
        stem,
      ].join('/'),
    );
  return [subject, swap([]), swap(['src'])];
}

const MOCK = /^(?:vi|jest)\.(?:mock|doMock|unstable_mockModule)$/;

// `vi.mock('./foo')` in `foo.test.ts`: the code under test replaced by a
// mock. A factory that gets the real module (`importOriginal`, or through
// a parameter) and options such as `{ spy: true }` keep part of it.
function subjectMocks(calls: Node[], path: string): SkipMatch[] {
  const subjects = subjectsOf(path);
  if (subjects.length === 0) return [];
  const dir = path.split('/').slice(0, -1).join('/');
  return calls.flatMap((call) => {
    if (!MOCK.test(callee(call.childForFieldName('function')))) return [];
    const [arg, factory, ...rest] =
      call.childForFieldName('arguments')?.namedChildren ?? [];
    // Vitest also takes `vi.mock(import('./foo'), …)`.
    const specifier =
      arg?.type === 'call_expression' &&
      arg.childForFieldName('function')?.type === 'import'
        ? arg.childForFieldName('arguments')?.namedChildren[0]
        : arg;
    const module = stringValue(specifier);
    if (!module || rest.length > 0) return [];
    // A relative path resolves from the test; an alias (`@/foo`) has to end
    // the subject's path.
    const relative = /^\.{1,2}(?:\/|$)/.test(module);
    const alias = /^(?:[@~]\/|#)/.test(module)
      ? modulePath(module.replace(/^(?:[@~]\/|#)/, ''))
      : null;
    const target = relative ? modulePath(`${dir}/${module}`) : null;
    const mocked = subjects.some((s) =>
      target !== null
        ? s === target
        : alias !== null &&
          alias !== '' &&
          (s === alias || s.endsWith(`/${alias}`)),
    );
    if (!mocked) return [];
    if (
      factory &&
      (!FUNCTIONS.includes(factory.type) ||
        // `(orig) => …`, or `orig => …` (no `parameters` field).
        (factory.childForFieldName('parameters')?.namedChildren.length ?? 1) >
          0 ||
        /\b(?:importActual|importOriginal|requireActual)\b/.test(factory.text))
    ) {
      return [];
    }
    return [
      {
        line: call.startPosition.row + 1,
        text: `${callee(call.childForFieldName('function'))}('${module}')`,
      },
    ];
  });
}

// Jest/Vitest matchers that `expect.extend` must not replace.
const BUILTIN_MATCHERS =
  'toBe|toEqual|toStrictEqual|toThrow|toThrowError|toHaveLength|toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull|toBeNaN|toContain|toContainEqual|toMatch|toMatchObject|toHaveProperty|toBeCloseTo|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual|toBeInstanceOf|toHaveBeenCalled|toHaveBeenCalledWith|toHaveBeenCalledTimes|toHaveBeenLastCalledWith|toHaveBeenNthCalledWith|toHaveReturned|toHaveReturnedWith|toMatchSnapshot|toMatchInlineSnapshot|toThrowErrorMatchingSnapshot|toThrowErrorMatchingInlineSnapshot';

const SKIPS = [
  // `?.` too: `it?.skip(…)`.
  `(?<![\\w$.])(?:it|test|describe|context|suite|specify)(?:\\??\\.\\w+)*\\??\\.(?:skip|only|todo|skipIf|runIf|fails|failing)\\b`,
  '(?<![\\w$.])(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\\s*\\(',
  // Skipping from inside a test: Mocha `this.skip()`, node:test `t.skip()`,
  // Vitest `ctx.skip()`, also as `ctx?.skip?.()`. node:test options
  // (`{ skip: true }`) are found on the tree.
  '(?<![\\w$.])(?:this|t|ctx|context)\\??\\.(?:skip|todo)\\s*(?:\\?\\.\\s*)?\\(',
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

// Handlers passed by name that drop the error: `.catch(noop)`.
const DROPS = /^(?:console\.\w+|(?:_|lodash)\.noop|noop)$/;

// A `catch` clause or `.catch` callback that doesn't fail the test.
function ignores(handler: Node | null | undefined): boolean {
  if (!handler) return false;
  if (handler.type === 'identifier' || handler.type === 'member_expression') {
    return DROPS.test(callee(handler));
  }
  if (handler.type !== 'catch_clause' && !FUNCTIONS.includes(handler.type)) {
    return false;
  }
  const param =
    handler.childForFieldName('parameter') ??
    handler.childForFieldName('parameters')?.namedChildren[0];
  const caught =
    param?.type === 'required_parameter'
      ? param.childForFieldName('pattern')
      : param;
  return !reportsFailure(
    handler.childForFieldName('body')?.text ?? '',
    HANDLER_FAILS,
    ALWAYS_PASSES,
    caughtIn(handler, caught?.type === 'identifier' ? caught.text : undefined),
  );
}

// A promise chain from `node` on that ends in a `.catch` ignoring the error:
// `check().catch(() => {})`, `expect(p).resolves.toBe(1).catch(noop)`.
function caughtLater(node: Node): boolean {
  for (let c: Node = node; ; ) {
    const p = c.parent;
    if (p?.type === 'member_expression' && has(p, 'object', c)) {
      const call = p.parent;
      if (call?.type === 'call_expression' && has(call, 'function', p)) {
        if (
          p.childForFieldName('property')?.text === 'catch' &&
          ignores(call.childForFieldName('arguments')?.namedChildren[0])
        ) {
          return true;
        }
        c = call;
      } else {
        c = p;
      }
    } else if (p?.type === 'call_expression' && has(p, 'function', c)) {
      c = p;
    } else {
      return false;
    }
  }
}

const has = (node: Node, field: string, child: Node) =>
  node.childForFieldName(field)?.id === child.id;

// An assertion whose failure a promise chain ignores: in a `.then(…)`
// callback, or itself, followed by `.catch(() => {})`.
function insideSwallowingCatch(node: Node): boolean {
  if (caughtLater(node)) return true;
  for (let n: Node | null = node; n?.parent; n = n.parent) {
    const call = n.parent;
    if (n.type !== 'arguments' || call.type !== 'call_expression') continue;
    const fn = call.childForFieldName('function');
    if (
      fn?.childForFieldName('property')?.text === 'then' &&
      caughtLater(call)
    ) {
      return true;
    }
  }
  return false;
}

// `it.each([])(…)`, `describe.each([])(…)`: no cases, nothing runs.
const emptyEach = (fn: Node | null) =>
  fn?.type === 'call_expression' &&
  /\.each$/.test(
    callee(fn.childForFieldName('function')).replace(/\?\./g, '.'),
  ) &&
  callee(fn.childForFieldName('arguments')) === '([])';

const DECLARATIONS = [
  ...FUNCTIONS,
  'function_declaration',
  'method_definition',
];

// The function a node runs in, unless it is a callback, a method, or
// exported.
function helper(node: Node): Helper | null {
  let fn = node.parent;
  while (fn && !DECLARATIONS.includes(fn.type)) fn = fn.parent;
  const named = fn?.type === 'function_declaration' ? fn : fn?.parent;
  const name = named?.childForFieldName('name');
  if (
    (named?.type !== 'function_declaration' &&
      named?.type !== 'variable_declarator') ||
    name?.type !== 'identifier'
  ) {
    return null;
  }
  // `export function`, `export const`.
  const statement =
    named.type === 'function_declaration' ? named : named.parent;
  return statement?.parent?.type === 'export_statement'
    ? null
    : { name, local: true };
}

// `const SKIP = true`, and every other binding of a name, which keeps it
// from being a constant.
function constants(root: Node): Map<string, string> {
  const bindings: [string, string][] = [];
  for (const decl of descendants(root, ['variable_declarator'])) {
    const name = decl.childForFieldName('name');
    if (name?.type !== 'identifier') continue;
    const constant =
      decl.parent?.type === 'lexical_declaration' &&
      decl.parent.child(0)?.text === 'const';
    bindings.push([
      name.text,
      constant ? (decl.childForFieldName('value')?.text ?? '') : '',
    ]);
  }
  for (const id of descendants(root, [
    'assignment_expression',
    'augmented_assignment_expression',
    'update_expression',
  ])) {
    const target =
      id.childForFieldName('left') ?? id.childForFieldName('argument');
    if (target?.type === 'identifier') bindings.push([target.text, '']);
  }
  return literalConstants(bindings);
}

function count(root: Node): Counts {
  const calls = descendants(root, ['call_expression']);
  const named = (re: RegExp) =>
    calls.filter((c) =>
      // `it?.skip(…)` declares a test too.
      re.test(callee(c.childForFieldName('function')).replace(/\?\./g, '.')),
    );
  const dead = deadCode(
    (_, parent) =>
      parent.type === 'call_expression' &&
      emptyEach(parent.childForFieldName('function')),
    constants(root),
  );
  const tests = named(TEST_CALL);
  const deadTests = tests.filter(dead).length;
  return {
    tests: tests.length - deadTests,
    deadTests,
    // `catch` takes every error; it swallows unless it fails the test.
    ...countAssertions(root, named(ASSERT_CALL), {
      dead,
      swallowed: (node) =>
        insideSwallowingCatch(node) ||
        insideSwallowingTry(
          node,
          ['try_statement'],
          (tryNode) => ignores(tryNode.childForFieldName('handler')),
          ignores,
        ),
      helper,
    }),
  };
}

export const js: LanguageSpec = {
  // With strings and comments blanked, a `\u` left is in an identifier:
  // `it.skip` is `it.skip`.
  strip: (source) =>
    stripCLike(source, { templateLiterals: true, textBlocks: false }).replace(
      /\\u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4}))/g,
      (_, braced, plain) =>
        String.fromCodePoint(Number.parseInt(braced ?? plain, 16)),
    ),
  // `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
  assertions: /(?<![\w$.])(?:expect(?:\.soft)?|assert(?:\.\w+)?)\s*\(/g,
  treeSkips,
  count,
  skips: (code) => {
    const patterns = [...SKIPS, ...redefinitions(runnerNames(code))];
    // The test callback's context under any name: `(c) => { c.skip() }`.
    const names = contextNames(code);
    if (names.length > 0) {
      patterns.push(
        `(?<![\\w$.])(?:${names.join('|')})\\??\\.(?:skip|todo)\\s*(?:\\?\\.\\s*)?\\(`,
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
