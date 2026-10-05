import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  Command,
  CommanderError,
  InvalidArgumentError,
  Option,
} from 'commander';
import { createColors } from 'picocolors';
import pkg from '../package.json' with { type: 'json' };
import { runClaudeCodeHook } from './adapters/claude-code.js';
import { runCodexHook } from './adapters/codex.js';
import { findApproval } from './approval.js';
import { runCheck } from './engine/check.js';
import { type CompareMode, findRoot } from './engine/git.js';
import { notifyUser } from './hook-io/common.js';
import {
  AGENTS,
  type Agent,
  formatDiff,
  planAgentHooks,
} from './install/agent-hooks.js';
import { InstallError, installGitHook } from './install/git-hook.js';
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
  readStdin?(): Promise<string>;
  confirm?(question: string): Promise<boolean>; // absent when not interactive
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
    .description('install git hooks or agent hooks')
    .option(
      '--pre-commit',
      'run `check --staged` on every commit (installed as a commit-msg hook)',
    )
    .option(
      '--agent <name>',
      'add agent hooks to its settings (claude-code, codex)',
    )
    .option('-y, --yes', 'write agent settings without asking')
    .action(async (flags: InstallFlags) => {
      exitCode = await install(flags, io);
    });

  program
    .command('hook')
    .description('run as an agent hook (hook JSON on stdin)')
    .argument('<agent>', 'claude-code | codex')
    .argument('<event>', 'pre-tool-use | stop')
    .action(async (agent: string, event: string) => {
      exitCode = await hook(agent, event, io);
    });

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.exitCode === 0) return 0;
      // Exit 2 would block the agent's tool call; a misconfigured hook must not.
      return argv[0] === 'hook' ? 1 : 2;
    }
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

interface InstallFlags {
  preCommit?: boolean;
  agent?: string;
  yes?: boolean;
}

async function install(flags: InstallFlags, io: Io): Promise<number> {
  if (!flags.preCommit && flags.agent === undefined) {
    io.stderr(
      'test-guard: nothing to install (use --pre-commit or --agent <claude-code|codex>)\n',
    );
    return 2;
  }
  try {
    if (flags.preCommit) {
      const { path, updated } = installGitHook(io.cwd);
      io.stdout(
        `${updated ? 'Updated' : 'Installed'} commit-msg hook: ${path}\n`,
      );
    }
    if (flags.agent !== undefined) {
      const agent = flags.agent as Agent;
      if (!AGENTS.includes(agent)) {
        throw new InstallError(
          `unsupported agent: ${flags.agent} (supported: ${AGENTS.join(', ')})`,
        );
      }
      const plan = planAgentHooks(findRoot(io.cwd), agent);
      if (!plan.changed) {
        io.stdout(`test-guard hooks are already in ${plan.path}\n`);
        return 0;
      }
      io.stdout(`${plan.path}\n${formatDiff(plan.before, plan.after)}`);
      const ok =
        flags.yes ||
        ((await io.confirm?.('Write these changes? [y/N] ')) ?? false);
      if (!ok) {
        io.stdout('Not written. Re-run with --yes to write without asking.\n');
        return 1;
      }
      mkdirSync(dirname(plan.path), { recursive: true });
      writeFileSync(plan.path, plan.after);
      io.stdout(`Written: ${plan.path}\n`);
      if (plan.note) io.stdout(`${plan.note}\n`);
    }
    return 0;
  } catch (error) {
    return fail(error, io);
  }
}

// Agent hooks answer through stdout JSON and always exit 0; errors are
// reported to the user rather than blocking the agent.
async function hook(agent: string, event: string, io: Io): Promise<number> {
  const run =
    agent === 'claude-code'
      ? runClaudeCodeHook
      : agent === 'codex'
        ? runCodexHook
        : null;
  if (!run || !['pre-tool-use', 'stop'].includes(event)) {
    io.stdout(notifyUser(`test-guard: unsupported hook "${agent} ${event}"`));
    return 0;
  }
  io.stdout(run((await io.readStdin?.()) ?? ''));
  return 0;
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
