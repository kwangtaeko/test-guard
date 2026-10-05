// Claude Code adapter: Edit/Write become file changes, Bash/PowerShell shell
// checks (spec: docs/agents/claude-code.md).
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  type FileEdit,
  fileEdit,
  shellCommand,
} from '../hook-io/claude-code.js';
import { checkFileChange, checkShell, runHook } from './agent.js';

export function runClaudeCodeHook(stdin: string): string {
  return runHook(stdin, (input) => {
    const edit = fileEdit(input);
    if (edit) {
      const file = resolve(edit.filePath);
      const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
      const next = applyEdit(edit, current);
      if (next === null) return [];
      return checkFileChange({
        beforePath: current === null ? null : file,
        before: current,
        afterPath: file,
        after: next,
      });
    }
    const command = shellCommand(input);
    return command === null ? [] : checkShell(command, resolve(input.cwd));
  });
}

function applyEdit(edit: FileEdit, current: string | null): string | null {
  if (edit.kind === 'write') return edit.content;
  if (current === null || edit.oldString === '') return null;
  let { oldString, newString } = edit;
  // The tool may match LF text against a CRLF file.
  if (!current.includes(oldString) && current.includes('\r\n')) {
    oldString = oldString.replace(/\r?\n/g, '\r\n');
    newString = newString.replace(/\r?\n/g, '\r\n');
  }
  if (!current.includes(oldString)) return null; // the tool will fail anyway
  return edit.replaceAll
    ? current.split(oldString).join(newString)
    : current.replace(oldString, () => newString);
}
