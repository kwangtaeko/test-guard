// Hook input/output shared by Claude Code and Codex, whose PreToolUse and
// Stop shapes match (docs/agents/claude-code.md, docs/agents/codex.md).
// Holds no test-guard logic and imports nothing from it, so it can move to a
// shared package later (ROADMAP §4.4).

export class HookInputError extends Error {}

export interface PreToolUseInput {
  event: 'PreToolUse';
  cwd: string;
  sessionId?: string;
  toolName: string;
  toolInput: Record<string, unknown>;
}

export interface StopInput {
  event: 'Stop';
  cwd: string;
  sessionId?: string;
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
  const sessionId =
    typeof raw.session_id === 'string' && raw.session_id !== ''
      ? raw.session_id
      : undefined;
  if (raw.hook_event_name === 'PreToolUse') {
    if (typeof raw.tool_name !== 'string' || !isObject(raw.tool_input)) {
      throw new HookInputError('PreToolUse input has no tool_name/tool_input');
    }
    return {
      event: 'PreToolUse',
      cwd: raw.cwd,
      sessionId,
      toolName: raw.tool_name,
      toolInput: raw.tool_input,
    };
  }
  if (raw.hook_event_name === 'Stop') {
    return {
      event: 'Stop',
      cwd: raw.cwd,
      sessionId,
      stopHookActive: raw.stop_hook_active === true,
    };
  }
  throw new HookInputError(
    `unsupported hook event: ${String(raw.hook_event_name)}`,
  );
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
