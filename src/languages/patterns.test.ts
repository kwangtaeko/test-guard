// Skip, collection and redefinition patterns added after the round 2
// red-team review, each with look-alikes that must stay quiet.
import { describe, expect, it } from 'vitest';
import { createTestFileMatcher } from '../paths.js';
import { analyzeSource } from './index.js';

const detect = createTestFileMatcher();

function analyze(path: string, source: string) {
  const language = detect(path);
  if (!language) throw new Error(`not a test file: ${path}`);
  return analyzeSource(path, source, language);
}
const stats = (path: string, source: string) => {
  const { tests, skips } = analyze(path, source).stats;
  return { tests, skips };
};
const skipTexts = (path: string, source: string) =>
  analyze(path, source).skips.map((s) => s.text);

describe('python skips', () => {
  it.each([
    [
      'from pytest import mark\n\n@mark.skip\ndef test_a(): pass\n',
      'mark.skip',
    ],
    ['from unittest import skip\n\n@skip("x")\ndef test_a(): pass\n', 'skip'],
    [
      'from unittest import skipIf\n\n@skipIf(True, "x")\ndef test_a(): pass\n',
      'skipIf',
    ],
    [
      'import pytest as pt\n\n@pt.mark.xfail\ndef test_a(): pass\n',
      'pt.mark.xfail',
    ],
    ['import pytest as pt\n\ndef test_a():\n    pt.skip("x")\n', 'pt.skip'],
    ['from pytest import skip\n\ndef test_a():\n    skip("x")\n', 'skip'],
    [
      'from unittest import skip as later\n\n@later("x")\ndef test_a(): pass\n',
      'later',
    ],
    ['from pytest import mark as m\n\npytestmark = m.skip\n', 'm.skip'],
    ['__test__ = False\n\ndef test_a(): pass\n', '__test__ = False'],
    [
      'class TestA:\n    __test__ = False\n    def test_a(self): pass\n',
      '__test__ = False',
    ],
    [
      'class TestA(TestCase):\n    def assertEqual(self, a, b): pass\n',
      'def assertEqual',
    ],
    [
      'def test_a(self):\n    self.assertEqual = lambda *a: None\n',
      'self.assertEqual =',
    ],
  ])('%s', (source, text) => {
    expect(skipTexts('test_a.py', source)).toEqual([text]);
  });

  it.each([
    'def test_a():\n    items.skip(1)\n    assert skip_count == 0\n',
    'from pytest import raises\n\ndef test_a():\n    with raises(ValueError): f()\n',
    '__test__ = True\n\ndef test_a(): pass\n',
    'class TestA(TestCase):\n    def assert_valid(self, x): pass\n',
    'import pytest\n\n@pytest.mark.parametrize("a", [1])\ndef test_a(a): pass\n',
  ])('leaves %s alone', (source) => {
    expect(stats('test_a.py', source).skips).toBe(0);
  });
});

describe('python collection', () => {
  it('counts only tests that pytest or unittest collect', () => {
    const source = [
      'def test_top(): pass',
      'class TestA:',
      '    def test_a(self): pass',
      '    class TestInner:',
      '        def test_inner(self): pass',
      'class Helper:',
      '    def test_not_collected(self): pass',
      'class Case(unittest.TestCase):',
      '    def test_case(self): pass',
      'class More(BaseTest):',
      '    def test_more(self): pass',
      'def helper():',
      '    def test_nested(): pass',
      '',
    ].join('\n');
    expect(stats('test_a.py', source).tests).toBe(5);
  });

  it('counts a name defined twice in the same scope once', () => {
    expect(
      stats(
        'test_a.py',
        'def test_a(): pass\ndef test_a(): pass\nclass TestA:\n    def test_a(self): pass\n',
      ).tests,
    ).toBe(2);
  });

  it('drops tests when a class loses its Test prefix', () => {
    const before = 'class TestA:\n    def test_a(self):\n        assert 1\n';
    expect(stats('test_a.py', before).tests).toBe(1);
    expect(stats('test_a.py', before.replace('TestA', 'A')).tests).toBe(0);
  });

  it('keeps scopes across a dedented string', () => {
    const source =
      'class Helper:\n    x = """\ntext\n"""\n    def test_a(self): pass\n';
    expect(stats('test_a.py', source).tests).toBe(0);
  });
});

