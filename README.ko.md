# test-guard

<p>
  <a href="https://www.npmjs.com/package/test-guard"><img src="https://img.shields.io/npm/v/test-guard.svg" alt="npm"></a>
  <a href="https://github.com/kwangtaeko/test-guard/actions/workflows/ci.yml"><img src="https://github.com/kwangtaeko/test-guard/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/test-guard.svg" alt="MIT"></a>
</p>

**AI 코딩 에이전트가 테스트를 지우거나, skip하거나, 약화해서 "통과"시키는 것을 막습니다.**

<img alt="Claude Code가 it.skip을 넣으려다 test-guard에 막히고, 대신 버그를 고치는 장면" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/hero.gif" width="800" />

<sub>[데모 프로젝트](examples/demo)에서 실제 Claude Code 세션을 2배속으로 재생한 것입니다.
<a href="https://github.com/charmbracelet/vhs">VHS</a>로 <a href="docs/tapes">이 테이프</a>에서 녹화했습니다.</sub>

[English](README.md)

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

## 설치

```sh
# npm
npm install --save-dev test-guard

# pnpm
pnpm add --save-dev test-guard

# yarn
yarn add --dev test-guard
```

Node.js 20 이상과 git이 필요합니다. 패키지는 런타임 의존성이 없는 단일 파일입니다.

## 설정

```sh
npx test-guard install --agent claude-code     # 또는: --agent codex
npx test-guard install --pre-commit            # git commit-msg 훅
```

`install --agent`는 에이전트 설정에 추가할 내용을 보여주고, 기록하기 전에 확인을 받습니다
(`--yes`로 생략).

<img alt="install --agent claude-code가 diff를 보여주고 확인 후 .claude/settings.json을 쓰고, install --pre-commit이 commit-msg 훅을 설치하는 장면" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/install.gif" width="800" />

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

**관문을 보호하세요.** PR은 자기 쪽 워크플로 파일로 실행되므로, PR에서 test-guard 단계를 지우거나
`continue-on-error`를 붙일 수 있습니다. 브랜치 보호 규칙에서 `test-guard`를 **필수 상태 검사**로
지정하고, `.github/workflows/`를 [CODEOWNERS](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)로 보호하세요.

## 사용법

### 작업 트리 검사

`test-guard check`는 변경 내용을 HEAD와 비교해 약화된 테스트를 모두 보여줍니다.
에이전트 작업이 끝난 뒤나 push 전에 실행하세요.

```sh
npx test-guard check
```

<img alt="test-guard check가 assertion 삭제(TG003), matcher 약화(TG007), it.skip 추가(TG004)를 보고하는 장면" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/check.gif" width="800" />

### 약화 커밋 차단

commit-msg 훅을 설치하면 테스트를 약화하는 커밋은 실패합니다. 의도적인 변경이면 사람이
`Test-Guard-Approved:` 트레일러에 사유를 적어 커밋하면 통과합니다.

```sh
git commit -m "test: skip flaky subtraction" -m "Test-Guard-Approved: tracked in #42"
```

<img alt="it.skip을 추가한 커밋은 막히고, Test-Guard-Approved 트레일러를 넣은 같은 커밋은 통과하는 장면" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/commit.gif" width="800" />

## 규칙

