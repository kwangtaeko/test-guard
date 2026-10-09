// Where literals appear in the tree before a change (TG009): as an input an
// existing test passes to the code under test, and whether implementation
// code already used them.
import type { CompareContext } from './compare.js';
import { isImplementation } from './compare.js';
import { type GrepHit, grepTree } from './git.js';

export interface LiteralUse {
  test: GrepHit | null; // an existing test line passing it to a call
  expected: string[]; // the other values on that test line
  inCode: boolean; // implementation code already had it
}

// Calls whose arguments are expectations or test titles, not inputs.
const CHECKS =
  /^(?:it|test|describe|context|suite|specify|expect|assert\w*|equals?|deepEqual|strictEqual|deepStrictEqual|ok|that|fail|each|parametrize|CsvSource|ValueSource)$/;
// Matchers called on a chain (`.toBe(…)`, `.isEqualTo(…)`); a bare
// `isPalindrome(…)` is the code under test.
const MATCHERS = /^(?:to|is|has|contains)[A-Z]\w*$/;

const COMMENT = /^\s*(?:\/\/|#|\*|\/\*|<!--)/;
// Bundled or generated code isn't the project's own.
const VENDORED =
  /(?:^|\/)(?:vendor|third_party|node_modules|dist|build)\/|\.min\.[cm]?js$/;

const LITERAL = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?|\btrue\b|\bfalse\b|\bTrue\b|\bFalse\b`;

// Whether `token` sits in the arguments of a call that isn't a check:
// `romanToInt('IV')` in `assert.equal(romanToInt('IV'), 4)`.
export function passedAsInput(text: string, token: string): boolean {
  for (
    let at = text.indexOf(token);
    at !== -1;
    at = text.indexOf(token, at + 1)
  ) {
    let depth = 0;
    for (let i = at - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === ')') depth++;
      else if (ch === '(') {
        if (depth > 0) {
          depth--;
          continue;
        }
        const call = /(\.\s*)?([A-Za-z_$][\w$]*)\s*$/.exec(text.slice(0, i));
        const callee = call?.[2];
        const matcher = call?.[1] !== undefined && MATCHERS.test(callee ?? '');
        if (callee && !CHECKS.test(callee) && !matcher) return true;
        break;
      }
    }
  }
  return false;
}

// A number literal; `1h30m` is a string that starts with a digit.
export const isNumber = (literal: string) => /^-?\d+(?:\.\d+)?$/.test(literal);

// The literal as source text: a string in any quote style, or a number.
function forms(literal: string): string[] {
  return isNumber(literal)
    ? [literal]
    : [`'${literal}'`, `"${literal}"`, `\`${literal}\``];
}

// Values on a test line other than the input: the expected result.
function expectedValues(text: string, input: string): string[] {
  return [...text.matchAll(new RegExp(LITERAL, 'g'))]
    .map((m) => m[0])
    .filter((v) => v !== input)
    .map((v) => (/^['"`]/.test(v) ? v.slice(1, -1) : v.toLowerCase()));
}

export function literalFinder(
  root: string,
  base: string,
  ctx: CompareContext,
): (literals: string[]) => Map<string, LiteralUse> {
  const cache = new Map<string, LiteralUse>();
  return (literals) => {
    const wanted = [...new Set(literals)].filter((l) => !cache.has(l));
    // One search per kind: strings as plain text, numbers as whole words.
    const strings = wanted.filter((l) => !isNumber(l));
    const numbers = wanted.filter(isNumber);
    let hits: GrepHit[] = [];
    try {
      hits = [
        ...(strings.length > 0 ? grepTree(root, base, strings) : []),
        ...(numbers.length > 0 ? grepTree(root, base, numbers, true) : []),
      ];
    } catch {
      // Too much output or an unreadable tree: leave TG009 undecided.
      return new Map();
    }
    for (const literal of wanted) {
      const use: LiteralUse = { test: null, expected: [], inCode: false };
      for (const hit of hits) {
        if (COMMENT.test(hit.text)) continue;
        const form = forms(literal).find((f) => hit.text.includes(f));
        if (!form) continue;
        if (ctx.detect(hit.path)) {
          if (!use.test && passedAsInput(hit.text, form)) {
            use.test = hit;
            use.expected = expectedValues(hit.text, form);
          }
        } else if (
          isImplementation(hit.path, ctx) &&
          !VENDORED.test(hit.path)
        ) {
          use.inCode = true;
        }
      }
      cache.set(literal, use);
    }
    return new Map(
      literals.flatMap((l) => {
        const use = cache.get(l);
        return use ? [[l, use] as const] : [];
      }),
    );
  };
}
