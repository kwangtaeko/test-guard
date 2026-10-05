import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { findRoot, gitPath } from '../engine/git.js';

export class InstallError extends Error {}

const MARKER = '# test-guard:';
const LOCAL_CLI = 'node_modules/test-guard/dist/cli.js';
const CHECK_ARGS = 'check --staged --message-file "$1"';

export const HOOK_COMMAND = `npx --no-install test-guard ${CHECK_ARGS}`;

// The CLI path inside the repository when test-guard is installed locally.
// Running it with `node` skips npx, which costs about a second per call.
export function localCli(root: string): string | null {
  return existsSync(join(root, LOCAL_CLI)) ? LOCAL_CLI : null;
}

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
  const root = findRoot(cwd);
  const path = gitPath(root, 'hooks/commit-msg');
  const local = localCli(root);
  // git runs hooks from the repository root.
  const command = local ? `node ${local} ${CHECK_ARGS}` : HOOK_COMMAND;
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (existing !== null && !existing.includes(MARKER)) {
    throw new InstallError(
      `${path} already exists and was not created by test-guard.\n` +
        `Add this line to it instead:\n  ${command}`,
    );
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, hookScript(command));
  chmodSync(path, 0o755);
  return { path, updated: existing !== null };
}
