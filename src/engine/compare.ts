import { analyzeSource, toLf } from '../languages/index.js';
import type { TestFileDetector } from '../paths.js';
import { RULES, type RuleId } from '../rules/index.js';
import type { RuleFinding, RuleInput } from '../rules/types.js';
import { guardFileKind, isSnapshot, runnerConfigKind } from '../watched.js';
import { diffLines } from './diff.js';
import type { LiteralUse } from './literals.js';

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
  // Whether a directory ('' is the root) had files before the change. A new
  // runner config in an existing directory is judged; in a new one (a new
  // package) it is not. Without it, new configs are not judged.
  dirExisted?(dir: string): boolean;
  // Whether the comparison changed any implementation file (TG008). Unset
  // when one file is judged on its own (an agent's edit), where it can't be
  // known.
  implementationChanged?: boolean;
  // Where a literal appeared before the change (TG009). Unset when there is
  // no "before" to search.
  findLiteral?(literals: string[]): Map<string, LiteralUse>;
}

// Whether the engine needs the contents of this path.
export function isWatched(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) !== null ||
    isSnapshot(path) ||
    guardFileKind(path) !== null ||
    (runnerConfigKind(path) !== null && !ctx.excluded(path)) ||
    (ctx.findLiteral !== undefined && isImplementationCode(path, ctx))
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
  // A workflow renamed away (`ci.yml` → `ci.yml.off`) is judged as one.
  const runnerConfig = ctx.excluded(path)
    ? null
    : (runnerConfigKind(path) ??
      (before && runnerConfigKind(before.path) === 'workflow'
        ? 'workflow'
        : null));
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
    runnerConfig,
    addedToExistingDir:
      runnerConfig !== null &&
      change.before === null &&
      change.after !== null &&
      ctx.dirExisted?.(parentDir(change.after.path)) === true,
    implementationChanged: ctx.implementationChanged,
    implementationFile: isImplementationCode(path, ctx),
    findLiteral: ctx.findLiteral,
    guardFile:
      guardFileKind(change.after?.path ?? '') ??
      guardFileKind(change.before?.path ?? ''),
  };
}

// Dependency manifests and lockfiles: a dependency bump can change outputs.
const DEPENDENCIES =
  /(?:^|\/)(?:package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|requirements[\w.-]*\.txt|pyproject\.toml|poetry\.lock|uv\.lock|Pipfile(?:\.lock)?|pom\.xml|build\.gradle(?:\.kts)?|gradle\.lockfile|go\.(?:mod|sum)|Cargo\.(?:toml|lock)|Gemfile(?:\.lock)?|composer\.(?:json|lock))$/;
const CODE =
  /\.(?:[cm]?[jt]sx?|vue|svelte|py|java|kt|kts|scala|groovy|go|rs|cs|fs|vb|rb|php|swift|m|mm|c|cc|cpp|cxx|h|hh|hpp|sql|sh|ps1)$/i;

// Files whose change can explain new expected values (TG008): code and
// dependencies outside the test folders. Config, data and docs don't count,
// so touching `.gitignore` or adding an empty file explains nothing.
export function isImplementation(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) === null &&
    !isSnapshot(path) &&
    guardFileKind(path) === null &&
    (DEPENDENCIES.test(path) ||
      (CODE.test(path) &&
        !/(?:^|\/)(?:tests?|__tests__|spec|__mocks__|fixtures?)\//i.test(path)))
  );
}

export const isDependencyFile = (path: string) => DEPENDENCIES.test(path);

// Implementation code, not a manifest or lockfile.
export const isImplementationCode = (path: string, ctx: CompareContext) =>
  isImplementation(path, ctx) && !isDependencyFile(path);

// Whether a code change does anything: lines other than blank ones and
// comments changed.
export function changesCode(before: string, after: string): boolean {
  const hunks = diffLines(splitLines(before), splitLines(after));
  const lines = [
    ...hunks.flatMap((h) => h.deleted.map((n) => splitLines(before)[n - 1])),
    ...hunks.flatMap((h) => h.added.map((n) => splitLines(after)[n - 1])),
  ];
  return lines.some((line) => {
    const t = (line ?? '').trim();
    return t !== '' && !/^(?:\/\/|#|\/\*|\*|<!--|--)/.test(t);
  });
}

function parentDir(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

function splitLines(content: string): string[] {
  return content === '' ? [] : toLf(content).split('\n');
}
