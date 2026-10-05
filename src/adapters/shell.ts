// Shell command analysis for agent hooks (Bash and PowerShell). A best-effort
// tokenizer for obvious cases only (ROADMAP §1.4): it does not expand
// variables or follow scripts.
import { resolve } from 'node:path';

const SEPARATORS = new Set(['\n', ';', '|', '&', '(', ')', '`']);

// Splits a command into simple commands (`a && b | c; $(d)`) of tokens.
// Quotes group words; backslashes stay literal for Windows paths.
export function splitCommand(command: string): string[][] {
  const segments: string[][] = [];
  let tokens: string[] = [];
  let current = '';
  let inToken = false;
  let quote: string | null = null;
  const endToken = () => {
    if (inToken) tokens.push(current);
    current = '';
    inToken = false;
  };
  const endSegment = () => {
    endToken();
    if (tokens.length > 0) segments.push(tokens);
    tokens = [];
  };
  for (const ch of command) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
    } else if (SEPARATORS.has(ch)) {
      endSegment();
    } else if (ch === ' ' || ch === '\t' || ch === '\r') {
      endToken();
    } else {
      current += ch;
      inToken = true;
    }
  }
  endSegment();
  return segments.map(unwrap).filter((s) => s.length > 0);
}

// Drops `VAR=x`, `sudo`, `env` and similar prefixes so tokens[0] is the program.
function unwrap(tokens: string[]): string[] {
  let i = 0;
  while (
    i < tokens.length &&
    (/^[A-Za-z_]\w*=/.test(tokens[i] ?? '') ||
      ['sudo', 'env', 'command', 'exec', 'nohup', 'time', '&'].includes(
        tokens[i] ?? '',
      ))
  ) {
    i++;
  }
  return tokens.slice(i);
}

export function verbOf(tokens: string[]): string {
  const first = (tokens[0] ?? '').toLowerCase().replace(/\\/g, '/');
  return (first.split('/').pop() ?? '').replace(/\.exe$/, '');
}

// `git -C dir -c k=v sub ...` → { sub, rest, configs }
function gitParts(tokens: string[]) {
  const configs: string[] = [];
  let i = 1;
  while (i < tokens.length && (tokens[i] ?? '').startsWith('-')) {
    const flag = tokens[i] ?? '';
    if (flag === '-c') configs.push(tokens[i + 1] ?? '');
    i += flag === '-c' || flag === '-C' ? 2 : 1;
  }
  return { sub: tokens[i] ?? '', rest: tokens.slice(i + 1), configs };
}

const READ_ONLY = new Set([
  'cat',
  'type',
  'less',
  'more',
  'head',
  'tail',
  'grep',
  'rg',
  'findstr',
  'select-string',
  'sls',
  'get-content',
  'gc',
  'ls',
  'dir',
  'get-childitem',
  'gci',
  'echo',
]);
const READ_ONLY_GIT = new Set([
  'log',
  'show',
  'grep',
  'diff',
  'blame',
  'status',
]);

function isReadOnly(tokens: string[]): boolean {
  const verb = verbOf(tokens);
  if (verb === 'git') return READ_ONLY_GIT.has(gitParts(tokens).sub);
  return READ_ONLY.has(verb) && !tokens.some((t) => t.startsWith('>'));
}

// TG006: obvious attempts to get around test-guard (ROADMAP §3.3).
// git accepts any unambiguous prefix of a long option, such as `--no-veri`.
const isNoVerify = (token: string) =>
  token.length >= 6 && '--no-verify'.startsWith(token);

// `git config [--get] core.hooksPath` only reads; anything else may write.
function readsHooksPath(tokens: string[]): boolean {
  if (verbOf(tokens) !== 'git') return false;
  const { sub, rest } = gitParts(tokens);
  const args = rest.filter(
    (t) =>
      ![
        '--get',
        '--get-all',
        '--local',
        '--global',
        '--system',
        '--worktree',
      ].includes(t),
  );
  return (
    sub === 'config' &&
    args.length === 1 &&
    args[0]?.toLowerCase() === 'core.hookspath'
  );
}

// Files that keep test-guard running; writing them from the shell is blocked.
const PROTECTED: [RegExp, string][] = [
  [/\.git[\\/]+hooks/i, 'changes a git hook'],
  [/(^|[\\/])\.test-guard\.json$/, 'changes the test-guard config'],
  [
    /(^|[\\/])\.claude[\\/]+settings[^\\/]*\.json$/i,
    'changes Claude Code settings',
  ],
  [/(^|[\\/])\.codex[\\/]/i, 'changes Codex settings'],
];

// Text that only shows up when something tries to get around test-guard.
// Mentions are fine in read-only commands such as `grep`.
const BYPASS_TEXT: [RegExp, string][] = [
  [/--no-verify/, '`--no-verify` skips test-guard’s git hook'],
  [/hookspath/i, 'changing `core.hooksPath` skips test-guard’s git hook'],
  [/disableAllHooks/i, '`disableAllHooks` turns off agent hooks'],
  [
    /test-guard-approved\s*:/i,
    'adds a `Test-Guard-Approved` trailer (only humans approve)',
  ],
];

