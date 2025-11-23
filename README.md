# Commerce Web - 모던 이커머스 플랫폼

> Next.js 14 + TypeScript + Supabase 기반 풀스택 전자상거래 플랫폼

[![CI](https://github.com/Lee-Gwang-soo/commerce-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Lee-Gwang-soo/commerce-web/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)

## 📋 목차

- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [환경 설정](#-환경-설정)
- [CI/CD](#-cicd)
- [배포](#-배포)

---

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**:
  - React Query v5 (서버 상태)
  - Zustand (클라이언트 상태 + localStorage 지속성)
- **Form**: React Hook Form + Zod
- **UI Icons**: Lucide React

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (세션 기반, HTTP-only 쿠키)
- **Storage**: Supabase Storage (리뷰 이미지)
- **Admin API**: Supabase Service Role Key (RLS 우회)

### Infrastructure

- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Payment**: 토스페이먼츠 (Toss Payments)

### Architecture

- **Design Pattern**: Atomic Design
- **API Strategy**: REST API (Next.js Route Handlers)
- **Data Fetching**: Server-Side Rendering + React Query

---

## 🎯 주요 기능

### 1. 인증 시스템

**기술 스택**: Supabase Auth + Zustand + React Query

- ✅ 회원가입/로그인/로그아웃
- ✅ 세션 기반 인증 (HTTP-only 쿠키)
- ✅ 아이디 저장 기능 (localStorage)
- ✅ 비밀번호 변경 (bcrypt 해시)
- ✅ 회원정보 수정 (이메일, 전화번호, 주소)
- ✅ 회원 탈퇴
- ✅ 비밀번호 확인 후 정보 수정

**주요 최적화**:

- autocomplete 속성으로 브라우저 자동완성 지원
- useCallback으로 불필요한 리렌더링 방지
- 모달 onClose에서 라우팅 처리 (setTimeout 제거)

**API 엔드포인트**:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/update`
- `POST /api/auth/verify-password`
- `DELETE /api/auth/delete-account`

---

### 2. 상품 시스템

**기술 스택**: Supabase + React Query + Intersection Observer

- ✅ 상품 목록 조회 (무한 스크롤)
- ✅ 상품 검색 (이름 기반)
- ✅ 카테고리 필터링
- ✅ 정렬 (최신순, 가격순, 이름순, 리뷰 많은 순)
- ✅ 상품 상세 페이지
- ✅ 이미지 갤러리 (최대 8장)
- ✅ 할인가 및 할인율 자동 계산
- ✅ 재고 관리
- ✅ 관련 상품 추천 (같은 카테고리)

**API 엔드포인트**:

- `GET /api/products` (검색, 필터, 정렬, 페이지네이션)
- `GET /api/products/[id]` (상품 상세)

---

### 3. 장바구니 시스템

**기술 스택**: React Query + Optimistic Updates + Zustand

- ✅ 장바구니 추가/삭제
- ✅ 수량 변경
- ✅ 선택 주문 (체크박스)
- ✅ 전체 선택/해제
- ✅ 실시간 카운트 배지 (Header)
- ✅ 일괄 삭제 최적화 (Promise.all 병렬 처리)
- ✅ 단일 토스트 메시지

**주요 최적화**:

- Optimistic Update로 즉각 반응형 UI
- React Query 캐싱으로 빠른 데이터 로딩
- 선택된 상품 동시 삭제 (Promise.all)

**API 엔드포인트**:

- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/[id]`
- `DELETE /api/cart/[id]`
- `DELETE /api/cart` (전체 삭제)

---

### 4. 찜목록 시스템

**기술 스택**: React Query + Optimistic Updates

- ✅ 찜목록 추가/삭제
- ✅ 장바구니 담기 (자동 찜목록 제거)
- ✅ 실시간 카운트 배지 (Header)
- ✅ Toggle 기능 (찜 추가 ↔ 제거)
- ✅ 아이콘 상시 표시
  - 찜한 상태: 빨간색 채워진 하트 ❤️
  - 안 찜한 상태: 빈 하트 🤍

**주요 최적화**:

- Optimistic Update (0.01초 이내 UI 변경)
- 에러 시 자동 롤백
- Link 이벤트 충돌 해결 (버튼을 Link 외부로 분리)

**API 엔드포인트**:

- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist/[id]`

---

### 5. 주문/결제 시스템

**기술 스택**: Toss Payments + React Query + Supabase Transactions

- ✅ 주문서 작성
  - 주문자 정보 (이름, 전화번호, 이메일)
  - 배송지 정보 (주소, 우편번호, 상세 주소)
  - 카카오 주소 검색 API 연동
- ✅ 토스페이먼츠 결제 연동
- ✅ 결제 승인 처리
- ✅ 주문 생성 및 재고 자동 감소
- ✅ 결제 성공/실패 페이지
- ✅ 결제 후 장바구니 자동 비우기
- ✅ 주문 내역 조회 (페이지네이션)
- ✅ 주문 상세 조회

**주요 최적화**:

- 트랜잭션으로 데이터 무결성 보장
- 재고 부족 시 자동 검증 및 에러 처리
- 결제 금액 검증 (서버 사이드)

**API 엔드포인트**:

- `POST /api/orders` (주문 생성)
- `GET /api/orders` (주문 목록)
- `GET /api/orders/[id]` (주문 상세)
- `PATCH /api/orders/[id]` (주문 상태 변경)
- `POST /api/confirm-payment` (결제 승인)

---

### 6. 리뷰 시스템

**기술 스택**: Supabase Storage + React Query + PostgreSQL Triggers

- ✅ 리뷰 작성 (주문 내역에서)
- ✅ 리뷰 이미지 업로드 (Supabase Storage)
  - 최대 5MB
  - png, jpg, webp 지원
- ✅ 리뷰 수정/삭제
- ✅ 리뷰 개수 자동 업데이트 (트리거)
- ✅ 리뷰 목록 조회 (페이지네이션, 최신순)
- ✅ Storage 이미지 자동 삭제 (리뷰 삭제 시)
- ✅ 권한 확인 (본인만 수정/삭제)

**데이터베이스 트리거**:

- 리뷰 추가 시: `products.review_count++`
- 리뷰 삭제 시: `products.review_count--`

**API 엔드포인트**:

- `GET /api/reviews/[productId]` (리뷰 목록)
- `POST /api/reviews` (리뷰 작성)
- `PATCH /api/reviews/[id]` (리뷰 수정)
- `DELETE /api/reviews/[id]` (리뷰 삭제)

---

### 7. 주소 관리

**기술 스택**: Kakao 주소 검색 API + React Hook Form

- ✅ 카카오 주소 검색 모달
- ✅ 우편번호, 기본 주소, 상세 주소
- ✅ 모바일 반응형 UI
- ✅ React Hook Form 통합

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── (shop)/                       # 쇼핑몰 레이아웃
│   │   ├── page.tsx                  # 홈
│   │   ├── products/                 # 상품
│   │   ├── cart/                     # 장바구니
│   │   ├── wishlist/                 # 찜목록
│   │   ├── checkout/                 # 주문/결제
│   │   └── mypage/                   # 마이페이지
│   ├── (auth)/                       # 인증 레이아웃
│   │   ├── login/                    # 로그인
│   │   └── register/                 # 회원가입
│   └── api/                          # API 라우트
│       ├── products/                 # 상품 API
│       ├── cart/                     # 장바구니 API
│       ├── wishlist/                 # 찜목록 API
│       ├── orders/                   # 주문 API
│       ├── reviews/                  # 리뷰 API
│       ├── confirm-payment/          # 결제 승인 API
│       └── auth/                     # 인증 API
├── components/
│   ├── atoms/                        # 기본 컴포넌트
│   ├── molecules/                    # 조합 컴포넌트
│   ├── organisms/                    # 복합 컴포넌트
│   └── templates/                    # 레이아웃
├── hooks/
│   ├── auth/                         # 인증 훅
│   ├── cart/                         # 장바구니 훅
│   ├── wishlist/                     # 찜목록 훅
│   ├── order/                        # 주문 훅
│   └── product/                      # 상품/리뷰 훅
├── lib/
│   ├── api/                          # API 클라이언트
│   ├── supabase/                     # Supabase 설정
│   │   ├── client.ts                 # 클라이언트 (브라우저)
│   │   └── server.ts                 # Admin (서버, RLS 우회)
│   └── react-query/                  # React Query 설정
├── store/
│   └── authStore.ts                  # Zustand 인증 상태
└── types/
    ├── database.ts                   # 데이터베이스 타입
    └── product.ts                    # 상품/리뷰 타입
```

---

## 🗄️ 데이터베이스 스키마

### products

```sql
- id (uuid, PK)
- name (text)
- description (text)
- price (numeric)
- sale_price (numeric)              -- 할인가
- category (text)
- stock (integer)
- images (text[])                   -- 이미지 배열 (최대 8개)
- review_count (integer, default 0) -- 자동 업데이트
- created_at, updated_at
```

### commerce_user

```sql
- id (uuid, PK)
- user_id (varchar, unique)
- password (varchar)                -- bcrypt 해시
- name (varchar)
- email (varchar, unique)
- phone (varchar)
- address (text)
- address_detail (text)
- marketing_agreed (boolean)
- created_at, updated_at
```

### reviews

```sql
- id (uuid, PK)
- product_id (uuid, FK → products.id, CASCADE)
- user_id (uuid, FK → commerce_user.id, CASCADE)
- user_name (text)
- content (text)
- images (text[])                   -- Supabase Storage URL
- created_at, updated_at

-- 트리거: review_count 자동 업데이트
```

### cart_items, wishlist, orders, order_items

상세 스키마는 Supabase Dashboard에서 확인 가능

---

## ⚙️ 환경 설정

### 1. 환경 변수 설정

```bash
# .env.local 생성
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

### 2. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### 3. 코드 품질 검사

```bash
# ESLint 검사 및 자동 수정
npm run lint
npm run lint:fix

# TypeScript 타입 체크
npm run type-check

# Prettier 포맷팅
npm run prettier:check
npm run prettier
```

---

## 🔄 CI/CD

### GitHub Actions 워크플로우

`.github/workflows/ci.yml` 파일로 자동화:

#### 1. Lint & Format Check

```yaml
- ESLint 검사
- Prettier 검사
```

#### 2. TypeScript Type Check

```yaml
- tsc --noEmit
- 환경 변수: GitHub Secrets에서 주입
```

#### 3. Build Check

```yaml
- npm run build
- 환경 변수: GitHub Secrets에서 주입
```

#### 4. Pre-commit Hook (Husky)

```yaml
- lint-staged로 변경된 파일만 검사
- Prettier 자동 포맷팅
- ESLint 자동 수정
- TypeScript 타입 체크
```

### 필수 GitHub Secrets

Repository Settings → Secrets → Actions에서 설정:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_TOSS_CLIENT_KEY
TOSS_SECRET_KEY
```

---

## 🚀 배포

### Vercel 배포 설정

#### 1. 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables:

| Variable                        | Value                            | Environment                      |
| ------------------------------- | -------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxx.supabase.co`        | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`                         | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJ...`                         | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL`           | `https://your-domain.vercel.app` | Production                       |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY`   | `live_ck_...` (프로덕션)         | Production                       |
| `TOSS_SECRET_KEY`               | `live_sk_...` (프로덕션)         | Production                       |

#### 2. 배포

```bash
git push origin main
```

Vercel이 자동으로 빌드 및 배포를 시작합니다.

#### 3. vercel.json 설정

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["icn1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ]
}
```

---

## 📊 성능 최적화

### 1. React Query 전략

- **staleTime**: 5분 (API 호출 최소화)
- **gcTime**: 10분 (캐시 유지)
- **Optimistic Updates**: 장바구니, 찜목록
- **조건부 실행**: `enabled` 옵션 활용

### 2. Next.js 최적화

- **App Router**: 서버 컴포넌트 우선 사용
- **Image 컴포넌트**: 자동 이미지 최적화
- **Dynamic Import**: 필요시 코드 스플리팅

### 3. Supabase 최적화

- **RLS (Row Level Security)**: 데이터 보안
- **인덱스**: 성능 개선 (user_id, product_id, created_at)
- **트리거**: 자동 데이터 동기화

### 4. 프론트엔드 최적화

- **useCallback**: 불필요한 리렌더링 방지
- **React.memo**: 컴포넌트 메모이제이션
- **Intersection Observer**: 무한 스크롤

---

## 📝 Git 커밋 규칙

Conventional Commits 사용:

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

---

## 📚 참고 문서

- [Next.js 14 문서](https://nextjs.org/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Toss Payments 문서](https://developers.tosspayments.com/)

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

This project is licensed under the MIT License.

---

## 👨‍💻 개발자

Lee Gwang Soo - [@Lee-Gwang-soo](https://github.com/Lee-Gwang-soo)

Project Link: [https://github.com/Lee-Gwang-soo/commerce-web](https://github.com/Lee-Gwang-soo/commerce-web)
