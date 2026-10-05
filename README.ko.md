# test-guard

**AI 코딩 에이전트가 테스트를 지우거나, skip하거나, 약화해서 "통과"시키는 것을 막습니다.**

[English](README.md)

<!-- 데모 GIF: 에이전트가 `it.skip`을 넣으려다 차단되고, 대신 구현을 고치는 과정 -->

코딩 에이전트는 실패하는 테스트를 만나면 테스트를 지우거나, `.skip`을 붙이거나,
assertion을 빼거나, 테스트 실행 대상에서 제외해서 "고치는" 경우가 있습니다.
테스트는 초록색이 되지만 버그는 그대로 남습니다. test-guard는 같은 규칙으로
세 곳에서 이를 잡습니다.

| 위치 | 시점 | 결과 |
|---|---|---|
| **에이전트 훅** (Claude Code, Codex) | 편집·셸 명령 실행 직전 | 편집을 막고, 구현을 고치라고 에이전트에게 알려줍니다 |
| **git commit-msg 훅** | 커밋할 때마다 | 사람이 승인하지 않으면 커밋이 실패합니다 |
| **GitHub Action** | PR마다 | 사람이 승인 라벨을 붙이지 않으면 검사가 실패합니다 |

LLM 호출, 네트워크, 텔레메트리 없음. 같은 입력이면 같은 결과입니다.

## 빠른 시작

```sh
npm install --save-dev test-guard
npx test-guard install --pre-commit            # git commit-msg 훅
npx test-guard install --agent claude-code     # 또는: --agent codex
npx test-guard check                           # 지금 작업 트리 검사
```

[데모 프로젝트](examples/demo)에서 바로 해볼 수 있습니다. 실패하는 테스트 1개, 버그 1개가 들어 있습니다.

### Claude Code 플러그인

`install --agent claude-code` 대신 플러그인을 설치할 수 있습니다. 여는 모든
저장소에 훅과 `test-guard` 스킬이 적용됩니다.

```
/plugin marketplace add kwangtaeko/test-guard
/plugin install test-guard@test-guard
```

플러그인은 git 저장소에서만 동작하고, git 밖에서는 아무것도 하지 않습니다.

### GitHub Action

```yaml
name: test-guard
on:
  pull_request:
    types: [opened, synchronize, reopened, labeled, unlabeled]
jobs:
  test-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: kwangtaeko/test-guard@v0
```

위반이 있으면 job이 실패하고 Job Summary에 목록이 표시됩니다. 의도적인 변경은
사람이 `test-guard:approved` 라벨(`approve-label` 입력으로 변경 가능)로 승인합니다.
**라벨 권한은 사람에게만 주고, 에이전트용 토큰에는 절대 주지 마세요.**

## 규칙

| ID | 잡아내는 것 |
|---|---|
| TG001 | 테스트 파일 삭제, 또는 테스트가 아닌 경로로 이동 |
| TG002 | 파일의 테스트 케이스 수 감소 |
| TG003 | 파일의 assertion 수 감소 |
| TG004 | skip / disable / focus 추가: `it.skip`, `xit`, `.only`, `.todo`, `@pytest.mark.skip`, `xfail`, `@Disabled`, `@Ignore` 등 |
| TG005 | 테스트 러너 설정 변조: `passWithNoTests`, `testPathIgnorePatterns`, pytest `addopts`의 `-k`/`--deselect`/`--ignore`, `collect_ignore`, Maven `skipTests`/`testFailureIgnore`, Gradle `enabled = false`/`ignoreFailures` 등 |
| TG006 | test-guard 우회: `.test-guard.json` 변경, 훅·CI 파일에서 test-guard 제거, `git commit --no-verify`, `core.hooksPath` 변경, 에이전트의 `Test-Guard-Approved` 트레일러·`TEST_GUARD_*` 변수 설정 |
| TG007 | assertion 약화: `toBe(3)` → `toBeDefined()`, `assertEqual` → `assertTrue`, `toThrow(X)` → `toThrow()`, `pytest.raises(ValueError)` → `pytest.raises(Exception)`, 그리고 `expect(true).toBe(true)` 같은 의미 없는 assertion |

지원 언어: TypeScript/JavaScript(Jest, Vitest, Mocha), Python(pytest, unittest),
Java(JUnit 4/5).

| 언어 | 테스트 파일 (기본값) |
|---|---|
| JS/TS | `*.test.*`, `*.spec.*`, `__tests__/**` (JS/TS 확장자) |
| Python | `test_*.py`, `*_test.py` |
| Java | `src/test/**/*Test.java`, `*Tests.java`, `*IT.java` |

## CLI

```
test-guard check                 작업 트리 ↔ HEAD
test-guard check --staged        스테이징 ↔ HEAD
test-guard check --base <ref>    HEAD ↔ merge-base(<ref>, HEAD)
  --json                         JSON 출력
  --rules TG001,TG004            특정 규칙만 실행
  --message-file <path>          Test-Guard-Approved 트레일러 읽기 (commit-msg 훅)
  --summary <file>               Markdown 보고서 추가 (GitHub Job Summary)

test-guard install --pre-commit                 commit-msg 훅 설치
test-guard install --agent <claude-code|codex>  에이전트 훅 설치 (diff를 보여주고 확인, --yes로 생략)
```

