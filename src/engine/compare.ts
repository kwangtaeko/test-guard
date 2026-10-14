import { analyzeSource, toLf } from '../languages/index.js';
import type { TestFileDetector } from '../paths.js';
import { RULES, type RuleId } from '../rules/index.js';
import type { RuleFinding, RuleInput } from '../rules/types.js';
import type { Language } from '../types.js';
import { guardFileKind, isSnapshot, runnerConfigKind } from '../watched.js';
import { diffLines } from './diff.js';
import type { LiteralUse } from './literals.js';

export interface FileVersion {
  path: string;
  content: string;
}

export interface TestFile extends FileVersion {
  language: Language;
}

// One file before and after a change. A rename has two different paths,
// an added file has no `before`, a deleted file has no `after`.
export interface FileChange {
  before: FileVersion | null;
  after: FileVersion | null;
}

export interface CompareContext {
  detect: TestFileDetector; // test files, config `exclude` already applied
  excluded(path: string): boolean; // config `exclude`
  // A test file only by a test runner's own settings (Mocha's `test/*.js`),
  // not by name or config `include`.
  runnerOnly?(path: string): boolean;
  // Whether a directory ('' is the root) had files before the change. A new
  // runner config in an existing directory is judged; in a new one (a new
  // package) it is not. Without it, new configs are not judged.
  dirExisted?(dir: string): boolean;
  // Whether the comparison changed any implementation file (TG008). Unset
  // when one file is judged on its own (an agent's edit), where it can't be
  // known.
  implementationChanged?: boolean;
  // Where a literal appeared before the change (TG009). Unset when there is
  // no "before" to search.
  findLiteral?(literals: string[]): Map<string, LiteralUse>;
  // Test files that mention a name, before the change (TG008, for a
  // constant or fixture given in a support file). Unset when there is no
  // "before" to search.
  testsNaming?(name: string): TestFile[];
}

// Whether the engine needs the contents of this path.
export function isWatched(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) !== null ||
    isSnapshot(path) ||
    isGolden(path, ctx) ||
    (ctx.testsNaming !== undefined && supportLanguage(path, ctx) !== null) ||
    guardFileKind(path) !== null ||
    (runnerConfigKind(path) !== null && !ctx.excluded(path)) ||
    (ctx.findLiteral !== undefined && isImplementationCode(path, ctx))
  );
}

export function compareFiles(
  change: FileChange,
  ctx: CompareContext,
  ruleIds: readonly RuleId[],
): RuleFinding[] {
  const input = toRuleInput(change, ctx);
  if (!input) return [];
  return ruleIds.flatMap((id) => RULES[id](input));
}

function toRuleInput(
  change: FileChange,
  ctx: CompareContext,
): RuleInput | null {
  const before =
    change.before && isWatched(change.before.path, ctx) ? change.before : null;
  const after =
    change.after && isWatched(change.after.path, ctx) ? change.after : null;
  if (!before && !after) return null;

  const beforeLang = before && ctx.detect(before.path);
  const afterLang = after && ctx.detect(after.path);
  const path = after?.path ?? before?.path ?? '';
  const beforeLines = before ? splitLines(before.content) : [];
  const afterLines = after ? splitLines(after.content) : [];
  // A workflow renamed away (`ci.yml` → `ci.yml.off`) is judged as one.
  const runnerConfig = ctx.excluded(path)
    ? null
    : (runnerConfigKind(path) ??
      (before && runnerConfigKind(before.path) === 'workflow'
        ? 'workflow'
        : null));
  let beforeAnalysis =
    before && beforeLang
      ? analyzeSource(before.path, before.content, beforeLang)
      : null;
  let afterAnalysis =
    after && afterLang
      ? analyzeSource(after.path, after.content, afterLang)
      : null;
  // A file only a runner's settings call a test (`test/setup.js` under
  // Mocha's `test/*.js`) is one only when it has tests.
  const hasTests = (a: typeof beforeAnalysis) =>
    a !== null && (a.stats.tests > 0 || a.stats.skips > 0);
  if (
    (before === null || ctx.runnerOnly?.(before.path)) &&
    (after === null || ctx.runnerOnly?.(after.path)) &&
    !hasTests(beforeAnalysis) &&
    !hasTests(afterAnalysis)
  ) {
    beforeAnalysis = null;
    afterAnalysis = null;
  }
  const support = supportLanguage(path, ctx);
  const strip = (file: FileVersion | null) =>
    file && support
      ? analyzeSource(file.path, file.content, support).lines
      : [];
  return {
    before: beforeAnalysis,
    after: afterAnalysis,
    beforePath: change.before?.path ?? null,
    afterPath: change.after?.path ?? null,
    beforeLines,
    afterLines,
    hunks: diffLines(beforeLines, afterLines),
    runnerConfig,
    addedToExistingDir:
      runnerConfig !== null &&
      change.before === null &&
      change.after !== null &&
      ctx.dirExisted?.(parentDir(change.after.path)) === true,
    implementationChanged: ctx.implementationChanged,
    golden: change.before !== null && isGolden(change.before.path, ctx),
    support: support && {
      language: support,
      before: strip(before),
      after: strip(after),
    },
    testsNaming: ctx.testsNaming,
    implementationFile: isImplementationCode(path, ctx),
    findLiteral: ctx.findLiteral,
    guardFile:
      guardFileKind(change.after?.path ?? '') ??
      guardFileKind(change.before?.path ?? ''),
  };
}

