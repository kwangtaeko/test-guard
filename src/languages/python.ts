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
import type { LanguageSpec } from './index.js';
import { stripPython } from './strip.js';

// unittest assertion methods; a test file that defines or assigns one has
// replaced the real check.
const ASSERT_METHODS =
  'assert(?:Equals?|NotEquals?|True|False|IsNot|IsNotNone|IsNone|Is|In|NotIn|IsInstance|NotIsInstance|Raises(?:Regex)?|Warns(?:Regex)?|(?:Not)?AlmostEquals?|Greater(?:Equal)?|Less(?:Equal)?|(?:Not)?Regex|CountEqual|MultiLineEqual|SequenceEqual|ListEqual|TupleEqual|SetEqual|DictEqual|Logs)';

const SKIPS = [
  /(?<![\w.])pytest\.(?:skip|xfail)\s*\(/,
  // Kept under another name (`sk = pytest.skip`), or raised directly.
  /^[ \t]*\w+[ \t]*=[ \t]*(?:pytest\.)?(?:skip|xfail)[ \t]*$/,
  /(?<![\w.])pytest\.skip\.Exception\b/,
  /(?<![\w.])(?:\w+\.)*mark\.(?:skip|skipif|xfail)\b/,
  /(?<![\w.])unittest\.skip\w*/,
  // Decorators under any import alias: `@skip`, `@mark.skipif`, `@ut.skipIf`.
  /(?<=@[ \t]*)(?:\w+\.)*(?:skip|skipIf|skipUnless|skipif|xfail)\b/,
  /(?<![\w.])self\.skipTest\s*\(/,
  /(?<![\w.])pytest\.importorskip\s*\(/,
  /\bSkipTest\b/,
  /\bexpectedFailure\b/,
  // `__test__ = False` stops pytest and nose collecting a module or class.
  /\b__test__[ \t]*=[ \t]*(?!True\b)\w+/,
  new RegExp(`^[ \\t]*(?:async[ \\t]+)?def[ \\t]+${ASSERT_METHODS}\\b`),
  new RegExp(
    `(?<![\\w.])(?:self|cls|(?:\\w+\\.)*\\w*TestCase)\\.${ASSERT_METHODS}[ \\t]*=(?!=)`,
  ),
].map((re) => re.source);

// Names bound by `import pytest as pt` or `from unittest import skip as s`.
function importedSkips(code: string): string[] {
  const patterns: string[] = [];
  for (const m of code.matchAll(
    /^[ \t]*import[ \t]+(pytest|unittest)[ \t]+as[ \t]+(\w+)/gm,
  )) {
    const alias = m[2] ?? '';
    patterns.push(
      m[1] === 'pytest'
        ? `(?<![\\w.])${alias}\\.(?:skip|xfail|importorskip)\\s*\\(`
        : `(?<![\\w.])${alias}\\.skip\\w*`,
    );
  }
  for (const m of code.matchAll(
    /^[ \t]*from[ \t]+(pytest|unittest(?:\.case)?)[ \t]+import[ \t]+(\([^)]*\)|[^\n]*)/gm,
  )) {
    // `from pytest import *` brings `skip`, `xfail` and `importorskip` in.
    if ((m[2] ?? '').trim() === '*') {
      patterns.push(
        m[1] === 'pytest'
          ? '(?<![\\w.])(?<!def\\s+)(?:skip|xfail|importorskip)\\b(?=\\s*\\()'
          : '(?<![\\w.])(?<!def\\s+)(?:skip|skipIf|skipUnless)\\b(?=\\s*\\()',
      );
      continue;
    }
    for (const item of (m[2] ?? '').replace(/[()]/g, '').split(',')) {
      const [name, alias = name] = item.trim().split(/\s+as\s+/);
      if (!name || !alias || !/^\w+$/.test(alias)) continue;
      if (name === 'mark') {
        patterns.push(`(?<![\\w.])${alias}\\.(?:skip|skipif|xfail)\\b`);
      } else if (
        /^(?:skip|skipIf|skipUnless|xfail|importorskip)$/.test(name) &&
        alias !== name
      ) {
        patterns.push(`(?<![\\w.])${alias}\\b(?=\\s*\\()`);
      } else if (/^(?:skip|xfail|importorskip)$/.test(name)) {
        // `from pytest import skip` then `skip("why")`.
        patterns.push(`(?<![\\w.])${name}\\b(?=\\s*\\()`);
      } else if (/^(?:SkipTest|expectedFailure)$/.test(name)) {
        patterns.push(`(?<![\\w.])${alias}\\b`);
      }
    }
  }
  return patterns;
}

// pytest collects `test*` functions at module level and `test*` methods of
// `Test*` classes; unittest collects methods of TestCase subclasses. A
// function defined again under the same name replaces the earlier one.
function countTests(
  root: Node,
  dead: (node: Node) => boolean,
): Pick<Counts, 'tests' | 'deadTests'> {
  const tests = new Set<string>();
  const deadTests = new Set<string>();
  const visit = (node: Node, path: string[], collected: boolean) => {
    for (const child of node.namedChildren) {
      if (!child) continue;
      const def =
        child.type === 'decorated_definition'
          ? child.childForFieldName('definition')
          : child;
      const name = def?.childForFieldName('name')?.text ?? '';
      if (def?.type === 'function_definition') {
        if (collected && name.startsWith('test')) {
          (dead(def) ? deadTests : tests).add([...path, name].join('.'));
        }
        continue; // nested functions are never collected
      }
      const body = def?.childForFieldName('body');
      if (def?.type === 'class_definition' && body) {
        // Any base named like a test class may be a TestCase subclass.
        const bases = def.childForFieldName('superclasses')?.text ?? '';
        visit(
          body,
          [...path, name],
          collected && (name.startsWith('Test') || /Test/.test(bases)),
        );
        continue;
      }
      visit(child, path, collected);
    }
  };
  visit(root, [], true);
  for (const name of tests) deadTests.delete(name);
  return { tests: tests.size, deadTests: deadTests.size };
}

// `@pytest.mark.parametrize("x", [])`: no cases, nothing runs.
function emptyParametrize(decorated: Node): boolean {
  return decorated.namedChildren.some((decorator) => {
    const call =
      decorator?.type === 'decorator' ? decorator.namedChildren[0] : null;
    if (
      call?.type !== 'call' ||
      !/(?:^|\.)parametrize$/.test(callee(call.childForFieldName('function')))
    ) {
      return false;
    }
    const args = call.childForFieldName('arguments')?.namedChildren ?? [];
    const values =
      args
        .find(
          (a) =>
            a?.type === 'keyword_argument' &&
            a.childForFieldName('name')?.text === 'argvalues',
        )
        ?.childForFieldName('value') ?? args[1];
    return /^(?:\[\]|\(\))$/.test(callee(values ?? null));
  });
}

const enclosing = (node: Node) => {
  let fn = node.parent;
  while (fn && fn.type !== 'function_definition' && fn.type !== 'lambda') {
    fn = fn.parent;
  }
  return fn;
};

// The function a node runs in, unless it is a test or a lambda. Only a
// function nested in another one is out of reach of other files and of
// the runner (fixtures, `setUp`).
function helper(node: Node): Helper | null {
  const fn = enclosing(node);
  const name =
    fn?.type === 'function_definition' ? fn.childForFieldName('name') : null;
  if (!fn || !name || name.text.startsWith('test')) return null;
  return {
    name,
    local:
      fn.parent?.type !== 'decorated_definition' &&
      enclosing(fn)?.type === 'function_definition',
  };
}

// `SKIP = True`, and every other binding of a name.
function constants(root: Node): Map<string, string> {
  const bindings: [string, string][] = [];
  for (const node of descendants(root, [
    'assignment',
    'augmented_assignment',
    'parameters',
    'for_statement',
  ])) {
    if (node.type === 'parameters') {
      for (const id of descendants(node, ['identifier'])) {
        bindings.push([id.text, '']);
      }
      continue;
    }
    const left = node.childForFieldName('left');
    if (left?.type !== 'identifier') continue;
    bindings.push([
      left.text,
      node.type === 'assignment'
        ? (node.childForFieldName('right')?.text ?? '')
        : '',
    ]);
  }
  return literalConstants(bindings);
}

// Exception types that catch an assertion's failure.
const CATCHES_ASSERTIONS = /\b(?:BaseException|Exception|AssertionError)\b/;
const HANDLER_FAILS =
  /(?<![\w.])(?:raise|assert)\b|\bfail\s*\(|\.fail\w*\s*\(|\.assert\w*\s*\(/;
const ALWAYS_PASSES =
  /(?<![\w.])assert\s+(?:True|\w+)\s*$|\bself\.assert(?:True\s*\(\s*True|IsNotNone\s*\(\s*\w+)\s*\)/gm;

// A bare `except`, `Exception`, `BaseException` or `AssertionError` that
// doesn't raise or fail, or `with suppress(…)` of one of them.
function swallows(node: Node): boolean {
  if (node.type === 'with_statement') {
    return descendants(node, ['with_item']).some((item) => {
      const call = item.childForFieldName('value');
      const args = call?.childForFieldName('arguments')?.text ?? '';
      return (
        call?.type === 'call' &&
        /^(?:contextlib\.)?suppress$/.test(
          callee(call.childForFieldName('function')),
        ) &&
        CATCHES_ASSERTIONS.test(args)
      );
    });
  }
  return node.namedChildren.some((clause) => clause && ignores(clause));
}

// An `except` clause that catches assertion failures and drops them.
function ignores(clause: Node): boolean {
  if (clause.type !== 'except_clause') return false;
  const [, types = '', body = ''] =
    /^except\*?([^:]*):([\s\S]*)$/.exec(clause.text) ?? [];
  return (
    (types.trim() === '' || CATCHES_ASSERTIONS.test(types)) &&
    !reportsFailure(
      body,
      HANDLER_FAILS,
      ALWAYS_PASSES,
      caughtIn(clause, /\bas\s+(\w+)\s*$/.exec(types)?.[1]),
    )
  );
}

const ASSERT_CALL = /^(?:self\.assert\w*|pytest\.raises)$/;

function count(root: Node): Counts {
  const assertions = [
    ...descendants(root, ['assert_statement']),
    ...descendants(root, ['call']).filter((c) =>
      ASSERT_CALL.test(callee(c.childForFieldName('function'))),
    ),
  ];
  const dead = deadCode(
    (node, parent) =>
      parent.type === 'decorated_definition' &&
      parent.childForFieldName('definition')?.id === node.id &&
      emptyParametrize(parent),
    constants(root),
  );
  return {
    ...countTests(root, dead),
    ...countAssertions(root, assertions, {
      dead,
      swallowed: (node) =>
        insideSwallowingTry(
          node,
          ['try_statement', 'with_statement'],
          swallows,
          ignores,
        ),
      helper,
    }),
  };
}

export const python: LanguageSpec = {
  strip: stripPython,
  assertions:
    /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g,
  count,
  skips: (code) =>
    new RegExp([...SKIPS, ...importedSkips(code)].join('|'), 'gm'),
};
