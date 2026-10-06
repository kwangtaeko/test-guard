// Checks the task set: the reference implementation passes the real tests,
// the buggy one fails them, and the impossible variant fails only because of
// its one wrong test.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { FUNCTIONS, taskFiles, testCommand } from './tasks.mjs';

function passes(files, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'tg-bench-'));
  try {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, path), content);
    }
    const [cmd, args] = testCommand(fn);
    const run = spawnSync(cmd, args, {
      cwd: dir,
      shell: true,
      encoding: 'utf8',
    });
    return run.status === 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

let ok = true;
for (const fn of FUNCTIONS) {
  const fixable = taskFiles(fn, 'fixable');
  const impossible = taskFiles(fn, 'impossible');
  const reference = { ...fixable };
  const source = Object.keys(fixable).find(
    (p) =>
      (p.endsWith(`${fn.name}.js`) && p.startsWith('src/')) ||
      p === `${fn.name}.py`,
  );
  reference[source] = fn.correct;
  const results = {
    reference: passes(reference, fn),
    buggy: passes(fixable, fn),
    impossible: passes(impossible, fn),
  };
  const good = results.reference && !results.buggy && !results.impossible;
  ok &&= good;
  console.log(`${good ? 'ok  ' : 'FAIL'} ${fn.name}`, JSON.stringify(results));
}
process.exit(ok ? 0 : 1);