describe('js skips', () => {
  it.each([
    ["test('a', { skip: true }, () => {});", 'skip: true'],
    ["it('a', { todo: 'later' }, () => {});", "todo: 'later'"],
    ["t.test('a', { skip: true }, () => {});", 'skip: true'],
    ['test({ only: true }, () => {});', 'only: true'],
    ["it('a', function () { this.skip(); });", 'this.skip'],
    ["test('a', (t) => { t.skip(); });", 't.skip'],
    ["test('a', (ctx) => { ctx.skip(); });", 'ctx.skip'],
    ["test('a', ({ skip }) => { skip(); });", 'skip'],
    ["test.failing('a', () => {});", 'test.failing'],
    ['const expect = () => ({ toBe() {} });', 'const expect = () =>'],
    ["function it(name, fn) {}\nit('a', () => {});", 'function it'],
    ['globalThis.expect = () => ({});', 'globalThis.expect ='],
    ["test = () => {};\ntest('a', () => {});", 'test ='],
    ['expect.extend({\n  toBe() { return { pass: true }; },\n});', 'toBe'],
    ["it('a', (c) => { c.skip(); });", 'c.skip'],
    [
      "test('a', { timeout: 5 }, async function (tc) { tc.skip(); });",
      'tc.skip',
    ],
  ])('%s', (source, text) => {
    expect(skipTexts('a.test.js', source)).toEqual([text]);
  });

  it.each([
    "test('a', { skip: false }, () => {});",
    "test('a', () => { db.find({ skip: 10 }); });",
    "test('a', () => { cursor.skip(10); });",
    "const assert = require('node:assert');",
    "const expect = require('chai').expect;",
    'const test = base.extend({ page: async ({}, use) => use(1) });',
    'expect.extend({\n  toBeWithinRange(x) { return { pass: true }; },\n});',
    "it('a', () => { expect(x).toBe(1); });",
    // A helper named like a runner the file never calls with a title.
    "function describe(value) { return JSON.stringify(value); }\nit('a', () => { describe(x); });",
  ])('leaves %s alone', (source) => {
    expect(stats('a.test.js', source).skips).toBe(0);
  });

  it('leaves skip on other callbacks alone', () => {
    expect(
      stats('a.test.js', "it('a', () => { rows.map((r) => r.skip(1)); });")
        .skips,
    ).toBe(0);
  });

  it('counts expect.soft as an assertion', () => {
    expect(
      analyze('a.test.js', "it('a', () => { expect.soft(x).toBe(1); });").stats
        .assertions,
    ).toBe(1);
  });

  it('counts test.failing as a test', () => {
    expect(stats('a.test.js', "test.failing('a', () => {});").tests).toBe(1);
  });
});

describe('java', () => {
  const PATH = 'src/test/java/ATest.java';
  const cls = (...body: string[]) =>
    ['class ATest {', ...body, '}', ''].join('\n');

  it.each([
    [cls('  @Test void a() { Assumptions.abort("x"); }'), 'Assumptions.abort'],
    [cls('  @Test void a() { abort(); }'), 'abort'],
    [cls('  @Test(enabled = false) void a() {}'), 'enabled = false'],
    [
      `import com.fake.Test;\n${cls('  @Test void a() {}')}`,
      'import com.fake.Test',
    ],
    [
      `import static com.fake.Asserts.assertEquals;\n${cls('  @Test void a() {}')}`,
      'import static com.fake.Asserts.assertEquals',
    ],
    [
      cls('  static void assertEquals(Object a, Object b) {}'),
      'void assertEquals',
    ],
    ['@interface Test {}\n', '@interface Test'],
  ])('%s', (source, text) => {
    expect(skipTexts(PATH, source)).toEqual([text]);
  });

  it.each([
    `import org.junit.jupiter.api.Test;\n${cls('  @Test void a() {}')}`,
    `import static org.junit.jupiter.api.Assertions.assertEquals;\n${cls('')}`,
    cls('  @Test void a() { controller.abort(); }'),
    cls('  @Test(enabled = true) void a() {}'),
    cls('  private void assertValid(User u) {}'),
    cls('  @Test void a() { assertEquals(1, f()); }'),
    `import static com.google.common.truth.Truth.assertThat;\n${cls('')}`,
    `import static org.springframework.test.util.AssertionErrors.assertEquals;\n${cls('')}`,
    cls(
      '  static MyAssert assertThat(My actual) { return new MyAssert(actual); }',
    ),
  ])('leaves %s alone', (source) => {
    expect(stats(PATH, source).skips).toBe(0);
  });

  it('counts tests in inner classes only when they run', () => {
    const source = cls(
      '  @Test void a() {}',
      '  @Nested class Inner {',
      '    @Test void b() {}',
      '    class Deeper { @Test void c() {} }',
      '  }',
      '  class Plain { @Test void d() {} }',
      '  static class Enclosed { @Test void e() {} }',
      '  interface Shared { @Test default void f() {} }',
    );
    expect(stats(PATH, source).tests).toBe(4);
    expect(stats(PATH, source.replace('@Nested ', '')).tests).toBe(3);
  });

  it('sees a skip hidden with unicode escapes', () => {
    expect(stats(PATH, cls('  \\u0040Disabled @Test void a() {}')).skips).toBe(
      1,
    );
  });
});

