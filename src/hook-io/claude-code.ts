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

export function fileEdit(input: PreToolUseInput): FileEdit | null {
  const { toolName, toolInput: t } = input;
  if (typeof t.file_path !== 'string') return null;
  if (toolName === 'Write' && typeof t.content === 'string') {
    return { kind: 'write', filePath: t.file_path, content: t.content };
  }
  if (
    toolName === 'Edit' &&
    typeof t.old_string === 'string' &&
    typeof t.new_string === 'string'
  ) {
    return {
      kind: 'edit',
      filePath: t.file_path,
      oldString: t.old_string,
      newString: t.new_string,
      replaceAll: t.replace_all === true,
    };
  }
  return null;
}

// Bash and PowerShell share `{ command }`.
export function shellCommand(input: PreToolUseInput): string | null {
  if (input.toolName !== 'Bash' && input.toolName !== 'PowerShell') {
    return null;
  }
  return typeof input.toolInput.command === 'string'
    ? input.toolInput.command
    : null;
}
