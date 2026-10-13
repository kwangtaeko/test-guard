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
  /^(?:-r|--require|-R|--reporter|-O|--reporter-options?|-u|--ui|-t|--timeout|-s|--slow|-g|--grep|-f|--fgrep|--config|--package|--extension|--file|--ignore|--exclude|-n|--node-option|-j|--jobs|--retries|--watch-files|--watch-ignore|--delay|--opts)$/;

const GLOB = /[*?{[]/;
const RUNNER =
  /^(?:npx|pnpx|bunx|yarn|pnpm|exec|dlx|nyc|c8|cross-env|[A-Za-z_][\w]*=\S*|-{1,2}[\w-]+(?:=\S*)?)$/;

export function mochaTestPatterns(
  read: (path: string) => string | null,
): string[] {
  let pkg: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(read('package.json') ?? '{}');
    if (parsed && typeof parsed === 'object') pkg = parsed;
  } catch {}
  const config = CONFIG_FILES.map(read).find((text) => text !== null) ?? null;
  // Mocha's arguments in each script command that runs it as the command
  // or through a runner (`npx`, `nyc`, `cross-env NODE_ENV=test`), not
  // `eslint --plugin mocha`.
  const runs = Object.values(record(pkg.scripts))
    .filter((s): s is string => typeof s === 'string')
    .flatMap((script) => script.split(/&&|\|\||[;|]/))
    .flatMap((command) => {
      const words = command.trim().split(/\s+/);
      const at = words.findIndex((w) => /(?:^|\/)mocha$/.test(w));
      return at !== -1 && words.slice(0, at).every((w) => RUNNER.test(w))
        ? [words.slice(at + 1)]
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
  let recursive = false;
  const extensions = new Set(['js', 'cjs', 'mjs']);
  for (const words of runs) {
    for (let i = 0; i < words.length; i++) {
      const word = unquote(words[i] ?? '');
      if (word === '--recursive') recursive = true;
      else if (word === '--extension') {
        extensions.add(unquote(words[i + 1] ?? ''));
      }
      if (word === '--spec') specs.push(unquote(words[++i] ?? ''));
      else if (VALUED.test(word)) i++;
      else if (!word.startsWith('-') && word !== '') specs.push(word);
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
  if (specs.length === 0) specs.push('./test');

  const ext = [...extensions].filter(Boolean).join(',');
  return specs.map((spec) => {
    const path = spec.replace(/^\.\//, '').replace(/\/+$/, '');
    if (GLOB.test(path) || /\.[cm]?[jt]sx?$/.test(path)) return path;
    return `${path}/${recursive ? '**/' : ''}*.{${ext}}`;
  });
}

function record(value: unknown): Record<string, unknown> {
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

const unquote = (word: string) => word.replace(/^(['"])(.*)\1$/, '$2');

// The strings given to `key` in a `.mocharc` file (JSON, YAML or JS):
// `"spec": "test/**/*.js"`, `spec: [a, b]`, `spec:\n  - a`.
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
    .map((s) => unquote(s.trim()))
    .filter(Boolean);
}
