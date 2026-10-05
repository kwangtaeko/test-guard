import { analyzeSource, toLf } from '../languages/index.js';
import type { TestFileDetector } from '../paths.js';
import { RULES, type RuleId } from '../rules/index.js';
import type { RuleFinding, RuleInput } from '../rules/types.js';
import { guardFileKind, runnerConfigKind } from '../watched.js';
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

export interface CompareContext {
  detect: TestFileDetector; // test files, config `exclude` already applied
  excluded(path: string): boolean; // config `exclude`
}

// Whether the engine needs the contents of this path.
export function isWatched(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) !== null ||
    guardFileKind(path) !== null ||
    (runnerConfigKind(path) !== null && !ctx.excluded(path))
  );
}

export function compareFiles(
  change: FileChange,
  ctx: CompareContext,
  ruleIds: readonly RuleId[],
): RuleFinding[] {
  const input = toRuleInput(change, ctx);
  if (!input) return [];
  return ruleIds.flatMap((id) => RULES[id](input));
}

function toRuleInput(
  change: FileChange,
  ctx: CompareContext,
): RuleInput | null {
  const before =
    change.before && isWatched(change.before.path, ctx) ? change.before : null;
  const after =
    change.after && isWatched(change.after.path, ctx) ? change.after : null;
  if (!before && !after) return null;

  const beforeLang = before && ctx.detect(before.path);
  const afterLang = after && ctx.detect(after.path);
  const path = after?.path ?? before?.path ?? '';
  const beforeLines = before ? splitLines(before.content) : [];
  const afterLines = after ? splitLines(after.content) : [];
  return {
    before:
      before && beforeLang
        ? analyzeSource(before.path, before.content, beforeLang)
        : null,
    after:
      after && afterLang
        ? analyzeSource(after.path, after.content, afterLang)
        : null,
    beforePath: change.before?.path ?? null,
    afterPath: change.after?.path ?? null,
    beforeLines,
    afterLines,
    hunks: diffLines(beforeLines, afterLines),
    runnerConfig: ctx.excluded(path) ? null : runnerConfigKind(path),
    guardFile:
      guardFileKind(change.after?.path ?? '') ??
      guardFileKind(change.before?.path ?? ''),
  };
}

function splitLines(content: string): string[] {
  return content === '' ? [] : toLf(content).split('\n');
}
