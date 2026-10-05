import { describe, expect, it } from 'vitest';
import { compareFiles, type FileChange } from '../engine/compare.js';
import { createTestFileMatcher } from '../paths.js';
import { RULE_IDS } from './index.js';

const detect = createTestFileMatcher();

function check(change: FileChange) {
  return compareFiles(change, detect, RULE_IDS).map(
    ({ ruleId, line, message }) => ({ ruleId, line, message }),
  );
}

const file = (path: string, ...lines: string[]) => ({
  path,
  content: `${lines.join('\n')}\n`,
});

const JS_BEFORE = [
  "it('adds', () => {",
  '  expect(add(1, 2)).toBe(3);',
  '  expect(add(2, 2)).toBe(4);',
  '});',
  "it('subtracts', () => {",
  '  expect(sub(3, 1)).toBe(2);',
  '});',
];

describe('non-test files', () => {
  it('are ignored', () => {
    expect(
      check({ before: file('src/a.ts', 'x'), after: file('src/a.ts', 'y') }),
    ).toEqual([]);
  });
});

describe('TG001', () => {
  it('reports a deleted test file', () => {
    expect(
      check({ before: file('a.test.js', ...JS_BEFORE), after: null }),
    ).toMatchInlineSnapshot(`
      [
        {
          "line": undefined,
          "message": "deleted test file",
          "ruleId": "TG001",
        },
      ]
    `);
  });

  it('reports a move to a non-test path', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('backup/a.js', ...JS_BEFORE),
      }),
    ).toEqual([
      {
        ruleId: 'TG001',
        line: undefined,
        message: 'moved test file to non-test path backup/a.js',
      },
    ]);
  });

  it('accepts a rename between test paths', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('test/a.spec.js', ...JS_BEFORE),
      }),
    ).toEqual([]);
  });
});

describe('TG002 / TG003', () => {
  it('reports fewer tests and assertions', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE.slice(0, 4)),
      }).map((f) => f.message),
    ).toEqual(['test cases 2 → 1', 'assertions 3 → 2']);
  });

  it('reports fewer assertions only', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE.filter((_, i) => i !== 2)),
      }).map((f) => f.ruleId),
    ).toEqual(['TG003']);
  });

  it('accepts more tests', () => {
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...JS_BEFORE, ...JS_BEFORE),
      }),
    ).toEqual([]);
  });
});

describe('TG004', () => {
  it('reports an added skip on its line', () => {
    const after = [...JS_BEFORE];
    after[4] = "it.skip('subtracts', () => {";
    expect(
      check({
        before: file('a.test.js', ...JS_BEFORE),
        after: file('a.test.js', ...after),
      }),
    ).toEqual([{ ruleId: 'TG004', line: 5, message: 'added `it.skip`' }]);
  });

  it('reports skips in a new test file', () => {
    expect(
      check({
        before: null,
        after: file(
          't/test_a.py',
          '@pytest.mark.skip',
          'def test_a():',
          '    assert f() == 1',
        ),
      }),
    ).toEqual([
      { ruleId: 'TG004', line: 1, message: 'added `pytest.mark.skip`' },
    ]);
  });

  it('accepts moving an existing skip', () => {
    const before = ["it.skip('a', () => {});", "it('b', () => {});"];
    const after = ["it('b', () => {});", "it.skip('a', () => {});"];
    expect(
      check({
        before: file('a.test.js', ...before),
        after: file('a.test.js', ...after),
      }),
    ).toEqual([]);
  });
});

describe('TG007', () => {
  function swap(path: string, from: string, to: string) {
    return check({ before: file(path, from), after: file(path, to) });
  }

  it.each([
    [
      'a.test.js',
      'it("x", () => { expect(f()).toBe(3); });',
      'it("x", () => { expect(f()).toBeDefined(); });',
      'weakened assertion `toBe` → `toBeDefined`',
    ],
    [
      'a.test.js',
      'it("x", () => { expect(f()).toEqual([1]); });',
      'it("x", () => { expect(f()).not.toBeNull(); });',
      'weakened assertion `toEqual` → `not.toBeNull`',
    ],
    [
      'a.test.js',
      'it("x", () => { expect(f).toThrow(RangeError); });',
      'it("x", () => { expect(f).toThrow(); });',
      'weakened assertion `toThrow(X)` → `toThrow()`',
    ],
    [
      'test_a.py',
      '        self.assertEqual(f(), 3)',
      '        self.assertTrue(f())',
      'weakened assertion `self.assertEqual` → `self.assertTrue`',
    ],
    [
      'test_a.py',
      '    assert f() == 3',
      '    assert f()',
      'weakened assertion `assert x == y` → `assert x`',
    ],
    [
      'test_a.py',
      '    with pytest.raises(ValueError):',
      '    with pytest.raises(Exception):',
      'weakened assertion `pytest.raises(SpecificError)` → `pytest.raises(Exception)`',
    ],
    [
      'src/test/java/ATest.java',
      '        assertEquals(3, f());',
      '        assertNotNull(f());',
      'weakened assertion `assertEquals` → `assertNotNull`',
    ],
    [
      'src/test/java/ATest.java',
      '        assertThrows(ArithmeticException.class, () -> f());',
      '        assertThrows(Exception.class, () -> f());',
      'weakened assertion `assertThrows(SpecificException.class)` → `assertThrows(Exception.class)`',
    ],
  ])('%s: %s → %s', (path, from, to, message) => {
    expect(swap(path, from, to)).toEqual([
      { ruleId: 'TG007', line: 1, message },
    ]);
  });

  it.each([
    ['a.test.js', 'expect(true).toBe(true);', 'expect(true).toBe(true)'],
    ['a.test.js', 'assert.ok(true);', 'assert.ok(true)'],
    ['test_a.py', '    assert True', 'assert True'],
    ['test_a.py', '        self.assertTrue(True)', 'self.assertTrue(True)'],
    ['src/test/java/ATest.java', '  assertTrue(true);', 'assertTrue(true)'],
  ])('%s: reports meaningless %s', (path, line, text) => {
    expect(
      check({ before: file(path, '//'), after: file(path, line) }),
    ).toEqual([
      {
        ruleId: 'TG007',
        line: 1,
        message: `added meaningless assertion \`${text}\``,
      },
    ]);
  });

  it.each([
    [
      'a.test.js',
      'it("x", () => { expect(f()).toBe(3); });',
      'it("x", () => { expect(f()).toBe(4); });',
    ],
    ['test_a.py', '    assert f() == 3', '    assert f() == 4'],
    [
      'src/test/java/ATest.java',
      '        assertEquals(3, f());',
      '        assertEquals(4, f());',
    ],
    ['a.test.js', '// expect(f()).toBe(3);', '// expect(f()).toBeDefined();'],
  ])('%s: accepts %s → %s', (path, from, to) => {
    expect(swap(path, from, to)).toEqual([]);
  });

  it('pairs strong lines with strong replacements first', () => {
    expect(
      check({
        before: file('a.test.js', 'expect(f()).toBe(3);'),
        after: file(
          'a.test.js',
          'expect(f()).toBeDefined();',
          'expect(f()).toBe(4);',
        ),
      }),
    ).toEqual([]);
  });
});
