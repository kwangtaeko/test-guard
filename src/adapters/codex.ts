// Codex adapter: apply_patch becomes file changes, Bash shell checks
// (spec: docs/agents/codex.md).
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { patchText, shellCommand } from '../hook-io/codex.js';
import { checkFileChange, checkShell, runHook } from './agent.js';
import { PatchError, simulatePatch } from './apply-patch.js';

export function runCodexHook(stdin: string): string {
  return runHook(stdin, (input) => {
    const cwd = resolve(input.cwd);
    const patch = patchText(input);
    if (patch !== null) {
      let files: ReturnType<typeof simulatePatch>;
      try {
        files = simulatePatch(patch, cwd, read);
      } catch (error) {
        if (error instanceof PatchError) return []; // Codex rejects it too
        throw error;
      }
      return files.flatMap(checkFileChange);
    }
    const command = shellCommand(input);
    return command === null ? [] : checkShell(command, cwd);
  });
}

function read(path: string): string | null {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}
