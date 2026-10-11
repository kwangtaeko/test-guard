// Gemini CLI specifics (spec: docs/agents/gemini.md). No test-guard imports,
// like ./common.ts. Gemini's BeforeTool and AfterAgent carry the fields of
// PreToolUse and Stop under other names, so input is renamed to the shared
// shape and the shared answers are renamed back.
import type { PreToolUseInput } from './common.js';

export * from './common.js';

const EVENTS: Record<string, string> = {
  BeforeTool: 'PreToolUse',
  AfterAgent: 'Stop',
};

// Gemini's stdin as the shared hook JSON. Text that isn't a JSON object is
// passed on for the shared parser to reject.
export function toCommonInput(text: string): string {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return text;
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return text;
  }
  const input = raw as Record<string, unknown>;
  const event = EVENTS[String(input.hook_event_name)];
  return event ? JSON.stringify({ ...input, hook_event_name: event }) : text;
}

// A shared answer in Gemini's words: a PreToolUse deny becomes
// `{ decision: "deny", reason }`. Stop's `{ decision: "block", reason }`
// and `{ systemMessage }` are Gemini's already.
export function toGeminiOutput(output: string): string {
  if (output === '') return output;
  const value = JSON.parse(output) as {
    hookSpecificOutput?: { permissionDecisionReason?: string };
  };
  const reason = value.hookSpecificOutput?.permissionDecisionReason;
  return reason === undefined
    ? output
    : `${JSON.stringify({ decision: 'deny', reason })}\n`;
}

// write_file: { file_path, content }. replace: { file_path, old_string,
// new_string, allow_multiple? }. Null when the shape is not as documented.
export type FileEdit =
  | { kind: 'write'; filePath: string; content: string }
  | {
      kind: 'replace';
      filePath: string;
      oldString: string;
      newString: string;
      allowMultiple: boolean;
    };

export function fileEdit(input: PreToolUseInput): FileEdit | null {
  const { toolName, toolInput: t } = input;
  if (typeof t.file_path !== 'string') return null;
  if (toolName === 'write_file' && typeof t.content === 'string') {
    return { kind: 'write', filePath: t.file_path, content: t.content };
  }
  if (
    toolName === 'replace' &&
    typeof t.old_string === 'string' &&
    typeof t.new_string === 'string'
  ) {
    return {
      kind: 'replace',
      filePath: t.file_path,
      oldString: t.old_string,
      newString: t.new_string,
      allowMultiple: t.allow_multiple === true,
    };
  }
  return null;
}

// run_shell_command: { command, dir_path? }; `dir_path` is where it runs.
export function shellCommand(
  input: PreToolUseInput,
): { command: string; dir: string | null } | null {
  const { toolName, toolInput: t } = input;
  if (toolName !== 'run_shell_command' || typeof t.command !== 'string') {
    return null;
  }
  return {
    command: t.command,
    dir:
      typeof t.dir_path === 'string' && t.dir_path !== '' ? t.dir_path : null,
  };
}
