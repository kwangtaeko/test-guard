import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  blockStop,
  denyToolUse,
  fileEdit,
  type PreToolUseInput,
  parseHookInput,
  shellCommand,
} from './claude-code.js';
import { shellCommand as codexShell, patchText } from './codex.js';

const pre = (tool_name: string, tool_input: object) =>
  parseHookInput(
    JSON.stringify({
      hook_event_name: 'PreToolUse',
      cwd: '/repo',
      tool_name,
      tool_input,
    }),
  ) as PreToolUseInput;

describe('parseHookInput', () => {
  it('parses PreToolUse and Stop', () => {
    expect(pre('Bash', { command: 'ls' })).toEqual({
      event: 'PreToolUse',
      cwd: '/repo',
      toolName: 'Bash',
      toolInput: { command: 'ls' },
    });
    expect(
      parseHookInput(
        '{"hook_event_name":"Stop","cwd":"/r","stop_hook_active":true}',
      ),
    ).toEqual({ event: 'Stop', cwd: '/r', stopHookActive: true });
  });

  it.each([
    'not json',
    '{}',
    '{"hook_event_name":"PreToolUse","cwd":"/r"}',
    '{"hook_event_name":"Notification","cwd":"/r"}',
  ])('rejects %s', (text) => {
    expect(() => parseHookInput(text)).toThrow();
  });
});

describe('tool inputs', () => {
  it('reads Write and Edit', () => {
    expect(fileEdit(pre('Write', { file_path: '/a', content: 'x' }))).toEqual({
      kind: 'write',
      filePath: '/a',
      content: 'x',
    });
    expect(
      fileEdit(
        pre('Edit', { file_path: '/a', old_string: 'x', new_string: 'y' }),
      ),
    ).toEqual({
      kind: 'edit',
      filePath: '/a',
      oldString: 'x',
      newString: 'y',
      replaceAll: false,
    });
    expect(fileEdit(pre('Read', { file_path: '/a' }))).toBeNull();
  });

  it('reads shell commands', () => {
    expect(shellCommand(pre('PowerShell', { command: 'ls' }))).toBe('ls');
    expect(shellCommand(pre('Write', { command: 'ls' }))).toBeNull();
  });
});

describe('responses', () => {
  it('match the documented shapes', () => {
    expect(JSON.parse(denyToolUse('no'))).toEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: 'no',
      },
    });
    expect(JSON.parse(blockStop('why'))).toEqual({
      decision: 'block',
      reason: 'why',
    });
  });
});

it.each(['common.ts', 'claude-code.ts', 'codex.ts'])(
  '%s imports nothing outside hook-io',
  (file) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
    const imports = [...source.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    expect(imports.every((path) => path === './common.js')).toBe(true);
  },
);

describe('codex inputs', () => {
  it('reads apply_patch and Bash', () => {
    expect(patchText(pre('apply_patch', { command: '*** Begin Patch' }))).toBe(
      '*** Begin Patch',
    );
    expect(patchText(pre('Bash', { command: 'ls' }))).toBeNull();
    expect(codexShell(pre('Bash', { command: 'ls' }))).toBe('ls');
    expect(codexShell(pre('Bash', { command: ['rm', 'a.test.js'] }))).toBe(
      'rm a.test.js',
    );
    expect(codexShell(pre('PowerShell', { command: 'ls' }))).toBeNull();
  });
});
