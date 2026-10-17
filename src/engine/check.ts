import {
  CONFIG_FILE,
  type Config,
  createContext,
  parseConfig,
} from '../config.js';
import { analyzeSource } from '../languages/index.js';
import { RULE_IDS, type RuleId } from '../rules/index.js';
import { isRunnerFile, runnerTestPatterns } from '../runner-tests.js';
import type { Finding } from '../types.js';
import {
  type CompareContext,
  changesCode,
  compareFiles,
  isDependencyFile,
  isImplementation,
  isWatched,
  type TestFile,
} from './compare.js';
import {
  afterSpec,
  type CompareMode,
  createWorktreeIndex,
  findRoot,
  grepTree,
  listAfterFiles,
  listChanges,
  listTreeFiles,
  type PathChange,
  readBlob,
  readBlobIfExists,
  readTreeTexts,
  resolveBase,
} from './git.js';
import { literalFinder } from './literals.js';

export interface CheckOptions {
  cwd: string;
  mode: CompareMode;
  rules?: readonly RuleId[];
  countFiles?: boolean; // filesScanned costs a git call; hooks skip it
}

export interface CheckResult {
  mode: CompareMode;
  from: string;
  findings: Finding[];
  filesScanned: number; // test files on the "after" side
}

export function runCheck(options: CheckOptions): CheckResult {
  const { mode } = options;
  const root = findRoot(options.cwd);
  const base = resolveBase(root, mode);
  // Read from the "before" side, so a change cannot loosen its own check.
  const config = parseConfig(
    base ? readBlobIfExists(root, `${base}:${CONFIG_FILE}`) : null,
  );
  let baseDirs: Set<string> | undefined;
  const ctx: CompareContext = {
    ...createContext(
      config,
      base ? runnerTestPatterns(readTreeTexts(root, base, isRunnerFile)) : [],
    ),
    // Only asked when a runner config is added, so the git call is rare.
    dirExisted: (dir) => {
      if (!base) return false;
      baseDirs ??= parentDirs(listTreeFiles(root, base));
      return baseDirs.has(dir);
    },
  };
  const ruleIds = activeRuleIds(config, options.rules);

  const worktree = mode.kind === 'worktree' ? createWorktreeIndex(root) : null;
  try {
    const env = worktree?.env;
    // Unwatched files are never read.
    const read = (spec: string, path: string) =>
      isWatched(path, ctx) ? readBlob(root, spec, env) : '';

    const findings: Finding[] = [];
    const changes = pairRenamedTests(
      [...listChanges(root, base, mode, env)],
      (path) => (base ? readBlob(root, `${base}:${path}`, env) : ''),
      (path) => readBlob(root, afterSpec(mode, path), env),
      ctx,
    );
    if (base) {
      ctx.findLiteral = literalFinder(root, base, ctx);
      ctx.testsNaming = testsNaming(root, base, ctx, env);
    }
    // A real implementation change: code or dependencies, not just comments
    // or blank lines (TG008).
    ctx.implementationChanged = changes.some(({ beforePath, afterPath }) => {
      const path = afterPath ?? beforePath;
      if (path === null || !isImplementation(path, ctx)) return false;
      // Deleted code counts; an added or moved file only with code in it
      // or changed.
      if (isDependencyFile(path) || afterPath === null) return true;
      return changesCode(
        base && beforePath ? readBlob(root, `${base}:${beforePath}`, env) : '',
        readBlob(root, afterSpec(mode, path), env),
        path,
      );
    });
    for (const { beforePath, afterPath } of changes) {
      const change = {
        before:
          beforePath && base
            ? {
                path: beforePath,
                content: read(`${base}:${beforePath}`, beforePath),
              }
            : null,
        after: afterPath
          ? {
              path: afterPath,
              content: read(afterSpec(mode, afterPath), afterPath),
            }
          : null,
      };
      for (const finding of compareFiles(change, ctx, ruleIds)) {
        const level = config.rules[finding.ruleId];
        findings.push({
          ...finding,
          severity: level === 'warn' ? 'warn' : 'error',
        });
      }
    }

    return {
      mode,
      from:
        mode.kind === 'base'
          ? mode.ref
          : mode.kind === 'worktree'
            ? (mode.from ?? 'HEAD')
            : 'HEAD',
      findings: findings.sort(
        (a, b) =>
          a.path.localeCompare(b.path) ||
          (a.line ?? 0) - (b.line ?? 0) ||
          a.ruleId.localeCompare(b.ruleId),
      ),
      filesScanned:
        options.countFiles === false
          ? 0
          : listAfterFiles(root, mode, env).filter((p) => ctx.detect(p)).length,
    };
  } finally {
    worktree?.dispose();
  }
}

export function activeRuleIds(
  config: Config,
  rules: readonly RuleId[] = RULE_IDS,
): RuleId[] {
  return rules.filter((id) => config.rules[id] !== 'off');
}

