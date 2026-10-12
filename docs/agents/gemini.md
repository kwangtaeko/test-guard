# Gemini CLI 훅 사양 (단계 C 조사 기록)

- 확인일: 2026-10-11 · 확인 버전: gemini-cli v0.63.0 (2026-10-06), main 9b6e0265
- 출처:
  - Hooks 문서: https://geminicli.com/docs/hooks/ , https://geminicli.com/docs/hooks/reference/
  - 소스: https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src — `hooks/types.ts`(입출력 타입), `hooks/hookRunner.ts`(실행·종료 코드), `hooks/hookRegistry.ts`·`hooks/trustedHooks.ts`(신뢰), `core/coreToolHookTriggers.ts`(BeforeTool), `core/client.ts`(AfterAgent), `tools/edit.ts`·`tools/write-file.ts`·`tools/shell.ts`(도구 인자)
- 실제 Gemini 세션에서는 아직 확인하지 않았습니다(소스와 문서 기준). 사양이 바뀌면 이 문서와 `src/hook-io/gemini.ts`, `src/adapters/gemini.ts`를 함께 고칩니다.

## 사용하는 사양

| 항목 | 내용 | 출처 |
|---|---|---|
| 설정 위치 | 프로젝트 `.gemini/settings.json` > 사용자 `~/.gemini/settings.json` > 시스템 > 확장의 `hooks/hooks.json`. 모두 합쳐서 실행 | 문서 |
| 설정 구조 | `hooks.<Event>[] = { matcher, hooks: [{ name, type: "command", command, timeout(ms, 기본 60000) }] }` | 문서 reference |
| 켜기 | `hooksConfig.enabled` 기본 true. `hooksConfig.disabled`는 끌 훅 이름 목록 | `settingsSchema.ts` |
| 신뢰 | 폴더 신뢰가 기본으로 켜져 있고, 신뢰하지 않은 폴더에서는 설정 파일의 훅(사용자 설정 포함)을 모두 건너뜀. 새 프로젝트 훅은 한 번 경고만 하고 실행됨 | `hookRegistry.ts`, `trustedHooks.ts` |
| 실행 방식 | macOS/Linux `bash -c`, Windows PowerShell(`pwsh` 또는 `powershell.exe -NoProfile -NonInteractive -Command`). cwd는 프로젝트 폴더. 실행 전에 명령 안의 `$GEMINI_PROJECT_DIR`(`$CLAUDE_PROJECT_DIR`도)를 실제 경로로 바꿈 | `hookRunner.ts`, `shell-utils.ts` |
| 이벤트 | 도구 실행 전 `BeforeTool`, 턴 끝 `AfterAgent`(실행 대기 중인 도구가 없을 때) | `coreToolHookTriggers.ts`, `client.ts` |
| matcher | BeforeTool은 도구 이름에 대한 정규식 | 문서 |
| 공통 입력 | stdin JSON: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `timestamp` | `types.ts` |
| BeforeTool 입력 | `tool_name`, `tool_input` | `types.ts` |
| 도구 인자 | `write_file`: `{file_path, content}`. `replace`: `{file_path, old_string, new_string, allow_multiple?}`. `run_shell_command`: `{command, dir_path?, …}`(`dir_path`가 실행 폴더) | `tools/*.ts` |
| BeforeTool 차단 | exit 0 + stdout `{"decision":"deny","reason":"…"}`(`block`도 같음). 도구는 실행되지 않고, 모델은 `Tool execution blocked: <reason>` 도구 오류를 받아 턴을 계속함 | `types.ts`, `coreToolHookTriggers.ts` |
| AfterAgent 입력 | `prompt`, `prompt_response`, `stop_hook_active` | `types.ts` |
| AfterAgent 차단 | `{"decision":"block","reason":"…"}` → reason을 새 사용자 메시지로 보내 턴을 이어감(`stop_hook_active: true`). 한 프롬프트당 최대 100턴 | `client.ts` |
| 사용자 알림 | `systemMessage` | 문서 |

test-guard는 Gemini 입력의 이벤트 이름만 `PreToolUse`/`Stop`으로 바꿔 Claude Code·Codex와 같은 판정 코드를 쓰고, 차단 응답만 Gemini 형식(`decision: "deny"`)으로 바꿉니다(`src/hook-io/gemini.ts`).

## `replace`가 편집을 적용하는 방식

`tools/edit.ts`의 `calculateReplacement`는 다음 순서로 시도합니다.

1. 정확히 일치: 일치하는 곳을 모두 바꿈. 2곳 이상이면 `allow_multiple`이 있어야 하고, 없으면 실패
2. 공백 무시(줄 앞뒤 공백을 지우고 비교, 들여쓰기 다시 맞춤)
3. 정규식(토큰 사이 공백 허용)
4. 퍼지 매칭
5. 실패하면 모델에게 고쳐 달라고 해서(`FixLLMEditWithInstruction`) 다시 시도

`old_string`이 비어 있으면 새 파일을 만들고(파일이 없을 때), 있는 파일이면 실패합니다.

test-guard는 1~3번을 그대로 옮겨(`src/adapters/gemini-replace.ts`) Gemini가 쓸 파일과 같은 내용으로 판정합니다. 일치가 한 곳이거나 `allow_multiple`이면 결과가 정해지기 때문입니다. 일치가 여러 곳인데 `allow_multiple`이 없으면 Gemini는 실패시키지 않고 5번(모델 보정)으로 넘기므로, 4·5번과 함께 **결과를 알 수 없는 편집**으로 봅니다. 이런 편집이 테스트·스냅샷·러너 설정·가드 파일에 닿으면 막고, 파일을 다시 읽어 정확한 문자열로 재시도하라고 안내합니다. 구현 파일(TG009 대상)은 막지 않고 AfterAgent 검사에 맡깁니다. 소스 편집이 자주 막히지 않게 하기 위해서입니다.