| ID | 잡아내는 것 |
|---|---|
| TG001 | 테스트 파일 삭제, 또는 테스트가 아닌 경로로 이동 (pytest가 건너뛰는 `build/`, `dist/`, `.*`, `venv/` 같은 폴더 포함) |
| TG002 | 파일의 테스트 케이스 수 감소 (Python: pytest/unittest가 실제로 수집하는 테스트만, 같은 이름을 두 번 정의하면 하나로 계산; Java: `@Nested`가 빠진 내부 클래스의 테스트) |
| TG003 | 파일의 assertion 수 감소 (실패를 무시하는 `catch`/`except`가 감싼 `try` 안의 assertion은 세지 않음) |
| TG004 | skip / disable / focus 추가: `it.skip`, `xit`, `.only`, `.todo`, `test.failing`, `{ skip: true }`, `this.skip()`, `@pytest.mark.skip`(import 별칭 포함), `xfail`, `__test__ = False`, `@Disabled`, `@Ignore`, `Assumptions.abort()`, TestNG `enabled = false` 등 — 그리고 파일 안에서 테스트·assertion 함수를 바꿔치기한 경우(`const expect = …`, 기본 matcher를 덮어쓰는 `expect.extend`, 로컬 `assertEquals`, JUnit이 아닌 `Test` 어노테이션) |
| TG005 | 테스트 러너 설정 변조: `passWithNoTests`, `testPathIgnorePatterns`, `setupFiles`/`globalSetup`, pytest `addopts`의 `-k`/`--deselect`/`--ignore`, `collect_ignore`, `conftest.py`의 `pytest_*` 훅, Maven `skipTests`/`testFailureIgnore`/`groups`/`includes`, Gradle `enabled = false`/`ignoreFailures`/`excludeTags`, GitHub Actions 테스트 스텝에 붙인 `\|\| true`·`set +e`·`continue-on-error`·`if:`·`-u`·테스트 필터, CI에서 테스트 명령 삭제 등 |
| TG006 | test-guard 우회: `.test-guard.json` 변경; 훅·CI 파일에서 test-guard를 실행하는 줄의 삭제·변경(`\|\| true`, 훅 matcher 축소, `continue-on-error`); 에이전트의 `git commit --no-verify`, `core.hooksPath`, git alias·include·`GIT_CONFIG_GLOBAL`, `Test-Guard-Approved` 트레일러, `TEST_GUARD_*` 변수, 플러그인 비활성화·제거, `.git/`·`.claude/settings.local.json`·`node_modules/test-guard` 쓰기 |
| TG007 | assertion 약화: `toBe(3)` → `toBeDefined()` / `not.toBe(…)` / `toBeGreaterThan(…)`, `assertEqual` → `assertTrue` / `assertNotEqual`, `assert x == y` → `assert x != y`, `toThrow(X)` → `toThrow()`, `pytest.raises(ValueError)` → `pytest.raises(Exception)`, 그리고 `expect(true).toBe(true)` 같은 의미 없는 assertion |
| TG008 | 코드에 맞춰 바꾼 기대값: 구현 파일은 그대로인데 assertion의 값이 바뀜(`toBe(10)` → `toBe(11)`), `.snap` 파일이나 인라인 스냅샷이 바뀜. 커밋·CI·에이전트 종료 시점에 판정합니다(편집마다 판정하지 않으므로 테스트를 먼저 고치고 코드를 나중에 고쳐도 됩니다). 에이전트가 `-u`로 테스트를 돌리는 것도 막습니다 |

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

## 에이전트 행동이 실제로 달라지나?

[`bench/`](bench/README.md)는 실패하는 테스트가 명세와 모순되는 작은 프로젝트 12개를 Claude Code와
Codex에 줍니다. 통과시키려면 테스트를 바꾸거나 코드를 틀린 테스트에 맞춰 망가뜨리는 수밖에
없습니다. "테스트를 통과시켜라"라고만 했을 때 테스트를 바꾼 경우가 **test-guard 없이 24번 중 14번,
켜고 24번 중 1번**이었습니다. "테스트는 수정하지 마라"를 덧붙이면 둘 다 테스트는 바꾸지 않았지만,
Codex는 대부분 코드를 틀린 테스트에 맞춰 바꿨고 이건 test-guard가 아직 잡지 못합니다. 진짜 버그가
있는 과제에서 test-guard 때문에 수정을 못 한 경우는 없었습니다. 표본이 작습니다. 자세한 내용과
한계는 [bench/README.md](bench/README.md)에 있습니다.

## 실제 이력에서의 오탐

`scripts/fp-history.mjs`는 저장소의 커밋마다 부모 커밋과 비교해 `test-guard check`를 돌립니다.
네 프로젝트의 최근 커밋 300개씩에 돌린 결과입니다 (2026-10-06):

