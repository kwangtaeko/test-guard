// Counting on syntax trees (ROADMAP §12.2 M11): tests, assertions, and
// assertions that can't fail the test: inside a `try` whose handler swallows
// their failure, or in code that never runs. Trees are parsed from
// comment/string-stripped code, so line numbers match the source and Java
// `\uXXXX` escapes are already decoded.
import type { Node } from 'web-tree-sitter';

export interface Counts {
  tests: number;
  assertions: number;
  swallowed: number; // assertions left out of `assertions`
  unreachable: number; // assertions left out of `assertions`
  deadTests: number; // tests left out of `tests`
}

// A handler body fails the test: it rethrows, fails, or checks the error
// with something other than a check that always passes. Keeping the error
// to fail later counts as failing: `errors.push(e)`, or `last = e` where the
// file (`code`) throws or checks `last`.
export function reportsFailure(
  body: string,
  fails: RegExp,
  alwaysPasses: RegExp,
  caught?: { name: string; code: string },
): boolean {
  if (/\.(?:push|append|add|addError)\s*\(/.test(body)) return true;
  const escape = (s: string) => s.replace(/\$/g, '\\$');
  const kept =
    caught &&
    new RegExp(
      `([\\w$]+)\\s*(?<![=!<>])=(?!=)\\s*${escape(caught.name)}(?![\\w$])`,
    ).exec(body)?.[1];
  if (
    caught &&
    kept &&
    new RegExp(
      `(?<![\\w$.])(?:(?:throw|raise)\\s+|(?:expect|assert\\w*)\\s*\\(\\s*|assert\\s+(?:not\\s+)?)${escape(kept)}(?![\\w$])`,
    ).test(caught.code)
  ) {
    return true;
  }
  return fails.test(body.replace(alwaysPasses, ' '));
}

// The caught error's name, with the file's code to look for it in.
export const caughtIn = (handler: Node, name: string | undefined) =>
  name ? { name, code: handler.tree.rootNode.text } : undefined;

export function descendants(node: Node, types: string[]): Node[] {
  return node.descendantsOfType(types).filter((n): n is Node => n !== null);
}

// The code a call runs, without whitespace: `it.skip`, `self.assertEqual`.
export const callee = (node: Node | null) =>
  (node?.text ?? '').replace(/\s+/g, '');

// Whether `node` runs inside the body of a `try` that `swallows` decides
// swallows failures (given the `try` node), or inside a handler clause that
// `ignores` (whose checks then always pass: `catch (e) { expect(e)… }`).
export function insideSwallowingTry(
  node: Node,
  tries: string[],
  swallows: (tryNode: Node) => boolean,
  ignores: (clause: Node) => boolean = () => false,
): boolean {
  for (let n: Node | null = node; n?.parent; n = n.parent) {
    const parent = n.parent;
    if (!tries.includes(parent.type)) continue;
    if (parent.childForFieldName('body')?.id === n.id) {
      if (swallows(parent)) return true;
    } else if (ignores(n)) {
      return true;
    }
  }
  return false;
}

// Literals a condition can be: `false`, `None`, `0`.
const FALSY = /^(?:false|False|0|null|None|undefined)$/;
const TRUTHY = /^(?:true|True|1)$/;
export const LITERAL = /^(?:false|False|0|null|None|undefined|true|True|1)$/;

// Names bound once in the file to a literal (`const SKIP = true`), from
// every binding of each name (`[name, value]`).
export function literalConstants(
  bindings: [string, string][],
): Map<string, string> {
  const count = new Map<string, number>();
  for (const [name] of bindings) count.set(name, (count.get(name) ?? 0) + 1);
  return new Map(
    bindings.filter(
      ([name, value]) => count.get(name) === 1 && LITERAL.test(value),
    ),
  );
}

// The value of a constant condition, or null: `false`, `(!ENABLED)`,
// `not True`.
function truth(text: string, constants: Map<string, string>): boolean | null {
  let t = text.trim();
  while (/^\(.*\)$/s.test(t)) t = t.slice(1, -1).trim();
  const not = /^(?:!|not\s)\s*([\s\S]+)$/.exec(t);
  if (not) {
    const inner = truth(not[1] ?? '', constants);
    return inner === null ? null : !inner;
  }
  t = constants.get(t) ?? t;
  if (FALSY.test(t)) return false;
  if (TRUTHY.test(t)) return true;
  return null;
}

const EMPTY = /^(?:\[\]|\(\))$/;
// Statement lists: JS, Python and Java blocks, files.
const BLOCKS = ['program', 'statement_block', 'module', 'block'];
// Declared before the code runs, wherever they are written.
const HOISTED = ['function_declaration', 'generator_function_declaration'];

const has = (field: Node | null, node: Node) => field?.id === node.id;

// Code that never runs: under `if (false)` or the `else` of `if (true)`,
// after a `return` or `if (true) return`, in a loop over an empty literal,
// or where `never` (given a node and its parent) says so for the language.
// `constants` are names bound once to a literal (`const SKIP = true`).
export function deadCode(
  never: (node: Node, parent: Node) => boolean = () => false,
  constants: Map<string, string> = new Map(),
): (node: Node) => boolean {
  const value = (node: Node) =>
    truth(node.childForFieldName('condition')?.text ?? '', constants);
  const returns = (node: Node | null): boolean => {
    if (node?.type === 'return_statement') return true;
    if (node?.type !== 'if_statement' || value(node) !== true) return false;
    const then = node.childForFieldName('consequence');
    return (
      returns(then) ||
      (then?.namedChildren.some((c) => c?.type === 'return_statement') ?? false)
    );
  };
  // End of each block's first `return`, once per block.
  const cut = new Map<number, number>();
  const returnAt = (block: Node) => {
    let at = cut.get(block.id);
    if (at === undefined) {
      at =
        block.namedChildren.find(returns)?.endIndex ?? Number.POSITIVE_INFINITY;
      cut.set(block.id, at);
    }
    return at;
  };
  return (node) => {
    for (let n: Node | null = node; n?.parent; n = n.parent) {
      const p = n.parent;
      if (
        ((p.type === 'if_statement' || p.type === 'elif_clause') &&
          has(p.childForFieldName('consequence'), n) &&
          value(p) === false) ||
        (p.type === 'if_statement' &&
          p.childrenForFieldName('alternative').some((a) => a && has(a, n)) &&
          value(p) === true) ||
        (p.type === 'while_statement' &&
          has(p.childForFieldName('body'), n) &&
          value(p) === false) ||
        ((p.type === 'for_in_statement' || p.type === 'for_statement') &&
          has(p.childForFieldName('body'), n) &&
          EMPTY.test(callee(p.childForFieldName('right')))) ||
        (BLOCKS.includes(p.type) &&
          !HOISTED.includes(n.type) &&
          n.startIndex >= returnAt(p)) ||
        never(n, p)
      ) {
        return true;
      }
    }
    return false;
  };
}

const CALLS = ['call_expression', 'call', 'method_invocation'];

// The call that `name` is the callee of: `helper()`, `self.helper()`,
// `this.helper()`.
function callOf(name: Node): Node | null {
  const p = name.parent;
  if (!p) return null;
  if (
    CALLS.includes(p.type) &&
    (has(p.childForFieldName('function'), name) ||
      has(p.childForFieldName('name'), name))
  ) {
    return p;
  }
  const g = p.parent;
  if (
    g &&
    CALLS.includes(g.type) &&
    has(g.childForFieldName('function'), p) &&
    (has(p.childForFieldName('property'), name) ||
      has(p.childForFieldName('attribute'), name))
  ) {
    return g;
  }
  return null;
}

export interface Helper {
  name: Node;
  // Only this file can call it, so a helper nothing calls never runs.
  local: boolean;
}

export interface Reach {
  dead: (node: Node) => boolean;
  swallowed: (node: Node) => boolean;
  // The helper function a node runs in, or null when the node runs in a
  // test, a callback, or code the runner calls.
  helper: (node: Node) => Helper | null;
}

// Assertions that can fail the test. One inside a helper counts as the
// helper's calls do: a helper only called inside a swallowing `try`, only
// from code that never runs, or (when local) never called checks nothing.
export function countAssertions(
  root: Node,
  assertions: Node[],
  { dead, swallowed, helper }: Reach,
): Pick<Counts, 'assertions' | 'swallowed' | 'unreachable'> {
  let names: Map<string, Node[]> | undefined;
  const uses = (name: Node) => {
    if (!names) {
      names = new Map();
      for (const id of descendants(root, [
        'identifier',
        'property_identifier',
        'shorthand_property_identifier',
      ])) {
        const same = names.get(id.text) ?? [];
        same.push(id);
        names.set(id.text, same);
      }
    }
    return (names.get(name.text) ?? []).filter((u) => u.id !== name.id);
  };
  const lost = (node: Node) =>
    dead(node) ? 'dead' : swallowed(node) ? 'swallowed' : null;
  const counts = { assertions: 0, swallowed: 0, unreachable: 0 };
  for (const assertion of assertions) {
    let reason = lost(assertion);
    const found = reason ? null : helper(assertion);
    if (found) {
      // Every use is a call that can't fail the test.
      const reasons = uses(found.name).map((use) => {
        const call = callOf(use);
        return call && lost(call);
      });
      if (reasons.length === 0) {
        if (found.local) reason = 'dead';
      } else if (reasons.every((r) => r)) {
        reason = reasons.every((r) => r === 'dead') ? 'dead' : 'swallowed';
      }
    }
    if (reason === 'dead') counts.unreachable++;
    else if (reason === 'swallowed') counts.swallowed++;
    else counts.assertions++;
  }
  return counts;
}
