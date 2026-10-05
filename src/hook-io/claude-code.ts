// Claude Code hook input/output (spec: docs/agents/claude-code.md).
// Holds no test-guard logic and imports nothing from it, so it can move to a
// shared package later (ROADMAP §4.4).

export class HookInputError extends Error {}

export interface PreToolUseInput {
  event: 'PreToolUse';
  cwd: string;
  toolName: string;
  toolInput: Record<string, unknown>;
}

export interface StopInput {
  event: 'Stop';
  cwd: string;
  stopHookActive: boolean; // already continuing because of a Stop hook
}

export type HookInput = PreToolUseInput | StopInput;

export function parseHookInput(text: string): HookInput {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new HookInputError('stdin is not valid JSON');
  }
  if (!isObject(raw) || typeof raw.cwd !== 'string') {
    throw new HookInputError('stdin JSON has no "cwd"');
  }
  if (raw.hook_event_name === 'PreToolUse') {
    if (typeof raw.tool_name !== 'string' || !isObject(raw.tool_input)) {
      throw new HookInputError('PreToolUse input has no tool_name/tool_input');
    }
    return {
      event: 'PreToolUse',
      cwd: raw.cwd,
      toolName: raw.tool_name,
      toolInput: raw.tool_input,
    };
  }
  if (raw.hook_event_name === 'Stop') {
    return {
      event: 'Stop',
      cwd: raw.cwd,
      stopHookActive: raw.stop_hook_active === true,
    };
  }
  throw new HookInputError(
    `unsupported hook event: ${String(raw.hook_event_name)}`,
  );
}

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

// Responses are written to stdout with exit code 0. Allowing is no output.
export function denyToolUse(reason: string): string {
  return json({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  });
}

export function blockStop(reason: string): string {
  return json({ decision: 'block', reason });
}

export function notifyUser(message: string): string {
  return json({ systemMessage: message });
}

function json(value: unknown): string {
  return `${JSON.stringify(value)}\n`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
