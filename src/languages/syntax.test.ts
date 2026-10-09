import { describe, expect, it } from 'vitest';
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
