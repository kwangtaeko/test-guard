# IDEAS

범위 밖 아이디어를 한 줄씩 기록합니다.

- TG007: 강한/약한 matcher 짝을 지을 때 피검 대상(`expect(...)` 안의 식)이 같은지도 비교해 오탐 줄이기 (0.2 AST와 함께)
- 에이전트 훅: `sed -i`, `node -e`, `python -c` 같은 셸 내부 편집은 PreToolUse에서 내용을 알 수 없어 Stop에서만 잡힘. 실행 후 git diff로 즉시 판정하는 방식 검토
- Codex(Windows) 훅 속도: 현재 `commandWindows`가 npx(호출당 약 1초)를 씀. `for /f`로 git 루트를 찾는 cmd 구문은 Codex 안에서 실행되지 않았음. 저장소 루트를 찾는 다른 cmd 형식이나 Codex의 경로 변수 지원 여부를 다시 확인
- Codex 플러그인(0.2): 플러그인 형식이 아직 바뀌는 중(루트 `plugin.json` vs `.codex-plugin/`). 플러그인 훅은 `PLUGIN_ROOT` 환경변수를 받으므로 Windows에서 `node "%PLUGIN_ROOT%/dist/cli.js"`로 npx 지연(약 0.8초)을 없앨 수 있는지 확인
- 레드팀 2차에서 남긴 한계(0.2 AST와 함께): JS `import { it } from './fake'`처럼 다른 곳에서 가져온 테스트 함수(문자열이 지워져 import 출처를 못 봄), JS 식별자 안의 유니코드 이스케이프(`\u0069t.skip`), Python 부모 클래스가 실제 TestCase인지 추적, 사용자 `norecursedirs` 읽기
- 셸 분석: `HOME=`/`XDG_CONFIG_HOME=`로 다른 전역 git 설정을 쓰게 하는 경우, `cat list | xargs rm`처럼 목록을 알 수 없는 파이프(현재는 Stop에서만 잡힘)
- 레드팀 2차 재검증에서 남긴 것: 사람이 승인한 커밋의 트레일러 재사용(`git commit --amend --no-edit`, `-C <sha>`; Stop·CI는 잡음), 훅 파일의 `on:`/`paths-ignore`/`if:`(잡 바깥) 같은 워크플로 트리거 변경, `package.json`에서 husky `prepare` 제거, `vite.config.*`의 `test:` 블록, Java `@Test private`/`static`/abstract 클래스와 상속으로 가려진 assertion, `const opts = { skip: true }`처럼 변수로 넘긴 옵션, `c['skip']()`·`const { skip: s } = c` 같은 우회 표기, `from pytest import *`
- TG007 확장(AST와 함께): `toEqual(expect.anything())`, `toBe(add(1, 2))` 같은 동어반복, `pytest.approx(…, abs=큰값)`, `assertEquals(f(), f())`, `assertDoesNotThrow`, `raises((ValueError, Exception))`
- 0.2 AST(레드팀 0.1.1 기록): 개수는 그대로 두고 테스트를 무력화하는 수법 탐지 — 테스트 앞부분 `return`, `try { … } catch {}`로 감싼 assertion, `if (false)` 안의 테스트, 빈 `it.each([])`, 테스트 대상 모듈 mock(`vi.mock('./x')`/`jest.mock`), 버그에 맞춘 기대값 변경(TG007 확장과 함께)
- 스냅샷 갱신(`-u`, `.snap`, 인라인 스냅샷)은 ROADMAP §12 M10(TG008)으로 옮김
- M7 레드팀에서 남긴 것(M11 엔진과 함께): Promise `.then(…).catch(() => {})`로 삼킨 assertion, `try` 안에서 호출한 헬퍼·람다 속 assertion, `catch (e) { if (e.name !== 'AssertionError') throw e }`, 워크플로 간 테스트 스텝 이동을 파일 경계 너머로 짝짓기, `continue-on-error: ${{ matrix.experimental }}` 허용 여부, `npm test --if-present`, 재시도 액션의 `continue_on_error`
- 0.2 검토에서 보류: "새 기대값 == 실제 테스트 출력" 판정(테스트 실행 필요), 새 코드의 suppressions(eslint-disable, @ts-ignore, noqa 등) 추가, CI의 일반 테스트 잡 삭제·커버리지 임계값 하향, aislop 등 슬롭 도구 결과 병합
