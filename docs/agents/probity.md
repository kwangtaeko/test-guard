# Probity 규칙 (단계 C 조사 기록)

- 확인일: 2026-10-11 · 확인 버전: @nizos/probity 1.10.1 (2026-09-15, MIT, Node 22 이상)
- 출처:
  - https://github.com/nizos/probity — `docs/configuration.md`(Custom rules), `docs/rules.md`, `src/rules/contract.ts`(`Rule`, `RuleContext`, `FileContent`), `src/types.ts`(`Action`, `RuleResult`), `src/engine.ts`(`runRule`), `docs/adr/0007-normalize-vendor-edits-to-write.md`
- Probity는 tdd-guard(별 약 2,400개)의 후속으로, Claude Code·Codex·GitHub Copilot CLI의 PreToolUse 훅에서 사용자가 고른 규칙을 실행합니다. test-guard는 경쟁 도구가 아니라 배포 채널로 보고, Probity 규칙으로도 쓸 수 있게 합니다(ROADMAP §12.3).

## 사용하는 사양

| 항목 | 내용 | 출처 |
|---|---|---|
| 규칙 | 함수 `(action, ctx?) => RuleResult \| Promise<RuleResult>`. 사용자 정의 규칙을 공식 지원 | `contract.ts`, `configuration.md` |
| 설정 | `probity.config.{ts,mts,js,mjs}`의 `defineConfig({ rules: [...] })`. `{ files: [glob], rules }`로 쓰기 동작을 경로로 좁힐 수 있음 | `configuration.md` |
| 동작(Action) | `{ kind: 'write', path, content }`(절대 POSIX 경로, 편집 후 파일 전체 내용) 또는 `{ kind: 'command', command }`. 에이전트의 Edit/apply_patch 등은 어댑터가 편집 후 전체 내용으로 바꿔 줌 | `types.ts`, ADR 0007 |
| 결과 | `{ kind: 'pass' }` 또는 `{ kind: 'violation', reason }`. reason은 "Probity: " 접두어와 함께 에이전트에게 감 | `types.ts`, `cli.ts` |
| 오류 | 규칙이 throw하거나 잘못된 값을 돌려주면 Probity가 막음 | `engine.ts` |
| 실행 위치 | 훅이 세션 폴더에서 실행됨. `command` 동작에는 cwd가 없음 | `cli.ts` |
| 종료 시점 | Stop 훅 없음. PreToolUse만 사용 | README |

## test-guard 규칙

```ts
// probity.config.ts
import { defineConfig } from '@nizos/probity'
import { testGuard } from 'test-guard/probity'

export default defineConfig({ rules: [testGuard()] })
```

- `write`: 디스크의 현재 내용(편집 전)과 `content`(편집 후)를 test-guard 에이전트 훅과 같은 판정(`checkFileChange`)으로 비교합니다.
- `command`: 프로세스 cwd(세션 폴더)에서 에이전트 훅과 같은 셸 판정(`checkShell`)을 합니다.
- test-guard 자체 오류는 통과시킵니다(`pass`, reason에 오류). Probity는 throw를 차단으로 처리하므로, test-guard 버그 하나로 모든 편집이 막히지 않게 하기 위해서입니다. 에이전트 훅과 같은 원칙입니다.
- 같은 프로세스에서 실행하므로 Probity 훅 하나에 test-guard 프로세스가 따로 뜨지 않습니다.
- `dist/probity.js`는 `dist/cli.js`와 따로 묶은 번들입니다(훅과 플러그인이 `cli.js`를 경로로 직접 실행하므로 한 파일로 유지).

## 한계
- Probity에는 종료 시점 훅이 없어, test-guard Stop 훅이 잡는 셸 내부 편집(`sed -i` 등)은 commit-msg 훅과 CI가 잡습니다. Probity와 함께 `test-guard install --pre-commit`과 GitHub Action을 권장합니다.
- Probity 어댑터가 모델링하지 않는 도구(예: Claude Code의 MultiEdit)는 Probity가 그대로 통과시킵니다. test-guard의 Claude Code 훅을 함께 쓰면 그 경우도 막습니다.

## 실제 확인 (2026-10-11, Windows 11, Node 22)
`@nizos/probity@1.10.1`을 설치한 임시 저장소에서 `probity.config.mjs`에 빌드한 `dist/probity.js`의 `testGuard()`를 넣고 Claude Code PreToolUse 입력을 `npx probity --agent claude-code`에 넘겼습니다.

| 입력 | 결과 |
|---|---|
| Edit: 테스트의 `.toBe(3)` → `.toBeDefined()` | deny: `Probity: [test-guard] Blocked: TG007 — weakened assertion …` |
| Edit: 구현 `a - b` → `a + b` | 허용(출력 없음) |
| Bash: `rm src/math.test.js` | deny: `TG001 — rm deletes test files` |
| Bash: `npm test` | 허용 |
