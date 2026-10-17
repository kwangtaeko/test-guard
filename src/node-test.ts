import {
  pathsIn,
  quotedPath,
  RUNNER,
  record,
  unquote,
  words,
} from './mocha.js';

// The test files `node --test` runs, which need no `.test.` in their names
// (`test/a.js`, `a-test.js`, `test-a.mjs`): the patterns a `package.json`
// script gives it, or Node's defaults. Read from the repository root.

const EXT = '{js,cjs,mjs,ts,cts,mts}';
// Node's default patterns, with TypeScript's where Node strips types.
const DEFAULTS = [
  `**/*.test.${EXT}`,
  `**/*-test.${EXT}`,
  `**/*_test.${EXT}`,
  `**/test-*.${EXT}`,
  `**/test.${EXT}`,
  `**/test/**/*.${EXT}`,
];

// Node (or tsx, which passes `--test` on to it) as the command.
const NODE = /(?:^|[\\/])(?:node|tsx)(?:\.exe)?$/;
// Options that take a value (`--import x`), so `x` isn't a pattern.
const VALUED =
  /^(?:-r|--require|--import|--loader|--experimental-loader|-C|--conditions|--env-file|--test-reporter|--test-reporter-destination|--test-name-pattern|--test-skip-pattern|--test-concurrency|--test-timeout|--test-shard|--test-isolation|--test-coverage-include|--test-coverage-exclude|--test-coverage-branches|--test-coverage-functions|--test-coverage-lines|--watch-path|--input-type|--stack-size|--max-old-space-size)$/;
const GLOB = /[*?{[(]/;
// A pattern as written, extglobs (`*.?(c|m)js`) included.
const PATTERN = /^[\w./*{}[\]!?@,+~()|-]+$/;

export function nodeTestPatterns(
  read: (path: string) => string | null,
): string[] {
  let pkg: Record<string, unknown> = {};
  try {
    // `trimStart` drops a byte order mark too.
    const text = (read('package.json') ?? '{}').trimStart();
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') pkg = parsed;
  } catch {}
  const patterns = new Set<string>();
  const commands = Object.values(record(pkg.scripts))
    .filter((s): s is string => typeof s === 'string')
    // A line continued with `\`; `|` inside an extglob doesn't split.
    .flatMap((script) =>
      script.replace(/\\\r?\n/g, ' ').split(/&&|\|\||;|\|(?![^()\s]*\))/),
    );
  for (const command of commands) {
    const all = words(command);
    const at = all.findIndex((w) => NODE.test(unquote(w)));
    if (at === -1 || (at > 0 && !RUNNER.test(all[0] ?? ''))) continue;
    // `--test` among Node's own options, before a script to run.
    let test = false;
    const given: string[] = [];
    for (let i = at + 1; i < all.length; i++) {
      const word = unquote(all[i] ?? '');
      const [option = '', value] = word.split(/=(.*)/);
      if (option === '--test') test = true;
      else if (VALUED.test(option)) {
        if (value === undefined) i++;
      } else if (!word.startsWith('-') && word !== '') {
        if (!test) break;
        given.push(all[i] ?? '');
      }
    }
    if (!test) continue;
    const paths = given.flatMap((raw) => {
      // A quoted path as written, spaces included.
      const quoted = quotedPath(raw);
      if (quoted !== null) return quoted === '' ? [] : [quoted];
      const word = unquote(raw);
      const path = word
        .replace(/\\/g, '/')
        .replace(/^(?:\.\/)+/, '')
        .replace(/\/+$/, '');
      if (PATTERN.test(path)) return path === '' ? [] : [path];
      // A pattern from the shell (`$GLOB`) could be any file.
      if (/[$`]/.test(word)) return [`**/*.${EXT}`];
      return pathsIn(word);
    });
    if (paths.length === 0) for (const p of DEFAULTS) patterns.add(p);
    for (const path of paths) {
      patterns.add(
        GLOB.test(path) || /\.[cm]?[jt]s$/i.test(path)
          ? path
          : `${path}/**/*.${EXT}`,
      );
    }
  }
  return [...patterns];
}
