import type { Node } from 'web-tree-sitter';
import {
  type Counts,
  callee,
  countAssertions,
  descendants,
  insideSwallowingTry,
  reportsFailure,
} from './ast.js';
import type { LanguageSpec } from './index.js';
import { stripJava } from './strip.js';

// JUnit assertion methods; a test file that declares one has replaced the
// real check.
const ASSERT_METHODS =
  'assertEquals|assertNotEquals|assertTrue|assertFalse|assertNull|assertNotNull|assertSame|assertNotSame|assertThrows|assertThrowsExactly|assertArrayEquals|assertThat|assertAll|assertDoesNotThrow|assertIterableEquals|assertLinesMatch|assertTimeout|assertTimeoutPreemptively|assertInstanceOf|fail';
const TEST_ANNOTATIONS =
  'Test|ParameterizedTest|RepeatedTest|TestFactory|TestTemplate';
// `junit.framework` is JUnit 3.
const TRUSTED_PACKAGES = 'org\\.junit\\.|org\\.testng\\.|junit\\.';
const ASSERTION_LIBRARIES =
  'org\\.hamcrest\\.|org\\.assertj\\.|com\\.google\\.common\\.truth\\.|org\\.springframework\\.';

const TYPES = [
  'class_declaration',
  'interface_declaration',
  'enum_declaration',
  'record_declaration',
  'annotation_type_declaration',
];
// Annotations may be fully qualified (`@org.junit.Test`).
const TEST_NAME = new RegExp(`^(?:[\\w$]+\\.)*(?:${TEST_ANNOTATIONS})$`);

const modifiersOf = (node: Node | null) =>
  node?.namedChildren.find((c) => c?.type === 'modifiers')?.text ?? '';

// Tests in an inner class run only when it is `@Nested` (JUnit 5) or static
// (JUnit 4 `Enclosed`); an inner class that lost `@Nested` runs nothing.
// JUnit skips `private` and `static` test methods, JUnit 5 a `@Test` that
// returns a value, JUnit 4 anything not `public`, and an `abstract` class
// runs only through subclasses.
function runs(node: Node, junit4: boolean): boolean {
  const method = node.parent?.parent;
  if (method?.type === 'method_declaration') {
    const modifiers = modifiersOf(method);
    if (/\b(?:private|static)\b/.test(modifiers)) return false;
    if (junit4 && !/\bpublic\b/.test(modifiers)) return false;
    const factory = /\b(?:TestFactory|TestTemplate)$/.test(
      callee(node.childForFieldName('name')),
    );
    if (
      !junit4 &&
      !factory &&
      method.childForFieldName('type')?.type !== 'void_type'
    ) {
      return false;
    }
  }
  const types: Node[] = [];
  for (let n = node.parent; n; n = n.parent) {
    if (TYPES.includes(n.type)) types.push(n);
  }
  if (types.some((t) => /\babstract\b/.test(modifiersOf(t)))) return false;
  // Every enclosing class but the outermost needs `@Nested` or `static`.
  return types.slice(0, -1).every((type) => {
    if (type.type !== 'class_declaration') return true;
    return /@(?:[\w$]+\.)*Nested\b|\bstatic\b/.test(modifiersOf(type));
  });
}

// `catch (Exception e)` lets an AssertionError through;
// `Throwable`/`Error`/`AssertionError` without a rethrow doesn't.
const CATCHES_ASSERTIONS =
  /\b(?:Throwable|Error|AssertionError|AssertionFailedError|ComparisonFailure)\b/;
const HANDLER_FAILS = /(?<![\w$])(?:throw\b|fail\s*\(|assert\w*\s*\()/;
const ALWAYS_PASSES =
  /(?<![\w$])assert(?:True\s*\(\s*true|NotNull\s*\(\s*[\w$]+)\s*\)/g;

const swallows = (tryNode: Node) =>
  tryNode.namedChildren.some(
    (clause) =>
      clause?.type === 'catch_clause' &&
      CATCHES_ASSERTIONS.test(
        clause.namedChildren.find((c) => c?.type === 'catch_formal_parameter')
          ?.text ?? '',
      ) &&
      !reportsFailure(
        clause.childForFieldName('body')?.text ?? '',
        HANDLER_FAILS,
        ALWAYS_PASSES,
      ),
  );

function count(root: Node): Counts {
  // JUnit 4's `@Test` (and no JUnit 5): test methods must be public.
  const imports = descendants(root, ['import_declaration']).map((i) => i.text);
  const junit4 =
    imports.some((i) => /\borg\.junit\.(?:Test|\*)\s*;/.test(i)) &&
    !imports.some((i) => /\borg\.junit\.jupiter\./.test(i));
  const tests = descendants(root, ['marker_annotation', 'annotation']).filter(
    (a) =>
      TEST_NAME.test(callee(a.childForFieldName('name'))) && runs(a, junit4),
  ).length;
  const assertions = [
    ...descendants(root, ['method_invocation']).filter((m) =>
      /^(?:assert\w*|fail)$/.test(m.childForFieldName('name')?.text ?? ''),
    ),
    // `assert (x)` reads like a call.
    ...descendants(root, ['assert_statement']).filter((s) =>
      /^assert\s*\(/.test(s.text),
    ),
  ];
  return {
    tests,
    ...countAssertions(assertions, (node) =>
      insideSwallowingTry(
        node,
        ['try_statement', 'try_with_resources_statement'],
        swallows,
      ),
    ),
  };
}

export const java: LanguageSpec = {
  strip: stripJava,
  // A leading `.` is allowed: `Assertions.assertEquals(`.
  assertions: /(?<![\w$])(?:assert\w*|fail)\s*\(/g,
  count,
  skips: new RegExp(
    [
      '@(?:[\\w$]+\\.)*(?:Disabled\\w*|Enabled\\w*|Ignore)\\b',
      '(?<![\\w$])assume\\w*\\s*\\(',
      '(?:\\bAssumptions\\.|(?<![\\w$.]))abort\\s*\\(',
      // TestNG `@Test(enabled = false)`.
      `(?<=@(?:[\\w$]+\\.)*Test\\s*\\([^)]*)\\benabled\\s*=\\s*false\\b`,
      // A test annotation or assertion that is not JUnit's or TestNG's.
      `\\bimport\\s+(?!static\\b)(?!${TRUSTED_PACKAGES})[\\w$.]+\\.(?:${TEST_ANNOTATIONS}|Nested)(?=\\s*;)`,
      `\\bimport\\s+static\\s+(?!${TRUSTED_PACKAGES}|${ASSERTION_LIBRARIES})[\\w$.]+\\.(?:${ASSERT_METHODS})(?=\\s*;)`,
      `@interface\\s+(?:${TEST_ANNOTATIONS}|Nested)\\b`,
      // A custom AssertJ `XAssert assertThat(X actual)` factory is routine.
      `(?<![\\w$.])(?:void\\s+assertThat|(?:void|boolean|[\\w$<>\\[\\]]+)\\s+(?!assertThat\\b)(?:${ASSERT_METHODS}))(?=\\s*\\([^)]*\\)\\s*(?:throws\\s[^{;]*)?\\{)`,
    ].join('|'),
    'g',
  ),
};
