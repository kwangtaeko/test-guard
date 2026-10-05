import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  Command,
  CommanderError,
  InvalidArgumentError,
  Option,
} from 'commander';
import { createColors } from 'picocolors';
import pkg from '../package.json' with { type: 'json' };
import { findApproval } from './approval.js';
import { runCheck } from './engine/check.js';
import type { CompareMode } from './engine/git.js';
import { installGitHook } from './install/git-hook.js';
import {
  formatJson,
  formatMarkdown,
  formatText,
  type Report,
} from './output.js';
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
  messageFile?: string;
  summary?: string;
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
    .addOption(
      new Option(
        '--message-file <path>',
        'commit message to read a Test-Guard-Approved trailer from (commit-msg hook)',
      ).conflicts('base'),
    )
    .option('--summary <file>', 'append a Markdown report (GitHub Job Summary)')
    .action((flags: CheckFlags) => {
      exitCode = check(flags, io);
    });

  program
    .command('install')
    .description('install git hooks')
    .option(
      '--pre-commit',
      'run `check --staged` on every commit (installed as a commit-msg hook)',
    )
    .action((flags: { preCommit?: boolean }) => {
      exitCode = install(flags, io);
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
    const report: Report = runCheck({ cwd: io.cwd, mode, rules: flags.rules });
    const hasError = report.findings.some((f) => f.severity === 'error');
    if (flags.messageFile !== undefined) {
      const message = readFileSync(resolve(io.cwd, flags.messageFile), 'utf8');
      report.approval = findApproval(message);
    }
    if (flags.summary !== undefined) {
      appendFileSync(resolve(io.cwd, flags.summary), formatMarkdown(report));
    }
    io.stdout(
      flags.json
        ? formatJson(report, pkg.version)
        : formatText(report, pkg.version, createColors(io.color ?? false)),
    );
    if (!hasError || report.approval !== undefined) return 0;
    if (flags.messageFile !== undefined && !flags.json) {
      io.stdout(
        'If this change is intentional, add a commit message trailer:\n' +
          '  Test-Guard-Approved: <reason>\n',
      );
    }
    return 1;
  } catch (error) {
    return fail(error, io);
  }
}

function install(flags: { preCommit?: boolean }, io: Io): number {
  if (!flags.preCommit) {
    io.stderr('test-guard: nothing to install (use --pre-commit)\n');
    return 2;
  }
  try {
    const { path, updated } = installGitHook(io.cwd);
    io.stdout(
      `${updated ? 'Updated' : 'Installed'} commit-msg hook: ${path}\n`,
    );
    return 0;
  } catch (error) {
    return fail(error, io);
  }
}

function fail(error: unknown, io: Io): number {
  io.stderr(
    `test-guard: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  return 2;
}

function parseRules(value: string): RuleId[] {
  const ids = value.split(',').map((id) => id.trim().toUpperCase());
  const unknown = ids.filter((id) => !isRuleId(id));
  if (unknown.length > 0) {
    throw new InvalidArgumentError(`unknown rule: ${unknown.join(', ')}`);
  }
  return ids as RuleId[];
}
