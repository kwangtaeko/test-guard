// Agent hook logic shared by the Claude Code and Codex adapters: hook input →
// shared engine → hook output (ROADMAP §4.4). Adapters only turn their tool
// calls into file changes or shell commands.
// Accuracy first, then speed: PreToolUse runs on every matched tool call, so
// work is skipped only where it cannot change the result. File changes make
// one git call per repository (the committed config); shell commands call git
// only when they delete or move files or try to bypass test-guard.
import { existsSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import picomatch from 'picomatch';
import {
  CONFIG_FILE,
  type Config,
  createContext,
  parseConfig,
} from '../config.js';
import { activeRuleIds, runCheck } from '../engine/check.js';
import {
  type CompareContext,
  compareFiles,
  isWatched,
} from '../engine/compare.js';
import { listWorktreeFiles, readBlobIfExists } from '../engine/git.js';
import {
  blockStop,
  denyToolUse,
  notifyUser,
  type PreToolUseInput,
  parseHookInput,
  type StopInput,
} from '../hook-io/common.js';
import { normalizePath } from '../paths.js';
import type { RuleId } from '../rules/index.js';
import type { PatchedFile } from './apply-patch.js';
import { type FileOp, fileOps, findBypass } from './shell.js';

export interface Violation {
  ruleId: string;
  message: string;
  path?: string;
  line?: number;
}

const ADVICE =
  'Do not weaken tests to make them pass. Fix the implementation instead.\n' +
  'If you believe the test itself is wrong, stop and explain why to the user.';

// Returns the hook's stdout ('' allows). Never throws: a broken hook must not
// stop the agent, so errors go to the user as a message instead.
export function runHook(
  stdin: string,
  checkToolUse: (input: PreToolUseInput) => Violation[],
): string {
  contexts.clear();
  try {
    const input = parseHookInput(stdin);
    if (input.event === 'Stop') return onStop(input);
    const violations = checkToolUse(input);
    return violations.length > 0 ? denyToolUse(blockedReason(violations)) : '';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return notifyUser(`test-guard hook error: ${message}`);
  }
}

// Judges one file change with absolute paths (an edit applied in memory),
// comparing it with the file on disk, so only what this tool call changes is
// judged. The working tree as a whole is checked against HEAD at Stop.
export function checkFileChange(change: PatchedFile): Violation[] {
  const anchor = change.afterPath ?? change.beforePath;
  if (!anchor) return [];
  const root = findRepoRoot(dirname(anchor));
  if (!root) return [];
  const before = change.beforePath ? repoPath(root, change.beforePath) : null;
  const after = change.afterPath ? repoPath(root, change.afterPath) : null;
  const gitHook = [before, after].find((p) => p?.startsWith('.git/hooks/'));
  if (gitHook)
    return [{ ruleId: 'TG006', message: 'edits a git hook', path: gitHook }];
  if ([before, after].some((p) => p?.startsWith('.git/'))) return [];

  const { config, ctx } = loadContext(root);
  const watched = (p: string | null) => p !== null && isWatched(p, ctx);
  if (!watched(before) && !watched(after)) return [];
  return compareFiles(
    {
      before:
        before !== null && change.before !== null
          ? { path: before, content: change.before }
          : null,
      after:
        after !== null && change.after !== null
          ? { path: after, content: change.after }
          : null,
    },
    ctx,
    blockingRuleIds(config),
  );
}

export function checkShell(command: string, cwd: string): Violation[] {
  const violations: Violation[] = findBypass(command).map((message) => ({
    ruleId: 'TG006',
    message,
  }));
  const ops = fileOps(command, cwd);
  if (violations.length === 0 && ops.length === 0) return [];

  const root = findRepoRoot(cwd);
  if (!root) return violations;
  const { config, ctx } = loadContext(root);
  const rules = blockingRuleIds(config);
  if (ops.length > 0 && rules.includes('TG001')) {
    violations.push(...checkFileOps(ops, root, ctx));
  }
  return violations.filter((v) => rules.includes(v.ruleId as RuleId));
}

function checkFileOps(
  ops: FileOp[],
  root: string,
  ctx: CompareContext,
): Violation[] {
  const tests = listWorktreeFiles(root).filter((f) => ctx.detect(f));
  const violations: Violation[] = [];
  for (const op of ops) {
    const dest = op.dest ? repoPath(root, op.dest) : null;
    const destIsDir =
      op.dest !== undefined &&
      existsSync(op.dest) &&
      statSync(op.dest).isDirectory();
    for (const source of op.sources) {
      const src = repoPath(root, source);
      if (src === null) continue;
      const glob = /[*?[\]{}]/.test(src);
      const matches = glob
        ? picomatch(src, { dot: true })
        : (f: string) => src === '' || f === src || f.startsWith(`${src}/`);
      const hits = tests.filter((f) => matches(f));
      if (hits.length === 0) continue;
      if (op.kind === 'delete') {
        violations.push({
          ruleId: 'TG001',
          message: `\`${op.verb}\` deletes test files: ${list(hits)}`,
        });
        continue;
      }
      const movedOut = hits.filter((f) => {
        const to = movedPath(f, src, glob, dest, destIsDir);
        return to === null || ctx.detect(to) === null;
      });
      if (movedOut.length > 0) {
        violations.push({
          ruleId: 'TG001',
          message: `\`${op.verb}\` moves test files to a non-test path: ${list(movedOut)}`,
        });
      }
    }
  }
  return violations;
}

function movedPath(
  file: string,
  src: string,
  glob: boolean,
  dest: string | null,
  destIsDir: boolean,
): string | null {
  if (dest === null) return null; // moved out of the repository
  const join = (...parts: string[]) => parts.filter(Boolean).join('/');
  const name = (p: string) => p.split('/').pop() ?? '';
  if (file === src) return destIsDir ? join(dest, name(file)) : dest;
  if (glob) return join(dest, name(file));
  const inner = file.slice(src.length + 1);
  return destIsDir ? join(dest, name(src), inner) : join(dest, inner);
}

function onStop(input: StopInput): string {
  const root = findRepoRoot(resolve(input.cwd));
  if (!root) return '';
  const result = runCheck({
    cwd: root,
    mode: { kind: 'worktree' },
    countFiles: false,
  });
  const errors = result.findings.filter((f) => f.severity === 'error');
  if (errors.length === 0) return '';
  if (input.stopHookActive) {
    // Blocked once already: don't hold the session hostage, e.g. over test
    // changes a human made on purpose.
    return notifyUser(
      `test-guard: ${errors.length} test weakening finding(s) remain in the working tree. Run \`test-guard check\` to review.`,
    );
  }
  return blockStop(
    [
      '[test-guard] Tests were weakened in the working tree (compared with HEAD):',
      ...errors.map((f) => `- ${describe(f)}`),
      'Revert these test changes and fix the implementation instead.',
      'If you believe a test itself is wrong, stop and explain why to the user.',
    ].join('\n'),
  );
}

function blockedReason(violations: Violation[]): string {
  const [first] = violations;
  const head =
    violations.length === 1 && first
      ? `[test-guard] Blocked: ${describe(first)}.`
      : [
          '[test-guard] Blocked:',
          ...violations.map((v) => `- ${describe(v)}`),
        ].join('\n');
  return `${head}\n${ADVICE}`;
}

function describe(v: Violation): string {
  const where = v.path
    ? ` in ${v.path}${v.line === undefined ? '' : `:${v.line}`}`
    : '';
  return `${v.ruleId} — ${v.message}${where}`;
}

function list(files: string[]): string {
  const shown = files.slice(0, 3).join(', ');
  return files.length > 3 ? `${shown} (+${files.length - 3} more)` : shown;
}

export function findRepoRoot(start: string): string | null {
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, '.git'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function repoPath(root: string, file: string): string | null {
  const rel = relative(root, file);
  if (rel.startsWith('..') || isAbsolute(rel)) return null;
  return normalizePath(rel);
}

// The committed config, as `check` uses: an uncommitted change (made through
// any tool) can never loosen the judgment. Costs one git call.
// Cached per repository within one hook call (cleared by runHook).
const contexts = new Map<string, { config: Config; ctx: CompareContext }>();

function loadContext(root: string): { config: Config; ctx: CompareContext } {
  let loaded = contexts.get(root);
  if (!loaded) {
    const config = parseConfig(readBlobIfExists(root, `HEAD:${CONFIG_FILE}`));
    loaded = { config, ctx: createContext(config) };
    contexts.set(root, loaded);
  }
  return loaded;
}

function blockingRuleIds(config: Config): RuleId[] {
  return activeRuleIds(config).filter((id) => config.rules[id] !== 'warn');
}
