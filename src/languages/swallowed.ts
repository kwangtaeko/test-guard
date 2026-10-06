// Code inside a `try` whose handler swallows assertion failures can't fail the
// test. These blank such `try` bodies (newlines kept) so their assertions
// aren't counted. Input is comment/string-stripped code.

const blank = (s: string) => s.replace(/[^\n]/g, ' ');

// Whether a handler body fails the test: it rethrows, fails, or checks the
// error with something other than a check that always passes. Collecting the
// error (`errors.push(e)`) for a later assertion counts as failing.
export function reportsFailure(
  body: string,
  fails: RegExp,
  alwaysPasses: RegExp,
): boolean {
  if (/\.(?:push|append|add|addError)\s*\(/.test(body)) return true;
  return fails.test(body.replace(alwaysPasses, ' '));
}

// `{` at `open` → index of its matching `}` (or the end).
function closeBrace(code: string, open: number): number {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}' && --depth === 0) return i;
  }
  return code.length;
}

function closeParen(code: string, open: number): number {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '(') depth++;
    else if (code[i] === ')' && --depth === 0) return i;
  }
  return code.length;
}

function skipSpace(code: string, i: number): number {
  while (i < code.length && /\s/.test(code[i] ?? '')) i++;
  return i;
}

// JS/Java: `try (…)? { … } catch (clause)? { body } …`. `swallows` gets each
// catch's clause (without parens) and body.
export function blankSwallowedBraces(
  code: string,
  swallows: (clause: string, body: string) => boolean,
): string {
  const ranges: [number, number][] = [];
  for (const match of code.matchAll(/(?<![\w$.])try\b/g)) {
    let i = skipSpace(code, match.index + 3);
    if (code[i] === '(') i = skipSpace(code, closeParen(code, i) + 1);
    if (code[i] !== '{') continue;
    const tryOpen = i;
    const tryClose = closeBrace(code, i);
    let swallowed = false;
    i = skipSpace(code, tryClose + 1);
    while (code.startsWith('catch', i) && !/[\w$]/.test(code[i + 5] ?? '')) {
      i = skipSpace(code, i + 5);
      let clause = '';
      if (code[i] === '(') {
        const end = closeParen(code, i);
        clause = code.slice(i + 1, end);
        i = skipSpace(code, end + 1);
      }
      if (code[i] !== '{') break;
      const end = closeBrace(code, i);
      if (swallows(clause, code.slice(i + 1, end))) swallowed = true;
      i = skipSpace(code, end + 1);
    }
    if (swallowed) ranges.push([tryOpen + 1, tryClose]);
  }
  return blankRanges(code, ranges);
}

// Python: `try:` and its `except` clauses at the same indent.
export function blankSwallowedPython(
  code: string,
  swallows: (clause: string, body: string) => boolean,
): string {
  const lines = code.split('\n');
  const indent = (s: string) => s.length - s.trimStart().length;
  // Lines after `start` indented deeper than `own` (blank lines included).
  const blockEnd = (start: number, own: number) => {
    let end = start + 1;
    while (
      end < lines.length &&
      ((lines[end] ?? '').trim() === '' || indent(lines[end] ?? '') > own)
    ) {
      end++;
    }
    return end;
  };
  const blanked = new Set<number>();
  lines.forEach((line, i) => {
    // `with suppress(AssertionError):` swallows like an empty `except`.
    const suppress =
      /^(\s*)with\s+(?:contextlib\s*\.\s*)?suppress\s*\((.*)\)\s*:(.*)$/.exec(
        line,
      );
    const types = suppress?.[2]?.trim() ?? '';
    if (suppress && types !== '' && swallows(types, '')) {
      for (let j = i + 1; j < blockEnd(i, indent(line)); j++) blanked.add(j);
      if (suppress[3]?.trim()) {
        lines[i] =
          line.slice(0, line.length - suppress[3].length) + blank(suppress[3]);
      }
      return;
    }
    const head = /^(\s*)try\s*:(.*)$/.exec(line);
    if (!head) return;
    const own = indent(line);
    const tryEnd = blockEnd(i, own);
    let swallowed = false;
    let k = tryEnd;
    for (;;) {
      const clause = /^\s*except\b(.*?):(.*)$/.exec(lines[k] ?? '');
      if (!clause || indent(lines[k] ?? '') !== own) break;
      const end = blockEnd(k, own);
      const body = [clause[2] ?? '', ...lines.slice(k + 1, end)].join('\n');
      if (swallows((clause[1] ?? '').trim(), body)) swallowed = true;
      k = end;
    }
    if (!swallowed) return;
    for (let j = i + 1; j < tryEnd; j++) blanked.add(j);
    // `try: assert x` on one line.
    if (head[2]?.trim()) lines[i] = `${head[1]}try:${blank(head[2])}`;
  });
  return lines.map((l, i) => (blanked.has(i) ? blank(l) : l)).join('\n');
}

function blankRanges(code: string, ranges: [number, number][]): string {
  if (ranges.length === 0) return code;
  const chars = code.split('');
  for (const [start, end] of ranges) {
    for (let i = start; i < end; i++) if (chars[i] !== '\n') chars[i] = ' ';
  }
  return chars.join('');
}
