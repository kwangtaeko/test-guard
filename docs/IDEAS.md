# IDEAS

범위 밖 아이디어를 한 줄씩 기록합니다.

- TG007: 강한/약한 matcher 짝을 지을 때 피검 대상(`expect(...)` 안의 식)이 같은지도 비교해 오탐 줄이기 (0.2 AST와 함께)
- node:test(Node 내장 러너) 지원: `test('x', { skip: true })`, `{ todo: true }` 옵션 형태의 skip은 현재 분석기가 못 잡음
- 에이전트 훅: `sed -i`, `node -e`, `python -c` 같은 셸 내부 편집은 PreToolUse에서 내용을 알 수 없어 Stop에서만 잡힘. 실행 후 git diff로 즉시 판정하는 방식 검토
- Codex(Windows) 훅 속도: 현재 `commandWindows`가 npx(호출당 약 1초)를 씀. `for /f`로 git 루트를 찾는 cmd 구문은 Codex 안에서 실행되지 않았음. 저장소 루트를 찾는 다른 cmd 형식이나 Codex의 경로 변수 지원 여부를 다시 확인
- Codex 플러그인(0.2): 플러그인 형식이 아직 바뀌는 중(루트 `plugin.json` vs `.codex-plugin/`). 플러그인 훅은 `PLUGIN_ROOT` 환경변수를 받으므로 Windows에서 `node "%PLUGIN_ROOT%/dist/cli.js"`로 npx 지연(약 0.8초)을 없앨 수 있는지 확인
