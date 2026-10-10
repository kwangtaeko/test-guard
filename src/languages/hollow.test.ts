// Tests that look intact but check nothing (M11c): code that never runs,
// assertions whose failures are swallowed on the way, and a mocked module
// under test. Each with look-alikes that must count as before.
import { describe, expect, it } from 'vitest';
import { createTestFileMatcher } from '../paths.js';
import { analyzeSource } from './index.js';

const detect = createTestFileMatcher();
function analyze(path: string, source: string) {
  const language = detect(path);
  if (!language) throw new Error(`not a test file: ${path}`);
  const { stats, swallowed, unreachable, deadTests, skips } = analyzeSource(
    path,
    source,
    language,
  );
  return {
    tests: stats.tests,
    assertions: stats.assertions,
    swallowed,
    unreachable,
    deadTests,
    skips: skips.map((s) => s.text),
  };
}

describe('JS code that never runs', () => {
  it.each([
    ["it('a', () => {\n  return;\n  expect(f()).toBe(1);\n});", 0, 1, 0],
    [
      "it('a', () => {\n  if (true) return;\n  expect(f()).toBe(1);\n});",
      0,
      1,
      0,
    ],
    [
      "it('a', () => {\n  if (false) {\n    expect(f()).toBe(1);\n  }\n});",
      0,
      1,
      0,
    ],
    ["it('a', () => {\n  if (true) {} else expect(f()).toBe(1);\n});", 0, 1, 0],
    ["while (false) { it('a', () => { expect(1).toBe(1); }); }", 0, 1, 1],
    ["if (false) { it('a', () => { expect(f()).toBe(1); }); }", 0, 1, 1],
    [
      "describe('s', () => {\n  return;\n  it('a', () => expect(f()).toBe(1));\n});",
      0,
      1,
      1,
    ],
    ["for (const c of []) it('a', () => expect(c).toBe(1));", 0, 1, 1],
    ["it.each([])('a %s', (c) => { expect(f(c)).toBe(1); });", 0, 1, 1],
    [
      "describe.each([])('s', () => { it('a', () => expect(1).toBe(1)); });",
      0,
      1,
      1,
    ],
  ])('%s', (source, assertions, unreachable, deadTests) => {
    const counts = analyze('a.test.js', source);
    expect(counts.assertions).toBe(assertions);
    expect(counts.unreachable).toBe(unreachable);
    expect(counts.deadTests).toBe(deadTests);
    expect(counts.tests).toBe(1 - deadTests);
  });

  it.each([
    // A guard, not a constant.
    "it('a', () => {\n  if (process.platform === 'win32') return;\n  expect(f()).toBe(1);\n});",
    "it('a', () => {\n  if (!ok) return;\n  expect(f()).toBe(1);\n});",
    // The `return` belongs to another function.
    "it('a', () => {\n  const g = () => { return 1; };\n  expect(g()).toBe(1);\n});",
    "it('a', () => {\n  [1].forEach((x) => { if (x) return; });\n  expect(f()).toBe(1);\n});",
    // `if (x) return; else …`: the `else` runs when `x` is false.
    "it('a', () => {\n  if (x) return;\n  else expect(f()).toBe(1);\n});",
    // Function declarations are hoisted above the `return`.
    "it('a', () => {\n  return check();\n  function check() { expect(f()).toBe(1); }\n});",
    "it('a', async () => {\n  if (true) {\n    expect(f()).toBe(1);\n  }\n});",
    "it.each([1, 2])('a %s', (c) => { expect(f(c)).toBe(1); });",
    "for (const c of [1]) it('a', () => expect(c).toBe(1));",
    "it('a', () => {\n  do { expect(f()).toBe(1); } while (false);\n});",
  ])('counts %s', (source) => {
    const counts = analyze('a.test.js', source);
    expect(counts).toMatchObject({
      tests: 1,
      assertions: 1,
      unreachable: 0,
      deadTests: 0,
    });
  });
});

