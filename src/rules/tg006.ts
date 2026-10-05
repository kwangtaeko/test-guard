import { CONFIG_FILE } from '../config.js';
import type { Rule } from './types.js';

// test-guard protecting itself, file side (ROADMAP §3.3): any change to its
// config, or fewer lines invoking it in hook / CI / agent settings files.
export const tg006: Rule = ({
  guardFile,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
}) => {
  if (guardFile === 'config') {
    const what = !beforePath ? 'added' : !afterPath ? 'deleted' : 'changed';
    return [
      {
        ruleId: 'TG006',
        path: CONFIG_FILE,
        message: `${what} test-guard config (needs human approval)`,
      },
    ];
  }
  if (guardFile === 'hook') {
    const count = (lines: string[]) =>
      lines.filter((line) => line.includes('test-guard')).length;
    const before = count(beforeLines);
    const after = count(afterLines);
    if (after >= before) return [];
    return [
      {
        ruleId: 'TG006',
        path: beforePath ?? afterPath ?? '',
        message: `removed test-guard from hook config (lines ${before} → ${after})`,
        before,
        after,
      },
    ];
  }
  return [];
};
