// Agent hook logic shared by the Claude Code and Codex adapters: hook input →
// shared engine → hook output (ROADMAP §4.4). Adapters only turn their tool
// calls into file changes or shell commands.
// Accuracy first, then speed: PreToolUse runs on every matched tool call, so
// work is skipped only where it cannot change the result. File changes make
// one git call per repository (the committed config); shell commands call git
// only when they delete or move files or try to bypass test-guard.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import picomatch from 'picomatch';
import { findApproval } from '../approval.js';
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
import { diffLines } from '../engine/diff.js';
import {
  listWorktreeFiles,
  readBlobIfExists,
  resolveCommit,
} from '../engine/git.js';
import { literalFinder } from '../engine/literals.js';
import {
  blockStop,
  denyToolUse,
  notifyUser,
  type PreToolUseInput,
  parseHookInput,
  type StopInput,
} from '../hook-io/common.js';
import { toLf } from '../languages/index.js';
import { normalizePath } from '../paths.js';
import type { RuleId } from '../rules/index.js';
import type { PatchedFile } from './apply-patch.js';
import { recordSessionStart, sessionStart } from './session.js';
import {
  commitMessageFiles,
  type FileOp,
  fileOps,
  findBypass,
  realPath,
  updatesSnapshots,
} from './shell.js';

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
    rememberSessionStart(input);
    if (input.event === 'Stop') return onStop(input);
    const violations = checkToolUse(input);
    return violations.length > 0 ? denyToolUse(blockedReason(violations)) : '';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return notifyUser(`test-guard hook error: ${message}`);
  }
}

// Best effort: without a recorded start, Stop compares with HEAD as before.
function rememberSessionStart(input: PreToolUseInput | StopInput): void {
  if (!input.sessionId) return;
  const root = findRepoRoot(resolve(input.cwd));
  if (!root) return;
  try {
    recordSessionStart(root, input.sessionId);
  } catch {
    // e.g. a read-only .git directory
  }
}

