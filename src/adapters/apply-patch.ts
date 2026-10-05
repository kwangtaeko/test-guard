// Codex `apply_patch` parsing and application, ported from openai/codex
// codex-rs/apply-patch (parser.rs, streaming_parser.rs, seek_sequence.rs,
// file_update.rs; default NormalizeToLf mode). The hook must judge exactly the
// content Codex would write, so the lenient parsing and fuzzy line matching
// are kept as they are. Spec notes: docs/agents/codex.md.
import { resolve } from 'node:path';

export interface Chunk {
  context?: string; // `@@ <line>` narrowing the search
  oldLines: string[];
  newLines: string[];
  endOfFile: boolean;
}

export type PatchHunk =
  | { kind: 'add'; path: string; contents: string }
  | { kind: 'delete'; path: string }
  | { kind: 'update'; path: string; movePath?: string; chunks: Chunk[] };

export class PatchError extends Error {}

const BEGIN = '*** Begin Patch';
const END = '*** End Patch';
const ADD = '*** Add File: ';
const DELETE = '*** Delete File: ';
const UPDATE = '*** Update File: ';
const MOVE = '*** Move to: ';
const EOF_MARKER = '*** End of File';
const CONTEXT = '@@ ';
const EMPTY_CONTEXT = '@@';
const ENVIRONMENT_ID = '*** Environment ID:';

export function parsePatch(patch: string): PatchHunk[] {
  const lines = boundaries(patch.trim().split('\n').map(stripCr));
  type Mode = 'notStarted' | 'started' | 'add' | 'delete' | 'update' | 'ended';
  let mode = 'notStarted' as Mode; // assigned inside closures too
  const hunks: PatchHunk[] = [];

  const lastChunks = () => {
    const last = hunks.at(-1);
    return last?.kind === 'update' ? last.chunks : null;
  };
  const isEmpty = (c: Chunk | undefined) =>
    c !== undefined && c.oldLines.length === 0 && c.newLines.length === 0;
  const ensureUpdateNotEmpty = () => {
    const chunks = lastChunks();
    if (!chunks) return;
    if (chunks.length === 0 && mode === 'update') {
      throw new PatchError('update file hunk is empty');
    }
    if (isEmpty(chunks.at(-1))) {
      throw new PatchError('update hunk does not contain any lines');
    }
  };
  const headers = (trimmed: string): boolean => {
    if (mode === 'started' && trimmed.startsWith(ENVIRONMENT_ID)) return true;
    if (trimmed === END) {
      ensureUpdateNotEmpty();
      mode = 'ended';
      return true;
    }
    for (const [marker, kind] of [
      [ADD, 'add'],
      [DELETE, 'delete'],
      [UPDATE, 'update'],
    ] as const) {
      if (trimmed.startsWith(marker)) {
        ensureUpdateNotEmpty();
        const path = trimmed.slice(marker.length);
        hunks.push(
          kind === 'add'
            ? { kind, path, contents: '' }
            : kind === 'delete'
              ? { kind, path }
              : { kind, path, chunks: [] },
        );
        mode = kind;
        return true;
      }
    }
    return false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    switch (mode) {
      case 'notStarted':
        if (trimmed !== BEGIN) {
          throw new PatchError(`the first line must be '${BEGIN}'`);
        }
        mode = 'started';
        break;
      case 'started':
      case 'delete':
        if (!headers(trimmed))
          throw new PatchError(`invalid hunk header: ${trimmed}`);
        break;
      case 'add': {
        if (headers(trimmed)) break;
        const last = hunks.at(-1);
        if (!line.startsWith('+') || last?.kind !== 'add') {
          throw new PatchError(`invalid hunk header: ${trimmed}`);
        }
        last.contents += `${line.slice(1)}\n`;
        break;
      }
      case 'update': {
        const updateLine = line.trimEnd();
        if (headers(updateLine)) break;
        const hunk = hunks.at(-1);
        if (hunk?.kind !== 'update') throw new PatchError('no update hunk');
        const { chunks } = hunk;
        const last = chunks.at(-1);
        const isContextMarker =
          updateLine === EMPTY_CONTEXT || updateLine.startsWith(CONTEXT);
        if (last?.endOfFile) {
          if (updateLine === '') break;
          if (!isContextMarker) {
            throw new PatchError(`expected a @@ context marker, got: ${line}`);
          }
        }
        if (
          chunks.length === 0 &&
          hunk.movePath === undefined &&
          updateLine.startsWith(MOVE)
        ) {
          hunk.movePath = updateLine.slice(MOVE.length);
          break;
        }
        if (isContextMarker && isEmpty(last)) {
          throw new PatchError(`unexpected line in update hunk: ${line}`);
        }
        if (updateLine === EMPTY_CONTEXT) {
          chunks.push(newChunk());
          break;
        }
        if (updateLine.startsWith(CONTEXT)) {
          chunks.push({
            ...newChunk(),
            context: updateLine.slice(CONTEXT.length),
          });
          break;
        }
        if (updateLine === EOF_MARKER) {
          if (isEmpty(last)) {
            throw new PatchError('update hunk does not contain any lines');
          }
          if (last) last.endOfFile = true;
          break;
        }
        const prefix = line[0];
        if (line === '' || prefix === ' ' || prefix === '+' || prefix === '-') {
          if (chunks.length === 0) chunks.push(newChunk());
          const chunk = chunks.at(-1) as Chunk;
          const text = line.slice(1);
          if (line === '' || prefix === ' ') {
            chunk.oldLines.push(text);
            chunk.newLines.push(text);
          } else if (prefix === '+') {
            chunk.newLines.push(text);
          } else {
            chunk.oldLines.push(text);
          }
          break;
        }
        throw new PatchError(`unexpected line in update hunk: ${line}`);
      }
      case 'ended':
        if (trimmed !== '')
          throw new PatchError(`the last line must be '${END}'`);
        break;
    }
  }
  if (mode !== 'ended') throw new PatchError(`the last line must be '${END}'`);
  return hunks;
}

