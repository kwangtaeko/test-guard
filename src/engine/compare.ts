import { analyzeSource, toLf } from '../languages/index.js';
import type { TestFileDetector } from '../paths.js';
import { RULES, type RuleId } from '../rules/index.js';
import type { RuleFinding, RuleInput } from '../rules/types.js';
import { diffLines } from './diff.js';

export interface FileVersion {
  path: string;
  content: string;
}

// One file before and after a change. A rename has two different paths,
// an added file has no `before`, a deleted file has no `after`.
export interface FileChange {
  before: FileVersion | null;
  after: FileVersion | null;
}

export function compareFiles(
  change: FileChange,
  detect: TestFileDetector,
  ruleIds: readonly RuleId[],
): RuleFinding[] {
  const input = toRuleInput(change, detect);
  if (!input) return [];
  return ruleIds.flatMap((id) => RULES[id](input));
}

function toRuleInput(
  change: FileChange,
  detect: TestFileDetector,
): RuleInput | null {
  const beforeLang = change.before && detect(change.before.path);
  const afterLang = change.after && detect(change.after.path);
  if (!beforeLang && !afterLang) return null;

  const before =
    change.before && beforeLang
      ? analyzeSource(change.before.path, change.before.content, beforeLang)
      : null;
  const after =
    change.after && afterLang
      ? analyzeSource(change.after.path, change.after.content, afterLang)
      : null;
  return {
    before,
    after,
    afterPath: change.after?.path ?? null,
    hunks: diffLines(
      before && change.before ? splitLines(change.before.content) : [],
      after && change.after ? splitLines(change.after.content) : [],
    ),
  };
}

function splitLines(content: string): string[] {
  return content === '' ? [] : toLf(content).split('\n');
}
