# Commerce Web - 모던 이커머스 플랫폼

Next.js 14와 Supabase로 구축된 현대적인 이커머스 웹사이트입니다.

## 📋 프로젝트 개요

### 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Data Fetching**: TanStack Query (React Query v5)
- **State Management**: Zustand (persist middleware)
- **UI Components**: shadcn/ui, Lucide-icon
- **Architecture**: Atomic Design Pattern
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Form**: React-hook-form, Zod
- **Deploy**: Vercel
- **Payment**: 토스 페이먼츠 (개발자용 테스트)

---

## 🚀 최근 작업 현황 (2025-10-23)

### ✅ 완료된 작업

#### 1. 데이터베이스 구조 설계 및 구현
- **products 테이블 업데이트**
  - `description` (TEXT) - 상품 설명
  - `sale_price` (NUMERIC) - 할인가
  - `images` (TEXT[]) - 이미지 배열 (최대 8개, 첫 번째가 썸네일)
  - `review_count` (INTEGER) - 리뷰 개수 (자동 업데이트)
  - 기존 `image_url` → `images` 배열로 마이그레이션

- **reviews 테이블 생성**
  - `id`, `product_id`, `user_id`
  - `user_name` (TEXT) - 리뷰 작성자 이름
  - `content` (TEXT) - 리뷰 내용
  - `images` (TEXT[]) - 리뷰 이미지 (선택사항)
  - `created_at`, `updated_at`

- **자동 트리거**
  - 리뷰 추가/삭제 시 `products.review_count` 자동 업데이트

#### 2. API 구현
- **GET `/api/products`** - 상품 목록 조회
  - 페이지네이션 지원 (page, limit)
  - 카테고리 필터
  - 검색 기능 (상품명)
  - 정렬 (created_at, price, name, review_count)

- **GET `/api/products/[id]`** - 상품 상세 조회
  - 할인율 자동 계산
  - 할인 금액 자동 계산

- **GET `/api/reviews/[productId]`** - 리뷰 목록 조회
  - 페이지네이션 지원
  - 최신순 정렬

#### 3. React Query 훅
- `useProducts` - 상품 목록 조회
- `useProduct` - 상품 상세 조회
- `useProductReviews` - 리뷰 목록 조회
- TypeScript 타입 정의 (`src/types/product.ts`)

#### 4. 프론트엔드 개선
- **홈페이지** (`/`)
  - 실제 API 데이터 연동
  - 최신 상품 섹션 (8개, created_at DESC)
  - 인기 상품 섹션 (8개, review_count DESC)

- **상품 상세 페이지** (`/products/[id]`)
  - 새로운 API 연동
  - 실제 리뷰 데이터 표시
  - 리뷰 이미지 갤러리
  - 같은 카테고리 관련 상품 추천
  - 할인율 배지 표시

- **ProductCard 컴포넌트**
  - 할인율 배지 표시 (예: "20% 할인")
  - `stock` / `stock_quantity` 모두 지원
  - 품절 상태 자동 감지

- **Header 컴포넌트**
  - 카테고리 드롭다운 hover 기능 추가
  - 포커스 스타일 개선

- **Banner 컴포넌트**
  - Hero 배너 width 증가 (`max-w-6xl`)

#### 5. 테스트 데이터
- 8개 샘플 상품 (할인가, 이미지 배열 포함)
- 3개 샘플 리뷰 (작성자, 내용, 이미지)
- review_count 자동 업데이트 확인 완료

---

## 🎯 다음 작업 예정

### 1. 장바구니/주문 시스템
- products 테이블의 새로운 구조 반영
- 장바구니에 할인 상품 표시
- 주문 시 재고 관리
- cart_items 테이블 업데이트

### 2. 관리자 기능
- 상품 등록/수정 API
- 이미지 업로드 기능
- 재고 관리 대시보드
- 리뷰 관리

### 3. 검색/필터 개선
- 카테고리별 필터 강화
- 가격 범위 필터
- 정렬 기능 고도화
- 검색 자동완성