export function findBypass(command: string): string[] {
  const segments = splitCommand(command);
  const found: string[] = [];
  for (const tokens of segments) {
    const verb = verbOf(tokens);
    if (verb === 'git') {
      const { sub, rest } = gitParts(tokens);
      if (rest.some(isNoVerify)) {
        found.push(`\`git ${sub} --no-verify\` skips test-guard’s git hook`);
      } else if (
        sub === 'commit' &&
        rest.some((t) => /^-[a-zA-Z]*n[a-zA-Z]*$/.test(t))
      ) {
        found.push('`git commit -n` skips test-guard’s git hook');
      }
    }
    const writes =
      tokens.some((t) => t.startsWith('>')) ||
      (verb !== 'git' && !READ_ONLY.has(verb));
    if (!writes) continue;
    for (const [path, message] of PROTECTED) {
      if (tokens.some((t) => path.test(t))) found.push(message);
    }
  }
  // Checked on the raw command so variables (`F=--no-verify`) and environment
  // overrides (`GIT_CONFIG_KEY_0=core.hooksPath`) count too.
  const readOnly = segments.every((s) => isReadOnly(s) || readsHooksPath(s));
  if (!readOnly) {
    for (const [text, message] of BYPASS_TEXT) {
      if (text.test(command)) found.push(message);
    }
  }
  if (/(?:\$env:)?\bTEST_GUARD_\w*\s*=(?!=)/i.test(command)) {
    found.push('sets a `TEST_GUARD_*` variable');
  }
  return [...new Set(found)];
}

// Commit message files (`git commit -F msg.txt`), resolved against `cwd`, so
// the hook can look for a trailer written there beforehand.
export function commitMessageFiles(command: string, cwd: string): string[] {
  const files: string[] = [];
  for (const tokens of splitCommand(command)) {
    if (verbOf(tokens) !== 'git') continue;
    const { sub, rest } = gitParts(tokens);
    if (sub !== 'commit') continue;
    rest.forEach((token, i) => {
      const value =
        token === '-F' || token === '--file'
          ? rest[i + 1]
          : token.startsWith('--file=')
            ? token.slice('--file='.length)
            : /^-F./.test(token)
              ? token.slice(2)
              : undefined;
      if (value && value !== '-') files.push(resolve(cwd, value));
    });
  }
  return files;
}

export interface FileOp {
  kind: 'delete' | 'move';
  verb: string;
  sources: string[]; // absolute, may contain globs
  dest?: string; // absolute
}

const DELETE = new Set([
  'rm',
  'unlink',
  'rmdir',
  'rd',
  'del',
  'erase',
  'remove-item',
  'ri',
]);
const MOVE = new Set(['mv', 'move', 'move-item', 'mi']);
const RENAME = new Set(['ren', 'rename', 'rename-item', 'rni']);
const CD = new Set(['cd', 'set-location', 'sl', 'pushd', 'chdir']);
const CMD_FLAG = /^\/[a-zA-Z]{1,2}$/; // `del /s /q`

// File deletions and moves, with paths resolved against `cwd` (and `cd`).
export function fileOps(command: string, cwd: string): FileOp[] {
  const ops: FileOp[] = [];
  let dir = cwd;
  for (const tokens of splitCommand(command)) {
    let verb = verbOf(tokens);
    let args = tokens.slice(1);
    if (verb === 'git') {
      const { sub, rest } = gitParts(tokens);
      if (sub !== 'rm' && sub !== 'mv') continue;
      verb = `git ${sub}`;
      args = rest;
    }
    if (CD.has(verb)) {
      const target = args.find((a) => !a.startsWith('-'));
      if (target) dir = resolve(dir, target);
      continue;
    }
    const paths = args.filter(
      (a) =>
        !a.startsWith('-') &&
        !a.startsWith('>') &&
        !(
          ['del', 'erase', 'rd', 'rmdir', 'move', 'ren', 'rename'].includes(
            verb,
          ) && CMD_FLAG.test(a)
        ),
    );
    if (DELETE.has(verb) || verb === 'git rm') {
      if (paths.length > 0) {
        ops.push({
          kind: 'delete',
          verb,
          sources: paths.map((p) => resolve(dir, p)),
        });
      }
    } else if (MOVE.has(verb) || RENAME.has(verb) || verb === 'git mv') {
      const dest = paths.pop();
      const first = paths[0];
      if (!dest || !first) continue;
      const sources = paths.map((p) => resolve(dir, p));
      ops.push({
        kind: 'move',
        verb,
        sources,
        // `ren a.js b.js` takes a new name, not a path.
        dest: RENAME.has(verb)
          ? resolve(resolve(dir, first), '..', dest)
          : resolve(dir, dest),
      });
    }
  }
  return ops;
}
