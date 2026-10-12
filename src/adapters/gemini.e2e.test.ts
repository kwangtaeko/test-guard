import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { main } from '../cli.js';
import { parseJsonc } from '../rules/tg006.js';
import { Repo } from '../testing/repo.js';
import { runGeminiHook } from './gemini.js';

let repo: Repo;
afterEach(() => repo?.cleanup());

const TEST = "it('adds', () => {\n  expect(add(1, 2)).toBe(3);\n});\n";

function setup(): Repo {
  repo = new Repo();
  repo.write('src/math.test.js', TEST);
  repo.write('src/math.js', 'export const add = (a, b) => a - b;\n');
  repo.commitAll();
  return repo;
}

// BeforeTool stdin as Gemini CLI sends it (docs/agents/gemini.md).
function hook(tool_name: string, tool_input: Record<string, unknown>) {
  return runGeminiHook(
    JSON.stringify({
      session_id: 's',
      transcript_path: '/tmp/t.json',
      cwd: repo.dir,
      hook_event_name: 'BeforeTool',
      timestamp: '2026-10-11T00:00:00.000Z',
      tool_name,
      tool_input,
    }),
  );
}

function denied(stdout: string): string {
  const out = JSON.parse(stdout);
  expect(out.decision).toBe('deny');
  return out.reason;
}

describe('BeforeTool: write_file and replace', () => {
  it.each([
    [
      'an added skip',
      'replace',
      {
        file_path: 'src/math.test.js',
        old_string: "it('adds'",
        new_string: "it.skip('adds'",
      },
      'TG004 — added `it.skip` in src/math.test.js:1',
    ],
    [
      'a removed assertion',
      'replace',
      {
        file_path: 'src/math.test.js',
        old_string: '  expect(add(1, 2)).toBe(3);\n',
        new_string: '',
      },
      'TG003',
    ],
    [
      'a weakened matcher, with an absolute path',
      'replace',
      {
        file_path: '<root>/src/math.test.js',
        old_string: '.toBe(3)',
        new_string: '.toBeDefined()',
      },
      'TG007',
    ],
    [
      'a test file rewritten without its assertion',
      'write_file',
      {
        file_path: 'src/math.test.js',
        content: "it('adds', () => {});\n",
      },
      'TG003',
    ],
    [
      'a new focused test',
      'write_file',
      { file_path: 'src/b.test.js', content: "it.only('b', () => {});\n" },
      'TG004',
    ],
    [
      'a new file made by replace with an empty old_string',
      'replace',
      {
        file_path: 'src/c.test.js',
        old_string: '',
        new_string: "it.only('c', () => {});\n",
      },
      'TG004',
    ],
    [
      'old text Gemini would match loosely, in a test file',
      'replace',
      {
        file_path: 'src/math.test.js',
        old_string: 'expect(sum(1, 2)).toBe(3);',
        new_string: '',
      },
      'cannot tell what this edit changes',
    ],
  ])('denies %s', (_, tool, input: Record<string, string>, expected) => {
    setup();
    const fixed = Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, v.replace('<root>', repo.dir)]),
    );
    expect(denied(hook(tool, fixed))).toContain(expected);
  });

  it.each([
    [
      'a fix to the implementation',
      'replace',
      {
        file_path: 'src/math.js',
        old_string: 'a - b',
        new_string: 'a + b',
      },
    ],
    [
      'loose old text in a file test-guard does not watch',
      'replace',
      { file_path: 'src/math.js', old_string: 'a -  b', new_string: 'a + b' },
    ],
    [
      'an edit Gemini rejects (nothing changes)',
      'replace',
      {
        file_path: 'src/math.test.js',
        old_string: '// add',
        new_string: '// add',
      },
    ],
    ['reading a file', 'read_file', { file_path: 'src/math.test.js' }],
  ])('allows %s', (_, tool, input) => {
    setup();
    repo.write('src/math.test.js', `${TEST}// add\n`);
    expect(hook(tool, input)).toBe('');
  });

  it('judges allow_multiple as replacing every occurrence', () => {
    setup();
    repo.write(
      'src/math.test.js',
      `${TEST}it('subs', () => {\n  expect(sub(3, 1)).toBe(2);\n});\n`,
    );
    repo.commitAll();
    const reason = denied(
      hook('replace', {
        file_path: 'src/math.test.js',
        old_string: ').toBe(',
        new_string: ').not.toBe(',
        allow_multiple: true,
      }),
    );
    expect(reason).toContain('TG007');
  });
});