function newChunk(): Chunk {
  return { oldLines: [], newLines: [], endOfFile: false };
}

function stripCr(line: string): string {
  return line.endsWith('\r') ? line.slice(0, -1) : line;
}

// Lenient mode also accepts the patch wrapped in a `<<EOF … EOF` heredoc.
function boundaries(lines: string[]): string[] {
  const ok = (l: string[]) =>
    l[0]?.trim() === BEGIN && l.at(-1)?.trim() === END;
  if (ok(lines)) return lines;
  const first = lines[0];
  if (
    (first === '<<EOF' || first === "<<'EOF'" || first === '<<"EOF"') &&
    lines.at(-1)?.endsWith('EOF') &&
    lines.length >= 4
  ) {
    const inner = lines.slice(1, -1);
    if (ok(inner)) return inner;
  }
  throw new PatchError(
    lines[0]?.trim() !== BEGIN
      ? `the first line must be '${BEGIN}'`
      : `the last line must be '${END}'`,
  );
}

// Returns the updated contents, or null when Codex could not apply the chunks.
export function applyChunks(original: string, chunks: Chunk[]): string | null {
  const lines = original.split('\n');
  if (lines.at(-1) === '') lines.pop();

  const replacements: [number, number, string[]][] = [];
  let lineIndex = 0;
  for (const chunk of chunks) {
    if (chunk.context !== undefined) {
      const idx = seekSequence(lines, [chunk.context], lineIndex, false);
      if (idx === null) return null;
      lineIndex = idx + 1;
    }
    if (chunk.oldLines.length === 0) {
      const at = lines.at(-1) === '' ? lines.length - 1 : lines.length;
      replacements.push([at, 0, chunk.newLines]);
      continue;
    }
    let pattern = chunk.oldLines;
    let newSlice = chunk.newLines;
    let found = seekSequence(lines, pattern, lineIndex, chunk.endOfFile);
    if (found === null && pattern.at(-1) === '') {
      pattern = pattern.slice(0, -1);
      if (newSlice.at(-1) === '') newSlice = newSlice.slice(0, -1);
      found = seekSequence(lines, pattern, lineIndex, chunk.endOfFile);
    }
    if (found === null) return null;
    replacements.push([found, pattern.length, newSlice]);
    lineIndex = found + pattern.length;
  }

  replacements.sort((a, b) => a[0] - b[0]);
  for (const [start, length, segment] of replacements.reverse()) {
    lines.splice(
      start,
      Math.min(length, Math.max(lines.length - start, 0)),
      ...segment,
    );
  }
  if (lines.at(-1) !== '') lines.push('');
  return lines.join('\n');
}

