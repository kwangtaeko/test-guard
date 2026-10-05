// Codex specifics (spec: docs/agents/codex.md). No test-guard imports, like
// ./common.ts.
import type { PreToolUseInput } from './common.js';

export * from './common.js';

// File edits arrive as `apply_patch` with the patch text in `command`.
export function patchText(input: PreToolUseInput): string | null {
  if (input.toolName !== 'apply_patch') return null;
  return typeof input.toolInput.command === 'string'
    ? input.toolInput.command
    : null;
}

// Shell commands and `exec_command` arrive as `Bash` with `command`.
export function shellCommand(input: PreToolUseInput): string | null {
  if (input.toolName !== 'Bash') return null;
  const { command } = input.toolInput;
  if (typeof command === 'string') return command;
  // Not documented, but an argv array is joined rather than ignored.
  if (Array.isArray(command) && command.every((c) => typeof c === 'string')) {
    return command.join(' ');
  }
  return null;
}