종료 코드: `0` 위반 없음, `1` 위반 있음, `2` 실행 오류.

```
test-guard 0.1.0 · compare: working tree ↔ HEAD · 37 test files

  ERROR   TG004  src/user.test.ts:42   added `it.skip`
  ERROR   TG003  src/order.test.ts     assertions 18 → 15

2 violations · Fix the implementation instead of weakening tests.
```

## 설정

저장소 루트의 `.test-guard.json` (선택):

```json
{
  "languages": ["js", "python", "java"],
  "include": ["e2e/**/*.ts"],
  "exclude": ["**/fixtures/**"],
  "rules": { "TG003": "warn", "TG007": "off" }
}
```

- `include`는 테스트 파일 패턴을 추가합니다. 언어는 확장자로 정합니다.
- `rules`는 규칙별로 `error`, `warn`, `off`를 정합니다. error만 실패로 처리됩니다.
- 설정은 **커밋된 쪽**(HEAD, CI에서는 merge-base)에서 읽습니다. 변경 자체가 자기 검사를
  느슨하게 만들 수 없도록 하기 위해서입니다. 설정 변경은 먼저 커밋하세요.

## 의도적인 변경 승인

정말로 테스트를 없애야 할 때도 있습니다. 승인은 사람만 할 수 있습니다.

- **커밋**: 커밋 메시지에 트레일러를 추가합니다. commit-msg 훅이 위반 내용을 보여주되
  커밋은 통과시킵니다.
  ```
  Test-Guard-Approved: api.test.ts의 새 계약 테스트로 대체
  ```
- **PR**: `test-guard:approved` 라벨을 붙입니다. 에이전트도 트레일러를 쓸 수 있으므로
  CI는 트레일러를 믿지 않습니다.

## 에이전트

### Claude Code

`install --agent claude-code`는 `.claude/settings.json`에 훅을 추가합니다.

- **PreToolUse** (`Edit`, `Write`, `Bash`, `PowerShell`): 편집을 메모리에서 미리 적용해
  실행 전에 판정합니다. 테스트 파일을 지우거나 옮기는 셸 명령, test-guard 우회 명령도 막습니다.
- **Stop**: Claude가 작업을 마치기 전에 작업 트리를 HEAD와 비교합니다. 한 번 막고,
  그래도 Claude가 끝내려 하면 사용자에게 알림만 보냅니다. 사람이 의도적으로 한 변경 때문에
  세션이 붙잡히지 않게 하기 위해서입니다.

로컬 설치가 있으면 훅이 `node`로 바로 실행됩니다(Windows 기준 호출당 약 0.15~0.2초).
없으면 `npx`로 실행되어 약 1초가 더 걸립니다.

### Codex

`install --agent codex`는 셸 명령과 `apply_patch` 편집에 대한 같은 훅을
`.codex/hooks.json`에 추가합니다. Codex는 프로젝트 훅을 신뢰한 뒤에만 실행합니다.
Codex에서 `/hooks`를 열어 신뢰하세요.

Windows에서는 Codex 훅이 `npx`로 실행됩니다(호출당 약 0.7~0.9초). 더 빠른 방식이 Codex
안에서 안정적으로 동작하지 않았기 때문입니다. macOS와 Linux는 `node`로 바로 실행됩니다.

다른 에이전트는 commit-msg 훅과 GitHub Action을 사용하세요.

## 다른 git 훅 관리 도구

test-guard는 pre-commit이 아니라 **commit-msg** 단계에서 실행됩니다. git은 pre-commit 훅이
실패하면 커밋 메시지가 만들어지기 전에 멈추므로, 승인 트레일러를 읽을 수 없기 때문입니다.

**husky** (`.husky/commit-msg`):

```sh
npx --no-install test-guard check --staged --message-file "$1"
```

**lefthook** (`lefthook.yml`):

```yaml
commit-msg:
  commands:
    test-guard:
      run: npx --no-install test-guard check --staged --message-file {1}
```

**pre-commit** (`.pre-commit-config.yaml` 작성 후 `pre-commit install --hook-type commit-msg`):

```yaml
repos:
  - repo: local
    hooks:
      - id: test-guard
        name: test-guard
        entry: npx --no-install test-guard check --staged --message-file
        language: system
        stages: [commit-msg]
        always_run: true
```

## 할 수 없는 것

- **샌드박스가 아니라 가드레일입니다.** 훅은 명백한 지름길을 막습니다. 셸 권한을 가진 에이전트가
  의도적으로 우회하는 것까지 로컬에서 완벽히 막을 수는 없습니다. 그래서 사람만 승인할 수 있는
  CI가 최종 관문입니다.
- **AST가 아니라 정규식입니다.** 주석과 문자열 내용은 무시하지만, 특이한 문법은 잘못 셀 수
  있습니다. 테스트를 다른 파일로 옮기면 원래 파일에서는 감소로 보고됩니다.
- **셸 내부 편집**(`sed -i`, `node -e`, 스크립트)은 실행 전에 내용을 알 수 없어서, Stop·커밋·CI
  단계에서 잡힙니다.
- **아직 지원하지 않음**: C#, Go, Rust, node:test의 옵션 형태 skip(`{ skip: true }`), 다른 에이전트.

## 라이선스

MIT
