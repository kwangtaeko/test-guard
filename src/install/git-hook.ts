import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { findRoot, gitPath } from '../engine/git.js';

export class InstallError extends Error {}

const MARKER = '# test-guard:';

export const HOOK_COMMAND =
  'npx --no-install test-guard check --staged --message-file "$1"';

// The check runs in commit-msg, not pre-commit: git stops at a failing
// pre-commit hook before the message exists, so a `Test-Guard-Approved:`
// trailer could never be read.
export function hookScript(command = HOOK_COMMAND): string {
  return [
    '#!/bin/sh',
    `${MARKER} blocks commits that weaken tests (test-guard install --pre-commit)`,
    `exec ${command}`,
    '',
  ].join('\n');
}

export function installGitHook(cwd: string): {
  path: string;
  updated: boolean;
} {
  const path = gitPath(findRoot(cwd), 'hooks/commit-msg');
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (existing !== null && !existing.includes(MARKER)) {
    throw new InstallError(
      `${path} already exists and was not created by test-guard.\n` +
        `Add this line to it instead:\n  ${HOOK_COMMAND}`,
    );
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, hookScript());
  chmodSync(path, 0o755);
  return { path, updated: existing !== null };
}
