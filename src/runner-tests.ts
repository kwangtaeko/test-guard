import { posix } from 'node:path';
import { mochaTestPatterns } from './mocha.js';
import { nodeTestPatterns } from './node-test.js';

const NAME = /^(?:package\.json|\.mocharc(?:\.\w+)?)$/;
// Dependencies and sample projects, whose tests the repository doesn't run.
const OUTSIDE =
  /(?:^|\/)(?:node_modules|vendor|third_party|fixtures?|__fixtures__|testdata)\//;

// A file that sets what Mocha or `node --test` runs: the root's
// `package.json` or `.mocharc.*`, or a sub-package's.
export const isRunnerFile = (path: string) =>
  NAME.test(posix.basename(path)) && !OUTSIDE.test(path);

// A directory name as a glob that matches only itself
// (`packages/(legacy)`).
const literal = (dir: string) => dir.replace(/[*?[\]{}()!+@\\]/g, '\\$&');

// The test files Mocha and `node --test` run, from `files` (path → text):
// each directory's patterns, relative to that directory.
export function runnerTestPatterns(files: Map<string, string>): string[] {
  const dirs = new Set([...files.keys()].map((path) => posix.dirname(path)));
  const configured = new Set(
    [...files.keys()]
      .filter((path) => posix.basename(path).startsWith('.mocharc'))
      .map((path) => posix.dirname(path)),
  );
  return [...dirs].flatMap((dir) => {
    // A package that uses Mocha without its own config gets the nearest
    // parent's, as Mocha looks for it there too.
    let from = dir;
    if (/mocha/.test(files.get(posix.join(dir, 'package.json')) ?? '')) {
      while (!configured.has(from) && from !== '.') from = posix.dirname(from);
    }
    const read = (path: string) =>
      files.get(posix.join(path.startsWith('.mocharc') ? from : dir, path)) ??
      null;
    return [...mochaTestPatterns(read), ...nodeTestPatterns(read)].map(
      (pattern) => inDir(dir, pattern),
    );
  });
}

// A pattern relative to `dir`, as one from the repository root.
export const inDir = (dir: string, pattern: string) =>
  posix.normalize(dir === '.' ? pattern : `${literal(dir)}/${pattern}`);
