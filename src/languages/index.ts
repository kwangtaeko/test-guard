import { normalizePath } from '../paths.js';
import type { FileStats, Language } from '../types.js';
import { analyzeJava } from './java.js';
import { analyzeJs } from './js.js';
import { analyzePython } from './python.js';

export type Counts = Pick<FileStats, 'tests' | 'assertions' | 'skips'>;

const ANALYZERS: Record<Language, (source: string) => Counts> = {
  js: analyzeJs,
  python: analyzePython,
  java: analyzeJava,
};

export function analyzeFile(
  path: string,
  source: string,
  language: Language,
): FileStats {
  const counts = ANALYZERS[language](source.replace(/\r\n?/g, '\n'));
  return { path: normalizePath(path), language, ...counts };
}