// Dependency manifests and lockfiles: a dependency bump can change outputs.
const DEPENDENCIES =
  /(?:^|\/)(?:package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|requirements[\w.-]*\.txt|pyproject\.toml|poetry\.lock|uv\.lock|Pipfile(?:\.lock)?|pom\.xml|build\.gradle(?:\.kts)?|gradle\.lockfile|go\.(?:mod|sum)|Cargo\.(?:toml|lock)|Gemfile(?:\.lock)?|composer\.(?:json|lock))$/;
// Folders of tests and their data, not implementation.
const TEST_DIR =
  /(?:^|\/)(?:tests?|__tests__|spec|__mocks__|__fixtures__|fixtures?|testdata)\//i;
const CODE =
  /\.(?:[cm]?[jt]sx?|vue|svelte|py|java|kt|kts|scala|groovy|go|rs|cs|fs|vb|rb|php|swift|m|mm|c|cc|cpp|cxx|h|hh|hpp|sql|sh|ps1)$/i;

// Files whose change can explain new expected values (TG008): code and
// dependencies outside the test folders. Config, data and docs don't count,
// so touching `.gitignore` or adding an empty file explains nothing.
export function isImplementation(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) === null &&
    !isSnapshot(path) &&
    guardFileKind(path) === null &&
    (DEPENDENCIES.test(path) ||
      (CODE.test(path) && !TEST_DIR.test(path) && !CONFTEST.test(path)))
  );
}

const CONFTEST = /(?:^|\/)conftest\.py$/;

// Code that tests share without being tests (TG008): constants and fixtures
// in the test folders (`tests/fixtures.ts`), and pytest's `conftest.py`.
export function supportLanguage(
  path: string,
  ctx: CompareContext,
): Language | null {
  if (
    ctx.detect(path) !== null ||
    ctx.excluded(path) ||
    !(TEST_DIR.test(path) || CONFTEST.test(path))
  ) {
    return null;
  }
  if (/\.[cm]?[jt]sx?$/.test(path)) return 'js';
  if (/\.py$/.test(path)) return 'python';
  if (/\.java$/.test(path)) return 'java';
  return null;
}

// A file of expected output in the test folders, written by hand or by the
// code (TG008): `tests/data/expected.json`, `out.golden`,
// `testdata/golden/a.txt`. Not code, docs or inputs (`expected_input.json`).
export function isGolden(path: string, ctx: CompareContext): boolean {
  return (
    ctx.detect(path) === null &&
    !ctx.excluded(path) &&
    TEST_DIR.test(path) &&
    !CODE.test(path) &&
    !/\.(?:md|rst|adoc)$/i.test(path) &&
    path
      .split('/')
      .some(
        (part) =>
          !/(?:^|[._-])[Ii]nputs?(?=[._-]|[A-Z]|$)/.test(part) &&
          /(?:^|[._-])(?:[Ee]xpected|EXPECTED|[Gg]olden|GOLDEN)[sS]?(?=[._-]|[A-Z]|$)/.test(
            part,
          ),
      )
  );
}

export const isDependencyFile = (path: string) => DEPENDENCIES.test(path);

// Implementation code, not a manifest or lockfile.
export const isImplementationCode = (path: string, ctx: CompareContext) =>
  isImplementation(path, ctx) && !isDependencyFile(path);

// Whether a code change does anything: more than comments (wherever they
// sit on a line), docstrings or whitespace changed.
export function changesCode(
  before: string,
  after: string,
  path: string,
): boolean {
  return codeOf(before, path) !== codeOf(after, path);
}

// A source file's code without comments, Python docstrings, blank lines and
// whitespace that doesn't matter. Strings are kept as written, and so is
// Python's indentation.
function codeOf(source: string, path: string): string {
  const python = /\.py$/i.test(path);
  const hash = /\.(?:py|sh|rb|ps1|php)$/i.test(path);
  const slash = !/\.(?:py|sh|rb|ps1)$/i.test(path);
  const dash = /\.sql$/i.test(path);
  const markup = /\.(?:vue|svelte)$/i.test(path);
  const text = toLf(source);
  const end = (from: number) => {
    const n = text.indexOf('\n', from);
    return n === -1 ? text.length : n;
  };
  let out = '';
  let lineStart = true;
  let i = 0;
  while (i < text.length) {
    const ch = text[i] ?? '';
    if (ch === '\n') {
      out += ch;
      lineStart = true;
      i++;
    } else if (/\s/.test(ch)) {
      if (python && lineStart) out += ch;
      i++;
    } else if (
      (slash && text.startsWith('//', i)) ||
      (hash && ch === '#') ||
      (dash && text.startsWith('--', i))
    ) {
      i = end(i);
    } else if (slash && text.startsWith('/*', i)) {
      const close = text.indexOf('*/', i + 2);
      i = close === -1 ? text.length : close + 2;
    } else if (markup && text.startsWith('<!--', i)) {
      const close = text.indexOf('-->', i + 4);
      i = close === -1 ? text.length : close + 3;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const quote =
        python && text.startsWith(ch.repeat(3), i) ? ch.repeat(3) : ch;
      let j = i + quote.length;
      while (j < text.length && !text.startsWith(quote, j)) {
        if (quote.length === 1 && ch !== '`' && text[j] === '\n') break;
        j += text[j] === '\\' ? 2 : 1;
      }
      if (text.startsWith(quote, j)) j += quote.length;
      j = Math.min(text.length, j);
      // A Python docstring: a triple-quoted string on lines of its own.
      const docstring: boolean =
        quote.length === 3 && lineStart && text.slice(j, end(j)).trim() === '';
      if (!docstring) out += text.slice(i, j);
      lineStart = lineStart && docstring;
      i = j;
    } else {
      out += ch;
      lineStart = false;
      i++;
    }
  }
  return out
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
}

function parentDir(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

function splitLines(content: string): string[] {
  return content === '' ? [] : toLf(content).split('\n');
}
