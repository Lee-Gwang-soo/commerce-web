# 🚀 Vercel 배포 가이드

> Commerce Web 프로젝트를 Vercel에 배포하는 전체 가이드

## 📋 목차

1. [사전 준비사항](#사전-준비사항)
2. [Vercel 프로젝트 설정](#vercel-프로젝트-설정)
3. [환경 변수 설정](#환경-변수-설정)
4. [배포 실행](#배포-실행)
5. [배포 후 확인사항](#배포-후-확인사항)
6. [트러블슈팅](#트러블슈팅)

---

## 사전 준비사항

### 1. Vercel 계정 생성

- [Vercel 가입](https://vercel.com/signup)
- GitHub 계정과 연동 권장

### 2. Supabase 프로젝트 설정

- [Supabase Dashboard](https://supabase.com/dashboard)에서 프로젝트 생성
- Database 설정 완료
- RLS (Row Level Security) 정책 설정

### 3. Toss Payments 설정

- [Toss Payments 개발자센터](https://developers.tosspayments.com/)에서 계정 생성
- 테스트 키 발급 (개발/스테이징)
- 운영 키 발급 (프로덕션)

---

## Vercel 프로젝트 설정

### 1. GitHub Repository 연동

```bash
# 1. GitHub에 코드 푸시
git add .
git commit -m "feat: ready for deployment"
git push origin main

# 2. Vercel에서 Import
# https://vercel.com/new
# "Import Git Repository" 선택
# GitHub 레포지토리 선택
```

### 2. 프로젝트 설정

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3. 리전 설정

```json
// vercel.json에 이미 설정됨
{
  "regions": ["icn1"] // 서울 리전 (한국 사용자 대상)
}
```

---

## 환경 변수 설정

### Vercel Dashboard에서 설정

**Settings > Environment Variables**로 이동하여 다음 변수들을 추가:

#### 1. Supabase 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### 2. 애플리케이션 URL

```bash
# Production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Preview (선택사항)
NEXT_PUBLIC_APP_URL=https://your-domain-git-develop.vercel.app
```

#### 3. Toss Payments 키

**개발/스테이징 환경 (Preview Deployments)**

```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_YOUR_TEST_CLIENT_KEY
TOSS_SECRET_KEY=test_sk_YOUR_TEST_SECRET_KEY
```

**프로덕션 환경 (Production)**

```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_YOUR_LIVE_CLIENT_KEY
TOSS_SECRET_KEY=live_sk_YOUR_LIVE_SECRET_KEY
```

### 환경 변수 타입 구분

| Environment | 용도             | 환경 변수 범위           |
| ----------- | ---------------- | ------------------------ |
| Production  | 실제 운영 환경   | `main` 브랜치만          |
| Preview     | 개발/테스트 환경 | `develop`, `test` 브랜치 |
| Development | 로컬 개발        | `.env.local` 파일        |

### 설정 화면 예시

```
Environment Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environments:
  ☑ Production
  ☑ Preview
  ☐ Development
```

---

## 배포 실행

### 자동 배포 (권장)

GitHub에 푸시하면 자동으로 배포됩니다:

```bash
# Production 배포 (main 브랜치)
git checkout main
git merge develop
git push origin main

# Preview 배포 (develop 브랜치)
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
```

### 수동 배포

Vercel CLI를 사용한 배포:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포 (Production)
vercel --prod

# 배포 (Preview)
vercel
```

---

## 배포 후 확인사항

### 1. 빌드 로그 확인

Vercel Dashboard > Deployments > 최신 배포 선택

```bash
✓ Deployment successful!
Build Output:
  ✓ Compiled successfully
  ✓ Linting and checking validity of types
  ✓ Collecting page data
  ✓ Generating static pages
```

### 2. 기능 테스트 체크리스트

- [ ] 홈페이지 정상 로드
- [ ] 회원가입/로그인 정상 작동
- [ ] 상품 목록 조회
- [ ] 장바구니 추가/삭제
- [ ] 찜목록 추가/삭제
- [ ] 주문/결제 플로우
- [ ] 마이페이지 접근
- [ ] 리뷰 작성/조회

### 3. 성능 확인

[Vercel Analytics](https://vercel.com/docs/analytics) 활성화:

```bash
# Vercel Dashboard > Analytics 탭
# Real Experience Score (Core Web Vitals) 확인
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
```

### 4. 에러 모니터링

Vercel Dashboard > Logs에서 런타임 에러 확인:

```bash
# 주요 확인 사항
- API 엔드포인트 에러
- 환경 변수 누락
- Database 연결 문제
- 이미지 로딩 실패
```

---

## GitHub Actions CI/CD

### 현재 설정

`.github/workflows/ci.yml` 파일로 자동 검증:

```yaml
on:
  push:
    branches: [main, develop, test]
  pull_request:
    branches: [main, develop, test]

jobs:
  - lint: ESLint & Prettier 검사
  - type-check: TypeScript 타입 체크
  - build: Next.js 빌드 검증
```

### CI 통과 후 배포

모든 CI 검사가 통과해야 배포가 진행됩니다:

```bash
✓ Lint & Format Check
✓ TypeScript Type Check
✓ Build Check
→ Deploy to Vercel
```

---

## Pre-commit Hooks (Husky + lint-staged)

### 현재 설정

커밋 전 자동으로 다음 작업 실행:

```bash
# .husky/pre-commit
npx lint-staged

# .lintstagedrc.js
"*.{js,jsx,ts,tsx}": [
  "prettier --write",      # 코드 포맷팅
  "eslint --fix",          # 린트 오류 자동 수정
  "tsc --noEmit"           # 타입 체크
]
```

### 작동 확인

```bash
# 테스트 커밋
git add .
git commit -m "test: husky hook test"

# 출력 예시:
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ Applying modifications from tasks...
# ✔ Cleaning up temporary files...
```

---

## 트러블슈팅

### 1. 빌드 실패

**문제**: `Error: Cannot find module`

```bash
# 해결
1. package.json의 dependencies 확인
2. Vercel Dashboard > Settings > General > Node.js Version 확인 (20.x 권장)
3. npm install 다시 실행
```

**문제**: `TypeScript compilation error`

```bash
# 해결
npm run type-check  # 로컬에서 먼저 확인
npm run lint:fix    # 자동 수정
```

### 2. 환경 변수 에러

**문제**: `NEXT_PUBLIC_SUPABASE_URL is not defined`

```bash
# 해결
1. Vercel Dashboard > Settings > Environment Variables
2. 모든 필수 환경 변수 추가 확인
3. Redeploy 실행
```

### 3. API 응답 에러

**문제**: `500 Internal Server Error`

```bash
# 해결
1. Vercel Dashboard > Logs 확인
2. Supabase 연결 확인
3. SUPABASE_SERVICE_ROLE_KEY 확인
4. CORS 설정 확인
```

### 4. 이미지 로딩 실패

**문제**: `Invalid src prop`

```bash
# 해결
# next.config.js에 이미지 도메인 추가
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    },
  ],
}
```

### 5. Supabase 연결 실패

**문제**: `Failed to connect to Supabase`

```bash
# 해결
1. Supabase 프로젝트 상태 확인 (Paused일 수 있음)
2. IP 허용 목록 확인 (Vercel IP 추가)
3. RLS 정책 확인
```

---

## 도메인 설정 (선택사항)

### 커스텀 도메인 추가

1. **Vercel Dashboard > Settings > Domains**
2. 도메인 입력 (예: `mystore.com`)
3. DNS 레코드 추가:

```bash
# A Record
Type: A
Name: @
Value: 76.76.21.21

# CNAME Record
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. SSL 인증서 자동 발급 (무료)

---

## 성능 최적화 권장사항

### 1. 이미지 최적화

```tsx
// Next.js Image 컴포넌트 사용
<Image src="/product.jpg" width={500} height={500} alt="Product" priority={isAboveFold} />
```

### 2. API 캐싱

```typescript
// React Query 캐싱 전략
{
  staleTime: 1000 * 60 * 5,  // 5분
  gcTime: 1000 * 60 * 10,    // 10분
}
```

### 3. Code Splitting

```tsx
// 동적 import로 번들 크기 줄이기
const DynamicComponent = dynamic(() => import("./HeavyComponent"));
```

---

## 모니터링 및 분석

### Vercel Analytics 활성화

```bash
# Vercel Dashboard > Analytics
- Real-time 방문자 통계
- Core Web Vitals 모니터링
- 페이지별 성능 분석
```

### Sentry 연동 (선택사항)

```bash
npm install @sentry/nextjs

# sentry.client.config.js
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

---

## 롤백 방법

### Vercel Dashboard에서 롤백

1. **Deployments** 탭으로 이동
2. 이전 성공한 배포 선택
3. **⋯** 메뉴 > **Promote to Production** 클릭

### CLI로 롤백

```bash
vercel rollback [deployment-url]
```

---

## 체크리스트

### 배포 전

- [ ] `.env.local` 파일 확인 (커밋하지 않음)
- [ ] `.env.example` 파일 업데이트
- [ ] `npm run build` 로컬 빌드 성공
- [ ] `npm run type-check` 타입 체크 통과
- [ ] `npm run lint` 린트 검사 통과
- [ ] GitHub Actions CI 통과

### 배포 중

- [ ] Vercel 환경 변수 모두 설정
- [ ] 리전 설정 (icn1 - 서울)
- [ ] 빌드 명령어 확인
- [ ] Node.js 버전 확인 (20.x)

### 배포 후

- [ ] 배포 URL 접속 확인
- [ ] 주요 기능 테스트
- [ ] 에러 로그 확인
- [ ] 성능 메트릭 확인
- [ ] 커스텀 도메인 연결 (선택사항)

---

## 참고 자료

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Toss Payments Docs](https://developers.tosspayments.com/)

---

## 지원

문제가 발생하면 다음을 확인하세요:

1. Vercel Dashboard > Logs
2. GitHub Actions 로그
3. Supabase Dashboard > Logs
4. 브라우저 콘솔 에러

---

**마지막 업데이트**: 2025-01-06
