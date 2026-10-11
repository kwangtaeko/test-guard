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
// `edit { path, old_str, new_str }`, `create { path, file_text }` (not
// confirmed in a live session; docs/agents/claude-code.md). Those are read
// as well, so such an edit isn't let through unseen.
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
  if (
    toolName === 'Edit' &&
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