### 4. 성능 최적화
- 이미지 최적화 (Next.js Image)
- 무한 스크롤 구현
- React Query 캐싱 전략
- 코드 스플리팅

---

## 📁 주요 파일 구조

```
src/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                    # 홈페이지 (API 연동 완료)
│   │   ├── products/
│   │   │   ├── page.tsx                # 상품 목록
│   │   │   └── [id]/page.tsx           # 상품 상세 (API 연동 완료)
│   │   ├── cart/                       # 장바구니
│   │   ├── mypage/                     # 마이페이지
│   │   └── categories/[slug]/          # 카테고리별 상품
│   ├── (auth)/
│   │   ├── login/                      # 로그인
│   │   └── register/                   # 회원가입
│   └── api/
│       ├── products/
│       │   ├── route.ts                # 상품 목록 API ✅
│       │   └── [id]/route.ts           # 상품 상세 API ✅
│       ├── reviews/
│       │   └── [productId]/route.ts    # 리뷰 조회 API ✅
│       └── auth/                       # 인증 API
│           ├── login/route.ts
│           ├── register/route.ts
│           ├── logout/route.ts
│           ├── me/route.ts
│           └── update/route.ts
├── components/
│   ├── atoms/                          # 기본 UI 요소
│   │   ├── Banner/                     # 배너 (Hero 포함)
│   │   ├── Badge/                      # 배지
│   │   ├── Price/                      # 가격 표시
│   │   └── Rating/                     # 별점
│   ├── molecules/                      # 조합 컴포넌트
│   │   ├── ProductCard/                # 상품 카드 (할인율 표시)
│   │   ├── SearchBar/                  # 검색바
│   │   └── ProductImageGallery/        # 이미지 갤러리
│   ├── organisms/                      # 복합 컴포넌트
│   │   ├── Header/                     # 헤더 (hover 드롭다운)
│   │   ├── ProductGrid/                # 상품 그리드
│   │   └── Footer/                     # 푸터
│   └── templates/                      # 레이아웃
│       ├── Layout/
│       └── PageLayout/
├── hooks/
│   ├── auth/
│   │   └── useAuth.ts                  # 인증 훅
│   ├── cart/
│   │   └── use-cart.ts                 # 장바구니 훅
│   └── product/
│       └── useProducts.ts              # 상품/리뷰 React Query 훅 ✅
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase 클라이언트
│   │   └── server.ts                   # Supabase Admin (서버용)
│   └── react-query/
│       └── provider.tsx                # React Query 설정
├── store/
│   └── authStore.ts                    # Zustand 인증 상태
└── types/
    ├── database.ts                     # 데이터베이스 타입
    └── product.ts                      # 상품/리뷰 타입 ✅
```

---

## 🗄️ 데이터베이스 스키마

### products 테이블
```sql
- id (uuid, PK)
- name (text)
- description (text)
- price (numeric)
- sale_price (numeric, nullable)      -- 할인가
- category (text)
- stock (integer)
- images (text[])                     -- 이미지 배열 (첫 번째가 썸네일)
- review_count (integer, default 0)   -- 자동 업데이트
- created_at (timestamptz)
- updated_at (timestamptz)
```

### reviews 테이블
```sql
- id (uuid, PK)
- product_id (uuid, FK → products.id)
- user_id (uuid, FK → commerce_user.id)
- user_name (text)                    -- 작성자 이름 (작성 시점 고정)
- content (text)
- images (text[])                     -- 리뷰 이미지 (선택사항)
- created_at (timestamptz)
- updated_at (timestamptz)

-- 트리거: review 추가/삭제 시 products.review_count 자동 업데이트
```

