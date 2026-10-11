// Types of `test-guard/probity` (src/probity.ts), copied to dist/ by the
// build. Probity's own types, restated so test-guard needs no dependency.
type Action =
  | { kind: 'write'; path: string; content: string }
  | { kind: 'command'; command: string };

type RuleResult =
  | { kind: 'pass'; reason?: string }
  | { kind: 'violation'; reason: string };

export type TestGuardRule = (action: Action) => RuleResult;

export declare function testGuard(): TestGuardRule;
