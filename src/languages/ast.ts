// Counting on syntax trees (ROADMAP §12.2 M11): tests, assertions, and
// assertions inside a `try` whose handler swallows their failure. Trees are
// parsed from comment/string-stripped code, so line numbers match the source
// and Java `\uXXXX` escapes are already decoded.
import type { Node } from 'web-tree-sitter';

export interface Counts {
  tests: number;
  assertions: number;
  swallowed: number; // assertions left out of `assertions`
}

// A handler body fails the test: it rethrows, fails, or checks the error
// with something other than a check that always passes. Collecting the error
// (`errors.push(e)`) for a later assertion counts as failing.
export function reportsFailure(
  body: string,
  fails: RegExp,
  alwaysPasses: RegExp,
): boolean {
  if (/\.(?:push|append|add|addError)\s*\(/.test(body)) return true;
  return fails.test(body.replace(alwaysPasses, ' '));
}

export function descendants(node: Node, types: string[]): Node[] {
  return node.descendantsOfType(types).filter((n): n is Node => n !== null);
}

// The code a call runs, without whitespace: `it.skip`, `self.assertEqual`.
export const callee = (node: Node | null) =>
  (node?.text ?? '').replace(/\s+/g, '');

// Whether `node` runs inside the body of a `try` that `swallows` decides
// swallows failures (given the `try` node).
export function insideSwallowingTry(
  node: Node,
  tries: string[],
  swallows: (tryNode: Node) => boolean,
): boolean {
  for (let n: Node | null = node; n?.parent; n = n.parent) {
    const parent = n.parent;
    if (
      tries.includes(parent.type) &&
      parent.childForFieldName('body')?.id === n.id &&
      swallows(parent)
    ) {
      return true;
    }
  }
  return false;
}

export function countAssertions(
  assertions: Node[],
  swallowed: (node: Node) => boolean,
): Pick<Counts, 'assertions' | 'swallowed'> {
  const lost = assertions.filter(swallowed).length;
  return { assertions: assertions.length - lost, swallowed: lost };
}
