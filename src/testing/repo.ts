// Temporary git repositories for e2e tests. System and global git config are
// disabled so the user's settings (hooks, autocrlf, signing) never leak in.
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { main } from '../cli.js';

const emptyConfig = join(
  mkdtempSync(join(tmpdir(), 'tg-gitconfig-')),
  'config',
);
writeFileSync(emptyConfig, '');
Object.assign(process.env, {
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_CONFIG_GLOBAL: emptyConfig,
  GIT_AUTHOR_NAME: 'test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
});

export class Repo {
  readonly dir = mkdtempSync(join(tmpdir(), 'tg-e2e-'));

  constructor() {
    this.git('init', '-q', '-b', 'main');
    this.git('config', 'core.autocrlf', 'false');
  }

  git(...args: string[]): string {
    return execFileSync('git', args, { cwd: this.dir, encoding: 'utf8' });
  }

  write(path: string, content: string): void {
    const target = join(this.dir, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  // Replace the working tree (everything but .git) with a fixture directory.
  load(fixtureDir: string): void {
    for (const entry of readdirSync(this.dir)) {
      if (entry !== '.git') rmSync(join(this.dir, entry), { recursive: true });
    }
    cpSync(fixtureDir, this.dir, { recursive: true });
  }

  commitAll(message = 'commit'): void {
    this.git('add', '-A');
    this.git('commit', '-q', '-m', message);
  }

  check(...args: string[]) {
    return this.run('check', ...args);
  }

  async run(...args: string[]) {
    let stdout = '';
    let stderr = '';
    const code = await main(args, {
      cwd: this.dir,
      stdout: (text) => {
        stdout += text;
      },
      stderr: (text) => {
        stderr += text;
      },
    });
    return { code, stdout, stderr };
  }

  cleanup(): void {
    rmSync(this.dir, { recursive: true, force: true });
  }
}
