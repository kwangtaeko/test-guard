import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fileOps, findBypass, splitCommand } from './shell.js';

describe('splitCommand', () => {
  it('splits simple commands and keeps quoted words', () => {
    expect(
      splitCommand(
        `FOO=1 npm test && git commit -m "a; b" | cat; echo $(rm x)`,
      ),
    ).toEqual([
      ['npm', 'test'],
      ['git', 'commit', '-m', 'a; b'],
      ['cat'],
      ['echo', '$'],
      ['rm', 'x'],
    ]);
  });
});

describe('findBypass', () => {
  it.each([
    'git commit --no-verify -m "x"',
    'git commit -nm "x"',
    'git commit -am x -n',
    'git push --no-verify origin main',
    'git -c core.hooksPath=/dev/null commit -m x',
    'git config core.hooksPath .nohooks',
    'git config --unset core.hooksPath',
    'git commit -m "fix" -m "Test-Guard-Approved: flaky"',
    "echo 'Test-Guard-Approved: x' > msg.txt && git commit -F msg.txt",
    'git interpret-trailers --trailer "test-guard-approved: x"',
    'TEST_GUARD_OFF=1 git commit -m x',
    'export TEST_GUARD_X=1',
    '$env:TEST_GUARD_X = "1"',
    'rm .git/hooks/commit-msg',
    'Remove-Item .git\\hooks\\commit-msg',
    'echo exit 0 > .git/hooks/commit-msg',
    'chmod -x .git/hooks/commit-msg',
    'echo {} > .test-guard.json',
    'rm .test-guard.json',
    "sed -i 's/a/b/' .test-guard.json",
  ])('blocks %s', (command) => {
    expect(findBypass(command)).not.toEqual([]);
  });

  it.each([
    'git commit -m "add -n flag support"',
    'git commit -m x',
    'git push origin main',
    'git config --get core.hooksPath',
    'git config core.hooksPath',
    'grep -r "Test-Guard-Approved" docs',
    'git log --grep "Test-Guard-Approved:"',
    'cat .git/hooks/commit-msg',
    'ls .git/hooks',
    'cat .test-guard.json',
    'git add .test-guard.json',
    'git diff .test-guard.json',
    'echo $TEST_GUARD_X',
    'if [ "$TEST_GUARD_X" == 1 ]; then :; fi',
    'npm test',
  ])('allows %s', (command) => {
    expect(findBypass(command)).toEqual([]);
  });
});

describe('fileOps', () => {
  const cwd = resolve('/repo');
  const at = (...p: string[]) => resolve(cwd, ...p);

  it.each([
    [
      'rm src/a.test.js',
      [{ kind: 'delete', verb: 'rm', sources: [at('src/a.test.js')] }],
    ],
    ['rm -rf tests', [{ kind: 'delete', verb: 'rm', sources: [at('tests')] }]],
    [
      'git rm -q "src/b c.test.js"',
      [{ kind: 'delete', verb: 'git rm', sources: [at('src/b c.test.js')] }],
    ],
    [
      'cd src && rm *.test.js',
      [{ kind: 'delete', verb: 'rm', sources: [at('src/*.test.js')] }],
    ],
    [
      'del /q src/a.test.js',
      [{ kind: 'delete', verb: 'del', sources: [at('src/a.test.js')] }],
    ],
    [
      'Remove-Item -Path src/a.test.js -Force',
      [{ kind: 'delete', verb: 'remove-item', sources: [at('src/a.test.js')] }],
    ],
    [
      'mv a.test.js b.js',
      [
        {
          kind: 'move',
          verb: 'mv',
          sources: [at('a.test.js')],
          dest: at('b.js'),
        },
      ],
    ],
    [
      'git mv a.test.js old/',
      [
        {
          kind: 'move',
          verb: 'git mv',
          sources: [at('a.test.js')],
          dest: at('old'),
          destIsDir: true,
        },
      ],
    ],
    [
      'Rename-Item src/a.test.js a.bak',
      [
        {
          kind: 'move',
          verb: 'rename-item',
          sources: [at('src/a.test.js')],
          dest: at('src/a.bak'),
        },
      ],
    ],
  ])('%s', (command, expected) => {
    expect(fileOps(command, cwd)).toEqual(expected);
  });

  it('ignores other commands', () => {
    expect(fileOps('npm test && git status && ls -la', cwd)).toEqual([]);
  });

  it.each([
    [
      "find . -name '*.test.js' -delete",
      [{ kind: 'delete', verb: 'find', sources: [at('**/*.test.js')] }],
    ],
    [
      "find src -name '*.test.js' -exec rm {} \\;",
      [{ kind: 'delete', verb: 'find', sources: [at('src/**/*.test.js')] }],
    ],
    [
      "find . -name '*.test.js' | grep user | xargs rm -f",
      [{ kind: 'delete', verb: 'rm', sources: [at('**/*.test.js')] }],
    ],
    [
      "git ls-files '*.test.js' | xargs -0 rm",
      [{ kind: 'delete', verb: 'rm', sources: [at('*.test.js')] }],
    ],
    [
      'Get-ChildItem -Recurse -Filter *.test.js | Remove-Item',
      [
        {
          kind: 'delete',
          verb: 'remove-item',
          sources: [at('**/*.test.js')],
        },
      ],
    ],
    [
      'Remove-Item -Path:src\\a.test.js',
      [{ kind: 'delete', verb: 'remove-item', sources: [at('src/a.test.js')] }],
    ],
    [
      'Move-Item -Destination old -Path a.test.js',
      [
        {
          kind: 'move',
          verb: 'move-item',
          sources: [at('a.test.js')],
          dest: at('old'),
        },
      ],
    ],
    [
      'bash -c "cd src && rm a.test.js"',
      [{ kind: 'delete', verb: 'rm', sources: [at('src/a.test.js')] }],
    ],
    [
      'rm a.test.js > log.txt',
      [{ kind: 'delete', verb: 'rm', sources: [at('a.test.js')] }],
    ],
  ])('%s', (command, expected) => {
    expect(fileOps(command, cwd)).toEqual(expected);
  });

  it('knows a folder made earlier or written with a slash', () => {
    expect(
      fileOps('mkdir -p tests/unit && mv tests/test_a.py tests/unit', cwd),
    ).toMatchObject([
      { kind: 'move', dest: at('tests/unit'), destIsDir: true },
    ]);
  });

  it('does not guess what an unknown list holds', () => {
    expect(fileOps('cat list.txt | xargs rm', cwd)).toEqual([]);
  });
});

