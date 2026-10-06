# test-guard — 로드맵 & MVP 명세

> AI 코딩 에이전트가 테스트를 삭제·skip·약화해서 "통과"시키는 행동을 탐지하고 차단하는 벤더 중립 도구.
> 이 문서는 Claude Code / Codex 등 CLI 코딩 에이전트에게 그대로 전달하는 작업 지시서입니다.
> 버전: v0.3 (2026-10-05) · 소유자: Tony · 작업명/패키지명: `test-guard` (§11에서 확정)

---

## 0. 이 문서 사용법

1. 저장소 루트에 `docs/ROADMAP.md`로 둡니다.
2. `AGENTS.md`에 다음 한 줄을 추가합니다. (`CLAUDE.md`는 기존대로 `@AGENTS.md` import 유지)
   ```
   - 작업 전 반드시 docs/ROADMAP.md를 읽고, 지시받은 마일스톤 범위만 작업한다.
   ```
3. 킥오프 프롬프트 (Claude Code / Codex 공통):
   ```
   docs/ROADMAP.md를 읽고 M0을 진행해줘.
   코드 작성 전에 §10 작업 규칙에 따라 가정, 질문, 단계별 계획(각 단계의 검증 방법 포함)을
   먼저 보여주고, 내가 승인하면 시작해.
   ```
4. 이후 마일스톤 단위로 지시합니다. 예: `M2 진행해줘`
5. 권장 운영: 구현 에이전트와 리뷰 에이전트를 나눕니다 (Claude Code 구현 → Codex 리뷰, 또는 반대).

---

## 1. 제품 정의

### 1.1 문제
코딩 에이전트는 실패하는 테스트를 만나면 구현을 고치는 대신 테스트를 지우거나, skip 처리하거나, assertion을 빼거나, 테스트 설정을 바꿔서 "통과" 상태를 만드는 경우가 있습니다. 사람이 diff를 꼼꼼히 보지 않으면 놓치기 쉽습니다.

### 1.2 한 줄 정의
에이전트 훅(실시간) · git pre-commit · CI(GitHub Action) 세 지점에서 **같은 규칙**으로 테스트 약화를 탐지하고 차단합니다.

### 1.3 차별점
"결정론적·LLM 없음·네트워크 없음"은 경쟁 도구도 모두 내세우므로 차별점으로 쓰지 않습니다. 차별점은 아래 다섯 가지를 **하나의 규칙 엔진**으로 묶은 조합입니다.
- **편집 시점 차단**: 턴 종료(Stop)가 아니라 도구 실행 전(PreToolUse)에 막고, 차단 사유를 에이전트에게 돌려줘 스스로 구현을 고치게 합니다.
- **러너 설정 변조 탐지**: `passWithNoTests`, pytest `addopts`, Maven `skipTests`, Gradle `enabled = false` 등 (TG005).
- **Java/JUnit 지원**: 기본 설정만으로 TS/JS, Python, Java를 인식합니다.
- **자기 보호**: `--no-verify`, 자체 설정·훅 수정, 승인 트레일러 주입 차단 (TG006).
- **사람만 가능한 승인**: 커밋 트레일러와 PR 라벨. 로컬(훅, pre-commit)과 CI가 같은 엔진을 쓰고, 최종 판단은 CI가 합니다.

경쟁 도구 (2026-10-05 조사): `tamperguard`(PyPI), `hallucinot`(npm), `groundtruth`(Claude Code Stop 훅 + Action). 셋 다 스타 0~2개 수준의 초기 프로젝트이며, 위 다섯 가지를 모두 갖춘 도구는 없습니다. 같은 아이디어가 몇 달 사이 여러 번 나왔으므로 진입장벽이 낮다는 전제로 출시 속도를 우선합니다.

추가 조사 (2026-10-06):