export function seekSequence(
  lines: string[],
  pattern: string[],
  start: number,
  eof: boolean,
): number | null {
  if (pattern.length === 0) return start;
  if (pattern.length > lines.length) return null;
  const searchStart = eof ? lines.length - pattern.length : start;
  const last = lines.length - pattern.length;
  const passes: ((s: string) => string)[] = [
    (s) => s,
    (s) => s.trimEnd(),
    (s) => s.trim(),
    normalise,
  ];
  for (const norm of passes) {
    for (let i = searchStart; i <= last; i++) {
      if (pattern.every((p, j) => norm(lines[i + j] ?? '') === norm(p))) {
        return i;
      }
    }
  }
  return null;
}

function normalise(s: string): string {
  return s
    .trim()
    .replace(/[‐-―−]/g, '-')
    .replace(/[‘-‛]/g, "'")
    .replace(/[“-‟]/g, '"')
    .replace(/[  -   　]/g, ' ');
}

export interface PatchedFile {
  beforePath: string | null; // absolute
  before: string | null;
  afterPath: string | null;
  after: string | null;
}

// Applies the patch to an in-memory view of the files. Hunks run in order like
// Codex; when one fails, the earlier hunks may already be on disk, so their
// changes are still returned. Throws PatchError for patches Codex rejects as a
// whole.
export function simulatePatch(
  patch: string,
  cwd: string,
  read: (path: string) => string | null,
): PatchedFile[] {
  const hunks = parsePatch(patch);
  const original = new Map<string, string | null>();
  const current = new Map<string, string | null>();
  const moves = new Map<string, string>(); // destination → source
  const get = (path: string) => {
    if (!current.has(path)) {
      const text = read(path);
      original.set(path, text);
      current.set(path, text);
    }
    return current.get(path) ?? null;
  };

  for (const hunk of hunks) {
    const path = resolve(cwd, hunk.path);
    if (hunk.kind === 'add') {
      get(path);
      current.set(path, hunk.contents);
      continue;
    }
    const text = get(path);
    if (text === null) break; // Codex fails on a missing file
    if (hunk.kind === 'delete') {
      current.set(path, null);
      continue;
    }
    const next = applyChunks(text, hunk.chunks);
    if (next === null) break;
    if (hunk.movePath === undefined) {
      current.set(path, next);
    } else {
      const dest = resolve(cwd, hunk.movePath);
      get(dest);
      current.set(path, null);
      current.set(dest, next);
      moves.set(dest, path);
    }
  }

  const files: PatchedFile[] = [];
  const paired = new Set<string>();
  for (const [dest, source] of moves) {
    files.push({
      beforePath: source,
      before: original.get(source) ?? null,
      afterPath: dest,
      after: current.get(dest) ?? null,
    });
    paired.add(source).add(dest);
  }
  for (const [path, after] of current) {
    if (paired.has(path)) continue;
    const before = original.get(path) ?? null;
    if (before === after) continue;
    files.push({
      beforePath: before === null ? null : path,
      before,
      afterPath: after === null ? null : path,
      after,
    });
  }
  return files;
}
