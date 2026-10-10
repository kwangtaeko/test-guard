# IDEAS

범위 밖 아이디어를 한 줄씩 기록합니다.

- TG007: 강한/약한 matcher 짝을 지을 때 피검 대상(`expect(...)` 안의 식)이 같은지도 비교해 오탐 줄이기 (0.2 AST와 함께)
- 에이전트 훅: `sed -i`, `node -e`, `python -c` 같은 셸 내부 편집은 PreToolUse에서 내용을 알 수 없어 Stop에서만 잡힘. 실행 후 git diff로 즉시 판정하는 방식 검토
- Codex(Windows) 훅 속도: 현재 `commandWindows`가 npx(호출당 약 1초)를 씀. `for /f`로 git 루트를 찾는 cmd 구문은 Codex 안에서 실행되지 않았음. 저장소 루트를 찾는 다른 cmd 형식이나 Codex의 경로 변수 지원 여부를 다시 확인
- Codex 플러그인(0.2): 플러그인 형식이 아직 바뀌는 중(루트 `plugin.json` vs `.codex-plugin/`). 플러그인 훅은 `PLUGIN_ROOT` 환경변수를 받으므로 Windows에서 `node "%PLUGIN_ROOT%/dist/cli.js"`로 npx 지연(약 0.8초)을 없앨 수 있는지 확인
- 레드팀 2차에서 남긴 한계: Python 부모 클래스가 실제 TestCase인지 추적, 사용자 `norecursedirs` 읽기 (가져온 테스트 함수와 식별자 유니코드 이스케이프는 M11b에서 해결)
- 셸 분석: `HOME=`/`XDG_CONFIG_HOME=`로 다른 전역 git 설정을 쓰게 하는 경우, `cat list | xargs rm`처럼 목록을 알 수 없는 파이프(현재는 Stop에서만 잡힘)
- 레드팀 2차 재검증에서 남긴 것: 사람이 승인한 커밋의 트레일러 재사용(`git commit --amend --no-edit`, `-C <sha>`; Stop·CI는 잡음), 훅 파일의 `on:`/`paths-ignore`/`if:`(잡 바깥) 같은 워크플로 트리거 변경, `package.json`에서 husky `prepare` 제거, `vite.config.*`의 `test:` 블록, 상속으로 가려진 Java assertion (Java `private`/`static`/abstract 테스트, 변수로 넘긴 옵션, `c['skip']()`·`{ skip: s }`, `from pytest import *`는 M11b에서 해결)
- TG007 확장(AST와 함께): `toEqual(expect.anything())`, `toBe(add(1, 2))` 같은 동어반복, `pytest.approx(…, abs=큰값)`, `assertEquals(f(), f())`, `assertDoesNotThrow`, `raises((ValueError, Exception))`
- 0.2 AST(레드팀 0.1.1 기록): 버그에 맞춘 기대값 변경(TG007 확장과 함께) (앞부분 `return`, `if (false)`, 빈 `each([])`, 테스트 대상 모듈 mock은 M11c에서 해결)
- 스냅샷 갱신(`-u`, `.snap`, 인라인 스냅샷)은 ROADMAP §12 M10(TG008)으로 옮김
- M7 레드팀에서 남긴 것(M11 엔진과 함께; Promise `.catch`와 `try` 안에서 호출한 헬퍼는 M11c에서 해결): `catch (e) { if (e.name !== 'AssertionError') throw e }`, 워크플로 간 테스트 스텝 이동을 파일 경계 너머로 짝짓기, `continue-on-error: ${{ matrix.experimental }}` 허용 여부, `npm test --if-present`, 재시도 액션의 `continue_on_error`
- M10 레드팀에서 남긴 것: 기대값을 변수로 옮기기(`const expected = 11`), 코드가 든 새 소스 파일로 "구현 변경"을 만들기(테스트가 그 파일을 import하는지까지 보면 줄일 수 있음), `nx`/`turbo`/`lerna`를 거친 `-u`, 한 줄짜리 `package.json`에서 `name`만 바꿔도 TG005 "changed test script"
- M12(TG009) 레드팀에서 남긴 것: 파라미터 표(`it.each`, `parametrize`)나 여러 줄로 나뉜 인자로 넘긴 테스트 입력, 변수를 거친 입력, lookup 객체(`{ IV: 6 }[s]`)·`startsWith`·정규식으로 비교, 기대값을 계산으로 만드는 특수 처리(`? total + 30`), 테스트 대상 함수가 아닌 곳에 넘긴 값까지 입력으로 보는 문제(바뀐 파일이 정의한 함수인지 확인하면 줄일 수 있음)
- M11b 레드팀에서 남긴 것: 로컬 파일에서 가져온 가짜 러너(`import { it } from './fake'`, 그 파일이 실제 러너를 다시 내보내는지 따라가 봐야 함), 간접 호출(`c.skip.call(c)`, `const f = c.skip; f()`), 계산된 키(`c['sk' + 'ip']`, `const k = 'skip'; c[k]()`), 다른 파일에서 가져온 옵션 객체, Python `getattr(pytest, 'skip')()`, Java 익명 클래스 안의 `@Test`
- M11c 레드팀에서 남긴 것: 테스트 대상 네임스페이스에 `vi.spyOn(mod, 'sum').mockReturnValue(…)`(같은 모듈의 다른 함수를 spy하는 정상 사용과 구분이 어려움), 객체·클래스 메서드로 만든 헬퍼, 변수에 담은 빈 표(`const cases = []; it.each(cases)`, `parametrize("c", CASES)`), `false && expect(…)`·`if (1 === 2)`·`{ return; }` 블록·행 없는 태그 템플릿 `it.each`·`for (i = 0; i < 0; …)`, baseUrl 경로(`jest.mock('src/sum')`)나 변수로 넘긴 mock 경로, Python `mock.patch`·Java Mockito로 테스트 대상 자체를 mock하기, 테스트가 끝난 뒤 실행되는 assertion(`setTimeout`, await하지 않은 Promise). 잡은 오류를 변수에 담는 `catch (e) { last = e }`는 파일 어딘가에서 그 변수를 던지거나(`throw last`) 검사하면 실패를 보고한 것으로 봄(재시도 루프 오탐 방지) — 같은 이름의 다른 변수와 구분하지 않음
- 성능: JS 테스트 파일을 두 번 파싱함(주석·문자열을 비운 코드와 원본). 큰 커밋(zod 11파일) 검사가 0.3.0 대비 약 15% 느림(4.9초→5.6초). 원본 파싱은 skip 후보 문자열이 있을 때만 하도록 줄일 수 있음
- 0.2 검토에서 보류: "새 기대값 == 실제 테스트 출력" 판정(테스트 실행 필요), 새 코드의 suppressions(eslint-disable, @ts-ignore, noqa 등) 추가, CI의 일반 테스트 잡 삭제·커버리지 임계값 하향, aislop 등 슬롭 도구 결과 병합
