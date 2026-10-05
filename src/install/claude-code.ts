import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { diffLines } from '../engine/diff.js';
import { InstallError, localCli } from './git-hook.js';

export interface SettingsPlan {
  path: string;
  before: string | null;
  after: string;
  changed: boolean;
}

const EVENTS = [
  {
    event: 'PreToolUse',
    arg: 'pre-tool-use',
    // Windows routes shell commands through PowerShell when it is enabled.
    matcher: 'Edit|Write|Bash|PowerShell',
  },
  { event: 'Stop', arg: 'stop' },
];

// Merges test-guard's hooks into .claude/settings.json without touching
// anything else. Already-present hooks are left alone.
export function planClaudeCodeSettings(root: string): SettingsPlan {
  const path = join(root, '.claude', 'settings.json');
  const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
  const settings = parseSettings(path, before);
  const hooks = isObject(settings.hooks) ? settings.hooks : {};
  const local = localCli(root);

  for (const { event, arg, matcher } of EVENTS) {
    const entries = Array.isArray(hooks[event]) ? hooks[event] : [];
    const text = JSON.stringify(entries);
    if (text.includes('test-guard') && text.includes(arg)) continue;
    // A local install runs `node` directly: npx costs ~1 s per call.
    const handler = local
      ? {
          type: 'command',
          command: 'node',
          args: [`\${CLAUDE_PROJECT_DIR}/${local}`, 'hook', 'claude-code', arg],
        }
      : {
          type: 'command',
          command: `npx --no-install test-guard hook claude-code ${arg}`,
        };
    entries.push({ ...(matcher && { matcher }), hooks: [handler] });
    hooks[event] = entries;
  }
  settings.hooks = hooks;
  const after = `${JSON.stringify(settings, null, 2)}\n`;
  return { path, before, after, changed: after !== before };
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