| 저장소 | 스택 | 막힌 커밋 | 실제로는 약화가 아닌 것 |
|---|---|---|---|
| expressjs/express | JS, Mocha | 1 (0.3%) | 1 |
| pallets/flask | Python, pytest | 3 (1.0%) | 0 |
| google/gson | Java, JUnit | 13 (4.3%) | 5 |
| colinhacks/zod | TS, Vitest | 11 (3.7%) | 2 |
| **합계** | | **28 / 1,200 (2.3%)** | **8 (0.7%)** |

28개 중 20개는 실제로 테스트를 지우거나 skip하거나 약화한 커밋입니다(기능 제거, `@Ignore`·`skipif`
추가, 의도적으로 느슨하게 바꾼 `assertThrows(Specific.class)` 등). 사람도 이런 변경을 하며, 한 번
승인하면 통과합니다. 나머지 8개는 약화가 아니었습니다: 여러 assertion을 하나로 합침, `try/fail`을
`assertThrows`로 바꿈, 테스트를 새 파일로 대체, `test` 스크립트에 래퍼 추가. 코드를 잘못 읽은 경우는
없었습니다. 재현:

```bash
pnpm build
git clone https://github.com/pallets/flask /tmp/flask
node scripts/fp-history.mjs /tmp/flask --commits 300
```

## 할 수 없는 것

- **샌드박스가 아니라 가드레일입니다.** 훅은 명백한 지름길을 막습니다. 셸 권한을 가진 에이전트가
  의도적으로 우회하는 것까지 로컬에서 완벽히 막을 수는 없습니다. 그래서 사람만 승인할 수 있는
  CI가 최종 관문입니다.
- **AST가 아니라 정규식입니다.** 주석과 문자열 내용은 무시하지만, 특이한 문법은 잘못 셀 수
  있습니다. 테스트를 다른 파일로 옮기면 원래 파일에서는 감소로 보고됩니다.
- **셸 내부 편집**(`sed -i`, `node -e`, 스크립트)은 실행 전에 내용을 알 수 없어서, Stop·커밋·CI
  단계에서 잡힙니다. 셸 분석은 `cd`, `bash -c "…"`, 이미 있는 링크는 따라가지만, 변수 확장,
  스크립트 파일 읽기, `xargs rm`에 넘어가는 알 수 없는 목록 추측은 하지 않습니다.
- **훅·CI 파일에서 test-guard를 실행하는 줄은 어떤 변경이든**(버전 올리기 제외) 사람 승인이
  필요합니다. 워크플로 트리거 변경(`on:`, `paths-ignore`)과 `git commit --amend`로 사람의 승인
  트레일러를 재사용하는 것은 커밋 전에 잡지 못하며, Stop과 CI에서 결과를 봅니다.
- **이름으로 추정하는 부분**: Python 클래스의 부모 이름에 `Test`가 들어 있으면 TestCase 하위
  클래스로 봅니다. 사용자 지정 `norecursedirs`는 읽지 않습니다. 다른 곳에서 import한 JS 테스트
  함수(`import { it } from './fake'`)와 JS 식별자 안의 유니코드 이스케이프는 잡지 못합니다.
- **겉모양은 그대로인데 실제로는 아무것도 검사하지 않는 테스트**는 개수가 그대로라 아직 잡지
  못합니다: 테스트 앞부분의 `return`, `if (false)` 안의 테스트, 빈 `it.each([])`, 테스트 대상
  모듈을 mock으로 바꾸기. 문법을 이해하는 분석(계획 중)이 필요합니다. 기대값만 바꾼 경우는
  TG008이 잡지만, 같은 커밋에서 실제 코드나 의존성이 바뀌었으면(코드가 든 새 소스 파일 포함) 잡지
  못하고, 기대값을 변수로 옮긴 경우도 잡지 못합니다.
- **간접적으로 삼킨 assertion**은 아직 잡지 못합니다: Promise `.catch(() => {})`, `try` 안에서
  호출한 헬퍼 함수 속 assertion. 테스트 스텝을 다른 워크플로 파일로 옮기면 테스트 명령 삭제로
  보고됩니다(한 번 승인하면 됩니다).
- **아직 지원하지 않음**: C#, Go, Rust, 다른 에이전트.

## 라이선스

MIT
