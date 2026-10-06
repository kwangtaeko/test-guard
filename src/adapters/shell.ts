// Shell command analysis for agent hooks (Bash and PowerShell). A best-effort
// tokenizer for obvious cases only (ROADMAP §1.4): it does not expand
// variables or read scripts from files, but follows `cd`, nested
// `bash -c` / `pwsh -Command` strings and links that already exist.
import {
  existsSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from 'node:fs';
import { basename, join, resolve } from 'node:path';

const SEPARATORS = new Set(['\n', ';', '|', '&', '(', ')', '`']);

// Splits a command into simple commands (`a && b | c; $(d)`) of tokens.
// Quotes group words; backslashes stay literal for Windows paths. A
// redirection becomes its own token (`>` or `>>`) followed by its target,
// also without spaces (`echo x>file`); `2>&1` is dropped.
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
  for (let i = 0; i < command.length; i++) {
    const ch = command[i] ?? '';
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
    } else if (ch === '>') {
      // `2>`: the descriptor belongs to the operator.
      if (/^\d+$/.test(current)) {
        current = '';
        inToken = false;
      }
      endToken();
      let op = '>';
      while (command[i + 1] === '>') {
        op += '>';
        i++;
      }
      if (command[i + 1] === '&') {
        i++; // `>&2` duplicates a descriptor, `>&file` is rare
        while (/\d/.test(command[i + 1] ?? '')) i++;
        continue;
      }
      tokens.push(op);
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

// Drops `VAR=x`, `sudo`, `env`, `npx -y` and similar prefixes so tokens[0] is
// the program.
function unwrap(tokens: string[]): string[] {
  let i = 0;
  for (;;) {
    const token = tokens[i] ?? '';
    if (
      /^[A-Za-z_]\w*=/.test(token) ||
      ['sudo', 'env', 'command', 'exec', 'nohup', 'time', '&'].includes(token)
    ) {
      i++;
    } else if (['npx', 'pnpx', 'bunx'].includes(token)) {
      i++;
      while ((tokens[i] ?? '').startsWith('-')) i++;
    } else {
      return tokens.slice(i);
    }
  }
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

const isRedirect = (token: string) => token === '>' || token === '>>';

// Arguments without redirections (`> file` and its target).
function withoutRedirects(args: string[]): string[] {
  return args.filter(
    (t, i) => !isRedirect(t) && !isRedirect(args[i - 1] ?? ''),
  );
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
  return READ_ONLY.has(verb) && !tokens.some(isRedirect);
}

// TG006: obvious attempts to get around test-guard (ROADMAP §3.3).
// git accepts any unambiguous prefix of a long option, such as `--no-veri`.
const isNoVerify = (token: string) =>
  token.length >= 6 && '--no-verify'.startsWith(token);

// `git config [--get] <key>` only reads; anything else may write.
function readsGitConfig(tokens: string[]): boolean {
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
  return sub === 'config' && args.length === 1 && !args[0]?.startsWith('-');
}

// Paths that keep test-guard running; writing them from the shell is blocked.
// Matched anywhere in a token, so paths inside scripts (`node -e "…"`) count.
const B = `(?:^|[\\s'"\`=:(,;\\\\/])`; // what may come before a path segment
const E = `(?=$|[\\s'"\`),;\\\\/])`; // what may come after it
const PROTECTED: [RegExp, string][] = [
  [new RegExp(`${B}\\.git[\\\\/]+hooks${E}`, 'i'), 'changes a git hook'],
  [new RegExp(`${B}\\.git${E}`, 'i'), 'changes git internals (.git)'],
  [
    new RegExp(`${B}\\.test-guard\\.json${E}`, 'i'),
    'changes the test-guard config',
  ],
  [
    new RegExp(`${B}\\.claude[\\\\/]+settings[\\w.-]*\\.json${E}`, 'i'),
    'changes Claude Code settings',
  ],
  [
    new RegExp(`${B}\\.claude[\\\\/]+plugins[\\\\/].*test-guard`, 'i'),
    'changes the test-guard plugin',
  ],
  [new RegExp(`${B}\\.codex${E}`, 'i'), 'changes Codex settings'],
  [
    new RegExp(
      `${B}node_modules[\\\\/]+(?:\\.bin[\\\\/]+)?test-guard(?:\\.\\w+)?${E}`,
      'i',
    ),
    'changes the installed test-guard',
  ],
];

// Directories a link must not point into or replace.
const PROTECTED_DIR = new RegExp(
  `${B}(?:\\.git|\\.claude|\\.codex|node_modules[\\\\/]+test-guard)${E}`,
  'i',
);

// The agent settings folder or plugin registry as a whole: deleting, moving
// or unpacking over it takes the plugin's hooks with it.
const AGENT_SETUP = new RegExp(
  `${B}(?:\\.claude(?:[\\\\/]+plugins(?:[\\\\/]+(?:cache|marketplaces)(?:[\\\\/]+[^\\\\/]+)?)?)?|\\.codex)[\\\\/]*$|installed_plugins\\.json$`,
  'i',
);
const REPLACES = new Set([
  'rm',
  'rmdir',
  'rd',
  'del',
  'erase',
  'remove-item',
  'ri',
  'mv',
  'move',
  'move-item',
  'mi',
  'ren',
  'rename',
  'rename-item',
  'rni',
  'tar',
  'unzip',
  'expand-archive',
]);

// Tracked hook and CI files that run test-guard. The Write tool's edits to
// them are judged by TG006; from the shell their content can't be seen
// before the command runs, so changing them there is blocked outright.
const HOOK_FILE =
  /[\\/](?:\.husky[\\/].+|\.github[\\/]workflows[\\/][^\\/]+\.ya?ml|\.?lefthook(?:-local)?\.ya?ml|\.pre-commit-config\.yaml)$/i;

function runsTestGuard(path: string): boolean {
  if (!HOOK_FILE.test(path) || !existsSync(path)) return false;
  try {
    return (
      statSync(path).isFile() &&
      readFileSync(path, 'utf8').includes('test-guard')
    );
  } catch {
    return false;
  }
}

// A hook file, or a folder of them (`.husky`, `.github`), that runs
// test-guard: deleting or moving it stops test-guard.
function holdsTestGuardHook(path: string, depth = 0): boolean {
  if (runsTestGuard(path)) return true;
  if (depth > 2 || !/[\\/](?:\.husky|\.github|workflows)$/i.test(path)) {
    return false;
  }
  try {
    if (!statSync(path).isDirectory()) return false;
    return readdirSync(path).some((name) => {
      const child = join(path, name);
      return name === 'workflows'
        ? holdsTestGuardHook(child, depth + 1)
        : runsTestGuard(child);
    });
  } catch {
    return false;
  }
}

// Hook files named inside a script string (`node -e "…writeFileSync('.husky/
// pre-commit', …)"`).
function hookPathsIn(token: string, dir: string): string[] {
  if (!/[\s'"(]/.test(token)) return [];
  return [
    ...token.matchAll(
      /(?:^|[\s'"`=(,])((?:\.\/)?(?:\.husky\/[\w.-]+|\.github\/workflows\/[\w.-]+\.ya?ml|\.?lefthook(?:-local)?\.ya?ml|\.pre-commit-config\.yaml))/g,
    ),
  ].map((m) => resolve(dir, m[1] ?? ''));
}

export function protectedPath(path: string): string | null {
  return PROTECTED.find(([re]) => re.test(path))?.[1] ?? null;
}

const TRAILER =
  /test-guard-approved\s*[:=]|trailer\.\S*key[\s=]+["']?test-guard-approved|trailer\.\S*key\S*test-guard-approved/i;
const TRAILER_MESSAGE =
  'adds a `Test-Guard-Approved` trailer (only humans approve)';

// `git commit -m "…"` values.
function commitMessages(segments: Segment[]): string[] {
  const messages: string[] = [];
  for (const { tokens } of segments) {
    if (verbOf(tokens) !== 'git') continue;
    const { rest } = gitParts(tokens);
    rest.forEach((token, i) => {
      if (/^-[a-zA-Z]*m$/.test(token) || token === '--message') {
        messages.push(rest[i + 1] ?? '');
      } else if (token.startsWith('--message=')) {
        messages.push(token.slice('--message='.length));
      }
    });
  }
  return messages.filter((m) => m !== '');
}

// Text that only shows up when something tries to get around test-guard.
// Mentions are fine in read-only commands such as `grep`.
const BYPASS_TEXT: [RegExp, string][] = [
  [/--no-verify(?![\w-])/, '`--no-verify` skips test-guard’s git hook'],
  [/hookspath/i, 'changing `core.hooksPath` skips test-guard’s git hook'],
  [/disableAllHooks/i, '`disableAllHooks` turns off agent hooks'],
  [
    /\bHUSKY\s*=\s*["']?0\b|\bLEFTHOOK\s*=\s*["']?(?:0|false)\b|\bLEFTHOOK_EXCLUDE\s*=|\bSKIP\s*=(?=[^\n]*\bgit\b[^\n]*\bcommit\b)/i,
    'turns off the git hook runner that starts test-guard',
  ],
  [
    // `git rev-parse --git-dir` only prints the path.
    /\bGIT_DIR\s*=|(?<!\brev-parse\b[^;&|\n]*)--git-dir\b/,
    'points git at another repository, whose hooks don’t run test-guard',
  ],
  [
    /["']test-guard(?:@[^"'\s:]*)?\\?["']\s*:\s*false\b/i,
    'turns off the test-guard plugin (`enabledPlugins`)',
  ],
  [
    /\bGIT_CONFIG(?:_GLOBAL|_SYSTEM|_PARAMETERS)?\s*=/,
    'points git at another config file, which can skip test-guard’s git hook',
  ],
  [
    /\binclude(?:If\.\S*)?\.path\b|\[\s*include(?:If\b[^\]]*)?\s*\]/i,
    'adds a git config include, which can skip test-guard’s git hook',
  ],
  [
    /\bcommit\.template\b/i,
    'sets `commit.template`, which can carry an approval trailer',
  ],
  [
    // Only in git config context: `alias.ts` in a commit message is fine.
    /\bconfig\b[^;&|\n]*\balias\.[\w-]+|(?:-c\s*|GIT_CONFIG_KEY_\d+\s*=\s*)["']?alias\.|\[\s*alias\s*\]/i,
    'defines a git alias, which can hide `--no-verify`',
  ],
];

const INTERPRETERS = new Set([
  'node',
  'deno',
  'bun',
  'tsx',
  'ts-node',
  'python',
  'python3',
  'py',
  'ruby',
  'perl',
]);

// The script an interpreter runs (`node node_modules/test-guard/dist/cli.js`)
// is executed, not written; inline code (`node -e "…"`) is not exempt.
function scriptIndex(tokens: string[]): number {
  if (!INTERPRETERS.has(verbOf(tokens))) return -1;
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i] ?? '';
    if (/^-(?:e|c|p|-eval|-print)$/.test(token)) return -1;
    if (!token.startsWith('-')) return i;
  }
  return -1;
}

const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh']);
const POWERSHELLS = new Set(['pwsh', 'powershell']);

// The command string run by `bash -c "…"`, `pwsh -Command …`, `cmd /c …` or
// `eval …`, or null.
function nestedCommand(tokens: string[]): string | null {
  const verb = verbOf(tokens);
  const args = tokens.slice(1);
  if (SHELLS.has(verb)) {
    const i = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
    return i === -1 ? null : (args[i + 1] ?? null);
  }
  if (POWERSHELLS.has(verb)) {
    const i = args.findIndex((a) => /^-(?:c|command)$/i.test(a));
    return i === -1 ? null : args.slice(i + 1).join(' ');
  }
  if (verb === 'cmd') {
    const i = args.findIndex((a) => /^\/[ck]$/i.test(a));
    return i === -1 ? null : args.slice(i + 1).join(' ');
  }
  if (verb === 'eval' || verb === 'invoke-expression' || verb === 'iex') {
    return args.join(' ');
  }
  return null;
}

interface Segment {
  tokens: string[];
  dir: string; // working directory, following `cd`
}

const CD = new Set(['cd', 'set-location', 'sl', 'pushd', 'chdir']);

// Simple commands with their working directory; nested shell strings are
// expanded in place.
function walk(command: string, cwd: string, depth = 0): Segment[] {
  const out: Segment[] = [];
  let dir = cwd;
  for (const tokens of splitCommand(command)) {
    const verb = verbOf(tokens);
    if (CD.has(verb)) {
      const target = pathArgs(tokens.slice(1))[0];
      if (target) dir = resolve(dir, target);
      continue;
    }
    out.push({ tokens, dir });
    const nested = depth < 3 ? nestedCommand(tokens) : null;
    if (nested) out.push(...walk(nested, dir, depth + 1));
  }
  return out;
}

// A test run that rewrites snapshots to match the current output (TG008):
// `jest -u`, `vitest --update`, `npm test -- -u`, Playwright
// `--update-snapshots`.
export function updatesSnapshots(command: string, cwd: string): boolean {
  return walk(command, cwd).some(({ tokens }) => {
    const runner =
      tokens.some((t) =>
        /(?:^|[\\/])(?:jest|vitest|playwright)(?:\.c?[jm]?s|\.cmd)?$/i.test(t),
      ) ||
      (/^(?:npm|pnpm|yarn|bun)$/i.test(verbOf(tokens)) &&
        tokens.some((t) => /^test(?::|$)/.test(t)));
    return (
      runner &&
      tokens.some((t) =>
        /^(?:-u|--update|--updateSnapshot|--update-snapshots?)(?:=.*)?$/.test(
          t,
        ),
      )
    );
  });
}

// PowerShell `-Path:x` and `--file=x` carry a value in the flag.
function flagValue(token: string): string | null {
  return /^--?[A-Za-z][\w-]*[:=](.+)$/.exec(token)?.[1] ?? null;
}

// Path-like arguments: positional ones and values of `-Path:x` style flags.
function pathArgs(args: string[]): string[] {
  return withoutRedirects(args).flatMap((a) => {
    if (!a.startsWith('-')) return [a];
    const value = flagValue(a);
    return value ? [value] : [];
  });
}

// What a token may refer to: itself, the path it resolves to, and that
// path's real location when it is an existing link.
function candidates(token: string, dir: string): string[] {
  const value = (flagValue(token) ?? token).replace(/::\$DATA$/i, '');
  const found = [token, value];
  if (value === '' || /[\s'"]/.test(value)) return found;
  const absolute = resolve(dir, value);
  found.push(absolute);
  const real = realPath(absolute);
  if (real !== absolute) found.push(real);
  return found;
}

// The real path of a file that may not exist yet: links and letter case
// resolved for the part that exists.
export function realPath(path: string): string {
  const clean = path.replace(/::\$DATA$/i, '');
  let existing = clean;
  const rest: string[] = [];
  while (!existsSync(existing)) {
    const parent = resolve(existing, '..');
    if (parent === existing) return clean;
    rest.unshift(basename(existing));
    existing = parent;
  }
  try {
    return join(realpathSync.native(existing), ...rest);
  } catch {
    return clean;
  }
}

const COPY = new Set([
  'cp',
  'copy',
  'copy-item',
  'cpi',
  'mv',
  'move',
  'move-item',
  'mi',
  'install',
  'rsync',
  'ln',
  'xcopy',
]);
const LINK = new Set(['ln', 'mklink']);
const MKDIR = new Set(['mkdir', 'md']);

// `cp settings.local.json .claude/` writes `.claude/settings.local.json`.
function copyTargets(tokens: string[], dir: string): string[] {
  if (!COPY.has(verbOf(tokens))) return [];
  const paths = pathArgs(tokens.slice(1));
  const dest = paths.pop();
  if (!dest) return [];
  return paths.map((source) => join(resolve(dir, dest), basename(source)));
}

function createsLink(tokens: string[]): boolean {
  const verb = verbOf(tokens);
  if (verb === 'ln') return tokens.some((t) => /^-[a-z]*s/i.test(t));
  if (LINK.has(verb)) return true;
  return (
    (verb === 'new-item' || verb === 'ni') &&
    tokens.some((t) => /symboliclink|junction|hardlink/i.test(t))
  );
}

const PACKAGE_MANAGERS = new Set(['npm', 'pnpm', 'yarn', 'bun']);
const UNINSTALL = new Set(['uninstall', 'un', 'unlink', 'remove', 'rm', 'r']);

// Turning the test-guard plugin off or removing the package.
function removesTestGuard(tokens: string[]): string | null {
  const verb = verbOf(tokens);
  const args = tokens.slice(1).map((t) => t.toLowerCase());
  const names = args.filter((a) => !a.startsWith('-'));
  if (verb === 'claude' && /^plugins?$/.test(names[0] ?? '')) {
    const action = names[1] ?? '';
    const target = names.slice(2);
    const all = args.includes('-a') || args.includes('--all');
    if (
      ['disable', 'uninstall', 'remove'].includes(action) &&
      (all ||
        target.some((t) => t.includes('test-guard')) ||
        (action === 'disable' && target.length === 0))
    ) {
      return `\`claude plugin ${action}\` turns off test-guard’s agent hooks`;
    }
  }
  if (
    verb === 'claude' &&
    /^plugins?$/.test(names[0] ?? '') &&
    names[1] === 'marketplace' &&
    ['remove', 'rm'].includes(names[2] ?? '')
  ) {
    return '`claude plugin marketplace remove` can take test-guard’s plugin with it';
  }
  if (
    PACKAGE_MANAGERS.has(verb) &&
    UNINSTALL.has(names[0] ?? '') &&
    names.slice(1).some((n) => /^test-guard(?:@|$)/.test(n))
  ) {
    return `\`${verb} ${names[0]}\` removes test-guard`;
  }
  // Swapping the package for a local or forked copy.
  if (
    PACKAGE_MANAGERS.has(verb) &&
    names.some((n) =>
      /^test-guard@(?:file:|link:|portal:|git|github:|https?:|\.|\/|[a-z]:)/.test(
        n,
      ),
    )
  ) {
    return `\`${verb}\` replaces test-guard with another copy`;
  }
  if (
    verb === 'npm' &&
    names[0] === 'pkg' &&
    ['set', 'delete'].includes(names[1] ?? '') &&
    names.slice(2).some((n) => /\btest-guard\b/.test(n))
  ) {
    return '`npm pkg` changes the test-guard dependency';
  }
  return null;
}

// Deleting a stale lock file can't get around anything.
function deletesOnlyLocks(tokens: string[]): boolean {
  const paths = pathArgs(tokens.slice(1));
  return (
    DELETE.has(verbOf(tokens)) &&
    paths.length > 0 &&
    paths.every((p) => /\.lock$/.test(p))
  );
}

export function findBypass(command: string, cwd = process.cwd()): string[] {
  const segments = walk(command, cwd);
  const found: string[] = [];
  for (const { tokens, dir } of segments) {
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
    const removal = removesTestGuard(tokens);
    if (removal) found.push(removal);
    const gitSub = verb === 'git' ? gitParts(tokens).sub : '';
    // git commands that delete, move or overwrite files in the work tree.
    const gitWrites = ['rm', 'mv', 'checkout', 'restore'].includes(gitSub);
    const writes =
      tokens.some(isRedirect) ||
      gitWrites ||
      (verb !== 'git' && !READ_ONLY.has(verb));
    if (!writes) continue;
    const replaces =
      REPLACES.has(verb) ||
      gitSub === 'rm' ||
      gitSub === 'mv' ||
      (verb === 'find' && tokens.includes('-delete'));
    // `chmod +x` only makes a hook runnable.
    const makesRunnable =
      verb === 'chmod' && tokens.slice(1).every((t) => !/^[ugoa]*-/.test(t));
    const script = scriptIndex(tokens);
    const paths = [
      // The program and its script run; they are not written.
      ...tokens.flatMap((t, i) =>
        i === 0 || i === script ? [] : candidates(t, dir),
      ),
      ...copyTargets(tokens, dir),
    ];
    const locksOnly = deletesOnlyLocks(tokens);
    for (const [re, message] of PROTECTED) {
      if (locksOnly && message.includes('(.git)')) continue;
      if (paths.some((p) => re.test(p))) {
        found.push(message);
        break; // one message per command is enough
      }
    }
    if (createsLink(tokens) && paths.some((p) => PROTECTED_DIR.test(p))) {
      found.push('links to or over a path that keeps test-guard running');
    }
    if (replaces && paths.some((p) => AGENT_SETUP.test(p))) {
      found.push('removes agent settings or plugins that run test-guard');
    }
    const hookFiles = [
      ...paths,
      ...tokens.flatMap((t) => hookPathsIn(t, dir)),
    ].filter((p) => (replaces ? holdsTestGuardHook(p) : runsTestGuard(p)));
    if (hookFiles.length > 0 && !makesRunnable) {
      found.push('changes a hook or CI file that runs test-guard');
    }
  }
  // Checked on the raw command so variables (`F=--no-verify`) and environment
  // overrides (`GIT_CONFIG_KEY_0=core.hooksPath`) count too. Quoted commit
  // messages may mention these words; only a trailer in them counts.
  const readOnly = segments.every(
    (s) => isReadOnly(s.tokens) || readsGitConfig(s.tokens),
  );
  if (!readOnly) {
    const scrubbed = commitMessages(segments).reduce(
      (text, m) => text.split(`"${m}"`).join('""').split(`'${m}'`).join("''"),
      command,
    );
    if (TRAILER.test(command)) found.push(TRAILER_MESSAGE);
    for (const [text, message] of BYPASS_TEXT) {
      if (text.test(scrubbed)) found.push(message);
    }
  }
  if (/(?:\$env:)?\bTEST_GUARD_\w*\s*=(?!=)/i.test(command)) {
    found.push('sets a `TEST_GUARD_*` variable');
  }
  return [...new Set(found)];
}

// Commit message files (`git commit -F msg.txt`, `-t template`), resolved
// against `cwd`, so the hook can look for a trailer written there beforehand.
export function commitMessageFiles(command: string, cwd: string): string[] {
  const files: string[] = [];
  for (const { tokens, dir } of walk(command, cwd)) {
    if (verbOf(tokens) !== 'git') continue;
    const { sub, rest } = gitParts(tokens);
    if (sub !== 'commit') continue;
    rest.forEach((token, i) => {
      const value = ['-F', '--file', '-t', '--template'].includes(token)
        ? rest[i + 1]
        : /^--(?:file|template)=/.test(token)
          ? token.slice(token.indexOf('=') + 1)
          : /^-[Ft]./.test(token)
            ? token.slice(2)
            : undefined;
      if (value && value !== '-') files.push(resolve(dir, value));
    });
  }
  return files;
}

export interface FileOp {
  kind: 'delete' | 'move';
  verb: string;
  sources: string[]; // absolute, may contain globs
  dest?: string; // absolute
  destIsDir?: boolean; // known to be a folder even if it doesn't exist yet
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
const CMD_FLAG = /^\/[a-zA-Z]{1,2}$/; // `del /s /q`
// Filters that pass a file list through to `xargs rm` unchanged or narrowed.
const FILTERS = new Set([
  'grep',
  'rg',
  'sort',
  'uniq',
  'head',
  'tail',
  'sed',
  'awk',
  'tr',
  'cut',
  'select-string',
  'sls',
  'where-object',
  'where',
  '?',
]);

// Files a `find` command selects, as globs: `find src -name '*.test.js'`.
function findSelection(args: string[], dir: string): string[] {
  const firstExpr = args.findIndex((a) => /^[-(!]/.test(a));
  const starts = (firstExpr === -1 ? args : args.slice(0, firstExpr)).filter(
    (a) => a !== '',
  );
  const flagArg = (...flags: string[]) => {
    const i = args.findIndex((a) => flags.includes(a));
    return i === -1 ? undefined : args[i + 1];
  };
  const path = flagArg('-path', '-ipath', '-wholename');
  const name = flagArg('-name', '-iname');
  return (starts.length > 0 ? starts : ['.']).map((start) => {
    const base = resolve(dir, start);
    if (path) return resolve(dir, path);
    return name ? join(base, '**', name) : base;
  });
}

// What a command earlier in a pipeline lists, for `… | xargs rm` and
// `Get-ChildItem … | Remove-Item`. Null when unknown.
function listedFiles(segment: Segment | undefined): string[] | null {
  if (!segment) return null;
  const { tokens, dir } = segment;
  const verb = verbOf(tokens);
  const args = tokens.slice(1);
  if (verb === 'find') return findSelection(args, dir);
  if (verb === 'git' && gitParts(tokens).sub === 'ls-files') {
    const specs = pathArgs(gitParts(tokens).rest);
    return specs.length > 0 ? specs.map((s) => resolve(dir, s)) : [dir];
  }
  if (['ls', 'dir', 'echo', 'printf'].includes(verb)) {
    return pathArgs(args).map((p) => resolve(dir, p));
  }
  if (['get-childitem', 'gci'].includes(verb)) {
    const value = (flag: string) => {
      const i = args.findIndex((a) => a.toLowerCase() === flag);
      return i === -1 ? undefined : args[i + 1];
    };
    const filter = value('-filter') ?? value('-include');
    const recurse = args.some((a) => /^-r(?:ecurse)?$/i.test(a));
    const roots = pathArgs(
      args.filter((_, i) => !/^-(?:filter|include)$/i.test(args[i - 1] ?? '')),
    );
    return (roots.length > 0 ? roots : ['.']).map((root) => {
      const base = resolve(dir, root);
      return filter ? join(base, recurse ? '**' : '', filter) : base;
    });
  }
  if (['grep', 'rg'].includes(verb) && args.some((a) => /^-\w*[lL]/.test(a))) {
    const rest = pathArgs(args).slice(1);
    return rest.length > 0 ? rest.map((p) => resolve(dir, p)) : [dir];
  }
  return null;
}

// File deletions and moves, with paths resolved against `cwd` (and `cd`).
export function fileOps(command: string, cwd: string): FileOp[] {
  const ops: FileOp[] = [];
  const segments = walk(command, cwd);
  const made = new Set<string>(); // folders created earlier in the command
  segments.forEach(({ tokens, dir }, index) => {
    let verb = verbOf(tokens);
    let args = tokens.slice(1);
    if (MKDIR.has(verb)) {
      for (const p of pathArgs(args)) made.add(resolve(dir, p));
      return;
    }
    if (verb === 'git') {
      const { sub, rest } = gitParts(tokens);
      if (sub !== 'rm' && sub !== 'mv') return;
      verb = `git ${sub}`;
      args = rest;
    }
    if (verb === 'xargs') {
      const inner = args.findIndex((a) => DELETE.has(verbOf([a])));
      if (inner === -1) return;
      verb = verbOf([args[inner] ?? '']);
      args = [];
    }
    if (verb === 'find') {
      const deletes =
        args.includes('-delete') ||
        args.some(
          (a, i) =>
            ['-exec', '-execdir', '-ok'].includes(a) &&
            DELETE.has(verbOf([args[i + 1] ?? ''])),
        );
      if (deletes) {
        ops.push({
          kind: 'delete',
          verb: 'find',
          sources: findSelection(args, dir),
        });
      }
      return;
    }
    // PowerShell cmdlets take `\` as a separator on every OS.
    if (/^[a-z]+-[a-z]+$/.test(verb)) {
      args = args.map((a) => a.replace(/\\/g, '/'));
    }
    const named = (name: string) => {
      const i = args.findIndex((a) => new RegExp(`^-${name}$`, 'i').test(a));
      if (i !== -1) return args[i + 1];
      return args
        .map((a) => new RegExp(`^-${name}:(.+)$`, 'i').exec(a)?.[1])
        .find(Boolean);
    };
    const destination = named('destination');
    const paths = pathArgs(
      args.filter(
        (a, i) =>
          !/^-destination(?::|$)/i.test(a) &&
          !/^-destination$/i.test(args[i - 1] ?? ''),
      ),
    ).filter(
      (a) =>
        !(
          ['del', 'erase', 'rd', 'rmdir', 'move', 'ren', 'rename'].includes(
            verb,
          ) && CMD_FLAG.test(a)
        ),
    );
    if (DELETE.has(verb) || verb === 'git rm') {
      // Without paths, the files come from earlier in the pipeline.
      const sources =
        paths.length > 0
          ? paths.map((p) => resolve(dir, p))
          : piped(segments, index);
      if (sources && sources.length > 0)
        ops.push({ kind: 'delete', verb, sources });
    } else if (MOVE.has(verb) || RENAME.has(verb) || verb === 'git mv') {
      const dest = destination ?? paths.pop();
      const first = paths[0];
      if (!dest || !first) return;
      const sources = paths.map((p) => resolve(dir, p));
      const target = RENAME.has(verb)
        ? resolve(resolve(dir, first), '..', dest)
        : resolve(dir, dest);
      ops.push({
        kind: 'move',
        verb,
        sources,
        // `ren a.js b.js` takes a new name, not a path.
        dest: target,
        // `mv a tests/unit/` or a folder made by `mkdir` just before.
        ...(/[\\/]$/.test(dest) || made.has(target) ? { destIsDir: true } : {}),
      });
    }
  });
  return ops;
}

// The files listed by the producer before `index`, skipping filters.
function piped(segments: Segment[], index: number): string[] | null {
  for (let i = index - 1; i >= 0; i--) {
    const segment = segments[i];
    const listed = listedFiles(segment);
    if (listed) return listed;
    if (!segment || !FILTERS.has(verbOf(segment.tokens))) return null;
  }
  return null;
}
