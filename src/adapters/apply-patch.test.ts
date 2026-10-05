import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyChunks,
  PatchError,
  parsePatch,
  seekSequence,
  simulatePatch,
} from './apply-patch.js';

// Cases ported from openai/codex codex-rs/apply-patch (parser.rs,
// seek_sequence.rs, file_update_tests.rs) unless noted.
const wrap = (body: string) => `*** Begin Patch\n${body}\n*** End Patch`;

function apply(original: string, body: string): string | null {
  const [hunk] = parsePatch(wrap(`*** Update File: f\n${body}`));
  if (hunk?.kind !== 'update') throw new Error('expected update');
  return applyChunks(original, hunk.chunks);
}

describe('parsePatch', () => {
  it('rejects bad boundaries', () => {
    expect(() => parsePatch('bad')).toThrow(PatchError);
    expect(() => parsePatch('*** Begin Patch\nbad')).toThrow(PatchError);
    expect(() =>
      parsePatch('*** Begin Patch\n*** Update File: test.py\n*** End Patch'),
    ).toThrow('empty');
  });

  it('parses add, delete, update with move and context', () => {
    expect(
      parsePatch(
        wrap(
          [
            '*** Add File: path/add.py',
            '+abc',
            '+def',
            '*** Delete File: path/delete.py',
            '*** Update File: path/update.py',
            '*** Move to: path/update2.py',
            '@@ def f():',
            '-    pass',
            '+    return 123',
          ].join('\n'),
        ),
      ),
    ).toEqual([
      { kind: 'add', path: 'path/add.py', contents: 'abc\ndef\n' },
      { kind: 'delete', path: 'path/delete.py' },
      {
        kind: 'update',
        path: 'path/update.py',
        movePath: 'path/update2.py',
        chunks: [
          {
            context: 'def f():',
            oldLines: ['    pass'],
            newLines: ['    return 123'],
            endOfFile: false,
          },
        ],
      },
    ]);
  });

  it('accepts whitespace around markers, a heredoc wrapper and CRLF', () => {
    expect(
      parsePatch('*** Begin Patch \n*** Add File: foo\n+hi\n *** End Patch'),
    ).toEqual([{ kind: 'add', path: 'foo', contents: 'hi\n' }]);
    expect(
      parsePatch(
        "<<'EOF'\n*** Begin Patch\n*** Add File: foo\n+hi\n*** End Patch\nEOF",
      ),
    ).toEqual([{ kind: 'add', path: 'foo', contents: 'hi\n' }]);
    expect(
      parsePatch('*** Begin Patch\r\n*** Delete File: a\r\n*** End Patch\r\n'),
    ).toEqual([{ kind: 'delete', path: 'a' }]);
  });
});

describe('seekSequence', () => {
  it('matches exactly, then ignoring whitespace, then normalized punctuation', () => {
    expect(seekSequence(['foo', 'bar', 'baz'], ['bar', 'baz'], 0, false)).toBe(
      1,
    );
    expect(seekSequence(['foo   ', 'bar\t\t'], ['foo', 'bar'], 0, false)).toBe(
      0,
    );
    expect(
      seekSequence(['    foo   ', '   bar\t'], ['foo', 'bar'], 0, false),
    ).toBe(0);
    expect(seekSequence(['a — b'], ['a - b'], 0, false)).toBe(0);
    expect(
      seekSequence(['just one line'], ['too', 'many', 'lines'], 0, false),
    ).toBeNull();
  });
});

describe('applyChunks', () => {
  it('applies multiple chunks', () => {
    expect(
      apply(
        'foo\nbar\nbaz\nqux\n',
        '@@\n foo\n-bar\n+BAR\n@@\n baz\n-qux\n+QUX',
      ),
    ).toBe('foo\nBAR\nbaz\nQUX\n');
  });

  it('inserts at end of file', () => {
    expect(apply('foo\nbar\nbaz\n', '@@\n+quux\n*** End of File\n')).toBe(
      'foo\nbar\nbaz\nquux\n',
    );
  });

  it('applies interleaved changes', () => {
    expect(
      apply(
        'a\nb\nc\nd\ne\nf\n',
        '@@\n a\n-b\n+B\n@@\n d\n-e\n+E\n@@\n f\n+g\n*** End of File',
      ),
    ).toBe('a\nB\nc\nd\nE\nf\ng\n');
  });

  it('narrows the search with @@ context', () => {
    // test-guard case: the same line appears twice
    expect(
      apply(
        'def a():\n  x = 1\ndef b():\n  x = 1\n',
        '@@ def b():\n-  x = 1\n+  x = 2',
      ),
    ).toBe('def a():\n  x = 1\ndef b():\n  x = 2\n');
  });

  it('returns null when Codex could not apply the chunk', () => {
    expect(apply('foo\n', '@@\n-missing\n+x')).toBeNull();
  });
});

describe('simulatePatch', () => {
  const cwd = resolve('/repo');
  const at = (p: string) => resolve(cwd, p);
  const disk: Record<string, string> = {
    [at('a.test.js')]: "it('a', () => {});\n",
    [at('b.js')]: 'b\n',
  };
  const read = (p: string) => disk[p] ?? null;

  it('reports updates, adds, deletes and moves', () => {
    const files = simulatePatch(
      wrap(
        [
          '*** Update File: a.test.js',
          "-it('a', () => {});",
          "+it.skip('a', () => {});",
          '*** Add File: c.test.js',
          '+x',
          '*** Delete File: b.js',
        ].join('\n'),
      ),
      cwd,
      read,
    );
    expect(files).toEqual([
      {
        beforePath: at('a.test.js'),
        before: "it('a', () => {});\n",
        afterPath: at('a.test.js'),
        after: "it.skip('a', () => {});\n",
      },
      {
        beforePath: null,
        before: null,
        afterPath: at('c.test.js'),
        after: 'x\n',
      },
      { beforePath: at('b.js'), before: 'b\n', afterPath: null, after: null },
    ]);
  });

  it('pairs a move with its source', () => {
    expect(
      simulatePatch(
        wrap(
          "*** Update File: a.test.js\n*** Move to: old/a.js\n@@\n-it('a', () => {});\n+it('a', () => {});",
        ),
        cwd,
        read,
      ),
    ).toEqual([
      {
        beforePath: at('a.test.js'),
        before: "it('a', () => {});\n",
        afterPath: at('old/a.js'),
        after: "it('a', () => {});\n",
      },
    ]);
  });

  it('keeps hunks applied before a failing one', () => {
    const files = simulatePatch(
      wrap(
        '*** Delete File: a.test.js\n*** Update File: b.js\n@@\n-missing\n+x',
      ),
      cwd,
      read,
    );
    expect(files.map((f) => [f.beforePath, f.afterPath])).toEqual([
      [at('a.test.js'), null],
    ]);
  });
});
