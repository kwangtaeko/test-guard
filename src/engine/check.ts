import {
  CONFIG_FILE,
  type Config,
  createContext,
  parseConfig,
} from '../config.js';
import { RULE_IDS, type RuleId } from '../rules/index.js';
import type { Finding } from '../types.js';
import {
  type CompareContext,
  changesCode,
  compareFiles,
  isDependencyFile,
  isImplementation,
  isWatched,
} from './compare.js';
import {
  afterSpec,
  type CompareMode,
  createWorktreeIndex,
  findRoot,
  listAfterFiles,
  listChanges,
  listTreeFiles,
  readBlob,
  readBlobIfExists,
  resolveBase,
} from './git.js';

export interface CheckOptions {
  cwd: string;
  mode: CompareMode;
  rules?: readonly RuleId[];
  countFiles?: boolean; // filesScanned costs a git call; hooks skip it
}

export interface CheckResult {
  mode: CompareMode;
  from: string;
  findings: Finding[];
  filesScanned: number; // test files on the "after" side
}

export function runCheck(options: CheckOptions): CheckResult {
  const { mode } = options;
  const root = findRoot(options.cwd);
  const base = resolveBase(root, mode);
  // Read from the "before" side, so a change cannot loosen its own check.
  const config = parseConfig(
    base ? readBlobIfExists(root, `${base}:${CONFIG_FILE}`) : null,
  );
  let baseDirs: Set<string> | undefined;
  const ctx: CompareContext = {
    ...createContext(config),
    // Only asked when a runner config is added, so the git call is rare.
    dirExisted: (dir) => {
      if (!base) return false;
      baseDirs ??= parentDirs(listTreeFiles(root, base));
      return baseDirs.has(dir);
    },
  };
  const ruleIds = activeRuleIds(config, options.rules);

  const worktree = mode.kind === 'worktree' ? createWorktreeIndex(root) : null;
  try {
    const env = worktree?.env;
    // Unwatched files are never read.
    const read = (spec: string, path: string) =>
      isWatched(path, ctx) ? readBlob(root, spec, env) : '';

    const findings: Finding[] = [];
    const changes = [...listChanges(root, base, mode, env)];
    // A real implementation change: code or dependencies, not just comments
    // or blank lines (TG008).
    ctx.implementationChanged = changes.some(({ beforePath, afterPath }) => {
      const path = afterPath ?? beforePath;
      if (path === null || !isImplementation(path, ctx)) return false;
      // Deleted or renamed code counts; an added file only with code in it.
      if (isDependencyFile(path) || afterPath === null) return true;
      if (beforePath !== null && beforePath !== afterPath) return true;
      return changesCode(
        base && beforePath ? readBlob(root, `${base}:${beforePath}`, env) : '',
        readBlob(root, afterSpec(mode, path), env),
      );
    });
    for (const { beforePath, afterPath } of changes) {
      const change = {
        before:
          beforePath && base
            ? {
                path: beforePath,
                content: read(`${base}:${beforePath}`, beforePath),
              }
            : null,
        after: afterPath
          ? {
              path: afterPath,
              content: read(afterSpec(mode, afterPath), afterPath),
            }
          : null,
      };
      for (const finding of compareFiles(change, ctx, ruleIds)) {
        const level = config.rules[finding.ruleId];
        findings.push({
          ...finding,
          severity: level === 'warn' ? 'warn' : 'error',
        });
      }
    }

    return {
      mode,
      from:
        mode.kind === 'base'
          ? mode.ref
          : mode.kind === 'worktree'
            ? (mode.from ?? 'HEAD')
            : 'HEAD',
      findings: findings.sort(
        (a, b) =>
          a.path.localeCompare(b.path) ||
          (a.line ?? 0) - (b.line ?? 0) ||
          a.ruleId.localeCompare(b.ruleId),
      ),
      filesScanned:
        options.countFiles === false
          ? 0
          : listAfterFiles(root, mode, env).filter((p) => ctx.detect(p)).length,
    };
  } finally {
    worktree?.dispose();
  }
}

export function activeRuleIds(
  config: Config,
  rules: readonly RuleId[] = RULE_IDS,
): RuleId[] {
  return rules.filter((id) => config.rules[id] !== 'off');
}

function parentDirs(files: string[]): Set<string> {
  const dirs = new Set<string>();
  for (const file of files) {
    let slash = file.lastIndexOf('/');
    while (slash !== -1) {
      dirs.add(file.slice(0, slash));
      slash = file.lastIndexOf('/', slash - 1);
    }
    dirs.add('');
  }
  return dirs;
}
