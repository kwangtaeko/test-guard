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
});
