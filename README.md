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

## 🚀 최근 작업 현황 (2025-10-25)

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

- **wishlist 테이블 생성**

  - `id`, `user_id`, `product_id`
  - 사용자별 찜목록 관리
  - 중복 방지 (UNIQUE 제약)

- **orders 테이블 업데이트**
  - `customer_phone` - 주문자 전화번호
  - `shipping_postcode` - 배송지 우편번호
  - `payment_key` - 토스페이먼츠 결제 키
  - `order_id` - 토스페이먼츠 주문 ID
  - `payment_status` - 결제 상태

#### 2. API 구현

##### 상품 API
- **GET `/api/products`** - 상품 목록 조회
  - 페이지네이션 지원 (page, limit)
  - 카테고리 필터
  - 검색 기능 (상품명)
  - 정렬 (created_at, price, name, review_count)
- **GET `/api/products/[id]`** - 상품 상세 조회
  - 할인율 자동 계산
  - 할인 금액 자동 계산

##### 리뷰 API
- **GET `/api/reviews/[productId]`** - 리뷰 목록 조회
  - 페이지네이션 지원
  - 최신순 정렬

##### 장바구니 API
- **GET `/api/cart`** - 장바구니 조회
- **POST `/api/cart`** - 장바구니 추가
- **PATCH `/api/cart/[id]`** - 수량 변경
- **DELETE `/api/cart/[id]`** - 상품 삭제

##### 찜목록 API
- **GET `/api/wishlist`** - 찜목록 조회
- **POST `/api/wishlist`** - 찜목록 추가
- **DELETE `/api/wishlist/[id]`** - 찜목록 삭제

##### 주문/결제 API
- **POST `/api/orders`** - 주문 생성
  - 장바구니 검증
  - 재고 확인 및 자동 감소
  - 주문 및 주문 아이템 생성
- **GET `/api/orders`** - 주문 목록 조회 (페이지네이션)
- **GET `/api/orders/[id]`** - 주문 상세 조회
- **PATCH `/api/orders/[id]`** - 주문 상태 업데이트
- **POST `/api/confirm-payment`** - 결제 승인
  - 토스페이먼츠 API 연동
  - 주문 금액 검증
  - 주문 상태 자동 업데이트
  - 장바구니 자동 비우기

#### 3. React Query 훅

##### 상품 훅
- `useProducts` - 상품 목록 조회
- `useProduct` - 상품 상세 조회
- `useProductReviews` - 리뷰 목록 조회

##### 장바구니 훅
- `useCartItems` - 장바구니 아이템 조회
- `useCartItemCount` - 장바구니 개수 조회 (실시간 업데이트)
- `useAddToCart` - 장바구니 추가
- `useUpdateCartItem` - 수량 변경
- `useRemoveFromCart` - 장바구니 삭제
- `useIsInCart` - 상품 장바구니 포함 여부

##### 찜목록 훅
- `useWishlistItems` - 찜목록 조회
- `useWishlistItemCount` - 찜목록 개수 조회 (실시간 업데이트)
- `useAddToWishlist` - 찜목록 추가
- `useRemoveFromWishlist` - 찜목록 삭제
- `useIsInWishlist` - 상품 찜목록 포함 여부

##### 주문 훅
- `useOrders` - 주문 목록 조회 (페이지네이션)
- `useOrder` - 주문 상세 조회
- `useCreateOrder` - 주문 생성
- `useUpdateOrder` - 주문 상태 업데이트

#### 4. 프론트엔드 페이지

##### 쇼핑 페이지
- **홈페이지** (`/`)
  - 최신 상품/인기 상품 섹션
- **상품 목록** (`/products`)
  - 검색, 필터, 정렬
- **상품 상세** (`/products/[id]`)
  - 리뷰 표시, 관련 상품 추천
  - 장바구니/찜목록 추가
- **장바구니** (`/cart`)
  - 상품 선택, 수량 변경
  - 주문하기 버튼
- **찜목록** (`/wishlist`)
  - 찜한 상품 관리
  - 장바구니 담기

##### 주문/결제 페이지
- **주문서** (`/checkout`)
  - 주문자/배송지 정보 입력
  - 결제 금액 계산
  - 토스페이먼츠 연동
