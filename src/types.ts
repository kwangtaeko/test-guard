export type Language = 'js' | 'python' | 'java';

export interface FileStats {
  path: string; // relative to the repository root, '/' separators
  language: Language;
  tests: number;
  assertions: number;
  skips: number; // skip/disable/only/todo/xfail total
}
