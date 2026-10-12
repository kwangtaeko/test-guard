// Claude Code specifics (spec: docs/agents/claude-code.md). No test-guard
// imports, like ./common.ts.
import type { PreToolUseInput } from './common.js';

export * from './common.js';

// Write: { file_path, content }. Edit: { file_path, old_string, new_string,
// replace_all }. Returns null when the shape is not as documented.
export type FileEdit =
  | { kind: 'write'; filePath: string; content: string }
  | {
      kind: 'edit';
      filePath: string;
      oldString: string;
      newString: string;
      replaceAll: boolean;
    };

// GitHub Copilot CLI runs Claude Code hooks too, naming its tools as Claude
// Code does (`Edit`, `Write`) but possibly keeping its own arguments:
// `edit { path, old_str, new_str }`, `create { path, file_text }` (seen in
// its bundle, not yet in a live session; docs/agents/claude-code.md). Those
// are read as well, so such an edit isn't let through unseen.
export function fileEdit(input: PreToolUseInput): FileEdit | null {
  const { toolName, toolInput: t } = input;
  const filePath = t.file_path ?? t.path;
  if (typeof filePath !== 'string') return null;
  const content = t.content ?? t.file_text;
  if (toolName === 'Write' && typeof content === 'string') {
    return { kind: 'write', filePath, content };
  }
  const oldString = t.old_string ?? t.old_str;
  const newString = t.new_string ?? t.new_str;
  // Cursor names Claude Code's Edit `Write`.
  if (
    (toolName === 'Edit' || toolName === 'Write') &&
    typeof oldString === 'string' &&
    typeof newString === 'string'
  ) {
    return {
      kind: 'edit',
      filePath,
      oldString,
      newString,
      replaceAll: t.replace_all === true,
    };
  }
  return null;
}

// GitHub Copilot CLI 1.0.95 sends its apply_patch as `Edit` with the patch
// text as the whole tool_input (recorded live, docs/agents/claude-code.md).
export function patchText(input: PreToolUseInput): string | null {
  return input.toolName === 'Edit' && input.toolText !== undefined
    ? input.toolText
    : null;
}

// Bash and PowerShell share `{ command }`; Cursor, which runs Claude Code
// hooks too, calls its shell tool `Shell`.
export function shellCommand(input: PreToolUseInput): string | null {
  if (!['Bash', 'PowerShell', 'Shell'].includes(input.toolName)) {
    return null;
  }
  return typeof input.toolInput.command === 'string'
    ? input.toolInput.command
    : null;
}

// Cursor follows Claude Code's deny but shows its reason only to the user;
// in Cursor's own fields the agent gets it too (cursor.com/docs/agent/hooks).
// Other output, and output for other agents, is left as it is.
export function forCursor(stdin: string, output: string): string {
  if (output === '') return output;
  let input: unknown;
  let parsed: unknown;
  try {
    input = JSON.parse(stdin.replace(/^\uFEFF/, ''));
    parsed = JSON.parse(output);
  } catch {
    return output;
  }
  const isCursor =
    typeof input === 'object' && input !== null && 'cursor_version' in input;
  const decision =
    typeof parsed === 'object' &&
    parsed !== null &&
    'hookSpecificOutput' in parsed
      ? (parsed.hookSpecificOutput as Record<string, unknown>)
      : undefined;
  if (!isCursor || decision?.permissionDecision !== 'deny') return output;
  const reason = String(decision.permissionDecisionReason ?? '');
  return `${JSON.stringify({ permission: 'deny', user_message: reason, agent_message: reason })}\n`;
}
