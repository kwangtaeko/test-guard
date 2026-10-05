#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import pc from 'picocolors';
import { main } from './cli.js';

process.exitCode = await main(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
  color: pc.isColorSupported,
  readStdin: async () => {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks).toString('utf8');
  },
  confirm: process.stdin.isTTY
    ? async (question) => {
        const rl = createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        const answer = await rl.question(question);
        rl.close();
        return /^y(es)?$/i.test(answer.trim());
      }
    : undefined,
});
