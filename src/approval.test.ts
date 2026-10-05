import { describe, expect, it } from 'vitest';
import { findApproval } from './approval.js';

describe('findApproval', () => {
  it.skip('reads the trailer reason', () => {
    expect(
      findApproval('fix: x\n\nTest-Guard-Approved: flaky upstream API\n'),
    ).toBe('flaky upstream API');
    expect(findApproval('x\r\n\r\ntest-guard-approved:  reason  \r\n')).toBe(
      'reason',
    );
  });

  it('ignores missing reasons, comments and the verbose diff', () => {
    expect(findApproval('x\n\nTest-Guard-Approved:\n')).toBeUndefined();
    expect(findApproval('x\n# Test-Guard-Approved: no\n')).toBeUndefined();
    expect(
      findApproval(
        'x\n# ------------------------ >8 ------------------------\n' +
          'Test-Guard-Approved: from the diff\n',
      ),
    ).toBeUndefined();
    expect(
      findApproval('x\n  Test-Guard-Approved: indented\n'),
    ).toBeUndefined();
  });
});
