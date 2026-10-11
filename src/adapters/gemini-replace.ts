// Gemini CLI's `replace` tool, worked out ahead so test-guard judges the
// file Gemini will write (spec: docs/agents/gemini.md). Ported from
// gemini-cli packages/core/src/tools/edit.ts (calculateReplacement, v0.63.0):
// exact, then whitespace-flexible, then token-regex matching. Past those,
// Gemini tries fuzzy matching and a model's correction, whose result can't
// be known here; so can't an ambiguous match, which Gemini hands to the
// model too.

export type Replaced = string | null | 'unpredictable';

// The file after the edit; null when Gemini will refuse it (nothing
// changes, or old_string is empty on an existing file).
export function geminiReplace(
  current: string,
  oldString: string,
  newString: string,
  allowMultiple: boolean,
): Replaced {
  const text = current.replace(/\r\n/g, '\n');
  const search = oldString.replace(/\r\n/g, '\n');
  const replace = newString.replace(/\r\n/g, '\n');
  if (search === '') return null;
  const result =
    exact(text, search, replace, allowMultiple) ??
    flexible(text, search, replace, allowMultiple) ??
    regex(text, search, replace, allowMultiple) ??
    'unpredictable';
  if (result === 'unpredictable') return result;
  if (result === text) return null;
  const next = restoreTrailingNewline(text, result);
  return current.includes('\r\n') ? next.replace(/\n/g, '\r\n') : next;
}

// A match count Gemini accepts: one, or several with allow_multiple.
const accepted = (occurrences: number, allowMultiple: boolean) =>
  occurrences === 1 || allowMultiple;

function exact(
  text: string,
  search: string,
  replace: string,
  allowMultiple: boolean,
): Replaced | undefined {
  const occurrences = text.split(search).length - 1;
  if (occurrences === 0) return undefined;
  if (!accepted(occurrences, allowMultiple)) return 'unpredictable';
  return text.split(search).join(replace);
}

// Lines compared with their surrounding whitespace removed; the new text
// takes the indentation of the first matched line.
function flexible(
  text: string,
  search: string,
  replace: string,
  allowMultiple: boolean,
): Replaced | undefined {
  const sourceLines = text.match(/.*(?:\n|$)/g)?.slice(0, -1) ?? [];
  const searchLines = search.split('\n').map((line) => line.trim());
  const replaceLines = replace.split('\n');
  let occurrences = 0;
  let i = 0;
  while (i <= sourceLines.length - searchLines.length) {
    const window = sourceLines.slice(i, i + searchLines.length);
    if (window.every((line, k) => line.trim() === searchLines[k])) {
      occurrences++;
      const indentation = /^([ \t]*)/.exec(window[0] ?? '')?.[1] ?? '';
      let replacement = applyIndentation(replaceLines, indentation).join('\n');
      if (
        replace !== '' &&
        (window.at(-1) ?? '').endsWith('\n') &&
        !replacement.endsWith('\n')
      ) {
        replacement += '\n';
      }
      sourceLines.splice(i, searchLines.length, replacement);
    }
    i++;
  }
  if (occurrences === 0) return undefined;
  if (!accepted(occurrences, allowMultiple)) return 'unpredictable';
  return sourceLines.join('');
}

// Tokens split at brackets and operators, with any whitespace between them.
function regex(
  text: string,
  search: string,
  replace: string,
  allowMultiple: boolean,
): Replaced | undefined {
  let spaced = search;
  for (const delimiter of ['(', ')', ':', '[', ']', '{', '}', '>', '<', '=']) {
    spaced = spaced.split(delimiter).join(` ${delimiter} `);
  }
  const tokens = spaced.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return undefined;
  const pattern = `^([ \t]*)${tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s*')}`;
  const occurrences = text.match(new RegExp(pattern, 'gm'))?.length ?? 0;
  if (occurrences === 0) return undefined;
  if (!accepted(occurrences, allowMultiple)) return 'unpredictable';
  const lines = replace.split('\n');
  return text.replace(
    new RegExp(pattern, allowMultiple ? 'gm' : 'm'),
    (_, indentation: string) =>
      applyIndentation(lines, indentation || '').join('\n'),
  );
}

function applyIndentation(lines: string[], target: string): string[] {
  if (lines.length === 0) return [];
  const reference = /^([ \t]*)/.exec(lines[0] ?? '')?.[1] ?? '';
  return lines.map((line) => {
    if (line.trim() === '') return '';
    if (line.startsWith(reference))
      return target + line.slice(reference.length);
    return target + line.trimStart();
  });
}

function restoreTrailingNewline(original: string, modified: string): string {
  const had = original.endsWith('\n');
  if (had && !modified.endsWith('\n')) return `${modified}\n`;
  if (!had && modified.endsWith('\n')) return modified.replace(/\n$/, '');
  return modified;
}
