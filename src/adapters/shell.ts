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
export function findBypass(command: string): string[] {
  const segments = splitCommand(command);
  const found: string[] = [];
  for (const tokens of segments) {
    const verb = verbOf(tokens);
    if (verb === 'git') {
      const { sub, rest, configs } = gitParts(tokens);
      if (configs.some((c) => /^core\.hookspath=/i.test(c))) {
        found.push('`git -c core.hooksPath=…` skips test-guard’s git hook');
      }
      if (rest.includes('--no-verify')) {
        found.push(`\`git ${sub} --no-verify\` skips test-guard’s git hook`);
      } else if (
        sub === 'commit' &&
        rest.some((t) => /^-[a-zA-Z]*n[a-zA-Z]*$/.test(t))
      ) {
        found.push('`git commit -n` skips test-guard’s git hook');
      }
      const key = rest.findIndex((t) => t.toLowerCase() === 'core.hookspath');
      if (
        sub === 'config' &&
        key !== -1 &&
        (rest.length > key + 1 || rest.includes('--unset'))
      ) {
        found.push('changing `core.hooksPath` skips test-guard’s git hook');
      }
    }
    const mentions = (re: RegExp) => tokens.some((t) => re.test(t));
    const writes =
      tokens.some((t) => t.startsWith('>')) ||
      (verb !== 'git' && !READ_ONLY.has(verb));
    if (mentions(/\.git[\\/]+hooks/i) && writes) {
      found.push('changes a git hook');
    }
    if (mentions(/(^|[\\/])\.test-guard\.json$/) && writes) {
      found.push('changes the test-guard config');
    }
  }
  if (/test-guard-approved\s*:/i.test(command) && !segments.every(isReadOnly)) {
    found.push('adds a `Test-Guard-Approved` trailer (only humans approve)');
  }
  if (/(?:\$env:)?\bTEST_GUARD_\w*\s*=(?!=)/i.test(command)) {
    found.push('sets a `TEST_GUARD_*` variable');
  }
  return [...new Set(found)];
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