describe('JS failures swallowed on the way', () => {
  it.each([
    "it('a', () => {\n  return p.then((v) => expect(v).toBe(1)).catch(() => {});\n});",
    "it('a', () => {\n  return p.then((v) => { expect(v).toBe(1); }).finally(done).catch((e) => console.log(e));\n});",
    // A helper only called inside a swallowing `try`.
    "function check(v) { expect(v).toBe(1); }\nit('a', () => {\n  try { check(f()); } catch {}\n});",
    "const check = (v) => expect(v).toBe(1);\nit('a', () => {\n  try { check(f()); } catch (e) {}\n});",
  ])('%s', (source) => {
    const counts = analyze('a.test.js', source);
    expect(counts).toMatchObject({ assertions: 0, swallowed: 1 });
  });

  it('a helper only called from code that never runs', () => {
    const counts = analyze(
      'a.test.js',
      "function check(v) { expect(v).toBe(1); }\nit('a', () => {\n  return;\n  check(f());\n});",
    );
    expect(counts).toMatchObject({ assertions: 0, unreachable: 1 });
  });

  it.each([
    "it('a', () => p.then((v) => expect(v).toBe(1)));",
    "it('a', () => p.then((v) => expect(v).toBe(1)).catch((e) => { throw e; }));",
    "it('a', () => p.then((v) => expect(v).toBe(1)).catch(done));",
    "it('a', () => p.catch(() => {}).then((v) => expect(v).toBe(1)));",
    // A helper also called outside the `try`.
    "function check(v) { expect(v).toBe(1); }\nit('a', () => {\n  try { check(f()); } catch {}\n  check(g());\n});",
    // Passed by name, not only called.
    "function check() { expect(f()).toBe(1); }\nit('a', check);\ntry { check(); } catch {}",
    // Exported: other files may call it.
    "export function check(v) { expect(v).toBe(1); }\nit('a', () => {\n  try { check(f()); } catch {}\n});",
    'function check(v) { expect(v).toBe(1); }\nmodule.exports = { check };\ntry { check(1); } catch {}',
    // `describe` inside a helper: its tests run later, outside the `try`.
    "function suite() { it('a', () => expect(f()).toBe(1)); }\ntry { suite(); } catch {}",
    "function check(v) { expect(v).toBe(1); }\nit('a', () => {\n  try { check(f()); } catch (e) { throw e; }\n});",
  ])('counts %s', (source) => {
    const counts = analyze('a.test.js', source);
    expect(counts.assertions).toBe(1);
    expect(counts.swallowed + counts.unreachable).toBe(0);
  });
});

describe('JS mocks of the module under test', () => {
  it.each([
    ['src/sum.test.ts', "vi.mock('./sum');", "vi.mock('./sum')"],
    ['src/sum.test.ts', "jest.mock('./sum.js');", "jest.mock('./sum.js')"],
    ['src/sum.spec.ts', "vi.mock('../src/sum');", "vi.mock('../src/sum')"],
    ['src/__tests__/sum.ts', "jest.mock('../sum');", "jest.mock('../sum')"],
    [
      'src/sum/sum.test.ts',
      "vi.mock('@/sum/index');",
      "vi.mock('@/sum/index')",
    ],
    [
      'src/sum.test.ts',
      "vi.mock('./sum', () => ({ sum: () => 3 }));",
      "vi.mock('./sum')",
    ],
    ['src/sum.test.ts', 'jest.doMock("./sum");', "jest.doMock('./sum')"],
  ])('%s: %s', (path, source, text) => {
    expect(analyze(path, source).skips).toEqual([text]);
  });

  it.each([
    // Another module: a collaborator.
    ['src/sum.test.ts', "vi.mock('./db');"],
    ['src/sum.test.ts', "vi.mock('./summary');"],
    // A package named like the file: `fs.test.ts` testing a wrapper.
    ['src/fs.test.ts', "vi.mock('fs');"],
    ['src/fs.test.ts', "vi.mock('node:fs');"],
    // Partial mocks keep the real module.
    [
      'src/sum.test.ts',
      "vi.mock('./sum', async (importOriginal) => ({ ...(await importOriginal()), log: vi.fn() }));",
    ],
    [
      'src/sum.test.ts',
      "jest.mock('./sum', () => ({ ...jest.requireActual('./sum'), log: jest.fn() }));",
    ],
    ['src/sum.test.ts', "vi.mock('./sum', { spy: true });"],
    ['src/sum.test.ts', "vi.mock('./sum', (orig) => orig());"],
    // Not a test file named after a module.
    ['src/integration.test.ts', "vi.mock('./sum');"],
  ])('%s: leaves %s alone', (path, source) => {
    expect(analyze(path, source).skips).toEqual([]);
  });
});

