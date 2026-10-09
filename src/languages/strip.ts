// Replaces comments and string contents with spaces before regex counting.
// Quotes and line breaks are kept, so line numbers stay valid and
// `it('name', ...)` still matches `it(`.
// Template literal expressions (`${...}`) are code and stay, nested
// templates included. Known limit: JS regex literals.

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

  // Blanks a template literal's text up to the closing backtick; each
  // `${...}` inside is scanned as code. Returns the index after the literal.
  const scanTemplate = (start: number): number => {
    let j = start;
    let textStart = start;
    while (j < src.length) {
      const ch = src[j];
      if (ch === '\\') {
        j += 2;
      } else if (ch === '`') {
        out.blank(textStart, j);
        return j + 1;
      } else if (src.startsWith('${', j)) {
        out.blank(textStart, j + 2);
        j = scanCode(j + 2, true);
        out.blank(j - 1, j); // the closing `}`
        textStart = j;
      } else {
        j++;
      }
    }
    out.blank(textStart, src.length);
    return src.length;
  };

  // Scans code from `start`. Inside a template expression it stops after the
  // `}` that closes it.
  const scanCode = (start: number, inExpression: boolean): number => {
    let i = start;
    let depth = 0;
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
        i = scanTemplate(i + 1);
      } else if (inExpression && ch === '{') {
        depth++;
        i++;
      } else if (inExpression && ch === '}') {
        if (depth === 0) return i + 1;
        depth--;
        i++;
      } else {
        i++;
      }
    }
    return i;
  };

  scanCode(0, false);
  return out.result();
}

// javac decodes `\uXXXX` escapes before anything else, so `\u0040Disabled`
// is `@Disabled` and `\u000a` ends a `//` comment. They are decoded before
// stripping; the result keeps the source's lines (a decoded line break
// becomes a space), not its columns.
export function stripJava(src: string): string {
  const options = { templateLiterals: false, textBlocks: true };
  if (!src.includes('\\u')) return stripCLike(src, options);
  const unicodeEscape = /\\u+([0-9a-fA-F]{4})/y;
  let decoded = '';
  const synthetic: boolean[] = []; // per decoded char: came from an escape
  let backslashes = 0; // contiguous backslashes right before `i`
  for (let i = 0; i < src.length; ) {
    unicodeEscape.lastIndex = i;
    const match = backslashes % 2 === 0 ? unicodeEscape.exec(src) : null;
    if (match) {
      decoded += String.fromCharCode(Number.parseInt(match[1] ?? '', 16));
      synthetic.push(true);
      backslashes = 0;
      i += match[0].length;
    } else {
      const ch = src[i] ?? '';
      decoded += ch;
      synthetic.push(false);
      backslashes = ch === '\\' ? backslashes + 1 : 0;
      i++;
    }
  }
  const stripped = stripCLike(decoded, options);
  let out = '';
  for (let k = 0; k < stripped.length; k++) {
    const ch = stripped[k] ?? '';
    out += synthetic[k] && (ch === '\n' || ch === '\r') ? ' ' : ch;
  }
  return out;
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
