import {
  type Analysis,
  isAssertionLine,
  type ValueCheck,
} from '../languages/index.js';
import type { Language } from '../types.js';
import { declarations, valueAt } from './declarations.js';
import type { Rule, RuleFinding } from './types.js';

// Assertion weakening (0.1: matcher swaps only, ROADMAP §3.4).
// Within each hunk, deleted lines with a strong matcher are paired in order
// with added lines of the same group: first with added strong lines (strength
// kept), then with added weak lines (reported). A line is judged by the whole
// assertion it belongs to, so wrapping one over several lines changes
// nothing. Meaningless assertions on added lines are reported on their own.
// Lines are matched after comment/string blanking.

interface Matcher {
  re: RegExp;
  group: 'value' | 'throw';
  label?: string;
  // Common in new tests too (`toMatchObject`, `toContain`): only reported
  // in place of a strong matcher in the same hunk, not counted file-wide.
  pairOnly?: boolean;
}

// Matchers that accept any value of a kind, or part of one.
const LOOSE = String.raw`\bexpect\.(?:anything|any|objectContaining|arrayContaining)\s*\(`;
// `approx(` given more than its value: a tolerance (`abs=`, `rel=`, or the
// second positional argument).
const TOLERANCE = String.raw`\bapprox\s*\((?:[^(),[\]{}]|\([^()]*\)|\[[^\]]*\]|\{[^}]*\})*,`;

interface Spec {
  strong: Matcher[];
  weak: Matcher[];
  trivial: RegExp[];
}