describe('Python code that never runs', () => {
  it.each([
    ['def test_a():\n    return\n    assert f() == 1\n', 1, 0],
    [
      'def test_a():\n    if True:\n        return\n    assert f() == 1\n',
      1,
      0,
    ],
    ['def test_a():\n    if False:\n        assert f() == 1\n', 1, 0],
    [
      'def test_a():\n    if 0:\n        pass\n    elif False:\n        assert f() == 1\n',
      1,
      0,
    ],
    ['def test_a():\n    for c in []:\n        assert f(c) == 1\n', 1, 0],
    ['if False:\n    def test_a():\n        assert f() == 1\n', 1, 1],
    [
      '@pytest.mark.parametrize("c", [])\ndef test_a(c):\n    assert f(c) == 1\n',
      1,
      1,
    ],
    [
      '@pytest.mark.parametrize("c", argvalues=())\ndef test_a(c):\n    assert f(c) == 1\n',
      1,
      1,
    ],
  ])('%s', (source, unreachable, deadTests) => {
    const counts = analyze('test_a.py', source);
    expect(counts).toMatchObject({
      assertions: 0,
      unreachable,
      deadTests,
      tests: 1 - deadTests,
    });
  });

  it.each([
    'def test_a():\n    if not ok:\n        return\n    assert f() == 1\n',
    'def test_a():\n    def g():\n        return 1\n    assert g() == 1\n',
    '@pytest.mark.parametrize("c", [1])\ndef test_a(c):\n    assert f(c) == 1\n',
    '@pytest.mark.parametrize("c", CASES)\ndef test_a(c):\n    assert f(c) == 1\n',
    'def test_a():\n    for c in [1]:\n        assert f(c) == 1\n',
    'def test_a():\n    while True:\n        assert f() == 1\n        break\n',
  ])('counts %s', (source) => {
    expect(analyze('test_a.py', source)).toMatchObject({
      tests: 1,
      assertions: 1,
      unreachable: 0,
      deadTests: 0,
    });
  });

  it('a helper only called inside a swallowing try', () => {
    const counts = analyze(
      'test_a.py',
      'class TestA:\n    def check(self, v):\n        assert v == 1\n\n    def test_a(self):\n        try:\n            self.check(f())\n        except Exception:\n            pass\n',
    );
    expect(counts).toMatchObject({ tests: 1, assertions: 0, swallowed: 1 });
  });

  it.each([
    // Also called outside the `try`.
    'def check(v):\n    assert v == 1\n\ndef test_a():\n    try:\n        check(f())\n    except Exception:\n        pass\n    check(g())\n',
    // A test called from another test still runs on its own.
    'def test_b():\n    assert f() == 1\n\ndef test_a():\n    try:\n        test_b()\n    except Exception:\n        pass\n',
    // A fixture or callback: used by name.
    'def check(v):\n    assert v == 1\n\ndef test_a():\n    run(check)\n    try:\n        check(1)\n    except Exception:\n        pass\n',
  ])('counts %s', (source) => {
    const counts = analyze('test_a.py', source);
    expect(counts.swallowed + counts.unreachable).toBe(0);
  });
});

