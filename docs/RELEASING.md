# 릴리스 절차

npm 패키지와 GitHub Action은 같은 파일을 씁니다: 버전 태그가 가리키는 커밋에 들어 있는 `dist/`.

## 한 번만: npm Trusted Publishing 설정
npmjs.com → test-guard → Settings → Trusted publisher → GitHub Actions:

| 항목 | 값 |
|---|---|
| Organization or user | `kwangtaeko` |
| Repository | `test-guard` |
| Workflow filename | `release.yml` |
| Environment | (비움) |

설정 후 **2일 안에 첫 배포가 성공해야** 설정이 유지됩니다(npm 문서). 그래서 첫 태그를 올리기 직전에 설정합니다. 값은 대소문자를 구분하고, npm은 저장할 때 검증하지 않아 틀리면 배포 때 실패합니다.

## 매 릴리스
1. main에서 `package.json`의 `version`과 `CHANGELOG.md`(Unreleased → 버전)를 고친 릴리스 커밋을 PR로 병합합니다.
2. main을 받아 빌드하고, dist를 담은 커밋에 태그를 답니다:
   ```bash
   git checkout main && git pull --ff-only
   pnpm build
   git checkout --detach
   git add -f dist
   git commit -m "chore: add built dist for vX.Y.Z (GitHub Action)"
   git tag -a vX.Y.Z -m "test-guard X.Y.Z"
   git push origin vX.Y.Z
   ```
3. 태그 push가 `.github/workflows/release.yml`을 실행합니다: 타입 검사·lint·테스트, `check-release.mjs`, dist 파일과 버전 확인 뒤 `npm publish --ignore-scripts`(dist를 다시 빌드하지 않음, provenance 자동).
4. Action 사용자를 위해 이동 태그 `v0`을 옮깁니다(사람이 실행):
   ```bash
   git tag -fa v0 vX.Y.Z^{} -m "v0 → vX.Y.Z" && git push -f origin v0
   ```

Trusted Publishing 설정 전에는 3번 대신 태그를 체크아웃해 `npm publish --auth-type=web`으로 직접 배포합니다(`prepublishOnly`가 같은 검사를 하고 다시 빌드합니다).
