#!/usr/bin/env node
// Runs `test-guard check` on each of the last N commits of a repository (each
// against its parent) and reports how many commits it would stop. Used to
// measure false positives on real history (ROADMAP §12.1 M8).
//
//   pnpm build
//   node scripts/fp-history.mjs <clone> [--commits 300] [--out result.json]
//
// The clone is checked out commit by commit and returned to its starting
// point at the end; use a throwaway clone.
import { execFileSync, spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
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
    'usage: fp-history.mjs <clone> [--commits 300] [--out result.json]',
  );
  process.exit(2);
}
const commits = Number(option('commits', '300'));
const out = option('out', null);
const cli = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
  'cli.js',
);

const git = (...a) =>
  execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8' }).trim();

const start = git('rev-parse', 'HEAD');
const shas = git(
  'rev-list',
  '--no-merges',
  '--first-parent',
  '-n',
  String(commits),
  'HEAD',
)
  .split('\n')
  .filter(Boolean);

const flagged = [];
const byRule = {};
let scanned = 0;
try {
  for (const sha of shas) {
    const parents = git('rev-list', '--parents', '-n', '1', sha).split(' ');
    if (parents.length < 2) continue; // root commit
    git('checkout', '-q', '--force', '--detach', sha);
    const run = spawnSync(
      process.execPath,
      [cli, 'check', '--base', `${sha}^`, '--json'],
      { cwd: resolve(repo), encoding: 'utf8' },
    );
    if (run.status !== 0 && run.status !== 1) {
      throw new Error(`${sha}: exit ${run.status}\n${run.stderr}`);
    }
    scanned++;
    const { findings } = JSON.parse(run.stdout);
    if (findings.length === 0) continue;
    for (const f of findings) byRule[f.ruleId] = (byRule[f.ruleId] ?? 0) + 1;
    flagged.push({
      sha: sha.slice(0, 10),
      subject: git('log', '-1', '--format=%s', sha),
      blocking: run.status === 1,
      findings: findings.map((f) =>
        [f.ruleId, f.path, f.line, f.message]
          .filter((x) => x != null)
          .join(' '),
      ),
    });
  }
} finally {
  git('checkout', '-q', '--force', start);
}

const result = {
  repository: git('remote', 'get-url', 'origin'),
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
