import type { LanguageSpec } from './index.js';
import { stripPython } from './strip.js';

// unittest assertion methods; a test file that defines or assigns one has
// replaced the real check.
const ASSERT_METHODS =
  'assert(?:Equals?|NotEquals?|True|False|IsNot|IsNotNone|IsNone|Is|In|NotIn|IsInstance|NotIsInstance|Raises(?:Regex)?|Warns(?:Regex)?|(?:Not)?AlmostEquals?|Greater(?:Equal)?|Less(?:Equal)?|(?:Not)?Regex|CountEqual|MultiLineEqual|SequenceEqual|ListEqual|TupleEqual|SetEqual|DictEqual|Logs)';

const SKIPS = [
  /(?<![\w.])pytest\.(?:skip|xfail)\s*\(/,
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
function countTests(code: string): number {
  const tests = new Set<string>();
  const scopes: { indent: number; kind: 'class' | 'def'; name: string }[] = [];
  const collected: boolean[] = []; // per scope: tests inside it run
  for (const line of code.split('\n')) {
    const text = line.trimStart();
    // Blank, or the end of a string or bracket that opened further up.
    if (/^(?:$|["')\]}])/.test(text)) continue;
    const indent = line.length - text.length;
    while ((scopes.at(-1)?.indent ?? -1) >= indent) {
      scopes.pop();
      collected.pop();
    }
    const runs = collected.every(Boolean);
    const def = /^(?:async\s+)?def\s+(\w+)/.exec(text);
    const cls = /^class\s+(\w+)\s*(\([^)]*)?/.exec(text);
    if (def) {
      const name = def[1] ?? '';
      if (name.startsWith('test') && runs) {
        tests.add([...scopes.map((s) => s.name), name].join('.'));
      }
      scopes.push({ indent, kind: 'def', name });
      collected.push(false); // nested functions are never collected
    } else if (cls) {
      const name = cls[1] ?? '';
      scopes.push({ indent, kind: 'class', name });
      // Any base named like a test class may be a TestCase subclass.
      collected.push(name.startsWith('Test') || /Test/.test(cls[2] ?? ''));
    }
  }
  return tests.size;
}

export const python: LanguageSpec = {
  strip: stripPython,
  tests: countTests,
  assertions:
    /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g,
  skips: (code) =>
    new RegExp([...SKIPS, ...importedSkips(code)].join('|'), 'gm'),
};
