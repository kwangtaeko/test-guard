// Replaces comments and string contents with spaces before regex counting.
// Quotes and line breaks are kept, so line numbers stay valid and
// `it('name', ...)` still matches `it(`.
// Known limits: JS regex literals and nested `${}` in template literals.

interface StringScan {
  contentEnd: number; // index where the closing quote starts (or scan stopped)
  next: number; // index right after the string
}

function scanString(
  src: string,
  start: number,
  quote: string,
  multiline: boolean,
): StringScan {
  let j = start;
  while (j < src.length) {
    const ch = src[j];
    if (ch === '\\') {
      j += 2;
    } else if (!multiline && ch === '\n') {
      return { contentEnd: j, next: j };
    } else if (src.startsWith(quote, j)) {
      return { contentEnd: j, next: j + quote.length };
    } else {
      j++;
    }
  }
  return { contentEnd: src.length, next: src.length };
}

function lineEnd(src: string, from: number): number {
  const end = src.indexOf('\n', from);
  return end === -1 ? src.length : end;
}

function createBlanker(src: string) {
  const out = src.split('');
  return {
    blank(from: number, to: number) {
      for (let k = from; k < Math.min(to, out.length); k++) {
        if (out[k] !== '\n' && out[k] !== '\r') out[k] = ' ';
      }
    },
    result: () => out.join(''),
  };
}

export interface CLikeOptions {
  templateLiterals: boolean; // JS backticks
  textBlocks: boolean; // Java """ text blocks
}

export function stripCLike(src: string, options: CLikeOptions): string {
  const out = createBlanker(src);
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (src.startsWith('//', i)) {
      const end = lineEnd(src, i);
      out.blank(i, end);
      i = end;
    } else if (src.startsWith('/*', i)) {
      const close = src.indexOf('*/', i + 2);
      const end = close === -1 ? src.length : close + 2;
      out.blank(i, end);
      i = end;
    } else if (options.textBlocks && src.startsWith('"""', i)) {
      const scan = scanString(src, i + 3, '"""', true);
      out.blank(i + 3, scan.contentEnd);
      i = scan.next;
    } else if (ch === '"' || ch === "'") {
      const scan = scanString(src, i + 1, ch, false);
      out.blank(i + 1, scan.contentEnd);
      i = scan.next;
    } else if (options.templateLiterals && ch === '`') {
      const scan = scanString(src, i + 1, '`', true);
      out.blank(i + 1, scan.contentEnd);
      i = scan.next;
    } else {
      i++;
    }
  }
  return out.result();
}

export function stripPython(src: string): string {
  const out = createBlanker(src);
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '#') {
      const end = lineEnd(src, i);
      out.blank(i, end);
      i = end;
    } else if (src.startsWith('"""', i) || src.startsWith("'''", i)) {
      const quote = src.slice(i, i + 3);
      const scan = scanString(src, i + 3, quote, true);
      out.blank(i + 3, scan.contentEnd);
      i = scan.next;
    } else if (ch === '"' || ch === "'") {
      const scan = scanString(src, i + 1, ch, false);
      out.blank(i + 1, scan.contentEnd);
      i = scan.next;
    } else {
      i++;
    }
  }
  return out.result();
}

export function count(code: string, pattern: RegExp): number {
  return code.match(pattern)?.length ?? 0;
}
