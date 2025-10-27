# Development Guide

## Code Quality & CI/CD

이 프로젝트는 코드 품질을 유지하기 위해 Husky, lint-staged, Prettier, ESLint를 사용하고 있으며, GitHub Actions를 통한 CI/CD 파이프라인이 구축되어 있습니다.

### 로컬 개발 환경

#### 1. Git Hooks (Husky)

프로젝트에 Husky가 설정되어 있어, 커밋 전에 자동으로 코드 포맷팅과 린트 체크가 실행됩니다.

```bash
# Husky 초기화 (npm install 시 자동 실행)
npm install
```

#### 2. Pre-commit Hook

커밋 전에 다음 작업이 자동으로 실행됩니다:

- **Prettier**: 변경된 파일의 포맷팅 자동 수정
- **ESLint**: 변경된 파일의 린트 체크 및 자동 수정 (가능한 경우)

```bash
# 수동으로 pre-commit hook 실행
npx lint-staged
```

#### 3. 수동 코드 품질 체크

```bash
# Prettier 실행
npm run prettier        # 모든 파일 포맷팅
npm run prettier:check  # 포맷팅 체크만 (수정 안 함)

# ESLint 실행
npm run lint           # 린트 체크
npm run lint:fix       # 린트 체크 및 자동 수정

# TypeScript 타입 체크
npm run type-check     # 타입 에러 체크

# 빌드 체크
npm run build          # Next.js 빌드 실행
```

### GitHub Actions CI/CD

#### CI Pipeline (`.github/workflows/ci.yml`)

Pull Request 및 Push 시 자동으로 다음 작업이 실행됩니다:

**1. Lint & Format Check**

- ESLint 체크
- Prettier 포맷 체크

**2. TypeScript Type Check**

- 타입 에러 체크

**3. Build Check**

- Next.js 빌드 성공 여부 확인

**4. Tests** (현재 비활성화)

- Jest 테스트 실행
- 테스트 구현 시 활성화 필요

#### CI가 실행되는 브랜치

- `main`
- `develop`
- `test`

#### 배포 자동화 (현재 비활성화)

배포가 준비되면 다음 단계를 따르세요:

1. `.github/workflows/ci.yml` 파일의 `deploy` job 주석 해제
2. 배포 명령어 추가 (Vercel, AWS, etc.)
3. 필요한 환경 변수를 GitHub Secrets에 추가

```yaml
# 배포 예시 (Vercel)
- name: Deploy
  run: |
    npm install -g vercel
    vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 코드 품질 개선 필요 사항

현재 프로젝트에 다음 이슈들이 존재합니다:

#### ESLint Warnings (74개)

- Unused variables (사용하지 않는 변수)
- Unused imports (사용하지 않는 import)
- `any` 타입 사용
- React unescaped entities

#### TypeScript Type Errors

- 타입 불일치
- null/undefined 처리 누락
- 타입 정의 누락

### 권장 수정 순서

1. **긴급 (CI 차단)**
   - TypeScript 타입 에러 수정
   - ESLint 에러 (Error) 수정

2. **중요 (코드 품질)**
   - Unused variables/imports 제거
   - `any` 타입을 구체적인 타입으로 변경

3. **일반 (개선)**
   - ESLint Warning 수정
   - 코드 리팩토링

### 커밋 전 체크리스트

- [ ] `npm run prettier` 실행하여 포맷팅 적용
- [ ] `npm run lint` 실행하여 린트 에러 확인
- [ ] `npm run type-check` 실행하여 타입 에러 확인
- [ ] `npm run build` 실행하여 빌드 성공 확인
- [ ] 변경사항 테스트 완료

### 트러블슈팅

#### Pre-commit hook이 실행되지 않을 때

```bash
# Husky 재설치
rm -rf .husky
npm install
```

#### CI에서 빌드 실패 시

```bash
# 로컬에서 동일한 환경으로 테스트
npm ci              # package-lock.json 기준으로 설치
npm run build       # 빌드 실행
```

#### ESLint 규칙 커스터마이징

`.eslintrc.json` 파일에서 규칙을 수정할 수 있습니다:

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn", // error -> warn으로 변경
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_"
      }
    ]
  }
}
```

## 추가 정보

- [Next.js Documentation](https://nextjs.org/docs)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Husky Documentation](https://typicode.github.io/husky/)