describe('Java code that never runs', () => {
  const wrap = (body: string) =>
    `import org.junit.jupiter.api.Test;\nclass ATest {\n${body}\n}\n`;

  it.each([
    '@Test void a() {\n  if (true) return;\n  assertEquals(1, f());\n}',
    '@Test void a() {\n  if (false) {\n    assertEquals(1, f());\n  }\n}',
    '@Test void a() {\n  if (true) {} else assertEquals(1, f());\n}',
  ])('%s', (body) => {
    expect(analyze('src/test/java/ATest.java', wrap(body))).toMatchObject({
      tests: 1,
      assertions: 0,
      unreachable: 1,
    });
  });

  it('a helper only called inside a swallowing try', () => {
    const counts = analyze(
      'src/test/java/ATest.java',
      wrap(
        'private void check(int v) { assertEquals(1, v); }\n@Test void a() {\n  try { check(f()); } catch (Throwable e) {}\n}',
      ),
    );
    expect(counts).toMatchObject({ tests: 1, assertions: 0, swallowed: 1 });
  });

  it.each([
    '@Test void a() {\n  if (!ok) return;\n  assertEquals(1, f());\n}',
    'private void check(int v) { assertEquals(1, v); }\n@Test void a() {\n  try { check(f()); } catch (Exception e) {}\n}',
    'private void check(int v) { assertEquals(1, v); }\n@Test void a() {\n  check(f());\n}',
  ])('counts %s', (body) => {
    expect(analyze('src/test/java/ATest.java', wrap(body))).toMatchObject({
      tests: 1,
      assertions: 1,
      swallowed: 0,
      unreachable: 0,
    });
  });
});