describe('BeforeTool: run_shell_command', () => {
  it('denies deleting a test file, also from dir_path', () => {
    setup();
    expect(
      denied(hook('run_shell_command', { command: 'rm src/math.test.js' })),
    ).toContain('TG001');
    expect(
      denied(
        hook('run_shell_command', {
          command: 'rm math.test.js',
          dir_path: 'src',
        }),
      ),
    ).toContain('TG001');
  });

  it('allows running the tests', () => {
    setup();
    expect(hook('run_shell_command', { command: 'npm test' })).toBe('');
  });
});

describe('self-protection', () => {
  const SETTINGS = {
    hooks: {
      BeforeTool: [
        {
          matcher: 'write_file|replace|run_shell_command',
          hooks: [
            {
              name: 'test-guard-pre-tool-use',
              type: 'command',
              command: 'npx --no-install test-guard hook gemini pre-tool-use',
            },
          ],
        },
      ],
    },
  };
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

  it.each([
    [
      'turning hooks off',
      { ...SETTINGS, hooksConfig: { enabled: false } },
      'hooksConfig.enabled: false',
    ],
    [
      "disabling test-guard's hook by name",
      { ...SETTINGS, hooksConfig: { disabled: ['test-guard-pre-tool-use'] } },
      'hooksConfig.disabled',
    ],
    ['removing the hook', { hooks: {} }, "removed test-guard's hooks"],
  ])('denies %s in .gemini/settings.json', (_, after, expected) => {
    setup();
    repo.write('.gemini/settings.json', json(SETTINGS));
    repo.commitAll();
    expect(
      denied(
        hook('write_file', {
          file_path: '.gemini/settings.json',
          content: json(after),
        }),
      ),
    ).toContain(expected);
  });

  it('denies turning hooks off in user settings outside the repository', () => {
    setup();
    const home = join(repo.dir, '..', `home-${Date.now()}`);
    expect(
      denied(
        hook('write_file', {
          file_path: join(home, '.gemini/settings.json'),
          content: json({ hooksConfig: { enabled: false } }),
        }),
      ),
    ).toContain('TG006');
  });

  it('denies editing the trusted folders, by tool or shell', () => {
    setup();
    const home = join(repo.dir, '..', `home-${Date.now()}`);
    expect(
      denied(
        hook('write_file', {
          file_path: join(home, '.gemini/trustedFolders.json'),
          content: '{}\n',
        }),
      ),
    ).toContain('TG006');
    expect(
      denied(
        hook('run_shell_command', {
          command: 'echo {} > ~/.gemini/trustedFolders.json',
        }),
      ),
    ).toContain('Gemini CLI settings');
  });
});

describe('AfterAgent', () => {
  it('blocks once on weakened tests', () => {
    setup();
    repo.write('src/math.test.js', TEST.replace('.toBe(3)', '.toBeTruthy()'));
    const stop = (active: boolean) =>
      runGeminiHook(
        JSON.stringify({
          session_id: 's',
          cwd: repo.dir,
          hook_event_name: 'AfterAgent',
          prompt: 'fix the tests',
          prompt_response: 'done',
          stop_hook_active: active,
        }),
      );
    const first = JSON.parse(stop(false));
    expect(first.decision).toBe('block');
    expect(first.reason).toContain('TG007');
    expect(JSON.parse(stop(true)).systemMessage).toContain('remain');
  });

  it('lets a clean turn end', () => {
    setup();
    expect(
      runGeminiHook(
        JSON.stringify({
          cwd: repo.dir,
          hook_event_name: 'AfterAgent',
          stop_hook_active: false,
        }),
      ),
    ).toBe('');
  });
});