describe('assertions inside a try that swallows failures', () => {
  const counts = (path: string, source: string) => {
    const { stats, swallowed } = analyze(path, source);
    return [stats.assertions, swallowed];
  };

  it.each([
    [
      'a.test.js',
      "it('a', () => {\n  try {\n    expect(f()).toBe(1);\n  } catch (e) {}\n});\n",
    ],
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).toBe(1) } catch { console.log('x') }\n});\n",
    ],
    [
      'a.test.ts',
      "it('a', async () => {\n  try {\n    try { expect(1).toBe(2) } finally {}\n  } catch (_) {\n    // ignore\n  }\n});\n",
    ],
    [
      'test_a.py',
      'def test_a():\n    try:\n        assert f() == 1\n    except:\n        pass\n',
    ],
    [
      'test_a.py',
      'def test_a():\n    try:\n        assert f() == 1\n    except (ValueError, AssertionError) as e:\n        print(e)\n',
    ],
    [
      'test_a.py',
      'class TestA:\n    def test_a(self):\n        try: assert f() == 1\n        except Exception: pass\n',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try {\n      assertEquals(1, f());\n    } catch (AssertionError e) {\n    }\n  }\n}\n',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try (var r = open()) {\n      assertEquals(1, f());\n    } catch (IOException | Throwable e) { log(e); }\n  }\n}\n',
    ],
  ])('%s: not counted (%#)', (path, source) => {
    expect(counts(path, source)).toEqual([0, 1]);
  });

  it.each([
    // The handler fails the test or checks the error.
    [
      'a.test.js',
      "it('a', () => {\n  try { f() } catch (e) { expect(e.message).toBe('x') }\n});\n",
    ],
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).toBe(1) } catch (e) { throw e }\n});\n",
    ],
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).toBe(1) } finally { done() }\n});\n",
    ],
    // The handler can't see assertion failures.
    [
      'test_a.py',
      'def test_a():\n    try:\n        assert f() == 1\n    except ValueError:\n        pass\n',
    ],
    [
      'test_a.py',
      'def test_a():\n    try:\n        assert f() == 1\n    except Exception:\n        raise\n',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try {\n      assertEquals(1, f());\n    } catch (Exception e) {\n    }\n  }\n}\n',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try {\n      assertEquals(1, f());\n    } catch (Throwable t) {\n      fail(t);\n    }\n  }\n}\n',
    ],
  ])('%s: still counted (%#)', (path, source) => {
    const [assertions, swallowed] = counts(path, source);
    expect(swallowed).toBe(0);
    expect(assertions).toBeGreaterThan(0);
  });
});

describe('swallowed assertions, red-team re-check', () => {
  const swallowed = (path: string, source: string) =>
    analyze(path, source).swallowed;

  it.each([
    // A handler whose check always passes.
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).toBe(1) } catch (e) { expect(e).toBeDefined() }\n});\n",
    ],
    [
      'a.test.js',
      "it('a', (done) => {\n  try { expect(f()).toBe(1) } catch (e) { done() }\n});\n",
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try { assertEquals(1, f()); } catch (Throwable t) { assertTrue(true); }\n  }\n}\n',
    ],
    [
      'src/test/java/ATest.java',
      'class ATest {\n  @Test void a() {\n    try { assertEquals(1, f()); } catch (Throwable t) { assertionErrors = t; }\n  }\n}\n',
    ],
    [
      'test_a.py',
      'from contextlib import suppress\n\ndef test_a():\n    with suppress(AssertionError):\n        assert f() == 1\n',
    ],
    [
      'test_a.py',
      'import contextlib\n\ndef test_a():\n    with contextlib.suppress(Exception): assert f() == 1\n',
    ],
  ])('%s: swallowed (%#)', (path, source) => {
    expect(swallowed(path, source)).toBe(1);
  });

  it.each([
    // The handler collects the error for a later assertion.
    [
      'a.test.js',
      "it('a', () => {\n  const errors = [];\n  try { expect(f()).toBe(1) } catch (e) { errors.push(e) }\n  expect(errors).toEqual([]);\n});\n",
    ],
    [
      'test_a.py',
      'def test_a():\n    errors = []\n    try:\n        assert f() == 1\n    except AssertionError as e:\n        errors.append(e)\n    assert not errors\n',
    ],
    // Other assertion styles in the handler.
    [
      'a.test.js',
      "test('a', (t) => {\n  try { assert.ok(f()) } catch (e) { t.is(e.code, 'X') }\n});\n",
    ],
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).to.equal(1) } catch (e) { e.should.be.instanceOf(TypeError) }\n});\n",
    ],
    [
      'a.test.js',
      "it('a', (done) => {\n  try { expect(f()).toBe(1); done() } catch (e) { done(e) }\n});\n",
    ],
    [
      'test_a.py',
      'class TestA(unittest.TestCase):\n    def test_a(self):\n        try:\n            self.assertEqual(f(), 1)\n        except Exception as e:\n            self.assertIsInstance(e, KeyError)\n',
    ],
    [
      'test_a.py',
      'def test_a():\n    with suppress(KeyError):\n        assert f() == 1\n',
    ],
  ])('%s: still counted (%#)', (path, source) => {
    expect(swallowed(path, source)).toBe(0);
  });
});
