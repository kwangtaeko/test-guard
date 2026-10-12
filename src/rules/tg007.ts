import type { Analysis, ValueCheck } from '../languages/index.js';
import type { Language } from '../types.js';
import { declarations, valueAt } from './declarations.js';
import type { Rule, RuleFinding } from './types.js';

// Assertion weakening (0.1: matcher swaps only, ROADMAP §3.4).
// Within each hunk, deleted lines with a strong matcher are paired in order
// with added lines of the same group: first with added strong lines (strength
// kept), then with added weak lines (reported). Meaningless assertions on added
// lines are reported on their own. Lines are matched after comment/string
// blanking.

interface Matcher {
  re: RegExp;
  group: 'value' | 'throw';
  label?: string;
}

interface Spec {
  strong: Matcher[];
  weak: Matcher[];
  trivial: RegExp[];
}

const SPECS: Record<Language, Spec> = {
  js: {
    strong: [
      {
        re: /(?<!\.not)\.(?:toBe|toEqual|toStrictEqual|toHaveLength)\s*\((?!\s*expect\.(?:anything|any|objectContaining|arrayContaining)\s*\()/,
        group: 'value',
      },
      { re: /\.toThrow\s*\(\s*[^\s)]/, group: 'throw', label: 'toThrow(X)' },
    ],
    weak: [
      {
        re: /\.(?:toBeDefined|toBeTruthy|not\.toBeNull|not\.toBeUndefined)\s*\(/,
        group: 'value',
      },
      // Part of the value (`toMatchObject`, `expect.objectContaining`), or
      // any value of a type (`expect.any(Number)`, `expect.anything()`).
      { re: /\.toMatchObject\s*\(/, group: 'value' },
      {
        re: /\.(?:toBe|toEqual|toStrictEqual)\s*\(\s*expect\.(?:anything|any|objectContaining|arrayContaining)\s*\(/,
        group: 'value',
        label: 'expect.anything() / any() / objectContaining()',
      },
      // An exact value replaced by "anything but" or a range.
      {
        re: /\.(?:not\.(?:toBe|toEqual|toStrictEqual|toHaveLength)|toBeGreaterThan(?:OrEqual)?|toBeLessThan(?:OrEqual)?)\s*\(/,
        group: 'value',
      },
      { re: /\.toThrow\s*\(\s*\)/, group: 'throw', label: 'toThrow()' },
    ],
    trivial: [
      /(?<![\w$.])expect\s*\(\s*(true|false|null|undefined|\d+)\s*\)\s*\.(?:toBe|toEqual|toStrictEqual)\s*\(\s*\1\s*\)/,
      /(?<![\w$.])expect\s*\(\s*true\s*\)\s*\.toBeTruthy\s*\(\s*\)/,
      /(?<![\w$.])assert(?:\.ok)?\s*\(\s*true\s*\)/,
    ],
  },
  python: {
    strong: [
      { re: /(?<![\w.])self\.assertEquals?\s*\(/, group: 'value' },
      {
        re: /(?<![\w.])assert(?=[\s(])(?!.*\bapprox\s*\(.*\b(?:abs|rel)\s*=).*==/,
        group: 'value',
        label: 'assert x == y',
      },
      {
        re: /(?<![\w.])pytest\.raises\s*\(\s*(?!(?:Exception|BaseException)\b)\w/,
        group: 'throw',
        label: 'pytest.raises(SpecificError)',
      },
    ],
    weak: [
      {
        re: /(?<![\w.])self\.assert(?:True|IsNotNone|NotEqual|Greater|GreaterEqual|Less|LessEqual)\s*\(/,
        group: 'value',
      },
      {
        // A line ending in `(` continues (Black's multi-line `assert (`).
        // `is` (but not `is not`) is as exact as `==`.
        re: /(?<![\w.])assert(?=[\s(])(?!.*(?:==|!=|<|>|\bin\b|\bis\b(?!\s+not\b)))(?!.*\(\s*$)/,
        group: 'value',
        label: 'assert x',
      },
      // A tolerance given to an exact comparison.
      {
        re: /(?<![\w.])assert(?=[\s(]).*==.*\bapprox\s*\(.*\b(?:abs|rel)\s*=/,
        group: 'value',
        label: 'assert x == pytest.approx(y, abs/rel=…)',
      },
      {
        re: /(?<![\w.])assert(?=[\s(])(?!.*==).*!=/,
        group: 'value',
        label: 'assert x != y',
      },
      {
        re: /(?<![\w.])assert(?=[\s(])(?!.*[=!]=).*[<>]/,
        group: 'value',
        label: 'assert x < y',
      },
      {
        re: /(?<![\w.])pytest\.raises\s*\(\s*(?:Exception|BaseException)\b/,
        group: 'throw',
        label: 'pytest.raises(Exception)',
      },
    ],
    trivial: [
      /(?<![\w.])assert\s*\(?\s*True\s*\)?\s*(?:,|$)/,
      /(?<![\w.])self\.assertTrue\s*\(\s*True\s*\)/,
    ],
  },
  java: {
    strong: [
      { re: /(?<![\w$])assertEquals\s*\(/, group: 'value' },
      {
        re: /(?<![\w$])assertThrows\s*\(\s*(?!(?:java\.lang\.)?(?:Exception|Throwable)\.class)[\w$.]+\.class/,
        group: 'throw',
        label: 'assertThrows(SpecificException.class)',
      },
    ],
    weak: [
      {
        re: /(?<![\w$])(?:assertNotNull|assertTrue|assertNotEquals|assertNotSame)\s*\(/,
        group: 'value',
      },
      {
        re: /(?<![\w$])assertThrows\s*\(\s*(?:java\.lang\.)?(?:Exception|Throwable)\.class/,
        group: 'throw',
        label: 'assertThrows(Exception.class)',
      },
    ],
    trivial: [
      /(?<![\w$])assertTrue\s*\(\s*true\s*\)/,
      /(?<![\w$])assertFalse\s*\(\s*false\s*\)/,
    ],
  },
};

interface Hit {
  line: number;
  group: Matcher['group'];
  label: string;
}

function hits(
  matchers: Matcher[],
  lineNumbers: number[],
  lines: string[],
): Hit[] {
  const result: Hit[] = [];
  for (const line of lineNumbers) {
    const text = lines[line - 1] ?? '';
    for (const matcher of matchers) {
      const match = matcher.re.exec(text);
      if (!match) continue;
      const label =
        matcher.label ?? match[0].replace(/^[.\s]+/, '').replace(/\s*\($/, '');
      result.push({ line, group: matcher.group, label });
      break;
    }
  }
  return result;
}

export const tg007: Rule = ({
  before,
  after,
  hunks,
  beforeLines,
  afterLines,
}) => {
  if (!after) return [];
  const spec = SPECS[after.stats.language];
  const path = after.stats.path;
  const findings: RuleFinding[] = [];
  const pairedPerGroup = { value: 0, throw: 0 };

  for (const hunk of hunks) {
    const reported = new Set<number>();
    if (before) {
      const strongAdded = hits(spec.strong, hunk.added, after.lines);
      const weakAdded = hits(spec.weak, hunk.added, after.lines);
      for (const strong of hits(spec.strong, hunk.deleted, before.lines)) {
        const kept = strongAdded.findIndex((h) => h.group === strong.group);
        if (kept !== -1) {
          strongAdded.splice(kept, 1);
          continue;
        }
        const weak = weakAdded.findIndex((h) => h.group === strong.group);
        if (weak === -1) continue;
        const [hit] = weakAdded.splice(weak, 1);
        if (!hit) continue;
        reported.add(hit.line);
        pairedPerGroup[strong.group]++;
        findings.push({
          ruleId: 'TG007',
          path,
          line: hit.line,
          message: `weakened assertion \`${strong.label}\` → \`${hit.label}\``,
        });
      }
    }
    for (const line of hunk.added) {
      if (reported.has(line)) continue;
      const text = after.lines[line - 1] ?? '';
      const match = spec.trivial.map((re) => re.exec(text)).find(Boolean);
      if (!match) continue;
      findings.push({
        ruleId: 'TG007',
        path,
        line,
        message: `added meaningless assertion \`${match[0].trim()}\``,
      });
    }
  }

  // Subject comparison: a check that compared a value with something else
  // removed, and a check of that value against itself added
  // (`toBe(3)` → `toBe(add(1, 2))` under `expect(add(1, 2))`). A name
  // stands for the value it was declared with (`const r = add(1, 2)`).
  if (before) {
    const resolved = (analysis: Analysis, source: string[]) => {
      const value = valueAt(
        declarations(analysis.lines, source, analysis.stats.language),
      );
      const resolve = (side: string, line: number) =>
        /^[A-Za-z_$][\w$]*$/.test(side)
          ? (value(side, line)?.replace(/\s+/g, '') ?? side)
          : side;
      return analysis.checks
        .filter((c) => c.equal)
        .map(
          (c): ValueCheck => ({
            ...c,
            sides: [resolve(c.sides[0], c.start), resolve(c.sides[1], c.start)],
          }),
        );
    };
    const checksAfter = resolved(after, afterLines);
    const kept = new Set(checksAfter.map((c) => c.sides.join('\n')));
    const deleted = new Set(hunks.flatMap((hunk) => hunk.deleted));
    const added = new Set(hunks.flatMap((hunk) => hunk.added));
    const lines = (check: ValueCheck, set: Set<number>) => {
      const found: number[] = [];
      for (let n = check.start; n <= check.end; n++) {
        if (set.has(n)) found.push(n);
      }
      return found;
    };
    // Removed: on a deleted line, and not still in the file.
    const removed = resolved(before, beforeLines).filter(
      (c) =>
        c.sides[0] !== c.sides[1] &&
        lines(c, deleted).length > 0 &&
        !kept.has(c.sides.join('\n')),
    );
    const reported = new Set(findings.map((f) => f.line));
    for (const check of checksAfter) {
      const [subject, expected] = check.sides;
      const [line] = lines(check, added);
      if (
        subject !== expected ||
        line === undefined ||
        reported.has(line) ||
        !removed.some((r) => r.sides.includes(subject))
      ) {
        continue;
      }
      reported.add(line);
      findings.push({
        ruleId: 'TG007',
        path,
        line,
        message: `replaced the expected value with the value under test \`${subject.length > 60 ? `${subject.slice(0, 57)}...` : subject}\``,
      });
    }
  }

  // Across the whole file: a strong matcher removed in one place and a weak
  // one added in another escapes the per-hunk pairing above.
  if (before) {
    const all = (lines: string[]) => lines.map((_, i) => i + 1);
    const added = new Set(hunks.flatMap((hunk) => hunk.added));
    for (const group of ['value', 'throw'] as const) {
      const count = (matchers: Matcher[], lines: string[]) =>
        hits(matchers, all(lines), lines).filter((h) => h.group === group);
      const strongDrop =
        count(spec.strong, before.lines).length -
        count(spec.strong, after.lines).length;
      const weakAfter = count(spec.weak, after.lines);
      const weakRise = weakAfter.length - count(spec.weak, before.lines).length;
      if (Math.min(strongDrop, weakRise) <= pairedPerGroup[group]) continue;
      const where = weakAfter.find((h) => added.has(h.line));
      findings.push({
        ruleId: 'TG007',
        path,
        line: where?.line,
        message: `weakened assertions: strong matchers −${strongDrop}, weak matchers +${weakRise}`,
      });
    }
  }
  return findings.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
};
