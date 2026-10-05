// Where an agent session started: HEAD when test-guard first saw the session.
// Stop compares the working tree with this commit rather than the current
// HEAD, so commits made during the session are judged too, however they were
// made (commit, cherry-pick, revert, rebase, plumbing) and even after a reset.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { gitPath, resolveCommit } from '../engine/git.js';

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function sessionFile(root: string, sessionId: string): string {
  const dotGit = join(root, '.git');
  // A plain repository needs no git call; worktrees and submodules do.
  const dir = statSync(dotGit).isDirectory()
    ? join(dotGit, 'test-guard', 'sessions')
    : gitPath(root, 'test-guard/sessions');
  return join(dir, sessionId.replace(/[^\w.-]/g, '_'));
}

// Records HEAD on the first hook call of a session; later calls only check
// that the file exists.
export function recordSessionStart(root: string, sessionId: string): void {
  const file = sessionFile(root, sessionId);
  if (existsSync(file)) return;
  const head = resolveCommit(root, 'HEAD');
  if (!head) return; // no commits yet
  const dir = join(file, '..');
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    const old = join(dir, name);
    if (Date.now() - statSync(old).mtimeMs > MAX_AGE_MS) rmSync(old);
  }
  writeFileSync(file, `${head}\n`);
}

// The recorded commit, or null when there is none (or it no longer exists).
export function sessionStart(root: string, sessionId: string): string | null {
  const file = sessionFile(root, sessionId);
  if (!existsSync(file)) return null;
  const hash = readFileSync(file, 'utf8').trim();
  return /^[0-9a-f]{40,64}$/.test(hash) ? resolveCommit(root, hash) : null;
}