describe('cli', () => {
  async function run(args: string[], stdin = '') {
    let stdout = '';
    const code = await main(args, {
      cwd: repo.dir,
      stdout: (t) => {
        stdout += t;
      },
      stderr: () => {},
      readStdin: async () => stdin,
    });
    return { code, stdout };
  }

  it('hook gemini pre-tool-use', async () => {
    setup();
    const input = JSON.stringify({
      hook_event_name: 'BeforeTool',
      cwd: repo.dir,
      tool_name: 'run_shell_command',
      tool_input: { command: 'rm src/math.test.js' },
    });
    const { code, stdout } = await run(
      ['hook', 'gemini', 'pre-tool-use'],
      input,
    );
    expect(code).toBe(0);
    expect(denied(stdout)).toContain('TG001');
  });

  it('install --agent gemini writes .gemini/settings.json', async () => {
    setup();
    repo.write(
      '.gemini/settings.json',
      '{\n  "ui": { "theme": "Default" }\n}\n',
    );
    const { code, stdout } = await run(['install', '--agent', 'gemini', '-y']);
    expect(code).toBe(0);
    expect(stdout).toContain('trusted folder');
    const settings = JSON.parse(
      readFileSync(join(repo.dir, '.gemini/settings.json'), 'utf8'),
    );
    expect(settings.ui).toEqual({ theme: 'Default' });
    expect(settings.hooks).toEqual({
      BeforeTool: [
        {
          matcher: 'write_file|replace|run_shell_command',
          hooks: [
            {
              name: 'test-guard-pre-tool-use',
              type: 'command',
              command: 'npx --no-install test-guard hook gemini pre-tool-use',
            },
          ],
        },
      ],
      AfterAgent: [
        {
          hooks: [
            {
              name: 'test-guard-stop',
              type: 'command',
              command: 'npx --no-install test-guard hook gemini stop',
            },
          ],
        },
      ],
    });
    expect((await run(['install', '--agent', 'gemini'])).stdout).toContain(
      'already',
    );
  });

  it('install --agent gemini runs a local install by a path relative to the project', async () => {
    setup();
    mkdirSync(join(repo.dir, 'node_modules/test-guard/dist'), {
      recursive: true,
    });
    repo.write('node_modules/test-guard/dist/cli.js', '');
    await run(['install', '--agent', 'gemini', '-y']);
    const settings = JSON.parse(
      readFileSync(join(repo.dir, '.gemini/settings.json'), 'utf8'),
    );
    expect(settings.hooks.AfterAgent[0].hooks[0].command).toBe(
      'node node_modules/test-guard/dist/cli.js hook gemini stop',
    );
  });
});

