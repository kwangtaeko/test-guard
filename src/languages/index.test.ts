import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createTestFileMatcher } from '../paths.js';
import { analyzeFile } from './index.js';

const FIXTURES = fileURLToPath(
  new URL('../../fixtures/languages/', import.meta.url),
);
const detect = createTestFileMatcher();

function analyzeFixture(path: string) {
  const language = detect(path);
  if (!language) throw new Error(`not a test file: ${path}`);
  const source = readFileSync(FIXTURES + path, 'utf8');
  const { tests, assertions, skips } = analyzeFile(path, source, language);
  return { language, tests, assertions, skips };
}

describe('analyzeFile', () => {
  it('normalizes the path', () => {
    expect(analyzeFile('.\\a\\b.test.ts', '', 'js').path).toBe('a/b.test.ts');
  });

  it.each(['js/crlf.test.ts', 'python/crlf_test.py', 'java/PaymentIT.java'])(
    'keeps CRLF in %s',
    (path) => {
      expect(readFileSync(FIXTURES + path, 'utf8')).toContain('\r\n');
    },
  );
});

describe('js fixtures', () => {
  it('basic', () => {
    expect(analyzeFixture('js/basic.test.ts')).toMatchInlineSnapshot(`
      {
        "assertions": 8,
        "language": "js",
        "skips": 7,
        "tests": 7,
      }
    `);
  });
  it('comments, strings and look-alikes', () => {
    expect(analyzeFixture('js/tricky.spec.js')).toMatchInlineSnapshot(`
      {
        "assertions": 2,
        "language": "js",
        "skips": 0,
        "tests": 1,
      }
    `);
  });
  it('CRLF', () => {
    expect(analyzeFixture('js/crlf.test.ts')).toMatchInlineSnapshot(`
      {
        "assertions": 2,
        "language": "js",
        "skips": 1,
        "tests": 2,
      }
    `);
  });
});

describe('python fixtures', () => {
  it('basic', () => {
    expect(analyzeFixture('python/test_basic.py')).toMatchInlineSnapshot(`
      {
        "assertions": 9,
        "language": "python",
        "skips": 6,
        "tests": 9,
      }
    `);
  });
  it('comments, strings and look-alikes', () => {
    expect(analyzeFixture('python/tricky_test.py')).toMatchInlineSnapshot(`
      {
        "assertions": 1,
        "language": "python",
        "skips": 0,
        "tests": 1,
      }
    `);
  });
  it('CRLF', () => {
    expect(analyzeFixture('python/crlf_test.py')).toMatchInlineSnapshot(`
      {
        "assertions": 2,
        "language": "python",
        "skips": 1,
        "tests": 2,
      }
    `);
  });
});

describe('java fixtures', () => {
  it('basic', () => {
    expect(
      analyzeFixture('java/src/test/java/com/example/CalculatorTest.java'),
    ).toMatchInlineSnapshot(`
      {
        "assertions": 6,
        "language": "java",
        "skips": 3,
        "tests": 5,
      }
    `);
  });
  it('comments, strings and look-alikes', () => {
    expect(
      analyzeFixture('java/OrderServiceTests.java'),
    ).toMatchInlineSnapshot(`
      {
        "assertions": 1,
        "language": "java",
        "skips": 0,
        "tests": 1,
      }
    `);
  });
  it('CRLF', () => {
    expect(analyzeFixture('java/PaymentIT.java')).toMatchInlineSnapshot(`
      {
        "assertions": 2,
        "language": "java",
        "skips": 1,
        "tests": 2,
      }
    `);
  });
});