- **결제 성공** (`/checkout/success`)
  - 결제 승인 처리
  - 주문 완료 안내
- **결제 실패** (`/checkout/fail`)
  - 실패 사유 표시
  - 재시도 옵션

##### 마이페이지
- **마이페이지** (`/mypage`)
  - 주문내역, 정보수정, 로그아웃
- **주문 내역** (`/mypage/orders`)
  - 주문 목록 (페이지네이션)
  - 주문/결제 상태 배지
- **주문 상세** (`/mypage/orders/[id]`)
  - 주문 상품, 배송/결제 정보
- **정보 수정** (`/mypage/update`)
  - 회원정보 수정
  - 비밀번호 변경

#### 5. 테스트 데이터

- 8개 샘플 상품 (할인가, 이미지 배열 포함)
- 3개 샘플 리뷰 (작성자, 내용, 이미지)
- review_count 자동 업데이트 확인 완료

---

## 🎯 다음 작업 예정

### 1. 관리자 기능

- 상품 등록/수정/삭제 API
- 이미지 업로드 기능 (Supabase Storage)
- 재고 관리 대시보드
- 주문 관리 (상태 변경)
- 리뷰 관리

### 2. 검색/필터 고도화

- 가격 범위 필터
- 다중 카테고리 필터
- 검색 자동완성
- 최근 검색어 저장

### 3. 사용자 경험 개선

- 상품 비교 기능
- 최근 본 상품
- 리뷰 작성 기능
- 상품 문의 기능
- 배송 추적

### 4. 성능 최적화

- 이미지 최적화 (Next.js Image)
- 무한 스크롤 구현
- React Query 캐싱 전략 고도화
- 코드 스플리팅
- SSR/ISR 적용

---

## 📁 주요 파일 구조

