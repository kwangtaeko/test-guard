import { CONFIG_FILE, createContext, parseConfig } from '../config.js';
import { RULE_IDS, type RuleId } from '../rules/index.js';
import type { Finding } from '../types.js';
import { compareFiles, isWatched } from './compare.js';
import {
  afterSpec,
  type CompareMode,
  createWorktreeIndex,
  findRoot,
  listAfterFiles,
  listChanges,
  readBlob,
  readBlobIfExists,
  resolveBase,
} from './git.js';

export interface CheckOptions {
  cwd: string;
  mode: CompareMode;
  rules?: readonly RuleId[];
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
  const ctx = createContext(config);
  const ruleIds = (options.rules ?? RULE_IDS).filter(
    (id) => config.rules[id] !== 'off',
  );

  const worktree = mode.kind === 'worktree' ? createWorktreeIndex(root) : null;
  try {
    const env = worktree?.env;
    // Unwatched files are never read.
    const read = (spec: string, path: string) =>
      isWatched(path, ctx) ? readBlob(root, spec, env) : '';

    const findings: Finding[] = [];
    for (const { beforePath, afterPath } of listChanges(
      root,
      base,
      mode,
      env,
    )) {
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
      from: mode.kind === 'base' ? mode.ref : 'HEAD',
      findings: findings.sort(
        (a, b) =>
          a.path.localeCompare(b.path) ||
          (a.line ?? 0) - (b.line ?? 0) ||
          a.ruleId.localeCompare(b.ruleId),
      ),
      filesScanned: listAfterFiles(root, mode, env).filter((p) => ctx.detect(p))
        .length,
    };
  } finally {
    worktree?.dispose();
  }
}
