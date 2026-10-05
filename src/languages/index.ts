import { normalizePath } from '../paths.js';
import type { FileStats, Language } from '../types.js';
import { java } from './java.js';
import { js } from './js.js';
import { python } from './python.js';
import { count } from './strip.js';

export interface LanguageSpec {
  strip(source: string): string;
  tests: RegExp;
  assertions: RegExp;
  skips: RegExp;
}

export interface SkipMatch {
  line: number;
  text: string; // e.g. `it.skip`, `@Disabled`
}

export interface Analysis {
  stats: FileStats;
  lines: string[]; // stripped lines, same numbering as the source
  skips: SkipMatch[];
}

const SPECS: Record<Language, LanguageSpec> = { js, python, java };

export function toLf(source: string): string {
  return source.replace(/\r\n?/g, '\n');
}

export function analyzeSource(
  path: string,
  source: string,
  language: Language,
): Analysis {
  const spec = SPECS[language];
  const code = spec.strip(toLf(source));
  return {
    stats: {
      path: normalizePath(path),
      language,
      tests: count(code, spec.tests),
      assertions: count(code, spec.assertions),
      skips: count(code, spec.skips),
    },
    lines: code.split('\n'),
    skips: findMatches(code, spec.skips),
  };
}

export function analyzeFile(
  path: string,
  source: string,
  language: Language,
): FileStats {
  return analyzeSource(path, source, language).stats;
}

function findMatches(code: string, pattern: RegExp): SkipMatch[] {
  const matches: SkipMatch[] = [];
  let line = 1;
  let pos = 0;
  for (const match of code.matchAll(pattern)) {
    for (; pos < match.index; pos++) if (code[pos] === '\n') line++;
    matches.push({ line, text: match[0].replace(/\s*\($/, '') });
  }
  return matches;
}
