import type { Language } from '../types.js';

// A name bound to a value: `const expected = 11`, `EXPECTED = {…}`,
// `static final int EXPECTED = 11;`.
const DECLARATION: Record<Language, RegExp> = {
  js: /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=(?![=>])/,
  python: /^\s*([A-Za-z_]\w*)\s*(?::[^=]*)?=(?!=)/,
  java: /^\s*(?:(?:public|private|protected|static|final)\s+)*[\w$.<>[\], ?]*[\w$>\]]\s+([A-Za-z_$][\w$]*)\s*=(?!=)/,
};

export interface Declaration {
  name: string;
  start: number; // lines, 1-based
  end: number;
  value: string; // source text after `=`, without a trailing `;`
}

// The last line of the statement starting at line index `i`, by brackets
// on comment/string-stripped lines.
export function statementEnd(stripped: string[], i: number): number {
  let depth = 0;
  let last = i;
  for (let j = i; j < stripped.length && j < i + 200; j++) {
    for (const ch of stripped[j] ?? '') {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
    }
    last = j;
    if (depth <= 0) break;
  }
  return last;
}

// Declarations in the file, found on stripped lines; values are read from
// the source lines.
export function declarations(
  stripped: string[],
  source: string[],
  language: Language,
): Declaration[] {
  const found: Declaration[] = [];
  let depth = 0; // Python: `name=value` inside brackets is an argument
  for (let i = 0; i < stripped.length; i++) {
    const line = stripped[i] ?? '';
    const at = depth;
    for (const ch of line) {
      if ('(['.includes(ch)) depth++;
      else if (')]'.includes(ch)) depth--;
    }
    const name = DECLARATION[language].exec(line)?.[1];
    if (!name || (language === 'python' && at > 0)) continue;
    const last = statementEnd(stripped, i);
    found.push({
      name,
      start: i + 1,
      end: last + 1,
      value: source
        .slice(i, last + 1)
        .join('\n')
        .replace(/^[^=]*=/, '')
        .replace(/;\s*$/, '')
        .trim(),
    });
  }
  return found;
}

// The value a name has at a line: its nearest declaration above, or its
// only one (a Python module constant defined below the tests).
export function valueAt(
  list: Declaration[],
): (name: string, line: number) => string | undefined {
  return (name, line) => {
    const named = list.filter((d) => d.name === name);
    const above = named.filter((d) => d.end < line).at(-1);
    return (above ?? (named.length === 1 ? named[0] : undefined))?.value;
  };
}
