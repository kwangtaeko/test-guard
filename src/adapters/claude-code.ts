// Claude Code adapter: Edit/Write become file changes, Bash/PowerShell shell
// checks (spec: docs/agents/claude-code.md). Also runs GitHub Copilot CLI's
// and Cursor's calls of these hooks.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  type FileEdit,
  fileEdit,
  forCursor,
  patchText,
  shellCommand,
} from '../hook-io/claude-code.js';
import {
  checkFileChange,
  checkShell,
  runHook,
  unpredictableEdit,
  type Violation,
} from './agent.js';
import { PatchError, type PatchedFile, simulatePatch } from './apply-patch.js';

export function runClaudeCodeHook(stdin: string): string {
  return forCursor(stdin, check(stdin));
}

function check(stdin: string): string {
  return runHook(stdin, (input) => {
    const patch = patchText(input);
    if (patch !== null) return checkPatch(patch, resolve(input.cwd));
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

// Copilot CLI's apply_patch is its own, not known to match Codex's. When the
// patch, or one of its hunks, wouldn't apply as Codex applies it, every file
// it names is judged as an edit whose result can't be told.
function checkPatch(patch: string, cwd: string): Violation[] {
  let complete = true;
  let files: PatchedFile[] = [];
  try {
    files = simulatePatch(patch, cwd, read, () => {
      complete = false;
    });
  } catch (error) {
    if (!(error instanceof PatchError)) throw error;
    complete = false;
  }
  const violations = files.flatMap(checkFileChange);
  if (complete) return violations;
  const named = patch.matchAll(
    /^\*\*\* (?:(?:Add|Update|Delete) File|Move to):[ \t]*(.+?)[ \t]*\r?$/gm,
  );
  const paths = new Set([...named].map((m) => resolve(cwd, m[1] ?? '')));
  return [...violations, ...[...paths].flatMap(unpredictableEdit)];
}

function read(path: string): string | null {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
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
