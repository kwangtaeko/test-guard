import {
  CONFIG_FILE,
  type Config,
  createContext,
  parseConfig,
} from '../config.js';
import { mochaTestPatterns } from '../mocha.js';
import { nodeTestPatterns } from '../node-test.js';
import { RULE_IDS, type RuleId } from '../rules/index.js';
import type { Finding } from '../types.js';
import {
  type CompareContext,
  changesCode,
  compareFiles,
  isDependencyFile,
  isImplementation,
  isWatched,
  type TestFile,
} from './compare.js';
import {
  afterSpec,
  type CompareMode,
  createWorktreeIndex,
  findRoot,
  grepTree,
  listAfterFiles,
  listChanges,
  listTreeFiles,
  readBlob,
  readBlobIfExists,
  resolveBase,
} from './git.js';
import { literalFinder } from './literals.js';

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
  const committed = (path: string) =>
    base ? readBlobIfExists(root, `${base}:${path}`) : null;
  let baseDirs: Set<string> | undefined;
  const ctx: CompareContext = {
    ...createContext(config, [
      ...mochaTestPatterns(committed),
      ...nodeTestPatterns(committed),
    ]),
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
    if (base) {
      ctx.findLiteral = literalFinder(root, base, ctx);
      ctx.testsNaming = testsNaming(root, base, ctx, env);
    }
    // A real implementation change: code or dependencies, not just comments
    // or blank lines (TG008).
    ctx.implementationChanged = changes.some(({ beforePath, afterPath }) => {
      const path = afterPath ?? beforePath;
      if (path === null || !isImplementation(path, ctx)) return false;
      // Deleted code counts; an added or moved file only with code in it
      // or changed.
      if (isDependencyFile(path) || afterPath === null) return true;
      return changesCode(
        base && beforePath ? readBlob(root, `${base}:${beforePath}`, env) : '',
        readBlob(root, afterSpec(mode, path), env),
        path,
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

// Test files in `base` that mention a name as a whole word (TG008).
function testsNaming(
  root: string,
  base: string,
  ctx: CompareContext,
  env: NodeJS.ProcessEnv | undefined,
): (name: string) => TestFile[] {
  const cache = new Map<string, TestFile[]>();
  return (name) => {
    let found = cache.get(name);
    if (!found) {
      let paths: string[] = [];
      try {
        paths = [
          ...new Set(grepTree(root, base, [name], true).map((h) => h.path)),
        ];
      } catch {
        // Too much output or an unreadable tree: none found.
      }
      found = paths.flatMap((path) => {
        const language = ctx.detect(path);
        return language
          ? [
              {
                path,
                language,
                content: readBlob(root, `${base}:${path}`, env),
              },
            ]
          : [];
      });
      cache.set(name, found);
    }
    return found;
  };
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
