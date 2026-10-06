import type { Hunk } from '../engine/diff.js';
import type { Analysis } from '../languages/index.js';
import type { Finding } from '../types.js';
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
}

export type RuleFinding = Omit<Finding, 'severity'>;

export type Rule = (input: RuleInput) => RuleFinding[];