describe('red-team re-check', () => {
  const add = (input: Record<string, unknown>) =>
    hook('replace', { new_string: "it.skip('adds'", ...input });

  it('judges whitespace-loose edits as Gemini applies them', () => {
    setup();
    // Gemini's flexible match: the assertion is removed whatever the indent.
    expect(
      denied(
        hook('replace', {
          file_path: 'src/math.test.js',
          old_string: '\texpect(add(1, 2)).toBe(3);',
          new_string: '',
        }),
      ),
    ).toContain('TG003');
    // Token match across changed spacing.
    expect(
      denied(
        hook('replace', {
          file_path: 'src/math.test.js',
          old_string: 'expect( add(1, 2) ).toBe( 3 )',
          new_string: 'expect(add(1, 2)).toBeDefined()',
        }),
      ),
    ).toContain('TG007');
  });

  it('denies an ambiguous edit, which Gemini hands to the model', () => {
    setup();
    repo.write('src/math.test.js', `${TEST}${TEST.replace('adds', 'adds 2')}`);
    repo.commitAll();
    expect(
      denied(
        hook('replace', {
          file_path: 'src/math.test.js',
          old_string: 'expect(',
          new_string: '// expect(',
          instruction: 'comment out the assertion',
        }),
      ),
    ).toContain('cannot tell');
  });

  it.each([
    ['a NUL character', 'src/math.test.js\u0000'],
    ['a file URL', '<url>'],
    ['a %-escaped name', 'src/math%2Etest.js'],
    ['a workspace mention', '@/src/math.test.js'],
    ['a path Gemini finds by its end', 'math.test.js'],
  ])('denies a test edit through %s', (_, path) => {
    setup();
    const file_path =
      path === '<url>'
        ? pathToFileURL(join(repo.dir, 'src/math.test.js')).href
        : path;
    expect(denied(add({ file_path, old_string: "it('adds'" }))).toMatch(
      /TG004|cannot tell/,
    );
  });

  it.each([
    ['a trailing comment', '"hooksConfig": { "enabled": false }, // off'],
    ['a block comment', '/* off */ "hooksConfig": { "enabled": false },'],
  ])('reads settings with %s', (_, line) => {
    setup();
    const settings = `{\n  ${line}\n  "ui": {}\n}\n`;
    expect(
      denied(
        hook('write_file', {
          file_path: '.gemini/settings.json',
          content: settings,
        }),
      ),
    ).toContain('hooksConfig.enabled');
  });

  it('denies distrusting the folder through .env', () => {
    setup();
    expect(
      denied(
        hook('write_file', {
          file_path: '.env',
          content: 'GEMINI_CLI_TRUST_WORKSPACE=false\n',
        }),
      ),
    ).toContain('distrust');
    expect(
      denied(
        hook('run_shell_command', {
          command: 'echo GEMINI_RESTRICTED_MODE=true >> .gemini/.env',
        }),
      ),
    ).toContain('distrust');
  });

  it('denies turning hooks off in system settings', () => {
    setup();
    const system = join(repo.dir, '..', `sys-${Date.now()}`, 'gemini-cli');
    expect(
      denied(
        hook('write_file', {
          file_path: join(system, 'settings.json'),
          content: '{ "hooksConfig": { "enabled": false } }\n',
        }),
      ),
    ).toContain('TG006');
  });
});

describe('own review', () => {
  it("denies disabling test-guard's hook under a name the user chose", () => {
    setup();
    const settings = (disabled: string[]) =>
      `${JSON.stringify(
        {
          hooks: {
            BeforeTool: [
              {
                matcher: 'write_file|replace|run_shell_command',
                hooks: [
                  {
                    name: 'guard',
                    type: 'command',
                    command:
                      'npx --no-install test-guard hook gemini pre-tool-use',
                  },
                ],
              },
            ],
          },
          hooksConfig: { disabled },
        },
        null,
        2,
      )}
`;
    repo.write('.gemini/settings.json', settings([]));
    repo.commitAll();
    expect(
      denied(
        hook('write_file', {
          file_path: '.gemini/settings.json',
          content: settings(['guard']),
        }),
      ),
    ).toContain('hooksConfig.disabled');
  });
});