describe('M11c red-team', () => {
  it.each([
    // Mocks of a same-named module elsewhere: a collaborator.
    ['src/routes/user.test.ts', "vi.mock('../services/user');"],
    ['src/store/__tests__/user.test.ts', "jest.mock('../../api/user');"],
    ['src/hooks/useAuth.test.ts', "jest.mock('@/store/useAuth');"],
  ])('%s: leaves %s alone', (path, source) => {
    expect(analyze(path, source).skips).toEqual([]);
  });

  it.each([
    [
      'src/sum.test.ts',
      "vi.mock(import('./sum'), () => ({ sum: () => 3 }));",
      "vi.mock('./sum')",
    ],
    ['src/sum/index.test.ts', "vi.mock('./index');", "vi.mock('./index')"],
    ['src/sum/index.test.ts', "vi.mock('.');", "vi.mock('.')"],
    ['test/sum.test.ts', "vi.mock('../src/sum');", "vi.mock('../src/sum')"],
    ['src/sum.test.ts', "jest.mock('@/sum');", "jest.mock('@/sum')"],
  ])('%s: %s', (path, source, text) => {
    expect(analyze(path, source).skips).toEqual([text]);
  });

  it.each([
    // The error is kept and thrown after the loop.
    "it('a', async () => {\n  let last;\n  for (let i = 0; i < 3; i++) {\n    try { expect(await f()).toBe(1); return; } catch (e) { last = e; }\n  }\n  throw last;\n});",
  ])('counts a retry loop: %s', (source) => {
    expect(analyze('a.test.js', source)).toMatchObject({
      assertions: 1,
      swallowed: 0,
    });
  });

  it('counts a Python retry loop', () => {
    expect(
      analyze(
        'test_a.py',
        'def test_a():\n    last = None\n    for _ in range(3):\n        try:\n            assert f() == 1\n            return\n        except AssertionError as e:\n            last = e\n    raise last\n',
      ),
    ).toMatchObject({ assertions: 1, swallowed: 0 });
  });

  it.each([
    // Checks in an ignoring handler always pass.
    [
      'a.test.js',
      "it('a', () => {\n  try { expect(f()).toBe(1); } catch (e) { expect(e).toBeDefined(); }\n});",
      2,
    ],
    [
      'test_a.py',
      'def test_a():\n    try:\n        assert f() == 1\n    except Exception as e:\n        assert e\n',
      2,
    ],
    [
      'src/test/java/ATest.java',
      'import org.junit.jupiter.api.Test;\nclass ATest {\n@Test void a() {\n  try { assertEquals(1, f()); } catch (Throwable t) { assertNotNull(t); }\n}\n}\n',
      2,
    ],
    // A promise whose rejection is dropped.
    [
      'a.test.js',
      "it('a', () => expect(p).resolves.toBe(1).catch(() => {}));",
      1,
    ],
    [
      'a.test.js',
      "it('a', () => p.then((v) => expect(v).toBe(1)).catch(noop));",
      1,
    ],
    [
      'a.test.js',
      "async function check() { expect(await f()).toBe(1); }\nit('a', async () => { await check().catch(console.error); });",
      1,
    ],
  ])('%s: %s', (path, source, swallowed) => {
    expect(analyze(path, source)).toMatchObject({ assertions: 0, swallowed });
  });

  it.each([
    // Constant flags.
    [
      'a.test.js',
      "const SKIP = true;\nit('a', () => {\n  if (SKIP) return;\n  expect(f()).toBe(1);\n});",
    ],
    [
      'a.test.js',
      "const ENABLED = false;\nit('a', () => {\n  if (ENABLED) {\n    expect(f()).toBe(1);\n  }\n});",
    ],
    [
      'test_a.py',
      'SKIP = True\n\ndef test_a():\n    if SKIP:\n        return\n    assert f() == 1\n',
    ],
    [
      'src/test/java/ATest.java',
      'import org.junit.jupiter.api.Test;\nclass ATest {\nprivate static final boolean ENABLED = false;\n@Test void a() {\n  if (!ENABLED) return;\n  assertEquals(1, f());\n}\n}\n',
    ],
    // Helpers nothing calls.
    [
      'a.test.js',
      "it('a', () => {\n  const run = () => { expect(f()).toBe(1); };\n});",
    ],
    [
      'a.test.js',
      "function check() { expect(f()).toBe(1); }\nit('a', () => {});",
    ],
    ['test_a.py', 'def test_a():\n    def run():\n        assert f() == 1\n'],
    [
      'src/test/java/ATest.java',
      'import org.junit.jupiter.api.Test;\nclass ATest {\nprivate void check() { assertEquals(1, f()); }\n@Test void a() {}\n}\n',
    ],
  ])('%s: %s', (path, source) => {
    expect(analyze(path, source)).toMatchObject({
      assertions: 0,
      unreachable: 1,
    });
  });

  it.each([
    // Flags that change, or come from outside.
    [
      'a.test.js',
      "let SKIP = true;\nSKIP = false;\nit('a', () => {\n  if (SKIP) return;\n  expect(f()).toBe(1);\n});",
    ],
    [
      'a.test.js',
      "const SKIP = process.env.CI === '1';\nit('a', () => {\n  if (SKIP) return;\n  expect(f()).toBe(1);\n});",
    ],
    [
      'test_a.py',
      'SKIP = True\nSKIP = False\n\ndef test_a():\n    if SKIP:\n        return\n    assert f() == 1\n',
    ],
    [
      'test_a.py',
      'def test_a(skip=True):\n    if skip:\n        return\n    assert f() == 1\n',
    ],
    // Called by the runner or by other files.
    [
      'test_a.py',
      'def check():\n    assert f() == 1\n\ndef test_a():\n    pass\n',
    ],
    [
      'test_a.py',
      'class TestA:\n    def setup_method(self):\n        assert f() == 1\n\n    def test_a(self):\n        pass\n',
    ],
    [
      'test_a.py',
      'def test_a():\n    @retry\n    def run():\n        assert f() == 1\n',
    ],
    [
      'src/test/java/ATest.java',
      'import org.junit.jupiter.api.*;\nclass ATest {\n@BeforeEach private void check() { assertEquals(1, f()); }\n@Test void a() {}\n}\n',
    ],
    [
      'src/test/java/ATest.java',
      'import org.junit.jupiter.api.Test;\nclass ATest {\nprotected void check() { assertEquals(1, f()); }\n@Test void a() {}\n}\n',
    ],
    [
      'a.test.js',
      "export function check() { expect(f()).toBe(1); }\nit('a', () => {});",
    ],
  ])('%s: counts %s', (path, source) => {
    expect(analyze(path, source)).toMatchObject({
      assertions: 1,
      unreachable: 0,
      swallowed: 0,
    });
  });
});
