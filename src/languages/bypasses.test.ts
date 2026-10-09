// Known bypasses of the pattern-based checks (docs/IDEAS.md), closed on the
// syntax tree in M11b, each with look-alikes that must stay quiet.
import { describe, expect, it } from 'vitest';
import { createTestFileMatcher } from '../paths.js';
import { analyzeSource } from './index.js';

const detect = createTestFileMatcher();
function analyze(path: string, source: string) {
  const language = detect(path);
  if (!language) throw new Error(`not a test file: ${path}`);
  return analyzeSource(path, source, language);
}
const skips = (path: string, source: string) =>
  analyze(path, source).skips.map((s) => s.text);
const tests = (path: string, source: string) =>
  analyze(path, source).stats.tests;

describe('JS skips the patterns missed', () => {
  it.each([
    ["it('a', (c) => { c['skip'](); });", "c['skip']"],
    ["it['skip']('a', () => {});", "it['skip']"],
    ['test("a", ({ skip: s }) => { s(); });', 'skip: s'],
    ['test("a", ({ skip: s = noop }) => { s(); });', 'skip: s'],
    ["it('a', (c) => { const { skip } = c; skip(); });", 'skip'],
    ["it('a', (c) => { c?.skip?.(); });", 'c?.skip'],
    ["it('a', (c) => { c[`skip`](); });", "c['skip']"],
    ['\\u0069t.skip("a", () => {});', 'it.skip'],
    ["const opts = { skip: true };\ntest('a', opts, () => {});", 'skip: true'],
    [
      "const opts = { todo: 'later' };\ntest('a', opts, () => {});",
      "todo: 'later'",
    ],
    [
      "const opts = { timeout: 5 };\nopts.skip = true;\ntest('a', opts, () => {});",
      'skip: true',
    ],
  ])('%s', (source, text) => {
    expect(skips('a.test.js', source)).toEqual([text]);
  });

  it.each([
    "import { describe, it, expect } from 'vitest';\nit('a', () => {});",
    "import { test } from '@playwright/test';\ntest('a', () => {});",
    "import { helper } from './helpers';\nit('a', () => helper());",
    // A project's own wrapper around the runner (Playwright fixtures).
    "import { test, expect } from '../fixtures';\ntest('a', () => {});",
    "const cache = {};\nit('a', () => { cache['only'](); });",
    "const { skip: s } = opts;\nit('a', () => { s(); });",
    "const cache = {};\nit('a', () => { cache['skip'] = 1; });",
    "const opts = { skip: false, timeout: 5 };\ntest('a', opts, () => {});",
    "const opts = { retries: 2 };\ntest('a', opts, () => {});",
    "it('a', () => { const { skip, take } = page; take(skip); });",
  ])('leaves %s alone', (source) => {
    expect(skips('a.test.js', source)).toEqual([]);
  });

  it('counts tests written with unicode escapes', () => {
    expect(
      tests('a.test.js', '\\u0069t("a", () => {});\nit("b", () => {});'),
    ).toBe(2);
  });
});

describe('Python star imports', () => {
  it.each([
    ['from pytest import *\n\ndef test_a():\n    skip("later")\n', 'skip'],
    ['from pytest import *\n\ndef test_a():\n    xfail("bug")\n', 'xfail'],
  ])('%s', (source, text) => {
    expect(skips('test_a.py', source)).toEqual([text]);
  });

  it('leaves a local skip() alone without the star import', () => {
    expect(
      skips(
        'test_a.py',
        'def skip(x):\n    return x\n\ndef test_a():\n    assert skip(1) == 1\n',
      ),
    ).toEqual([]);
  });
});

describe('Java tests that never run', () => {
  const java = (method: string, extra = '') =>
    `${extra}class ATest {\n  ${method}\n  @Test void b() {}\n}\n`;

  it.each([['@Test private void a() {}'], ['@Test static void a() {}']])(
    '%s does not count',
    (method) => {
      expect(tests('src/test/java/ATest.java', java(method))).toBe(1);
    },
  );

  it('JUnit 4 needs public test methods', () => {
    const source =
      'import org.junit.Test;\npublic class ATest {\n  @Test public void a() {}\n  @Test void b() {}\n}\n';
    expect(tests('src/test/java/ATest.java', source)).toBe(1);
  });

  it('tests in an abstract class do not count', () => {
    const source = 'abstract class BaseTest {\n  @Test void a() {}\n}\n';
    expect(tests('src/test/java/BaseTest.java', source)).toBe(0);
  });

  it.each([
    ['@Test void a() {}'],
    ['@Test public void a() {}'],
    ['@Test protected void a() {}'],
  ])('%s counts', (method) => {
    expect(
      tests(
        'src/test/java/ATest.java',
        java(method, 'import org.junit.jupiter.api.Test;\n'),
      ),
    ).toBe(2);
  });
});

describe('M11b re-check', () => {
  it('reports Python aliases of pytest.skip and leaves a local def alone', () => {
    expect(
      skips(
        'test_a.py',
        'import pytest\nsk = pytest.skip\n\ndef test_a():\n    sk("x")\n',
      ),
    ).toEqual(['sk = pytest.skip']);
    expect(
      skips(
        'test_a.py',
        'from pytest import *\n\ndef skip(x):\n    return x\n',
      ),
    ).toEqual([]);
  });

  it('JUnit 5 skips a @Test that returns a value; factories count', () => {
    const source = [
      'import org.junit.jupiter.api.Test;',
      'class ATest {',
      '  @Test int a() { return 1; }',
      '  @Test void b() {}',
      '  @TestFactory Stream<DynamicTest> c() { return Stream.empty(); }',
      '}',
    ].join('\n');
    expect(tests('src/test/java/ATest.java', source)).toBe(2);
  });
});
