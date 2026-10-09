import { describe, expect, it } from 'vitest';
import { analyzeSource } from './index.js';
import { parse } from './syntax.js';

describe('syntax', () => {
  it.each([
    ['js', "it('a', () => { c['skip'](); });", 'call_expression'],
    ['js', 'const x: number = f<T>(<A />);', 'lexical_declaration'],
    ['python', 'def test_a():\n    assert f() == 1\n', 'function_definition'],
    [
      'java',
      'class A { @Test void a() { assertEquals(1, f()); } }',
      'class_declaration',
    ],
  ] as const)('parses %s', (language, source, type) => {
    const root = parse(language, source).rootNode;
    expect(root.hasError).toBe(false);
    expect(root.descendantsOfType(type).length).toBeGreaterThan(0);
  });
});

describe('counting on the syntax tree', () => {
  it('counts calls to Java assertion helpers, not their declarations', () => {
    const source = [
      'class ATest {',
      '  @Test void a() { assertEqualsDate(d, 2020); assertEquals(1, f()); }',
      '  static void assertEqualsDate(Date d, int y) { assertEquals(y, d.getYear()); }',
      '}',
    ].join('\n');
    expect(
      analyzeSource('src/test/java/ATest.java', source, 'java').stats,
    ).toMatchObject({
      tests: 1,
      assertions: 3,
    });
  });

  it('ignores runner and assertion names in strings and comments', () => {
    const source =
      "// it('x')\nconst s = \"expect(a).toBe(1)\";\nit('a', () => { expect(f()).toBe(1); });\n";
    expect(analyzeSource('a.test.js', source, 'js').stats).toMatchObject({
      tests: 1,
      assertions: 1,
    });
  });
});
