// test-guard as a Probity rule (https://github.com/nizos/probity, spec:
// docs/agents/probity.md). Probity turns each agent's edits into a full
// file write and shell calls into a command, then runs the rules in
// probity.config.ts:
//
//   import { defineConfig } from '@nizos/probity'
//   import { testGuard } from 'test-guard/probity'
//   export default defineConfig({ rules: [testGuard()] })
//
// The types are Probity's, restated so test-guard needs no dependency.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { blockReason, checkFileChange, checkShell } from './adapters/agent.js';

type Action =
  | { kind: 'write'; path: string; content: string }
  | { kind: 'command'; command: string };

type RuleResult =
  | { kind: 'pass'; reason?: string }
  | { kind: 'violation'; reason: string };

export type TestGuardRule = (action: Action) => RuleResult;

// Blocks what test-guard's agent hooks block before a tool runs. Probity
// has no end-of-turn hook, so shell edits are left to the commit-msg hook
// and CI. A test-guard error lets the action through, as the hooks do.
export function testGuard(): TestGuardRule {
  return (action) => {
    try {
      const reason = blockReason(() => {
        if (action.kind === 'command') {
          // Probity runs the hook in the session's folder.
          return checkShell(action.command, process.cwd());
        }
        const file = resolve(action.path);
        const before = existsSync(file) ? readFileSync(file, 'utf8') : null;
        return checkFileChange({
          beforePath: before === null ? null : file,
          before,
          afterPath: file,
          after: action.content,
        });
      });
      return reason === null ? { kind: 'pass' } : { kind: 'violation', reason };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { kind: 'pass', reason: `test-guard error: ${message}` };
    }
  };
}
