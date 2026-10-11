// Agent hook settings for `install --agent`. Claude Code (.claude/settings.json),
// Codex (.codex/hooks.json) and Gemini CLI (.gemini/settings.json) share the
// `hooks.<Event>[]` shape.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { diffLines } from '../engine/diff.js';
import { InstallError, localCli } from './git-hook.js';

export const AGENTS = ['claude-code', 'codex', 'gemini'] as const;
export type Agent = (typeof AGENTS)[number];

export interface SettingsPlan {
  path: string;
  before: string | null;
  after: string;
  changed: boolean;
  note?: string; // shown after writing
}

type Handler = Record<string, unknown>;

interface AgentSpec {
  file: string[];
  // Windows routes Claude Code's shell commands through PowerShell when it is
  // enabled; Codex reports file edits as apply_patch.
  preToolUseMatcher: string;
  // Event names when they differ from PreToolUse and Stop.
  events?: { preToolUse: string; stop: string };
  handler(arg: string, local: string | null): Handler;
  note?: string;
}

const SPECS: Record<Agent, AgentSpec> = {
  'claude-code': {
    file: ['.claude', 'settings.json'],
    preToolUseMatcher: 'Edit|Write|Bash|PowerShell',
    // A local install runs `node` directly: npx costs ~1 s per call.
    handler: (arg, local) =>
      local
        ? {
            type: 'command',
            command: 'node',
            args: [
              `\${CLAUDE_PROJECT_DIR}/${local}`,
              'hook',
              'claude-code',
              arg,
            ],
          }
        : {
            type: 'command',
            command: `npx --no-install test-guard hook claude-code ${arg}`,
          },
  },
  codex: {
    file: ['.codex', 'hooks.json'],
    preToolUseMatcher: 'Bash|apply_patch',
    // Codex has no project-dir placeholder and runs hooks in the session cwd,
    // via `$SHELL -lc` or, on Windows, `cmd.exe /C`. A `for /f` lookup of the
    // git root never ran inside Codex on Windows (docs/agents/codex.md), so
    // Windows uses npx, which finds the local install from any subdirectory.
    handler: (arg, local) =>
      local
        ? {
            type: 'command',
            command: `node "$(git rev-parse --show-toplevel)/${local}" hook codex ${arg}`,
            commandWindows: `npx --no-install test-guard hook codex ${arg}`,
          }
        : {
            type: 'command',
            command: `npx --no-install test-guard hook codex ${arg}`,
          },
    note: 'Codex runs project hooks only after you trust them: open Codex and run /hooks.',
  },
  gemini: {
    file: ['.gemini', 'settings.json'],
    preToolUseMatcher: 'write_file|replace|run_shell_command',
    events: { preToolUse: 'BeforeTool', stop: 'AfterAgent' },
    // Hooks run in the project folder (the one whose .gemini/settings.json
    // was loaded), through bash or, on Windows, PowerShell, so a relative
    // path works in both. `$GEMINI_PROJECT_DIR` is not used: Gemini puts it
    // in quotes of its own, which break inside the command. The name lets
    // `hooksConfig.disabled` be checked for it (TG006).
    handler: (arg, local) => ({
      name: `test-guard-${arg}`,
      type: 'command',
      command: local
        ? `node ${local} hook gemini ${arg}`
        : `npx --no-install test-guard hook gemini ${arg}`,
    }),
    note: 'Gemini CLI runs project hooks only in a trusted folder, and loads them when started from the project root.',
  },
};

// Merges test-guard's hooks into the agent's settings without touching
// anything else. Already-present hooks are left alone.
export function planAgentHooks(root: string, agent: Agent): SettingsPlan {
  const spec = SPECS[agent];
  const path = join(root, ...spec.file);
  const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const settings = parseSettings(path, before);
  const hooks = isObject(settings.hooks) ? settings.hooks : {};
  const local = localCli(root);

  for (const { event, arg, matcher } of [
    {
      event: spec.events?.preToolUse ?? 'PreToolUse',
      arg: 'pre-tool-use',
      matcher: spec.preToolUseMatcher,
    },
    { event: spec.events?.stop ?? 'Stop', arg: 'stop', matcher: undefined },
  ]) {
    const entries = Array.isArray(hooks[event]) ? hooks[event] : [];
    const text = JSON.stringify(entries);
    if (text.includes('test-guard') && text.includes(arg)) continue;
    entries.push({
      ...(matcher && { matcher }),
      hooks: [spec.handler(arg, local)],
    });
    hooks[event] = entries;
  }
  settings.hooks = hooks;
  const after = `${JSON.stringify(settings, null, 2)}\n`;
  return { path, before, after, changed: after !== before, note: spec.note };
}

export function formatDiff(before: string | null, after: string): string {
  const b = before === null ? [] : before.replace(/\r\n/g, '\n').split('\n');
  const a = after.split('\n');
  const hunks = diffLines(b, a);
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added = new Set(hunks.flatMap((h) => h.added));
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < b.length || j < a.length) {
    if (i < b.length && deleted.has(i + 1)) out.push(`- ${b[i++]}`);
    else if (j < a.length && added.has(j + 1)) out.push(`+ ${a[j++]}`);
    else {
      out.push(`  ${a[j] ?? ''}`);
      i++;
      j++;
    }
  }
  return `${out.join('\n').trimEnd()}\n`;
}

function parseSettings(
  path: string,
  text: string | null,
): Record<string, unknown> {
  if (text === null || text.trim() === '') return {};
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new InstallError(`${path} is not valid JSON`);
  }
  if (!isObject(value)) throw new InstallError(`${path} is not a JSON object`);
  return value;
}

function isObject(value: unknown): value is Record<string, unknown[]> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
