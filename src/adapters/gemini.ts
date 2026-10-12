// Gemini CLI adapter: write_file/replace become file changes,
// run_shell_command shell checks (spec: docs/agents/gemini.md).
import { type Dirent, existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, isAbsolute, join, resolve } from 'node:path';
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
  type Violation,
} from './agent.js';
import { geminiReplace } from './gemini-replace.js';

export function runGeminiHook(stdin: string): string {
  return toGeminiOutput(
    runHook(toCommonInput(stdin), (input) => {
      const cwd = resolve(input.cwd);
      const edit = fileEdit(input);
      if (edit) {
        const file = toolPath(cwd, edit.filePath);
        if (edit.kind === 'write') {
          return changeTo(file, readText(file), edit.content);
        }
        const replace = (path: string, current: string) =>
          changeTo(
            path,
            current,
            geminiReplace(
              current,
              edit.oldString,
              edit.newString,
              edit.allowMultiple,
            ),
          );
        const current = readText(file);
        if (current !== null) return replace(file, current);
        // An empty old_string makes a new file.
        if (edit.oldString === '') return changeTo(file, null, edit.newString);
        // Otherwise Gemini edits the one file in the workspace whose path
        // ends like this relative one, and fails when there are more.
        // The search here is wider than Gemini's (no ignore files, no
        // folder limit), so with several matches any may be Gemini's.
        const found = [
          ...new Set(
            pathForms(edit.filePath)
              .filter((p) => !isAbsolute(p))
              .flatMap((p) => endingLike(cwd, p)),
          ),
        ];
        if (found.length > 1) return found.flatMap(unpredictableEdit);
        const [only] = found;
        const text = only === undefined ? null : readText(only);
        return only === undefined || text === null ? [] : replace(only, text);
      }
      const shell = shellCommand(input);
      return shell === null
        ? []
        : checkShell(shell.command, resolve(cwd, shell.dir ?? '.'));
    }),
  );
}

function changeTo(
  file: string,
  current: string | null,
  next: string | null | 'unpredictable',
): Violation[] {
  if (next === 'unpredictable') return unpredictableEdit(file);
  if (next === null) return [];
  return checkFileChange({
    beforePath: current === null ? null : file,
    before: current,
    afterPath: file,
    after: next,
  });
}

function readText(file: string): string | null {
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

// The file a path names as Gemini reads it: the first of its forms that
// exists; otherwise the path as written, without a leading `@` unless a
// folder starting with `@` is there (resolveDefensiveToolPath).
function toolPath(cwd: string, raw: string): string {
  const forms = pathForms(raw);
  const absolute = (p: string) => (isAbsolute(p) ? p : resolve(cwd, p));
  const found = forms.map(absolute).find((p) => existsSync(p));
  if (found) return found;
  const [path = raw] = forms;
  const first = path.split(/[\\/]/)[0] ?? '';
  const mention =
    path.startsWith('@') && !existsSync(resolve(cwd, first))
      ? forms.at(-1)
      : undefined;
  return absolute(mention ?? path);
}

// The ways Gemini may read a path: NUL characters dropped, a `file://` URL
// or `%`-escapes decoded, and a leading `@` (a workspace mention, as in
// `@/src` or `@src`) dropped.
function pathForms(raw: string): string[] {
  let path = raw.replace(/\0/g, '');
  if (/^file:\/\//i.test(path)) {
    try {
      path = fileURLToPath(path);
    } catch {
      // left as written
    }
  }
  const forms = [path];
  try {
    forms.push(decodeURIComponent(path));
  } catch {
    // not %-encoded
  }
  if (path.startsWith('@') && path.length > 1) {
    const stripped = path.slice(1).replace(/^[\\/]+/, '');
    if (stripped !== '') forms.push(stripped);
  }
  return forms;
}

// Files under `root` with the same name whose path ends like `relative`,
// as Gemini's correctPath (pathCorrector.ts) matches them. Skips .git and
// node_modules, which Gemini's tools refuse to touch.
function endingLike(root: string, relative: string): string[] {
  const target = relative.replace(/\\/g, '/');
  const name = basename(target);
  const found: string[] = [];
  const queue = [root];
  for (let i = 0; i < queue.length; i++) {
    const dir = queue[i] ?? '';
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '.git' && entry.name !== 'node_modules') {
          queue.push(full);
        }
      } else if (
        entry.isFile() &&
        entry.name === name &&
        full.replace(/\\/g, '/').endsWith(target)
      ) {
        found.push(full);
      }
    }
  }
  return found;
}
