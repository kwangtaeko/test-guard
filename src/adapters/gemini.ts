// Gemini CLI adapter: write_file/replace become file changes,
// run_shell_command shell checks (spec: docs/agents/gemini.md).
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fileEdit,
  shellCommand,
  toCommonInput,
  toGeminiOutput,
} from '../hook-io/gemini.js';
import {
  checkFileChange,
  checkShell,
  runHook,
  unpredictableEdit,
} from './agent.js';
import { geminiReplace } from './gemini-replace.js';

export function runGeminiHook(stdin: string): string {
  return toGeminiOutput(
    runHook(toCommonInput(stdin), (input) => {
      const cwd = resolve(input.cwd);
      const edit = fileEdit(input);
      if (edit) {
        const file = toolPath(cwd, edit.filePath);
        const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
        let next: string | null | 'unpredictable';
        if (edit.kind === 'write') next = edit.content;
        else if (current !== null) {
          next = geminiReplace(
            current,
            edit.oldString,
            edit.newString,
            edit.allowMultiple,
          );
        } else {
          // An empty old_string makes a new file. Otherwise Gemini looks
          // for a file whose path ends like this one, somewhere else.
          next = edit.oldString === '' ? edit.newString : 'unpredictable';
        }
        if (next === 'unpredictable') return unpredictableEdit(file);
        if (next === null) return [];
        return checkFileChange({
          beforePath: current === null ? null : file,
          before: current,
          afterPath: file,
          after: next,
        });
      }
      const shell = shellCommand(input);
      return shell === null
        ? []
        : checkShell(shell.command, resolve(cwd, shell.dir ?? '.'));
    }),
  );
}

// The file a path names as Gemini reads it: NUL characters dropped, a
// `file://` URL or `%`-escapes decoded, and `@/` (a workspace mention)
// dropped when the path doesn't exist as written.
function toolPath(cwd: string, raw: string): string {
  let path = raw.replace(/\0/g, '');
  if (/^file:\/\//i.test(path)) {
    try {
      path = fileURLToPath(path);
    } catch {
      // left as written
    }
  }
  const candidates = [path];
  try {
    candidates.push(decodeURIComponent(path));
  } catch {
    // not %-encoded
  }
  if (path.startsWith('@/')) candidates.push(path.slice(2));
  const absolute = (p: string) => (isAbsolute(p) ? p : resolve(cwd, p));
  const found = candidates.map(absolute).find((p) => existsSync(p));
  return found ?? absolute(path);
}
