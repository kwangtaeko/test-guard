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
  // GitHub Copilot CLI sends some tool inputs as plain text, such as an
  // apply_patch patch; toolInput is then empty.
  toolText?: string;
}

export interface StopInput {
  event: 'Stop';
  cwd: string;
  sessionId?: string;
  stopHookActive: boolean; // already continuing because of a Stop hook
}

export type HookInput = PreToolUseInput | StopInput;

// Cursor, which runs Claude Code hooks too (3.22, recorded live), starts
// stdin with a byte order mark, names events `preToolUse` and `stop`, and
// gives no `cwd` outside shell calls: its `workspace_roots` (`/c:/…` on
// Windows), where it also starts the hook, stands in for it.
export function parseHookInput(text: string): HookInput {
  let raw: unknown;
  try {
    raw = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    throw new HookInputError('stdin is not valid JSON');
  }
  if (!isObject(raw)) throw new HookInputError('stdin JSON has no "cwd"');
  const [root] = Array.isArray(raw.workspace_roots) ? raw.workspace_roots : [];
  const cwd =
    typeof raw.cwd === 'string'
      ? raw.cwd
      : typeof root === 'string'
        ? root.replace(/^\/([A-Za-z]:)/, '$1')
        : undefined;
  if (cwd === undefined) throw new HookInputError('stdin JSON has no "cwd"');
  const sessionId =
    typeof raw.session_id === 'string' && raw.session_id !== ''
      ? raw.session_id
      : undefined;
  if (
    raw.hook_event_name === 'PreToolUse' ||
    raw.hook_event_name === 'preToolUse'
  ) {
    const text = raw.tool_input;
    if (
      typeof raw.tool_name !== 'string' ||
      !(isObject(text) || typeof text === 'string')
    ) {
      throw new HookInputError('PreToolUse input has no tool_name/tool_input');
    }
    const object = typeof text === 'string' ? jsonObject(text) : text;
    return {
      event: 'PreToolUse',
      cwd,
      sessionId,
      toolName: raw.tool_name,
      ...(object === undefined
        ? { toolInput: {}, toolText: String(text) }
        : { toolInput: object }),
    };
  }
  if (raw.hook_event_name === 'Stop' || raw.hook_event_name === 'stop') {
    return {
      event: 'Stop',
      cwd,
      sessionId,
      // Cursor counts the follow-ups a stop hook has started instead.
      stopHookActive:
        raw.stop_hook_active === true ||
        (typeof raw.loop_count === 'number' && raw.loop_count > 0),
    };
  }
  throw new HookInputError(
    `unsupported hook event: ${String(raw.hook_event_name)}`,
  );
}

// Text that holds a JSON object, as tool arguments sent as text may.
function jsonObject(text: string): Record<string, unknown> | undefined {
  try {
    const value: unknown = JSON.parse(text);
    return isObject(value) ? value : undefined;
  } catch {
    return undefined;
  }
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