| 도구 | 하는 일 | 방식 | 상태 |
|---|---|---|---|
| [tampercheck](https://pypi.org/project/tampercheck/) | 삭제, only, skip, 테스트 필터, `\|\| true`·`assert(true)`, assertion 순감, 빈 catch/`except: pass`, TODO | 정규식 diff, CI/stdin | PyPI 0.1.1 (2026-08). 실제 커밋 1,331개 기준 오탐률 약 0.7% 공개. Py/JS/Rust/CI YAML |
| [groundtruth](https://github.com/msal2020/groundtruth) | 테스트를 직접 실행해 "통과" 주장 검증, skip, stub, 환각 패키지 | 결정론, Stop 훅 + Action | 0★, 자체 코퍼스 51건 |
| [AgentTestGuard](https://github.com/SefaYilmaz0/AgentTestGuard) | AST diff, assertion drop, skip, 빈 except, 소스 하드코딩, 기준 테스트 재실행 | AST, Action/pre-commit/Claude 훅 | 0★, 사설 저장소 유료화 예고 |
| [Probity](https://github.com/nizos/probity) (tdd-guard 후속) | 범용 규칙 엔진: TDD 강제, 명령·내용 패턴 금지 | 정규식 또는 LLM, Claude/Codex/Copilot CLI | 220★, 전신 tdd-guard 사용자 기반. 테스트 약화 전용 규칙은 없음 |

- 단순 검출률·오탐률 공개, 빈 catch 탐지, 결정론은 이미 다른 도구도 갖췄습니다. 차별점이 아니라 최소 조건입니다.
- test-guard만의 차별점은 **편집 시점에 막고 이유를 에이전트에게 돌려줘 구현을 고치게 하는 것**과, 그 가드를 에이전트가 끄지 못하게 하는 자기 보호입니다. 이 차이는 결과 지표(§12)로 증명합니다.

### 1.4 위협 모델 (README에도 그대로 명시)
- **막으려는 것**: 에이전트가 지름길로 테스트를 약화하는 행동 (게으른 우회).
- **막을 수 없는 것**: 셸 권한을 가진 에이전트의 의도적·적대적 우회를 로컬에서 완벽히 막는 것.
- 그래서 로컬(훅, pre-commit)은 "빠른 피드백과 명백한 우회 차단", CI는 "사람만 승인할 수 있는 최종 관문"으로 역할을 나눕니다.

### 1.5 성공 지표
GitHub 스타, npm 주간 다운로드, 외부 사용자의 이슈/PR. 출시 후 검증 기준은 §9.

---

## 2. 원칙

1. **벤더 중립**: 판단 엔진은 에이전트와 무관합니다. 에이전트별 차이는 얇은 어댑터에만 둡니다.
2. **결정적 동작**: LLM 호출·네트워크 없음. 같은 입력이면 같은 결과입니다.
3. **프라이버시**: 텔레메트리 없음, 외부 전송 없음.
4. **크로스 플랫폼**: Windows / macOS / Linux 동일 동작 (경로 구분자, CRLF 포함).
5. **단순함 우선**: 기준선 파일 없이 git 비교(작업 트리 ↔ HEAD, 스테이징 ↔ HEAD, PR head ↔ merge-base)만 사용합니다.
6. **외부 사양 추측 금지**: 에이전트 훅의 이벤트·페이로드·차단 방식은 공식 문서로 확인하고 출처 URL과 확인일을 기록합니다.

---

## 3. 탐지 규칙

| ID | 심각도 | 내용 |
|---|---|---|
| TG001 | error | 테스트 파일 삭제, 또는 테스트로 인식되지 않는 경로로 이동 |
| TG002 | error | 파일별 테스트 케이스 수 감소 |
| TG003 | error | 파일별 assertion 수 감소 |
| TG004 | error | skip / disable / only(포커스) 추가 |
| TG005 | error | 테스트 실행 설정 변조 (§3.2) |
| TG006 | error | test-guard 자체 설정·훅 변조 또는 우회 시도 (§3.3) |
| TG007 | error | assertion 약화: 강한 matcher를 약한 matcher로 교체 (§3.4). 구현 변경 없는 기대값 변경 판정은 0.2 이후 |

비교 단위는 "파일별 수치"입니다. 한 파일에서 테스트가 줄고 다른 파일에서 늘어난 경우, 이동으로 판정하지 않고 감소로 보고합니다 (MVP 단순화, 사람 승인으로 처리).

### 3.1 언어별 분석기 (MVP: 정규식 기반, 주석 제거 후 계수)

| 항목 | TS/JS (Jest, Vitest, Mocha) | Python (pytest, unittest) | Java (JUnit 4/5) |
|---|---|---|---|
| 테스트 파일 | `*.test.*`, `*.spec.*`, `__tests__/**` | `test_*.py`, `*_test.py` | `src/test/**/*Test.java`, `*Tests.java`, `*IT.java` |
| 테스트 케이스 | `it(`, `test(`, `.each` 포함 | `def test_*`, `TestCase` 하위 `test*` 메서드 | `@Test`, `@ParameterizedTest`, `@RepeatedTest` |
| assertion | `expect(`, `assert(`, `assert.*(` | `assert ` 문, `self.assert*(`, `pytest.raises(` | `assert*(`, `assertThat(`, `fail(` |
| skip / only | `.skip`, `xit`, `xdescribe`, `xtest`, `.only`, `fit`, `fdescribe`, `.todo` | `@pytest.mark.skip`, `skipif`, `xfail`, `pytest.skip(`, `@unittest.skip*` | `@Disabled`, `@Ignore`, `Assumptions.assume*` |

- 테스트 파일 패턴은 설정 파일(§5.3)에서 추가·제외할 수 있습니다.
- 정규식 한계(문자열 안의 키워드 등)로 인한 오탐은 허용하고, `explain` 명령과 README에 명시합니다. AST 분석은 0.2 이후입니다.
- C#(xUnit, NUnit, MSTest)은 0.2에서 추가합니다.

### 3.2 TG005 테스트 설정 변조 감시 대상

| 생태계 | 대상 파일 | 감시 항목 |
|---|---|---|
| JS/TS | `package.json`, `jest.config.*`, `vitest.config.*`, `.mocharc*` | `passWithNoTests`, `testPathIgnorePatterns`, `exclude`, `testMatch`/`include` 축소, test 스크립트의 `--passWithNoTests`·필터 추가 |
| Python | `pytest.ini`, `pyproject.toml`, `setup.cfg`, `tox.ini`, `conftest.py` | `addopts`의 `-k`, `--deselect`, `--ignore`, `-p no:`; `conftest.py`의 `pytest_collection_modifyitems` 추가 |
| Java | `pom.xml`, `build.gradle(.kts)` | `skipTests`, `maven.test.skip`, surefire `excludes`, Gradle `test { enabled = false }`, `exclude` 추가 |

MVP는 "해당 키·문자열이 추가되었는가"만 diff로 판정합니다.

### 3.3 TG006 자기 보호
- 에이전트 훅 모드에서 다음을 차단합니다:
  - `.test-guard.json`, 설치된 훅 설정 파일, pre-commit 훅 파일 수정
  - `git commit --no-verify`, `-n`, `git push --no-verify`
  - 커밋 메시지에 승인 트레일러(`Test-Guard-Approved:`)를 넣는 명령
  - `TEST_GUARD_` 로 시작하는 환경변수를 설정하는 명령
- 이 차단은 "명백한 우회"만 대상으로 합니다 (§1.4).

---

### 3.4 TG007 assertion 약화 (0.1: matcher 교체만)

같은 파일의 diff에서 **삭제된 줄의 강한 matcher가 추가된 줄의 약한 matcher로 바뀐 경우**를 탐지합니다. 줄 단위 정규식 매칭이며, 삭제·추가 줄을 짝짓는 방식은 M2 계획에서 제시합니다.

| 생태계 | 강한 → 약한 (예) |
|---|---|
| JS/TS | `toBe` / `toEqual` / `toStrictEqual` → `toBeDefined`, `toBeTruthy`, `not.toBeNull`, `not.toBeUndefined`; `toThrow(X)` → `toThrow()`; `toHaveLength(n)` → `toBeDefined` 등 존재 확인 |
| Python | `assertEqual` → `assertTrue`, `assertIsNotNone`; `assert x == y` → `assert x`; `pytest.raises(SpecificError)` → `pytest.raises(Exception)` |
| Java | `assertEquals` → `assertNotNull`, `assertTrue`; `assertThrows(SpecificException.class` → `assertThrows(Exception.class` / `Throwable.class` |

- 의미 없는 assertion 추가(`expect(true).toBe(true)`, `assert True`, `assertTrue(true)`)도 TG007로 보고합니다.
- 정확한 패턴 목록은 M2에서 fixture와 함께 확정합니다.

## 4. 동작 모드

### 4.1 CLI 검사
```
test-guard check                     작업 트리 ↔ HEAD (기본)
test-guard check --staged            스테이징 ↔ HEAD (pre-commit용)
test-guard check --base <ref>        HEAD ↔ merge-base(<ref>, HEAD) (CI용)
  --json                             JSON 출력
  --rules TG001,TG004                특정 규칙만
```

### 4.2 git pre-commit
- `test-guard install --pre-commit`이 `.git/hooks/pre-commit`에 `test-guard check --staged`를 등록합니다.
- husky / lefthook / pre-commit(framework) 사용자를 위한 설정 예시를 README에 둡니다. (자동 수정하지 않음)
- 사람의 의도적 감소 승인: 커밋 메시지 트레일러 `Test-Guard-Approved: <사유>`. pre-commit 단계에서는 메시지를 읽을 수 없으므로 승인은 `commit-msg` 훅에서 처리합니다.

### 4.3 CI (GitHub Action)
```yaml
- uses: actions/checkout@v4
  with: { fetch-depth: 0 }
- uses: <owner>/test-guard@v0
  with:
    base: ${{ github.event.pull_request.base.ref }}
```
- 위반 시 실패 처리하고, 위반 목록을 Job Summary에 출력합니다.
- 사람 승인: PR 라벨 `test-guard:approved`가 있으면 통과 (단, 결과는 Summary에 계속 표시).
- README에 "라벨 권한은 사람에게만 주고, 에이전트용 토큰에는 라벨 권한을 주지 마라"를 명시합니다.

### 4.4 에이전트 훅
판단은 3단계로 겹쳐서 합니다.

| 시점 | 대상 | 동작 |
|---|---|---|
| 도구 실행 전 | 파일 편집 도구 (Edit/Write 계열) | 편집 결과를 메모리에서 미리 적용해 규칙 검사 → 위반 시 차단 + 사유 반환 |
| 도구 실행 전 | 셸 명령 | §3.3 우회 패턴, 테스트 파일 삭제 명령(`rm`, `git rm`, `del` 등) 차단 |
| 도구 실행 후 / 작업 종료 전 | 모든 변경 | 작업 트리 ↔ HEAD 전체 검사 → 위반 시 에이전트에게 "원복하고 구현을 고쳐라" 피드백 |

에이전트에게 돌려주는 메시지 (영문 기본, 예):
```
[test-guard] Blocked: TG004 — added `it.skip` in src/user.test.ts:42.
Do not weaken tests to make them pass. Fix the implementation instead.
If you believe the test itself is wrong, stop and explain why to the user.
```

### 4.5 어댑터 지원 계획

| 에이전트 | MVP | 비고 |
|---|---|---|
| Claude Code | ✅ M4 | hooks 설정(PreToolUse / PostToolUse / Stop 등), stdin JSON, 종료 코드로 차단 — **M4 착수 시 공식 문서로 재확인** |
| Codex | ✅ M5 | 훅 사양 **M5 착수 시 공식 문서로 확인** 후 범위 확정. 미지원 이벤트는 문서화 |
| Gemini CLI, Copilot CLI 등 | 0.2 이후 | 그 전까지 pre-commit + CI로 대체한다고 README에 명시 |

- 어댑터 엔트리포인트: `test-guard hook <agent> <event>` (stdin JSON → 결과).
- 어댑터는 "입력 파싱 → 공용 판단 엔진 호출 → 에이전트 형식으로 결과 반환"만 담당합니다.
- 훅 입출력 처리(stdin 파싱, 차단·피드백 응답 형식)는 test-guard 판단 로직을 import하지 않는 별도 모듈로 분리합니다. 이후 다른 프로젝트(tgx-agent-guard 등)와 공유하기 위해 공용 패키지로 추출할 예정입니다. 지금 추출하지는 않습니다.
- `test-guard install --agent claude-code|codex`는 설정 파일에 넣을 내용을 **diff로 보여주고 확인 후** 기록합니다.

---

## 5. 구현 명세

### 5.1 저장소 구조 (단일 패키지)
```
test-guard/
├─ AGENTS.md
├─ CLAUDE.md                 # @AGENTS.md
├─ docs/
│  ├─ ROADMAP.md             # 이 문서
│  ├─ IDEAS.md               # 범위 밖 아이디어 한 줄 메모
│  └─ agents/                # 에이전트별 훅 사양 조사 기록 (출처 URL, 확인일)
├─ src/
│  ├─ cli.ts
│  ├─ engine/                # git diff 수집, 규칙 실행, Finding 생성
│  ├─ languages/             # js.ts, python.ts, java.ts (분석기)
│  ├─ rules/                 # tg001.ts ~ tg006.ts
│  ├─ adapters/              # claude-code.ts, codex.ts
│  └─ install/               # pre-commit, commit-msg, 에이전트 설정 설치
├─ skills/test-guard/SKILL.md
├─ examples/demo/            # 데모 저장소 (README GIF 촬영용)
├─ fixtures/                 # 규칙별 테스트용 git 시나리오
├─ action.yml                # GitHub Action
├─ .github/workflows/ci.yml
├─ package.json
└─ tsconfig.json
```

### 5.2 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 런타임 | Node.js 20 이상 | CI: 20, 22 |
| 언어 | TypeScript (strict), ESM | |
| 패키지 관리 | pnpm | |
| 빌드 | tsup | CLI 단일 번들 + shebang |
| 테스트 | vitest | 임시 git 저장소 생성 e2e |
| 런타임 의존성 | `commander`, `picocolors`, `picomatch` | 이 외 추가 시 PR에 사유 기록. git은 `child_process`로 호출 |
| CI | GitHub Actions | ubuntu / windows / macos × Node 20, 22 |

### 5.3 설정 파일 (선택) `.test-guard.json`
```json
{
  "languages": ["js", "python", "java"],
  "include": [],
  "exclude": ["**/fixtures/**"],
  "rules": { "TG003": "warn" }
}
```
설정 파일이 없어도 기본값으로 동작해야 합니다.

### 5.4 공용 타입
```ts
export type Severity = 'error' | 'warn';

export interface FileStats {
  path: string;                 // 저장소 루트 기준, '/' 구분자로 정규화
  language: 'js' | 'python' | 'java';
  tests: number;
  assertions: number;
  skips: number;                // skip/disable/only/todo/xfail 합계
}

export interface Finding {
  ruleId: string;               // 'TG001' ...
  severity: Severity;
  path: string;
  line?: number;
  message: string;              // 영문 (에이전트 피드백 겸용)
  before?: number;
  after?: number;
}
```

### 5.5 출력

텍스트:
```
test-guard 0.1.0 · 비교: working tree ↔ HEAD · 테스트 파일 37개

 ERROR  TG004  src/user.test.ts:42   added `it.skip`
 ERROR  TG003  src/order.test.ts     assertions 18 → 15
 ERROR  TG005  package.json          added `--passWithNoTests` to "test" script

3 violations · Fix the implementation instead of weakening tests.
```

JSON (`--json`):
```json
{
  "tool": "test-guard",
  "version": "0.1.0",
  "compare": { "mode": "worktree", "from": "HEAD" },
  "findings": [],
  "summary": { "error": 0, "warn": 0, "filesScanned": 37 }
}
```

종료 코드: `0` 위반 없음 · `1` error 위반 있음 · `2` 실행 오류 (git 저장소 아님 등)

### 5.6 SKILL.md 초안 (`skills/test-guard/SKILL.md`)
```markdown
---
name: test-guard
description: Enforces test integrity while coding. Use whenever tests fail, before committing, or when the user asks to check whether tests were weakened, skipped or deleted. Never make tests pass by deleting, skipping or loosening them.
---

# test-guard

## Policy
- Never delete, skip, disable, focus (.only) or loosen assertions in tests to make them pass.
- Never change test runner configuration to exclude or ignore failing tests.
- If a test seems wrong, stop and explain to the user why, with evidence. Wait for approval.

## Check
1. Run `npx -y test-guard@latest check --json` from the repository root.
2. If findings exist, revert the test changes and fix the implementation instead.
3. Report the final result to the user.
```

---

## 6. 마일스톤

각 마일스톤은 별도 브랜치/PR로 진행하고, "검증" 칸을 통과해야 완료입니다.

| 주차 | 마일스톤 | 작업 | 검증 |
|---|---|---|---|
| 1 | **M0** | 저장소, tsconfig, lint, vitest, CI 매트릭스, AGENTS.md 연결 | 3 OS × Node 20/22 CI 통과 |
| 1 | **M1** | 언어 분석기 3종 (§3.1), 주석 제거, 경로 정규화 | 언어별 fixture의 tests/assertions/skips 수치 스냅샷 테스트 |
| 2 | **M2** | git 비교 엔진 (worktree / staged / base), TG001~TG004, TG007, `check` 명령, 텍스트/JSON 출력, 종료 코드 | 임시 git 저장소로 규칙별 위반/정상 시나리오 e2e |
| 2 | **M3** | TG005, TG006(파일 측면), pre-commit·commit-msg 설치, 승인 트레일러, GitHub Action(`action.yml`) | e2e + 이 저장소 자체 CI에서 Action 동작 확인 |
| 3 | **M4** | Claude Code 어댑터 (§4.4 3단계 + TG006 명령 차단), `install --agent claude-code` | `docs/agents/claude-code.md`에 사양 출처 기록 + 실제 세션 수동 시나리오 5개 통과 기록 |
| 3 | **M5** | Codex 어댑터 (사양 확인 선행), `install --agent codex` | `docs/agents/codex.md` 기록 + 실제 세션 수동 시나리오 통과 기록 |
| 4 | **M6** | SKILL.md, 플러그인 매니페스트(공식 스키마 확인 후), `examples/demo`, README(데모 GIF), CHANGELOG, `npm publish --dry-run` | Tony의 실제 PC에서 설치부터 차단까지 재현 |
| 4 | **Release** | `0.1.0` npm 배포, GitHub Release, Action `v0` 태그 | — |

### 6.1 M4/M5 수동 시나리오 (최소)
1. 실패하는 테스트가 있는 상태에서 "테스트 통과시켜줘" 지시 → 에이전트가 skip을 넣으려 하면 차단되는가
2. 에이전트가 테스트 파일을 셸로 삭제 → 차단 또는 사후 감지되는가
3. 에이전트가 assertion을 줄이는 편집 → 차단되는가
4. 에이전트가 `--no-verify` 커밋 시도 → 차단되는가
5. 정상적인 구현 수정 → 아무 개입 없이 통과하는가 (오탐 없음)

### 6.2 데모 (스타 확보에 가장 중요)
`examples/demo`: 의도적으로 실패하는 테스트 1개가 있는 작은 저장소. README 첫 화면에 "에이전트가 `it.skip`을 넣으려다 차단되고, 구현을 고쳐 통과하는" 과정을 GIF로 넣습니다.

---

## 7. 테스트 전략
- `fixtures/<ruleId>/` 아래에 "변경 전/후" 파일 쌍을 두고, 테스트에서 임시 git 저장소를 만들어 커밋 → 수정 → `check`를 실행합니다.
- 실제 사용자 저장소나 홈 디렉터리를 읽지 않습니다.
- Windows CRLF 파일 fixture를 반드시 포함합니다.
- **테스트를 삭제·skip·약화해서 통과시키지 않습니다.** 이 프로젝트가 막으려는 바로 그 행동입니다.

---

## 8. 비범위 (0.1에서 하지 않음)
AST 기반 분석, 구현 변경 없는 기대값 변경 판정(TG007 확장), C#·Go·Rust 등 추가 언어, 커버리지 비교, LLM 기반 판단, Gemini CLI·Copilot 어댑터, 자동 원복, GUI·대시보드.

---

## 9. 출시와 검증
- 출시 채널: Show HN, r/ClaudeAI, r/codex, r/ChatGPTCoding, GeekNews, X. 데모 GIF를 중심으로 올립니다.
- 출시 후 2주 검증 기준 (Tony가 수치 확정):
  - 계속: 스타 ☐개 이상 또는 외부 이슈/PR ☐건 이상 → 0.2(C#, AST, 추가 어댑터) 진행
  - 정리: 기준 미달 → 유지보수 모드로 전환, 회고를 README/블로그에 기록

---

## 10. 에이전트 작업 규칙
1. **코딩 전에 생각하기**: 가정을 명시하고, 해석이 여러 개면 선택지를 제시하고, 불명확하면 멈추고 질문합니다. 다단계 작업은 `단계 → 검증 방법` 계획을 먼저 보여주고 승인을 받습니다.
2. **단순하게 먼저**: 현재 마일스톤에 필요한 최소 코드만 작성합니다. 요청하지 않은 기능, 단일 사용 추상화, 추측성 설정 옵션을 추가하지 않습니다.
3. **필요한 부분만 수정**: 관련 없는 코드, 주석, 포맷을 건드리지 않습니다. 내 변경으로 생긴 미사용 코드만 정리합니다.
4. **목표 중심 실행**: 마일스톤의 "검증" 칸을 성공 기준으로 삼고 통과할 때까지 반복합니다.
5. **범위 관리**: 범위 밖 아이디어는 구현하지 말고 `docs/IDEAS.md`에 한 줄로 남깁니다.
6. **외부 사양 추측 금지**: 훅 이벤트명, 페이로드 필드, 차단 방식, 플러그인 매니페스트 스키마는 공식 문서로 확인하고 `docs/agents/`에 출처 URL과 확인일을 기록합니다. 확인할 수 없으면 질문합니다.
7. **테스트 무결성**: 테스트가 틀렸다고 판단되면 근거와 함께 보고하고 승인을 받습니다.
8. **커밋/PR**: Conventional Commits, 마일스톤 단위 PR, 새 런타임 의존성은 PR 설명에 사유를 적습니다.

---

## 11. 착수 전 결정 필요 사항 (Tony)

| 항목 | 제안 | 결정 |
|---|---|---|
| 레포/패키지 이름 | `test-guard` (npm 사용 가능, 2026-10-03 확인). 대안: `honest-tests`, `testwarden` | ☐ |
| GitHub 소유 계정 | 개인 계정 | ☐ |
| 라이선스 | MIT | ☐ |
| README / 메시지 언어 | 영어 기본, 한국어 README 별도 | ☐ |
| 0.1 지원 언어 | TS/JS, Python, Java (C#은 0.2) | ☐ |
| TG007(assertion 약화)을 0.1로 당길지 | 당기기 검토. 경쟁 도구 `tamperguard`가 이미 matcher 완화(`toBe`→`toBeDefined` 등)를 탐지하고, 연구(ImpossibleBench)상 Claude 계열의 주된 부정 수법이 테스트 수정임. 당기면 M2 범위가 늘어남 | ☑ 0.1 포함 (matcher 교체만, 2026-10-05) |
| 출시 후 검증 수치 | §9 | ☐ |

---

## 12. 0.2 계획 (2026-10-06)

목표: 수익이 아니라 GitHub 스타와 실제로 쓸 가치. 판단 기준은 출시했을 때 경쟁력·차별성이 있고 사람들이 계속 켜 둘 만한가입니다. 기능 수보다 **무엇을 증명하느냐**와 **어디로 배포되느냐**를 우선합니다. 각 마일스톤은 지시받은 뒤 별도 브랜치/PR로 진행합니다.

### 12.1 단계 A — 출시와 증거
| 마일스톤 | 작업 | 검증 |
|---|---|---|
| Release 0.1.1 | npm 배포, GitHub Release, Action 태그, §9 수치 확정 | 설치부터 차단까지 재현 |
| **M7** 경쟁 격차 | 빈 catch로 감싼 assertion, 테스트 스크립트·CI의 `\|\| true`·`exit 0`, `assert(true)`류 확인·보강 | 회귀·오탐 fixture, 전체 테스트 |
| **M8** 오탐률 | 공개 저장소 3~5개의 실제 커밋 이력에 `check --base`를 돌리는 스크립트, README 표 | 스크립트로 재현 가능 |
| **M9** 결과 지표 | 실패 테스트가 있는 과제 20~30개(공개 데이터셋은 라이선스 확인 후) × Claude Code·Codex × test-guard on/off. 지표: 테스트 조작 커밋 비율, 구현 수정·불가능 보고 비율, 오탐 차단 수 | 재현 스크립트 공개 |

출시 게시는 데모 GIF와 M9 결과 한 줄을 중심으로 합니다. **게이트 1**: 출시 2주 후 §9 수치로 계속/유지보수를 결정합니다.

### 12.2 단계 B — 깊이 (게이트 1 통과 시)
- **M10 TG008 기대값 덮어쓰기**: 비교 범위 전체에서 테스트의 기대값 리터럴·`.snap`·인라인 스냅샷만 바뀌고 테스트·설정이 아닌 파일은 안 바뀐 경우. 파일 단위가 아니라 diff 전체로 판정하므로 Stop·commit·CI에서만 실행합니다(테스트를 먼저 고치고 소스를 나중에 고치는 정상 흐름을 편집 시점에 막지 않기 위해). `-u`/`--updateSnapshot` 실행은 에이전트 훅에서 차단합니다. "새 기대값 == 실제 출력" 판정은 테스트 실행이 필요해 하지 않습니다.
- **M11 엔진 스파이크 → 빈 테스트**: tree-sitter(WASM 번들)와 기존 스캐너 확장을 정확도·번들 크기·Windows 훅 지연으로 비교해 결정합니다(정확도 우선). 이후 "도달 가능한 테스트·assertion만 센다"로 early return, `if (false)`, 빈 `each([])`를 기존 TG002/TG003이 잡게 하고, 테스트 파일 이름이 가리키는 모듈의 mock 추가(SUT mock)를 보고합니다.
- **M12 TG009 소스 하드코딩**: 테스트 리터럴이 소스의 조건문에 새로 등장하는 경우. 흔한 리터럴은 제외합니다.
- 매 마일스톤: 회귀·오탐 fixture, 전체 테스트, 레드팀, M9 결과 지표 재측정.

### 12.3 단계 C — 배포 (B와 병행, 수요 기반)
- Probity 규칙으로 test-guard 판정을 쓰는 어댑터 가능성 확인. 경쟁보다 배포 채널로 봅니다.
- Copilot CLI, Cursor, Gemini CLI 어댑터. 공식 사양 확인 후 `docs/agents/`에 기록합니다.
- **게이트 2**: 팀 기능 요청 이슈가 들어오면 단계 D.

### 12.4 단계 D — 팀 기능 (요청이 있을 때만)
여러 저장소의 "막힌 시도" 리포트(CI Job Summary 집계, 로컬 산출물만, 텔레메트리 없음), 공통 정책, 승인 워크플로. 모두 오픈소스로 둡니다.

### 12.5 하지 않는 것
LLM 판정(opt-in 포함, §2-2), "1회 차단 후 경고"(재시도로 통과하는 우회 허용), 수요 신호 전의 언어 확장(C#/Go/Rust), suppressions 규칙·슬롭 도구 연동(범위 밖). 공개 README에는 내부 우선순위 문구 없이 "Planned" 목록만 둡니다.