// Judges one file change with absolute paths (an edit applied in memory),
// comparing it with the file on disk, so only what this tool call changes is
// judged. The working tree as a whole is checked against HEAD at Stop.
export function checkFileChange(input: PatchedFile): Violation[] {
  // Where the write really lands: links, letter case and `::$DATA` resolved.
  const change = {
    ...input,
    beforePath: input.beforePath && realPath(input.beforePath),
    afterPath: input.afterPath && realPath(input.afterPath),
  };
  const anchor = change.afterPath ?? change.beforePath;
  if (!anchor) return [];
  // Before the repository checks: settings outside the repository, such as
  // ~/.claude/settings.json, can turn hooks off too.
  const untracked = [change.beforePath, change.afterPath]
    .map((p) => p && untrackedGuard(p))
    .find(Boolean);
  if (untracked) return [untracked];
  const unplugged = droppedPlugin(change);
  if (unplugged) return [unplugged];
  const bypass = writtenBypass(change);
  if (bypass.length > 0) return bypass;
  const root = findRepoRoot(dirname(anchor));
  if (!root) return [];
  const before = change.beforePath ? repoPath(root, change.beforePath) : null;
  const after = change.afterPath ? repoPath(root, change.afterPath) : null;

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

// Files that keep test-guard running but that git doesn't track, so neither
// Stop nor CI would see a change: git internals (hooks, config, session
// records), local Claude Code settings, the installed package and plugin.
const UNTRACKED_GUARDS: [RegExp, string][] = [
  [/(?:^|\/)\.git\/hooks(?:\/|$)/i, 'edits a git hook'],
  [/(?:^|\/)\.git(?:\/|$)/i, 'edits git internals (.git)'],
  [
    /(?:^|\/)\.claude\/settings\.local\.json$/i,
    'edits local Claude Code settings, which git does not track',
  ],
  [
    /(?:^|\/)node_modules\/(?:\.bin\/)?test-guard(?:\.\w+)?(?:\/|$)/i,
    'edits the installed test-guard',
  ],
  [/(?:^|\/)\.claude\/plugins\/.*test-guard/i, 'edits the test-guard plugin'],
];

// Claude Code settings (in or outside the repository) that enabled the
// test-guard plugin and no longer do: the entry removed, or set to anything
// but `true`.
function droppedPlugin(change: PatchedFile): Violation | null {
  const path = normalizePath(change.afterPath ?? '');
  if (!/(?:^|\/)\.claude\/settings[\w.-]*\.json$/i.test(path)) return null;
  const enabled = (text: string | null) => {
    try {
      const plugins = JSON.parse(text ?? '')?.enabledPlugins;
      return Object.keys(plugins ?? {}).filter(
        (k) => /^test-guard(?:@|$)/i.test(k) && plugins[k] === true,
      );
    } catch {
      return [];
    }
  };
  const after = new Set(enabled(change.after));
  const lost = enabled(change.before).filter((k) => !after.has(k));
  return lost.length > 0
    ? {
        ruleId: 'TG006',
        message: `turns off the test-guard plugin (\`enabledPlugins\` ${lost[0]})`,
        path,
      }
    : null;
}

function untrackedGuard(path: string): Violation | null {
  const normalized = normalizePath(path);
  const hit = UNTRACKED_GUARDS.find(([re]) => re.test(normalized));
  return hit ? { ruleId: 'TG006', message: hit[1], path: normalized } : null;
}

// Text written into a file that only serves to get around test-guard: a
// script that commits with `--no-verify`, a commit message carrying an
// approval trailer, settings that turn hooks off, git config that points
// the hooks elsewhere. Markdown is exempt, since docs describe these. Only
// lines this change adds are looked at.
const WRITTEN_BYPASS: [RegExp, string][] = [
  [/--no-verify(?![\w-])/, '`--no-verify`, which skips test-guard’s git hook'],
  [
    /\bgit\s+commit\b[^\n]*\s-[a-zA-Z]*n[a-zA-Z]*(?=\s|$)|\bHUSKY\s*=\s*["']?0\b|\bLEFTHOOK\s*=\s*["']?(?:0|false)\b/m,
    'a commit that skips the git hook (`-n`, `HUSKY=0`, `LEFTHOOK=0`)',
  ],
  [
    /core\.hookspath|^\s*hookspath\s*=/im,
    '`core.hooksPath`, which skips test-guard’s git hook',
  ],
  [/disableAllHooks/, '`disableAllHooks`, which turns off agent hooks'],
  [
    /test-guard-approved\s*[:=]/i,
    'a `Test-Guard-Approved` trailer (only humans approve)',
  ],
  [
    /["']test-guard(?:@[^"'\s:]*)?\\?["']\s*:\s*false\b/,
    '`enabledPlugins` turning test-guard off',
  ],
  [
    /\bclaude\s+plugins?\s+(?:disable|uninstall|remove)\b|\b(?:npm|pnpm|yarn|bun)\s+(?:uninstall|un|remove|rm|r)\b[^\n]*\btest-guard\b/,
    'a command that removes test-guard',
  ],
  [
    /\bGIT_CONFIG(?:_GLOBAL|_SYSTEM|_PARAMETERS)?\s*=/,
    'a git config override, which can skip test-guard’s git hook',
  ],
  [
    /^\s*\[\s*(?:include(?:If\b[^\]]*)?|alias)\s*\]|\binclude(?:If\.\S*)?\.path\b|\bcommit\.template\b|\bgit\b[^\n]*\balias\.[\w-]+/im,
    'a git include, alias or commit template, which can skip test-guard',
  ],
];

function writtenBypass(change: PatchedFile): Violation[] {
  if (change.after === null || !change.afterPath) return [];
  if (/\.mdx?$/i.test(change.afterPath)) return [];
  const before = change.before === null ? [] : toLf(change.before).split('\n');
  const after = toLf(change.after).split('\n');
  const added = diffLines(before, after)
    .flatMap((hunk) => hunk.added)
    .map((line) => after[line - 1] ?? '')
    .join('\n');
  return WRITTEN_BYPASS.filter(([re]) => re.test(added)).map(([, what]) => ({
    ruleId: 'TG006',
    message: `writes ${what}`,
    path: normalizePath(change.afterPath ?? ''),
  }));
}

export function checkShell(command: string, cwd: string): Violation[] {
  const violations: Violation[] = findBypass(command, cwd).map((message) => ({
    ruleId: 'TG006',
    message,
  }));
  if (updatesSnapshots(command, cwd)) {
    violations.push({
      ruleId: 'TG008',
      message:
        'runs tests with `-u`, which rewrites snapshots to match the current output',
    });
  }
  // A trailer written into a file first, then `git commit -F file`.
  for (const file of commitMessageFiles(command, cwd)) {
    if (existsSync(file) && findApproval(readFileSync(file, 'utf8'))) {
      violations.push({
        ruleId: 'TG006',
        message:
          'commits a message with a `Test-Guard-Approved` trailer (only humans approve)',
      });
    }
  }
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
      op.destIsDir === true ||
      (op.dest !== undefined &&
        existsSync(op.dest) &&
        statSync(op.dest).isDirectory());
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
  // Compared with where the session started, so the agent's own commits
  // count too.
  const from = input.sessionId ? sessionStart(root, input.sessionId) : null;
  const result = runCheck({
    cwd: root,
    mode: from ? { kind: 'worktree', from } : { kind: 'worktree' },
    countFiles: false,
  });
  const errors = result.findings.filter((f) => f.severity === 'error');
  if (errors.length === 0) return '';
  if (input.stopHookActive) {
    // Blocked once already: don't hold the session hostage, e.g. over test
    // changes a human made on purpose.
    return notifyUser(
      `test-guard: ${errors.length} test weakening finding(s) remain${from ? ` since ${from.slice(0, 7)}` : ' in the working tree'}. Run \`test-guard check\` to review.`,
    );
  }
  return blockStop(
    [
      from
        ? `[test-guard] Tests were weakened in this session (working tree and commits since ${from.slice(0, 7)}):`
        : '[test-guard] Tests were weakened in the working tree (compared with HEAD):',
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
    loaded = {
      config,
      ctx: {
        ...createContext(config),
        // Before the tool runs, the disk is the "before" side.
        dirExisted: (dir) => {
          const path = join(root, dir);
          return existsSync(path) && readdirSync(path).length > 0;
        },
      },
    };
    // Test inputs special-cased in an edit (TG009), looked up in HEAD.
    const head = resolveCommit(root, 'HEAD');
    if (head) loaded.ctx.findLiteral = literalFinder(root, head, loaded.ctx);
    contexts.set(root, loaded);
  }
  return loaded;
}

function blockingRuleIds(config: Config): RuleId[] {
  return activeRuleIds(config).filter((id) => config.rules[id] !== 'warn');
}