```
src/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                    # 홈페이지 ✅
│   │   ├── products/
│   │   │   ├── page.tsx                # 상품 목록 ✅
│   │   │   └── [id]/page.tsx           # 상품 상세 ✅
│   │   ├── cart/
│   │   │   └── page.tsx                # 장바구니 ✅
│   │   ├── wishlist/
│   │   │   └── page.tsx                # 찜목록 ✅
│   │   ├── checkout/
│   │   │   ├── page.tsx                # 주문서 ✅
│   │   │   ├── success/page.tsx        # 결제 성공 ✅
│   │   │   └── fail/page.tsx           # 결제 실패 ✅
│   │   └── mypage/
│   │       ├── page.tsx                # 마이페이지 ✅
│   │       ├── orders/
│   │       │   ├── page.tsx            # 주문 목록 ✅
│   │       │   └── [id]/page.tsx       # 주문 상세 ✅
│   │       ├── update/page.tsx         # 정보 수정 ✅
│   │       └── password-check/         # 비밀번호 확인 ✅
│   ├── (auth)/
│   │   ├── login/page.tsx              # 로그인 ✅
│   │   └── register/page.tsx           # 회원가입 ✅
│   └── api/
│       ├── products/
│       │   ├── route.ts                # 상품 목록 API ✅
│       │   └── [id]/route.ts           # 상품 상세 API ✅
│       ├── reviews/
│       │   └── [productId]/route.ts    # 리뷰 조회 API ✅
│       ├── cart/
│       │   ├── route.ts                # 장바구니 조회/추가 ✅
│       │   └── [id]/route.ts           # 장바구니 수정/삭제 ✅
│       ├── wishlist/
│       │   ├── route.ts                # 찜목록 조회/추가 ✅
│       │   └── [id]/route.ts           # 찜목록 삭제 ✅
│       ├── orders/
│       │   ├── route.ts                # 주문 생성/목록 ✅
│       │   └── [id]/route.ts           # 주문 상세/수정 ✅
│       ├── confirm-payment/route.ts    # 결제 승인 ✅
│       └── auth/                       # 인증 API ✅
│           ├── login/route.ts
│           ├── register/route.ts
│           ├── logout/route.ts
│           ├── me/route.ts
│           ├── update/route.ts
│           ├── verify-password/route.ts
│           └── delete-account/route.ts
├── components/
│   ├── atoms/                          # 기본 UI 요소
│   │   ├── Banner/                     # 배너 (Hero 포함)
│   │   ├── Badge/                      # 배지
│   │   ├── Price/                      # 가격 표시
│   │   └── Rating/                     # 별점
│   ├── molecules/                      # 조합 컴포넌트
│   │   ├── ProductCard/                # 상품 카드 (할인율 표시)
│   │   ├── SearchBar/                  # 검색바
│   │   ├── ProductImageGallery/        # 이미지 갤러리
│   │   ├── ErrorModal/                 # 에러 모달 ✅
│   │   ├── ConfirmModal/               # 확인 모달 ✅
│   │   └── AuthRequiredModal/          # 로그인 필요 모달 ✅
│   ├── organisms/                      # 복합 컴포넌트
│   │   ├── Header/                     # 헤더 (장바구니/찜목록 카운트) ✅
│   │   ├── ProductGrid/                # 상품 그리드
│   │   └── Footer/                     # 푸터
│   └── templates/                      # 레이아웃
│       ├── Layout/
│       └── PageLayout/
├── hooks/
│   ├── auth/
│   │   └── useAuth.ts                  # 인증 훅 ✅
│   ├── cart/
│   │   └── use-cart.ts                 # 장바구니 훅 ✅
│   ├── wishlist/
│   │   └── use-wishlist.ts             # 찜목록 훅 ✅
│   ├── order/
│   │   └── use-order.ts                # 주문 훅 ✅
│   └── product/
│       └── useProducts.ts              # 상품/리뷰 React Query 훅 ✅
├── lib/
│   ├── api/
│   │   ├── cart.ts                     # 장바구니 API 클라이언트 ✅
│   │   ├── wishlist.ts                 # 찜목록 API 클라이언트 ✅
│   │   └── order.ts                    # 주문 API 클라이언트 ✅
│   ├── supabase/
│   │   ├── client.ts                   # Supabase 클라이언트
│   │   └── server.ts                   # Supabase Admin (서버용)
│   └── react-query/
│       └── provider.tsx                # React Query 설정
├── store/
│   └── authStore.ts                    # Zustand 인증 상태 (localStorage 지속성)
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

#### 장바구니 시스템

- ✅ 장바구니 조회 (실시간 카운트)
- ✅ 상품 추가/삭제
- ✅ 수량 변경
- ✅ 선택 주문 기능
- ✅ 헤더 카운트 배지

#### 찜목록 시스템

- ✅ 찜목록 조회 (실시간 카운트)
- ✅ 찜목록 추가/삭제
- ✅ 장바구니 담기 (자동 찜목록 제거)
- ✅ 헤더 카운트 배지

#### 주문/결제 시스템

- ✅ 주문서 작성 (주문자/배송지 정보)
- ✅ 토스페이먼츠 결제 연동
- ✅ 결제 승인 처리
- ✅ 주문 생성 및 재고 자동 감소
- ✅ 결제 성공/실패 페이지
- ✅ 주문 내역 조회 (페이지네이션)
- ✅ 주문 상세 조회
- ✅ 결제 후 장바구니 자동 비우기

### ⏳ 진행 예정

- ⏳ 관리자 페이지 (상품/주문 관리)
- ⏳ 리뷰 작성 기능
- ⏳ 이미지 업로드 (Supabase Storage)
- ⏳ 검색 자동완성
- ⏳ 무한 스크롤
- ⏳ 배송 추적

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
feat: 완전한 주문/결제 시스템 및 찜목록 구현 (2025-10-25)
- 주문/결제 시스템 완전 구현
- 찜목록 기능 구현
- 장바구니 선택 주문 기능
- 토스페이먼츠 통합
- 주문 내역 및 상세 페이지

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

🎯 다음 세션 시작 시 이렇게 요청하세요:

README를 확인하고 다음 작업을 제안해줘

또는

최근 커밋을 확인하고 장바구니 기능 구현을 도와줘

**다음 작업 제안 요청 예시**:

- "최근 커밋을 확인하고 다음 작업을 제안해줘"
- "장바구니 기능 구현을 도와줘"
- "관리자 페이지 만들어줘"
