import {
  Command,
  CommanderError,
  InvalidArgumentError,
  Option,
} from 'commander';
import { createColors } from 'picocolors';
import pkg from '../package.json' with { type: 'json' };
import { runCheck } from './engine/check.js';
import type { CompareMode } from './engine/git.js';
import { formatJson, formatText } from './output.js';
import { isRuleId, type RuleId } from './rules/index.js';

export interface Io {
  cwd: string;
  stdout(text: string): void;
  stderr(text: string): void;
  color?: boolean;
}

interface CheckFlags {
  staged?: boolean;
  base?: string;
  json?: boolean;
  rules?: RuleId[];
}

// Exit codes: 0 no violations · 1 error violations · 2 execution error.
export async function main(argv: string[], io: Io): Promise<number> {
  let exitCode = 0;
  const program = new Command('test-guard')
    .version(pkg.version)
    .exitOverride()
    .configureOutput({ writeOut: io.stdout, writeErr: io.stderr });

  program
    .command('check')
    .description('report tests that were deleted, skipped or weakened')
    .addOption(
      new Option(
        '--staged',
        'compare the index with HEAD (pre-commit)',
      ).conflicts('base'),
    )
    .option('--base <ref>', 'compare HEAD with merge-base(<ref>, HEAD) (CI)')
    .option('--json', 'print JSON')
    .option(
      '--rules <ids>',
      'comma-separated rule IDs, e.g. TG001,TG004',
      parseRules,
    )
    .action((flags: CheckFlags) => {
      exitCode = check(flags, io);
    });

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (error) {
    if (error instanceof CommanderError) return error.exitCode === 0 ? 0 : 2;
    throw error;
  }
  return exitCode;
}

function check(flags: CheckFlags, io: Io): number {
  const mode: CompareMode =
    flags.base !== undefined
      ? { kind: 'base', ref: flags.base }
      : flags.staged
        ? { kind: 'staged' }
        : { kind: 'worktree' };
  try {
    const result = runCheck({ cwd: io.cwd, mode, rules: flags.rules });
    io.stdout(
      flags.json
        ? formatJson(result, pkg.version)
        : formatText(result, pkg.version, createColors(io.color ?? false)),
    );
    return result.findings.some((f) => f.severity === 'error') ? 1 : 0;
  } catch (error) {
    io.stderr(
      `test-guard: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return 2;
  }
}

function parseRules(value: string): RuleId[] {
  const ids = value.split(',').map((id) => id.trim().toUpperCase());
  const unknown = ids.filter((id) => !isRuleId(id));
  if (unknown.length > 0) {
    throw new InvalidArgumentError(`unknown rule: ${unknown.join(', ')}`);
  }
  return ids as RuleId[];
}