describe('Codex adversarial review: install into settings with comments', () => {
  async function run(args: string[]) {
    let stdout = '';
    let stderr = '';
    const code = await main(args, {
      cwd: repo.dir,
      stdout: (t) => {
        stdout += t;
      },
      stderr: (t) => {
        stderr += t;
      },
      readStdin: async () => '',
    });
    return { code, stdout, stderr };
  }
  const read = () =>
    readFileSync(join(repo.dir, '.gemini/settings.json'), 'utf8');

  it.each([
    [
      '{\n  // my theme\n  "ui": { "theme": "Default" } /* keep */\n}\n',
      ['// my theme', '/* keep */'],
    ],
    ['{\n  // nothing yet\n}\n', ['// nothing yet']],
  ])('keeps the comments: %j', async (text, comments) => {
    setup();
    repo.write('.gemini/settings.json', text);
    expect((await run(['install', '--agent', 'gemini', '-y'])).code).toBe(0);
    const after = read();
    for (const comment of comments) expect(after).toContain(comment);
    const settings = parseJsonc(after) as { hooks: Record<string, unknown> };
    expect(Object.keys(settings.hooks)).toEqual(['BeforeTool', 'AfterAgent']);
    expect((await run(['install', '--agent', 'gemini'])).stdout).toContain(
      'already',
    );
    // The guard reads the installed hooks, comments and all.
    repo.commitAll();
    expect(
      denied(
        hook('write_file', {
          file_path: '.gemini/settings.json',
          content: after.replace('"hooks"', '"hooks_off"'),
        }),
      ),
    ).toContain('TG006');
  });

  it('stops, with the entries to add, when commented settings have hooks', async () => {
    setup();
    repo.write(
      '.gemini/settings.json',
      '{\n  // mine\n  "hooks": { "AfterAgent": [] }\n}\n',
    );
    const { code, stderr } = await run(['install', '--agent', 'gemini', '-y']);
    expect(code).toBe(2);
    expect(stderr).toContain('add these entries');
    expect(stderr).toContain('test-guard hook gemini pre-tool-use');
  });
});

// Gemini's replace on a relative path that isn't there edits the one file
// in the workspace whose path ends like it (pathCorrector.ts).
describe("Codex adversarial review: Gemini's path correction", () => {
  const skip = (file_path: string) =>
    hook('replace', {
      file_path,
      old_string: "it('adds'",
      new_string: "it.skip('adds'",
    });

  it('judges the file Gemini finds by the end of its path', () => {
    repo = new Repo();
    repo.write('src/__tests__/case.js', TEST);
    repo.write('src/math.js', 'export const add = (a, b) => a - b;\n');
    repo.commitAll();
    expect(denied(skip('case.js'))).toContain(
      'TG004 — added `it.skip` in src/__tests__/case.js:1',
    );
    expect(
      hook('replace', {
        file_path: 'math.js',
        old_string: 'a - b',
        new_string: 'a + b',
      }),
    ).toBe('');
  });

  it('denies when several test files end like the path', () => {
    repo = new Repo();
    repo.write('a/__tests__/case.js', TEST);
    repo.write('b/__tests__/case.js', TEST);
    repo.commitAll();
    expect(denied(skip('case.js'))).toContain('cannot tell');
  });

  it('reads a workspace mention without a slash', () => {
    setup();
    expect(denied(skip('@src/math.test.js'))).toContain('TG004');
    // A new file goes where Gemini puts it, without the `@`.
    expect(
      denied(
        hook('write_file', {
          file_path: '@src/new.test.js',
          content: "it.only('b', () => {});\n",
        }),
      ),
    ).toContain('`it.only` in src/new.test.js:1');
  });

  it('lets through a replace on a missing absolute path, which Gemini fails', () => {
    setup();
    expect(skip(join(repo.dir, 'gone/math.test.js'))).toBe('');
  });
});

// User and system settings disable hooks that the project's settings define.
describe('Codex adversarial review: custom-named hook disabled from user settings', () => {
  it('denies disabling the project guard by its name from user settings', () => {
    setup();
    repo.write(
      '.gemini/settings.json',
      `${JSON.stringify({
        hooks: {
          BeforeTool: [
            {
              hooks: [
                {
                  name: 'guard',
                  type: 'command',
                  command:
                    'npx --no-install test-guard hook gemini pre-tool-use',
                },
              ],
            },
          ],
        },
      })}\n`,
    );
    repo.commitAll();
    const home = join(repo.dir, '..', `home-${Date.now()}`);
    const user = (disabled: string[]) =>
      hook('write_file', {
        file_path: join(home, '.gemini/settings.json'),
        content: `${JSON.stringify({ hooksConfig: { disabled } })}\n`,
      });
    expect(denied(user(['guard']))).toContain('hooksConfig.disabled');
    expect(user(['other-hook'])).toBe('');
  });
});
