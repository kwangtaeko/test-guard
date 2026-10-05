export type Language = 'js' | 'python' | 'java';

export type Severity = 'error' | 'warn';

export interface FileStats {
  path: string; // relative to the repository root, '/' separators
  language: Language;
  tests: number;
  assertions: number;
  skips: number; // skip/disable/only/todo/xfail total
}

export interface Finding {
  ruleId: string; // 'TG001' ...
  severity: Severity;
  path: string;
  line?: number;
  message: string; // English (doubles as agent feedback)
  before?: number;
  after?: number;
}