describe('findBypass round 2', () => {
  it.each([
    'echo {}>.test-guard.json',
    'echo x>>.git/hooks/pre-commit',
    'cd .git && echo x > hooks/pre-commit',
    'cd .claude; echo {} > settings.local.json',
    'cp evil.json .claude/settings.local.json',
    'cp settings.local.json .claude/',
    'Copy-Item -Path settings.local.json -Destination .claude',
    'Set-Content -Path:.test-guard.json -Value "{}"',
    'echo {} > .test-guard.json::$DATA',
    `node -e "require('fs').writeFileSync('.test-guard.json', '{}')"`,
    `python -c "open('.git/hooks/commit-msg', 'w').write('')"`,
    'bash -c "rm .git/hooks/commit-msg"',
    'pwsh -Command Remove-Item .git\\hooks\\commit-msg',
    'ln -s /dev/null .git/hooks/commit-msg',
    'ln -s .claude c',
    'New-Item -ItemType SymbolicLink -Path c -Target .claude',
    'rm -rf node_modules/test-guard',
    'echo x > node_modules/test-guard/dist/cli.js',
    'echo "[core]" > .git/config',
    'rm -rf .git/test-guard/sessions',
    'claude plugin disable test-guard@tonygwangsk',
    'claude plugin disable --all',
    'claude plugin uninstall test-guard',
    'npm uninstall test-guard',
    'pnpm remove -D test-guard',
    'git commit --trailer "Test-Guard-Approved=x" -m y',
    'git commit --trailer=Test-Guard-Approved=x -m y',
    'git -c trailer.ok.key=Test-Guard-Approved commit --trailer ok=x -m y',
    'GIT_CONFIG_GLOBAL=/tmp/g git commit -m x',
    '$env:GIT_CONFIG_GLOBAL = "C:\\g"',
    'git config include.path /tmp/x',
    'git -c include.path=/tmp/x commit -m x',
    'git config commit.template msg.txt',
    'git config alias.c commit',
    'git -c alias.c=commit c -m x',
    `claude --settings '{"enabledPlugins": {"test-guard@x": false}}'`,
    // Found by the round 2 re-check.
    'HUSKY=0 git commit -am x',
    'export HUSKY=0; git commit -am x',
    'LEFTHOOK=0 git commit -am x',
    'SKIP=test-guard git commit -am x',
    'GIT_DIR=/tmp/other git commit -am x',
    'git --git-dir=/tmp/x commit -am x',
    'git config trailer.tga.key Test-Guard-Approved',
    'npx claude plugin uninstall test-guard',
    'rm -rf .claude',
    'rm -rf ~/.claude/plugins',
    'mv ~/.claude ~/.claude.bak',
    'rm ~/.claude/plugins/installed_plugins.json',
    'echo x > node_modules/.bin/test-guard',
  ])('blocks %s', (command) => {
    expect(findBypass(command, resolve('/repo'))).not.toEqual([]);
  });

  it.each([
    'node node_modules/test-guard/dist/cli.js check',
    './node_modules/.bin/test-guard check --staged',
    'npx test-guard check',
    'rm -f .git/index.lock',
    'git commit -m "add alias.ts"',
    'git commit -m "fix(test-guard): false positives"',
    'cat .git/config',
    'ls .git/hooks',
    'npm uninstall lodash',
    'claude plugin disable other-plugin',
    'git config alias.co',
    'echo x > out.txt 2>&1',
    'rm .gitignore',
    'cp a.md .claude/agents/',
    'cd src && npm test',
    'node scripts/build.js',
    // Found by the round 2 re-check.
    'git commit -am "docs: explain why --no-verify is banned"',
    'git commit -am "docs: core.hooksPath notes"',
    'git commit -am "feat: add [include] section parser"',
    "git commit -am 'fix: honour GIT_CONFIG_GLOBAL=path in tests'",
    'git merge --no-verify-signatures x',
    'rm -rf .claude/agents/old.md',
    'rm -rf node_modules',
  ])('allows %s', (command) => {
    expect(findBypass(command, resolve('/repo'))).toEqual([]);
  });

  it('splits redirections written without spaces', () => {
    expect(splitCommand('echo x>a 2>&1 >>b')).toEqual([
      ['echo', 'x', '>', 'a', '>>', 'b'],
    ]);
  });
});
