// Mocha's test files, which need no `.test.` in their names: the specs a
// project gives Mocha (test script arguments, `.mocharc.*`, `package.json`
// "mocha"), or Mocha's default `./test/*.{js,cjs,mjs}`. Only for a project
// that uses Mocha. Read from the repository root.

const CONFIG_FILES = [
  '.mocharc.js',
  '.mocharc.cjs',
  '.mocharc.mjs',
  '.mocharc.yaml',
  '.mocharc.yml',
  '.mocharc.jsonc',
  '.mocharc.json',
];

// Options that take a value (`--require x`), so `x` isn't a spec.
const VALUED =
  /^(?:-r|--require|-R|--reporter|-O|--reporter-options?|-u|--ui|-t|--timeout|-s|--slow|-g|--grep|-f|--fgrep|--config|--package|--extension|--file|--ignore|--exclude|-n|--node-option|-j|--jobs|--retries|--watch-files|--watch-ignore|--opts|--loader|--import|--globals|--project)$/;

const GLOB = /[*?{[]/;
// Mocha and the runners built on it: `mocha`, `_mocha`, `ts-mocha`,
// `electron-mocha`, `node_modules/mocha/bin/mocha.js`, `mocha@10`.
const MOCHA =
  /(?:^|[\\/])(?:_?mocha|ts-mocha|electron-mocha)(?:\.js)?(?:@\S+)?$/;
// A command that runs another one: `npx`, `nyc`, `cross-env`, `NODE_ENV=x`.
export const RUNNER =
  /^(?:npx|pnpx|bunx|yarn|pnpm|npm|bun|nyc|c8|cross-env|env|dotenv|node|ts-node|tsx|[A-Za-z_]\w*=\S*)$/;
// A spec as a path or glob, not code (`process.env.SPEC || 'x'`).
const PATH = /^[\w./*{}[\]!?@,+~-]+$/;

export function mochaTestPatterns(
  read: (path: string) => string | null,
): string[] {
  let pkg: Record<string, unknown> = {};
  try {
    // `trimStart` drops a byte order mark too.
    const text = (read('package.json') ?? '{}').trimStart();
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') pkg = parsed;
  } catch {}
  const config = CONFIG_FILES.map(read).find((text) => text !== null) ?? null;
  // Mocha's arguments in each script command that runs it as the command
  // or through a runner (`npx`, `nyc --reporter text`, `cross-env A=1`),
  // not `eslint --plugin mocha`.
  const runs = Object.values(record(pkg.scripts))
    .filter((s): s is string => typeof s === 'string')
    .flatMap((script) => script.split(/&&|\|\||[;|]/))
    .flatMap((command) => {
      const all = words(command);
      const at = all.findIndex((w) => MOCHA.test(unquote(w)));
      return at === 0 || (at > 0 && RUNNER.test(all[0] ?? ''))
        ? [all.slice(at + 1)]
        : [];
    });
  const deps = {
    ...record(pkg.dependencies),
    ...record(pkg.devDependencies),
  };
  if (!('mocha' in deps) && runs.length === 0 && config === null) {
    return [];
  }

  const specs: string[] = [];
  // Quoted script arguments, kept as written.
  const quoted: string[] = [];
  const spec = (word: string) => {
    const path = quotedPath(word);
    if (path === null) specs.push(unquote(word));
    else if (path !== '') quoted.push(path);
  };
  let recursive = false;
  const extensions = new Set(['js', 'cjs', 'mjs']);
  for (const args of runs) {
    for (let i = 0; i < args.length; i++) {
      const word = unquote(args[i] ?? '');
      const [option = '', value] = word.split(/=(.*)/);
      const next = () => value ?? unquote(args[++i] ?? '');
      if (option === '--recursive') recursive = true;
      else if (option === '--spec') {
        if (value === undefined) spec(args[++i] ?? '');
        else specs.push(value);
      } else if (option === '--extension') extensions.add(next());
      // ts-mocha's `-p tsconfig.json`; Mocha's own `-p` is `--parallel`.
      else if (option === '-p' && /\.json$/.test(args[i + 1] ?? '')) i++;
      else if (VALUED.test(option)) {
        if (value === undefined) i++;
      } else if (!word.startsWith('-') && word !== '') spec(args[i] ?? '');
    }
  }
  const mocha = record(pkg.mocha);
  specs.push(...strings(mocha.spec));
  if (mocha.recursive === true) recursive = true;
  for (const e of strings(mocha.extension)) extensions.add(e);
  if (config !== null) {
    specs.push(...configValues(config, 'spec'));
    if (/\brecursive['"]?\s*[:=]\s*true\b/.test(config)) recursive = true;
    for (const e of configValues(config, 'extension')) extensions.add(e);
  }
  const paths = [...quoted, ...specs.flatMap(pathsIn)];
  if (paths.length === 0) paths.push('test');

  const ext = [...extensions]
    .map((e) => e.replace(/^\./, ''))
    .filter(Boolean)
    .join(',');
  return paths.map((path) =>
    GLOB.test(path) || /\.[cm]?[jt]sx?$/.test(path)
      ? path
      : `${path}/${recursive ? '**/' : ''}*.{${ext}}`,
  );
}

// The paths in a spec: itself when it is one (`./test/`, `.\test`), or the
// quoted ones in code (`process.env.SPEC || 'test/**/*.js'`).
export function pathsIn(spec: string): string[] {
  const clean = (s: string) =>
    s
      .replace(/\\/g, '/')
      .replace(/^(?:\.\/)+/, '')
      .replace(/\/+$/, '');
  if (PATH.test(spec.replace(/\\/g, '/'))) return [clean(spec)].filter(Boolean);
  return [...spec.matchAll(/(['"`])([^'"`]+)\1/g)]
    .map(([, , s]) => clean(s ?? ''))
    .filter((s) => s !== '' && PATH.test(s));
}

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

export const unquote = (word: string) => word.replace(/^(['"])(.*)\1$/, '$2');

// A command's words, keeping a quoted one whole (`"test dir/a.js"`).
export const words = (command: string) =>
  command.match(/(?:"[^"]*"|'[^']*'|[^\s"']|["'])+/g) ?? [];

// A quoted path as written, spaces included (`"test dir/a.js"`), or null
// for a word that isn't quoted or holds code or a shell expansion.
export function quotedPath(word: string): string | null {
  const path = unquote(word);
  if (path === word || /[$`'"]|\|\|/.test(path)) return null;
  return path
    .replace(/\\/g, '/')
    .replace(/^(?:\.\/)+/, '')
    .replace(/\/+$/, '');
}

// The strings given to `key` in a `.mocharc` file (JSON, YAML or JS):
// `"spec": "test/**/*.js"`, `spec: [a, b]`, `spec:\n  - a`; YAML comments
// left out.
function configValues(text: string, key: string): string[] {
  const at = new RegExp(
    String.raw`(?:^|[\s{,])['"]?${key}['"]?[ \t]*:[ \t]*`,
    'm',
  ).exec(text);
  if (!at) return [];
  const rest = text.slice(at.index + at[0].length);
  const value =
    /^\[[^\]]*\]/.exec(rest)?.[0] ??
    /^(?:\r?\n\s*-\s*[^\r\n]+)+/.exec(rest)?.[0] ??
    /^[^\r\n,}]+/.exec(rest)?.[0] ??
    '';
  return value
    .replace(/^\[|\]$/g, '')
    .split(/,|\r?\n\s*-\s*/)
    .map((s) => unquote(s.replace(/\s+#.*$/, '').trim()))
    .filter(Boolean);
}
