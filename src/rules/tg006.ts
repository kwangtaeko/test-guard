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
    const path = beforePath ?? afterPath ?? '';
    const count = (lines: string[], test: (line: string) => boolean) =>
      lines.filter(test).length;
    const mentions = (line: string) => line.includes('test-guard');
    // Claude Code: `"disableAllHooks": true` turns every hook off.
    const disables = (line: string) =>
      /"disableAllHooks"\s*:\s*true/.test(line);
    const findings = [];
    const before = count(beforeLines, mentions);
    const after = count(afterLines, mentions);
    if (after < before) {
      findings.push({
        ruleId: 'TG006',
        path,
        message: `removed test-guard from hook config (lines ${before} → ${after})`,
        before,
        after,
      });
    }
    if (count(afterLines, disables) > count(beforeLines, disables)) {
      findings.push({
        ruleId: 'TG006',
        path,
        message:
          'turned on `disableAllHooks`, which stops test-guard’s agent hooks',
      });
    }
    return findings;
  }
  return [];
};
