import type { Language } from '../types.js';

// A name bound to a value: `const expected = 11`, `EXPECTED = {…}`,
// `static final int EXPECTED = 11;`, `self.expected = 11` (seen by the whole
// class).
const DECLARATION: Record<Language, RegExp> = {
  js: /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=(?![=>])/,
  python: /^\s*((?:self\.)?[A-Za-z_]\w*)\s*(?::[^=]*)?=(?!=)/,
  java: /^\s*(?:(?:public|private|protected|static|final)\s+)*[\w$.<>[\], ?]*[\w$>\]]\s+([A-Za-z_$][\w$]*)\s*=(?!=)/,
};

export interface Declaration {
  name: string;
  start: number; // lines, 1-based
  end: number;
  scopeEnd: number; // last line where the name is visible
  mutated: boolean; // assigned again in its block: the value isn't fixed
  value: string; // source text after `=`, without a trailing `;`
}

// The last line of the statement starting at line index `i`, by brackets
// on comment/string-stripped lines, however long; `i` itself when its
// brackets never close.
export function statementEnd(stripped: string[], i: number): number {
  let depth = 0;
  for (let j = i; j < stripped.length; j++) {
    for (const ch of stripped[j] ?? '') {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
    }
    if (depth <= 0) return j;
  }
  return i;
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
    const end = name.startsWith('self.')
      ? classEnd(stripped, i)
      : scopeEnd(stripped, i, language);
    found.push({
      name,
      start: i + 1,
      end: last + 1,
      scopeEnd: end + 1,
      mutated: assigns(name).test(stripped.slice(last + 1, end + 1).join('\n')),
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

// The last line index of the block a declaration at line index `i` is
// in: until its enclosing `{ }` closes (JS, Java), or until a line indented
// less (Python; a module constant reaches the end of the file).
function scopeEnd(stripped: string[], i: number, language: Language): number {
  if (language === 'python') {
    const indent = (line: string) => line.length - line.trimStart().length;
    const own = indent(stripped[i] ?? '');
    for (let j = i + 1; j < stripped.length; j++) {
      const line = stripped[j] ?? '';
      if (line.trim() !== '' && indent(line) < own) return j - 1;
    }
    return stripped.length - 1;
  }
  let depth = 0;
  for (let j = i; j < stripped.length; j++) {
    for (const ch of stripped[j] ?? '') {
      if (ch === '{') depth++;
      else if (ch === '}' && --depth < 0) return j;
    }
  }
  return stripped.length - 1;
}

// The last line index of the Python class line index `i` is in.
function classEnd(stripped: string[], i: number): number {
  const indent = (line: string) => line.length - line.trimStart().length;
  let limit = indent(stripped[i] ?? '');
  for (let k = i - 1; k >= 0; k--) {
    const line = stripped[k] ?? '';
    if (line.trim() === '' || indent(line) >= limit) continue;
    limit = indent(line);
    if (/^\s*class\s/.test(line)) break;
  }
  for (let j = i + 1; j < stripped.length; j++) {
    const line = stripped[j] ?? '';
    if (line.trim() !== '' && indent(line) <= limit) return j - 1;
  }
  return stripped.length - 1;
}

// An assignment to `name`: `name = …`, `name += …`, `name++`, `--name`.
function assigns(name: string): RegExp {
  const n = name.replace(/[$.]/g, '\\$&');
  return new RegExp(
    `(?<![\\w$.])${n}\\s*(?:[-+*/%&|^]|\\*\\*|<<|>>>?|\\?\\?|&&|\\|\\|)?=(?![=>])|(?:\\+\\+|--)\\s*${n}(?![\\w$])|(?<![\\w$.])${n}\\s*(?:\\+\\+|--)`,
  );
}

// The value a name has at a line: its nearest declaration above whose block
// reaches the line, or its only one if visible there (a Python module
// constant defined below the tests); none when the name is assigned again.
export function valueAt(
  list: Declaration[],
): (name: string, line: number) => string | undefined {
  return (name, line) => {
    const visible = list.filter((d) => d.name === name && line <= d.scopeEnd);
    const above = visible.filter((d) => d.end < line).at(-1);
    const found = above ?? (visible.length === 1 ? visible[0] : undefined);
    return found?.mutated ? undefined : found?.value;
  };
}
