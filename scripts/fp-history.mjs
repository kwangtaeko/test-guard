#!/usr/bin/env node
// Runs `test-guard check` on each of the last N commits of a repository (each
// against its parent) and reports how many commits it would stop. Used to
// measure false positives on real history (ROADMAP §12.1 M8).
//
//   pnpm build
//   node scripts/fp-history.mjs <clone> [--commits 300] [--jobs 4] [--out result.json]
//
// Commits are checked out in temporary worktrees, `--jobs` at a time; the
// clone itself is left as it is, so runs on the same clone don't collide.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const repo = args.find((a) => !a.startsWith('--'));
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
if (!repo) {
  console.error(
    'usage: fp-history.mjs <clone> [--commits 300] [--jobs 4] [--out result.json]',
  );
  process.exit(2);
}
const commits = Number(option('commits', '300'));
const jobs = Math.max(1, Number(option('jobs', '4')));
const out = option('out', null);
const cli = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
  'cli.js',
);

const git = (dir, ...a) =>
  execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8' }).trim();

const start = git(repo, 'rev-parse', 'HEAD');
// Each commit with its parent; root commits have nothing to compare with.
const shas = git(
  repo,
  'rev-list',
  '--no-merges',
  '--first-parent',
  '--parents',
  '-n',
  String(commits),
  'HEAD',
)
  .split('\n')
  .map((line) => line.split(' '))
  .filter((parts) => parts.length >= 2)
  .map(([sha]) => sha);

function check(dir, sha) {
  return new Promise((done, fail) => {
    const child = spawn(
      process.execPath,
      [cli, 'check', '--base', `${sha}^`, '--json'],
      { cwd: dir },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('close', (status) => {
      if (status !== 0 && status !== 1) {
        fail(new Error(`${sha}: exit ${status}\n${stderr}`));
      } else done({ status, findings: JSON.parse(stdout).findings });
    });
  });
}

const results = new Map();
const temp = mkdtempSync(join(tmpdir(), 'fp-history-'));
const trees = [];
try {
  for (let i = 0; i < Math.min(jobs, shas.length); i++) {
    const tree = join(temp, `wt${i}`);
    git(repo, 'worktree', 'add', '-q', '--detach', tree, start);
    trees.push(tree);
  }
  let next = 0;
  await Promise.all(
    trees.map(async (tree) => {
      while (next < shas.length) {
        const sha = shas[next++];
        git(tree, 'checkout', '-q', '--force', '--detach', sha);
        results.set(sha, await check(resolve(tree), sha));
      }
    }),
  );
} finally {
  for (const tree of trees) {
    try {
      git(repo, 'worktree', 'remove', '--force', tree);
    } catch {}
  }
  git(repo, 'worktree', 'prune');
  rmSync(temp, { recursive: true, force: true });
}

const flagged = [];
const byRule = {};
for (const sha of shas) {
  const { status, findings } = results.get(sha);
  if (findings.length === 0) continue;
  for (const f of findings) byRule[f.ruleId] = (byRule[f.ruleId] ?? 0) + 1;
  flagged.push({
    sha: sha.slice(0, 10),
    subject: git(repo, 'log', '-1', '--format=%s', sha),
    blocking: status === 1,
    findings: findings.map((f) =>
      [f.ruleId, f.path, f.line, f.message].filter((x) => x != null).join(' '),
    ),
  });
}

const scanned = results.size;
const result = {
  repository: git(repo, 'remote', 'get-url', 'origin'),
  head: start,
  scanned,
  flagged: flagged.length,
  blocking: flagged.filter((f) => f.blocking).length,
  byRule,
  commits: flagged,
};
const text = JSON.stringify(result, null, 2);
if (out) writeFileSync(out, `${text}\n`);
console.log(
  `${result.repository}: ${scanned} commits, ${result.blocking} would be stopped (${((100 * result.blocking) / Math.max(scanned, 1)).toFixed(1)}%)`,
);
if (!out) console.log(text);