경로도 Gemini처럼 풉니다: NUL 문자 제거, `file://` URL과 `%` 이스케이프 해석, 그대로는 없는 경로의 앞쪽 `@` 제거(`@/src`, `@src`, `resolveDefensiveToolPath`). 그대로는 없는 상대 경로에 대한 `replace`(기존 문자열이 있는 경우)는 Gemini가 작업 공간에서 이름이 같고 경로 끝이 같은 파일을 하나 찾아 고치고, 여럿이면 실패합니다(`correctPath`, `pathCorrector.ts`, 2026-10-12 main 확인). test-guard는 같은 방식으로 찾되 Gemini보다 넓게(무시 파일·폴더 50개 제한 없이, `.git`·`node_modules` 제외) 찾습니다. 하나면 그 파일에 대한 편집으로 판정하고, 여럿이면 Gemini가 어느 것을 찾을지 알 수 없으므로 그중 테스트·설정 파일 수정을 막습니다(Gemini가 실제로도 여럿을 찾으면 편집이 실패하므로, 이 경우의 차단은 지나친 쪽입니다). 없는 절대 경로는 Gemini가 실패하므로 통과시킵니다. `--include-directories`로 더한 작업 공간 폴더는 훅 입력에 없어 찾지 않습니다.

## 자기 보호
- `.gemini/settings.json`은 훅 파일로 감시합니다(TG006): test-guard 훅 제거·변경, matcher 축소.
- `hooksConfig.enabled: false`와 `hooksConfig.disabled`에 test-guard 훅 이름(`test-guard-pre-tool-use`, `test-guard-stop`) 추가를 막습니다. 저장소 밖 사용자 설정(`~/.gemini/settings.json`)도 같습니다. 사용자가 훅 이름을 바꿨어도 그 이름으로 판정하며, 사용자·시스템 설정에서 끄는 경우에는 프로젝트 설정(작업 폴더와 git 루트의 `.gemini/settings.json`)에 정의된 test-guard 훅 이름까지 봅니다(Codex 리뷰).
- 시스템 설정(`/etc/gemini-cli/settings.json`, `C:ProgramDatagemini-clisettings.json`)도 같습니다. 프로젝트 설정보다 우선하기 때문입니다.
- 설정 파일의 `//`·`/* */` 주석은 지우고 해석합니다(Gemini는 strip-json-comments로 읽음).
- `~/.gemini/trustedFolders.json` 편집을 막습니다. 폴더 신뢰를 풀면 프로젝트 훅이 모두 꺼지기 때문입니다. 셸로 이 파일들을 쓰는 것도 막습니다.
- `GEMINI_CLI_TRUST_WORKSPACE=false`, `GEMINI_RESTRICTED_MODE=true`, `GEMINI_CLI_TRUSTED_FOLDERS_PATH=`를 파일(`.env` 등)에 쓰거나 셸 명령에 넣는 것을 막습니다. Gemini는 신뢰한 폴더에서 프로젝트 `.env`를 읽는데, 이 값들이 들어가면 다음 세션부터 폴더를 신뢰하지 않아 훅이 꺼집니다. `.env`는 보통 git이 추적하지 않아 commit·CI도 보지 못합니다.
- 문서상 timeout이나 실행 실패는 통과로 처리됩니다. 최종 관문은 commit-msg 훅과 CI입니다(ROADMAP §1.4).

## 사용하지 않는 것과 이유
- **AfterTool**: 이미 실행된 결과를 되돌릴 수 없습니다. 셸 내부 편집은 AfterAgent에서 잡습니다(Codex와 같은 판단).
- **BeforeModel, BeforeToolSelection 등**: 테스트 약화 판정과 무관합니다.
- MCP 도구(`mcp_*`)와 확장 도구의 파일 쓰기는 BeforeTool 대상에 넣지 않았습니다. AfterAgent와 commit·CI가 잡습니다.

## 설치 형태
- `test-guard install --agent gemini`는 `.gemini/settings.json`에 BeforeTool(`write_file|replace|run_shell_command`)과 AfterAgent 훅을 추가합니다. 다른 설정은 그대로 둡니다.
- 로컬 설치가 있으면 `node node_modules/test-guard/dist/cli.js hook gemini <event>`, 없으면 `npx --no-install test-guard hook gemini <event>`. 훅은 프로젝트 폴더(설정을 읽은 폴더)에서 실행되므로 상대 경로가 bash와 PowerShell 모두에서 동작합니다.
- `$GEMINI_PROJECT_DIR`는 쓰지 않습니다. Gemini가 이 값을 셸 따옴표로 감싸서 넣기 때문에(Windows 경로, 공백 있는 경로) `"…"` 안에서 경로가 깨지고, 훅 실패는 통과로 처리됩니다(레드팀 확인). 2026-10-11 Windows PowerShell(`powershell.exe -NoProfile -NonInteractive -Command`)에서 상대 경로 명령이 실제로 차단 응답을 내는 것을 확인했습니다.
- Gemini는 시작한 폴더의 `.gemini/settings.json`을 읽으므로, 하위 폴더에서 시작하면 프로젝트 훅이 로드되지 않습니다.