### commerce_user 테이블
```sql
- id (uuid, PK)
- user_id (varchar, unique)
- password (varchar)
- name (varchar)
- email (varchar, unique)
- phone (varchar)
- address (text)
- marketing_agreed (boolean)
- benefits_agreed (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

---

## 🎯 핵심 기능

### ✅ 완료된 기능

#### 인증 시스템
- ✅ 회원가입 (React Query + Zustand)
- ✅ 로그인/로그아웃
- ✅ 마이페이지
- ✅ 회원정보 수정
- ✅ 비밀번호 변경
- ✅ 회원 탈퇴
- ✅ 세션 기반 인증 (HTTP-only 쿠키)

#### 상품 시스템
- ✅ 상품 목록 조회 (페이지네이션, 검색, 필터, 정렬)
- ✅ 상품 상세 조회 (할인율 자동 계산)
- ✅ 할인 배지 표시 (퍼센트)
- ✅ 재고 관리 (stock 필드)
- ✅ 이미지 갤러리 (여러 이미지 지원)
- ✅ 관련 상품 추천 (같은 카테고리)

#### 리뷰 시스템
- ✅ 리뷰 목록 조회 (페이지네이션)
- ✅ 리뷰 작성자 이름 표시
- ✅ 리뷰 이미지 갤러리
- ✅ review_count 자동 업데이트 (트리거)
- ✅ 빈 상태 처리

#### UI/UX
- ✅ 반응형 디자인
- ✅ Hero 배너 (이미지 슬라이더)
- ✅ 카테고리 드롭다운 (hover)
- ✅ 로딩 상태 표시
- ✅ 에러 모달 (ErrorModal, ConfirmModal, AuthRequiredModal)

### ⏳ 진행 예정

- ⏳ 장바구니 기능 (products 새 구조 반영)
- ⏳ 주문/결제 시스템
- ⏳ 관리자 페이지
- ⏳ 상품 등록/수정
- ⏳ 이미지 업로드
- ⏳ 검색 자동완성
- ⏳ 무한 스크롤

---

## 🔧 개발 가이드

### 환경 변수 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

### 설치 및 실행
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

### 코딩 규칙
- TypeScript 엄격 모드 사용
- Tailwind CSS로 스타일링
- Atomic Design Pattern 준수
- React Query로 서버 상태 관리
- Zustand로 클라이언트 상태 관리

### 컴포넌트 작성 규칙
- 모든 컴포넌트에 TypeScript 인터페이스 정의
- forwardRef 사용 시 ref 전달 고려
- 접근성 속성 포함
- PascalCase 네이밍 컨벤션
- Named export와 default export 함께 사용

---

## 📊 성능 고려사항

- React Query 캐싱 (staleTime: 5분)
- Next.js Image 컴포넌트 사용
- 조건부 쿼리 실행 (enabled)
- 에러 재시도 전략 (401/403/404 제외)
- 적절한 로딩 상태 구현

---

## 🎨 UI/UX 가이드라인

- shadcn/ui 컴포넌트 우선 사용
- 반응형 디자인 (모바일 퍼스트)
- 일관된 스페이싱 및 타이포그래피
- 접근성 고려 (WCAG 2.1 AA)
- 로딩/에러 상태 명확히 표시

---

## 📝 Git 커밋 규칙

- Conventional Commits 사용
- 예: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

### 최근 커밋
```
e2855fb - feat: 상품 API 및 리뷰 시스템 완전 구현 (2025-10-23)
b6838ac - feat: 완전한 인증 시스템 및 회원정보 관리 구현
6045449 - feat: 커머스 웹페이지 기본적인 UI 구현, tossPayment Test 연동
```

---

## 📚 참고 자료

- [Next.js 14 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 👨‍💻 다음 세션 시작 시

```bash
# 최근 커밋 확인
git log --oneline -5

# 프로젝트 구조 확인
tree src/ -L 2

# 개발 서버 실행
npm run dev
```

**다음 작업 제안 요청 예시**:
- "최근 커밋을 확인하고 다음 작업을 제안해줘"
- "장바구니 기능 구현을 도와줘"
- "관리자 페이지 만들어줘"
