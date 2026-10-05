import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export class GitError extends Error {}

export type CompareMode =
  | { kind: 'worktree' }
  | { kind: 'staged' }
  | { kind: 'base'; ref: string };

export interface PathChange {
  beforePath: string | null;
  afterPath: string | null;
}

type Env = NodeJS.ProcessEnv;

function git(root: string, args: string[], env: Env = process.env): string {
  try {
    return execFileSync('git', args, {
      cwd: root,
      env,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const stderr = String((error as { stderr?: unknown }).stderr ?? '').trim();
    throw new GitError(`git ${args[0]} failed${stderr ? `: ${stderr}` : ''}`);
  }
}

export function findRoot(cwd: string): string {
  try {
    return git(cwd, ['rev-parse', '--show-toplevel']).trim();
  } catch {
    throw new GitError('not a git repository');
  }
}

// The "before" side. null means HEAD does not exist yet (first commit).
export function resolveBase(root: string, mode: CompareMode): string | null {
  if (mode.kind === 'base') {
    try {
      return git(root, ['merge-base', mode.ref, 'HEAD']).trim();
    } catch {
      throw new GitError(`cannot find merge-base of ${mode.ref} and HEAD`);
    }
  }
  try {
    return git(root, [
      'rev-parse',
      '--verify',
      '--quiet',
      'HEAD^{commit}',
    ]).trim();
  } catch {
    return null;
  }
}

// Absolute path of a file in the git dir, honoring relocations such as
// GIT_INDEX_FILE and core.hooksPath.
export function gitPath(root: string, name: string): string {
  return resolve(root, git(root, ['rev-parse', '--git-path', name]).trim());
}

// Worktree mode stages everything into a throwaway index, so renames and
// untracked files are seen exactly as `git add -A` would see them. The real
// index is never touched.
export function createWorktreeIndex(root: string): {
  env: Env;
  dispose(): void;
} {
  const indexPath = gitPath(root, 'index');
  const dir = mkdtempSync(join(tmpdir(), 'test-guard-'));
  const tempIndex = join(dir, 'index');
  try {
    if (existsSync(indexPath)) copyFileSync(indexPath, tempIndex);
    const env = { ...process.env, GIT_INDEX_FILE: tempIndex };
    git(root, ['add', '--all', '--', '.'], env);
    return {
      env,
      dispose: () => rmSync(dir, { recursive: true, force: true }),
    };
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}

export function listChanges(
  root: string,
  base: string | null,
  mode: CompareMode,
  env?: Env,
): PathChange[] {
  const args = ['diff', '-z', '--name-status', '-M', '--no-ext-diff'];
  if (mode.kind === 'base') args.push(base ?? 'HEAD', 'HEAD');
  else args.push('--cached', ...(base ? [base] : []));
  const parts = git(root, args, env).split('\0');

  const changes: PathChange[] = [];
  let i = 0;
  while (i < parts.length - 1) {
    const status = parts[i++] ?? '';
    const path = parts[i++] ?? '';
    if (status.startsWith('R')) {
      changes.push({ beforePath: path, afterPath: parts[i++] ?? '' });
    } else if (status.startsWith('C')) {
      changes.push({ beforePath: null, afterPath: parts[i++] ?? '' });
    } else if (status === 'A') {
      changes.push({ beforePath: null, afterPath: path });
    } else if (status === 'D') {
      changes.push({ beforePath: path, afterPath: null });
    } else {
      changes.push({ beforePath: path, afterPath: path });
    }
  }
  return changes;
}

// Revision spec for the "after" side: the index (worktree/staged) or HEAD.
export function afterSpec(mode: CompareMode, path: string): string {
  return mode.kind === 'base' ? `HEAD:${path}` : `:${path}`;
}

export function readBlob(root: string, spec: string, env?: Env): string {
  return git(root, ['cat-file', 'blob', spec], env);
}

export function readBlobIfExists(root: string, spec: string): string | null {
  try {
    return readBlob(root, spec);
  } catch {
    return null;
  }
}

export function listAfterFiles(
  root: string,
  mode: CompareMode,
  env?: Env,
): string[] {
  const out =
    mode.kind === 'base'
      ? git(root, ['ls-tree', '-r', '-z', '--name-only', 'HEAD'])
      : git(root, ['ls-files', '-z', '--cached'], env);
  return [...new Set(out.split('\0').filter(Boolean))];
}

// Tracked and untracked (not ignored) files in the working tree.
export function listWorktreeFiles(root: string): string[] {
  return git(root, ['ls-files', '-z', '-co', '--exclude-standard'])
    .split('\0')
    .filter(Boolean);
}

// Files committed in `rev`.
export function listTreeFiles(root: string, rev: string): string[] {
  return git(root, ['ls-tree', '-r', '-z', '--name-only', rev])
    .split('\0')
    .filter(Boolean);
}
