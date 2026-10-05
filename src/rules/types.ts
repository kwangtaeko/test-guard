import type { Hunk } from '../engine/diff.js';
import type { Analysis } from '../languages/index.js';
import type { Finding } from '../types.js';

export interface RuleInput {
  before: Analysis | null; // set only when the old path is a test file
  after: Analysis | null; // set only when the new path is a test file
  afterPath: string | null; // new path even if not a test file; null when deleted
  hunks: Hunk[]; // line diff of before → after (a missing side has no lines)
}

export type RuleFinding = Omit<Finding, 'severity'>;

export type Rule = (input: RuleInput) => RuleFinding[];
