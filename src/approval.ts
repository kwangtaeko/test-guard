// Human approval in a commit message: `Test-Guard-Approved: <reason>`.
// Only the local commit-msg hook reads it; CI trusts PR labels instead.
const TRAILER = /^Test-Guard-Approved:[ \t]*(\S.*?)\s*$/i;
// `git commit -v` appends the diff below this line; it is not the message.
const SCISSORS = /^# -+ >8 -+$/;

export function findApproval(message: string): string | undefined {
  for (const line of message.replace(/\r\n?/g, '\n').split('\n')) {
    if (SCISSORS.test(line)) break;
    if (line.startsWith('#')) continue;
    const match = TRAILER.exec(line);
    if (match?.[1]) return match[1];
  }
  return undefined;
}
