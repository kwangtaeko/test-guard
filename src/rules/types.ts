import type { TestFile } from '../engine/compare.js';
import type { Hunk } from '../engine/diff.js';
import type { LiteralUse } from '../engine/literals.js';
import type { Analysis } from '../languages/index.js';
import type { Finding, Language } from '../types.js';
import type { RunnerConfig } from '../watched.js';

export interface RuleInput {
  before: Analysis | null; // set only when the old path is a test file
  after: Analysis | null; // set only when the new path is a test file
  beforePath: string | null; // null when added
  afterPath: string | null; // new path even if not a test file; null when deleted
  beforeLines: string[]; // raw lines of a watched file (empty otherwise)
  afterLines: string[];
  hunks: Hunk[]; // line diff of beforeLines → afterLines
  runnerConfig: RunnerConfig | null; // TG005 target (config `exclude` applied)
  addedToExistingDir: boolean; // a new runner config next to existing files
  guardFile: 'config' | 'hook' | null; // TG006 target
  implementationChanged: boolean | undefined; // TG008; unset per edit
  golden: boolean; // TG008: the old path is a file of expected output
  // TG008: a support file's stripped lines (`tests/fixtures.ts`, `conftest.py`)
  support: { language: Language; before: string[]; after: string[] } | null;
  testsNaming: ((name: string) => TestFile[]) | undefined; // TG008
  implementationFile: boolean; // TG009 target
  findLiteral: ((literals: string[]) => Map<string, LiteralUse>) | undefined; // TG009
}

export type RuleFinding = Omit<Finding, 'severity'>;

export type Rule = (input: RuleInput) => RuleFinding[];