// Test files in `base` that mention a name as a whole word (TG008).
function testsNaming(
  root: string,
  base: string,
  ctx: CompareContext,
  env: NodeJS.ProcessEnv | undefined,
): (name: string) => TestFile[] {
  const cache = new Map<string, TestFile[]>();
  return (name) => {
    let found = cache.get(name);
    if (!found) {
      let paths: string[] = [];
      try {
        paths = [
          ...new Set(grepTree(root, base, [name], true).map((h) => h.path)),
        ];
      } catch {
        // Too much output or an unreadable tree: none found.
      }
      found = paths.flatMap((path) => {
        const language = ctx.detect(path);
        return language
          ? [
              {
                path,
                language,
                content: readBlob(root, `${base}:${path}`, env),
              },
            ]
          : [];
      });
      cache.set(name, found);
    }
    return found;
  };
}

const jaccard = (a: Set<string>, b: Set<string>) => {
  const shared = [...a].filter((w) => b.has(w)).length;
  return shared / (a.size + b.size - shared || 1);
};

// Test names: `it('name', …)`, `def test_name`, a JUnit `@Test … void name(`.
function testNames(content: string): Set<string>[] {
  const names = [
    ...content.matchAll(
      /\b(?:it|test|specify)(?:\.\w+)*\(\s*(['"`])((?:(?!\1).)+)\1/g,
    ),
  ].map((m) => m[2] ?? '');
  names.push(
    ...[...content.matchAll(/\bdef\s+(test\w*)/g)].map((m) => m[1] ?? ''),
  );
  names.push(
    ...[...content.matchAll(/@Test\b[\s\S]{0,200}?\bvoid\s+(\w+)\s*\(/g)].map(
      (m) => m[1] ?? '',
    ),
  );
  return names.map(
    (n) =>
      new Set(
        n
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean),
      ),
  );
}

// Every old test has its own counterpart among the new ones, named mostly
// the same (`isValid narrows …` → `validate narrows …`).
function keepsTests(old: Set<string>[], now: Set<string>[]): boolean {
  if (old.length === 0) return false;
  const left = [...now];
  return old.every((name) => {
    const at = left.findIndex((n) => jaccard(name, n) >= 0.6);
    if (at === -1) return false;
    left.splice(at, 1);
    return true;
  });
}

// A test file deleted and another added in the same folder, with as many
// tests and assertions or more and mostly the same words: a rename git
// didn't see because most lines were edited (`is-valid.test.ts` →
// `validate.test.ts`). Judged as one file, so every rule compares them.
function pairRenamedTests(
  changes: PathChange[],
  readBefore: (path: string) => string,
  readAfter: (path: string) => string,
  ctx: CompareContext,
): PathChange[] {
  const tests = (pick: (c: PathChange) => string | null) =>
    changes.filter((c) => {
      const path = pick(c);
      return path !== null && ctx.detect(path) !== null;
    });
  const gone = tests((c) => (c.afterPath === null ? c.beforePath : null));
  const added = tests((c) => (c.beforePath === null ? c.afterPath : null));
  if (gone.length === 0 || added.length === 0) return changes;
  const dir = (p: string) => p.slice(0, p.lastIndexOf('/') + 1);
  const words = (text: string) => new Set(text.match(/[A-Za-z_]\w{2,}/g));
  const look = (path: string, content: string) => {
    const language = ctx.detect(path);
    if (!language) return null;
    // Words of the code, not of comments or strings an edit could pad.
    const analysis = analyzeSource(path, content, language);
    return {
      stats: analysis.stats,
      words: words(analysis.lines.join('\n')),
      names: testNames(content),
    };
  };
  const paired: PathChange[] = [];
  const used = new Set<PathChange>();
  for (const old of gone) {
    const from = old.beforePath ?? '';
    const was = look(from, readBefore(from));
    if (!was) continue;
    let best: { change: PathChange; score: number } | null = null;
    for (const change of added) {
      const to = change.afterPath ?? '';
      if (used.has(change) || dir(to) !== dir(from)) continue;
      if (ctx.detect(to) !== ctx.detect(from)) continue;
      const now = look(to, readAfter(to));
      if (
        !now ||
        now.stats.tests < was.stats.tests ||
        now.stats.assertions < was.stats.assertions
      ) {
        continue;
      }
      const score = jaccard(was.words, now.words);
      if (
        score >= 0.8 &&
        keepsTests(was.names, now.names) &&
        (!best || score > best.score)
      ) {
        best = { change, score };
      }
    }
    if (!best) continue;
    used.add(best.change);
    used.add(old);
    paired.push({ beforePath: from, afterPath: best.change.afterPath });
  }
  return [...changes.filter((c) => !used.has(c)), ...paired];
}

function parentDirs(files: string[]): Set<string> {
  const dirs = new Set<string>();
  for (const file of files) {
    let slash = file.lastIndexOf('/');
    while (slash !== -1) {
      dirs.add(file.slice(0, slash));
      slash = file.lastIndexOf('/', slash - 1);
    }
    dirs.add('');
  }
  return dirs;
}