const SPECS: Record<Language, Spec> = {
  js: {
    strong: [
      {
        re: new RegExp(
          String.raw`(?<!\.not)\.(?:toBe|toEqual|toStrictEqual|toHaveLength)\s*\((?!.*${LOOSE})`,
        ),
        group: 'value',
      },
      // chai (`expect(x).to.deep.equal(y)`, not under `.not`) and
      // node:assert / chai `assert`.
      {
        re: /\.to(?:\.(?!not\b)[\w$]+)*\.(?:equal|equals|eq|eql|eqls)\s*\(/,
        group: 'value',
      },
      {
        re: /(?<![\w$.])assert\.(?:equal|strictEqual|deepEqual|deepStrictEqual)\s*\(/,
        group: 'value',
      },
      { re: /\.toThrow\s*\(\s*[^\s)]/, group: 'throw', label: 'toThrow(X)' },
    ],
    weak: [
      {
        re: /\.(?:toBeDefined|toBeTruthy|not\.toBeNull|not\.toBeUndefined)\s*\(/,
        group: 'value',
      },
      {
        re: /\.to(?:\.[\w$]+)*\.(?:ok|exist)\b|\.to(?:\.[\w$]+)*\.not(?:\.[\w$]+)*\.(?:equal|equals|eq|eql|eqls|null|undefined)\b|(?<![\w$.])assert(?:\.(?:ok|notEqual|notStrictEqual|notDeepEqual|notDeepStrictEqual))?\s*\(/,
        group: 'value',
      },
      {
        re: /\.to(?:\.[\w$]+)*\.(?:above|below|least|most|gt|gte|lt|lte|greaterThan|lessThan|include|includes|contain|contains|property|a|an|instanceof|instanceOf|closeTo|approximately|within|match|members|keys|oneOf|satisfy|satisfies)\b/,
        group: 'value',
        pairOnly: true,
      },
      // jest-extended.
      {
        re: /\.(?:toBeNumber|toBeString|toBeArray|toBeObject|toBeBoolean|toBeDate|toBeFunction|toIncludeAllMembers|toIncludeAnyMembers|toIncludeSameMembers|toContainKey|toContainKeys|toContainEntry|toSatisfy|toBeOneOf|toBeWithin|toStartWith|toEndWith|toInclude)\s*\(/,
        group: 'value',
        pairOnly: true,
      },
      // Part of the value (`toMatchObject`, `expect.objectContaining`, also
      // nested), any value of a type (`expect.any(Number)`), a property, a
      // member, an approximation, or whatever a snapshot records.
      {
        re: new RegExp(
          String.raw`\.(?:toBe|toEqual|toStrictEqual)\s*\(.*${LOOSE}`,
        ),
        group: 'value',
        label: 'expect.anything() / any() / objectContaining()',
        pairOnly: true,
      },
      {
        re: /\.(?:toMatchObject|toHaveProperty|toContain|toContainEqual|toBeInstanceOf|toMatchSnapshot|toMatchInlineSnapshot)\s*\(/,
        group: 'value',
        pairOnly: true,
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
        re: new RegExp(
          String.raw`(?<![\w.])assert(?=[\s(])(?!.*${TOLERANCE}).*==`,
        ),
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
      // A tolerance given to an exact comparison, a member or a type in
      // place of the value.
      {
        re: new RegExp(
          String.raw`(?<![\w.])assert(?=[\s(])(?=.*==).*${TOLERANCE}`,
        ),
        group: 'value',
        label: 'assert x == pytest.approx(y, tolerance)',
        pairOnly: true,
      },
      {
        re: /(?<![\w.])self\.assertAlmostEquals?\s*\(.*\b(?:delta|places)\s*=/,
        group: 'value',
        label: 'assertAlmostEqual(…, delta/places=…)',
        pairOnly: true,
      },
      {
        re: /(?<![\w.])self\.(?:assertIn|assertIsInstance|assertDictContainsSubset)\s*\(/,
        group: 'value',
        pairOnly: true,
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
      // AssertJ and Hamcrest.
      {
        re: /(?<![\w$])assertThat\s*\(.*\.(?:isEqualTo|isSameAs|containsExactly|containsExactlyInAnyOrder|hasSize|isEqualByComparingTo)\s*\(/,
        group: 'value',
        label: 'assertThat(x).isEqualTo(y)',
      },
      {
        re: /(?<![\w$])assertThat\s*\(.*,\s*(?:(?:Matchers|CoreMatchers)\.)?(?:equalTo|is)\s*\((?!\s*(?:(?:Matchers|CoreMatchers)\.)?(?:not|nullValue|notNullValue|instanceOf|any|anything|greaterThan|lessThan|greaterThanOrEqualTo|lessThanOrEqualTo|closeTo|hasItems?|containsString)\b)/,
        group: 'value',
        label: 'assertThat(x, is(y))',
      },
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
        re: /(?<![\w$])assertThat\s*\(.*(?:\.(?:isNotNull|isNotEqualTo|isNotEmpty|isNotSameAs|isTrue)\s*\(|,\s*(?:is\s*\(\s*)?(?:(?:Matchers|CoreMatchers)\.)?(?:notNullValue|not)\s*\()/,
        group: 'value',
        label: 'assertThat(x).isNotNull()',
      },
      {
        re: /(?<![\w$])assertInstanceOf\s*\(/,
        group: 'value',
        pairOnly: true,
      },
      {
        re: /(?<![\w$])assertThat\s*\(.*(?:\.(?:contains|containsAll|containsAnyOf|containsKey|containsKeys|containsEntry|hasFieldOrProperty|hasFieldOrPropertyWithValue|isInstanceOf|isCloseTo|isBetween|startsWith|endsWith|isIn|hasSizeGreaterThan|hasSizeLessThan|matches|isPositive|isNegative|isNotZero|isGreaterThan|isGreaterThanOrEqualTo|isLessThan|isLessThanOrEqualTo)\s*\(|,\s*(?:is\s*\(\s*)?(?:(?:Matchers|CoreMatchers)\.)?(?:instanceOf|greaterThan|lessThan|greaterThanOrEqualTo|lessThanOrEqualTo|closeTo|hasItems?|containsString|startsWith|endsWith|anything|hasKey|hasEntry|hasProperty|any)\s*\()/,
        group: 'value',
        label: 'assertThat(x).contains(…) / isCloseTo(…) / isPositive()',
        pairOnly: true,
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
  text: string; // the whole assertion
}

// For each line, the [first, last] lines (1-based) of the assertion it is
// in, worked out once per file. An assertion runs over the lines its
// brackets span, however long (Prettier and Black wrap them); one whose
// brackets never close is its first line alone.
const SPANS = new WeakMap<string[], ([number, number] | undefined)[]>();

function spans(
  lines: string[],
  language: Language,
): ([number, number] | undefined)[] {
  const cached = SPANS.get(lines);
  if (cached) return cached;
  const found: ([number, number] | undefined)[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!isAssertionLine(language, lines[i] ?? '')) continue;
    let depth = 0;
    let last = -1;
    for (let j = i; j < lines.length && last === -1; j++) {
      for (const ch of lines[j] ?? '') {
        if ('([{'.includes(ch)) depth++;
        else if (')]}'.includes(ch)) depth--;
      }
      if (depth <= 0) last = j;
    }
    if (last === -1) last = i;
    for (let k = i; k <= last; k++) found[k] = [i + 1, last + 1];
    i = last;
  }
  SPANS.set(lines, found);
  return found;
}

// The text of the assertion a line belongs to and its first line; the line
// alone when it isn't in one.
function statementAt(
  lines: string[],
  line: number,
  language: Language,
): { start: number; text: string } {
  const span = spans(lines, language)[line - 1];
  if (!span) return { start: line, text: lines[line - 1] ?? '' };
  const text = lines
    .slice(span[0] - 1, span[1])
    .map((l) => l.trim())
    .join(' ');
  return { start: span[0], text };
}

// One hit per assertion, at the first of `lineNumbers` in it.
function hits(
  matchers: Matcher[],
  lineNumbers: number[],
  lines: string[],
  language: Language,
): Hit[] {
  const result: Hit[] = [];
  const seen = new Set<number>();
  for (const line of lineNumbers) {
    const { start, text } = statementAt(lines, line, language);
    if (seen.has(start)) continue;
    seen.add(start);
    for (const matcher of matchers) {
      const match = matcher.re.exec(text);
      if (!match) continue;
      const label =
        matcher.label ?? match[0].replace(/^[.\s]+/, '').replace(/\s*\($/, '');
      result.push({ line, group: matcher.group, label, text });
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
  const language = after.stats.language;
  const spec = SPECS[language];
  const path = after.stats.path;
  const findings: RuleFinding[] = [];
  const pairedPerGroup = { value: 0, throw: 0 };

  for (const hunk of hunks) {
    const reported = new Set<number>();
    if (before) {
      const strongAdded = hits(spec.strong, hunk.added, after.lines, language);
      const weakAdded = hits(spec.weak, hunk.added, after.lines, language);
      // A weak assertion deleted and added again unchanged isn't new: a
      // large file's diff can turn its whole middle into one hunk.
      for (const old of hits(spec.weak, hunk.deleted, before.lines, language)) {
        const same = weakAdded.findIndex((h) => h.text === old.text);
        if (same !== -1) weakAdded.splice(same, 1);
      }
      for (const strong of hits(
        spec.strong,
        hunk.deleted,
        before.lines,
        language,
      )) {
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
        hits(
          matchers.filter((m) => !m.pairOnly),
          all(lines),
          lines,
          language,
        ).filter((h) => h.group === group);
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
