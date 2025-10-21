# Commerce Web - 모던 이커머스 플랫폼

Next.js 14와 Supabase로 구축된 현대적인 이커머스 웹사이트입니다.

## 📋 프로젝트 개요

### 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Data Fetching**: TanStack Query
- **State Management**: Zustand
- **UI Components**: shadcn/ui, Lucide-icon
- **Architecture**: Atomic Design Pattern
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Form** : React-hook-form, Zod
- **Deploy**: Vercel
- **Payment**: 토스 페이먼츠 (개발자용 테스트)

### 🎯 핵심 기능

#### 기본 기능

- ✅ 메인페이지
- ✅ 상품 상세페이지
- ✅ 로그인/회원가입
- ✅ 마이페이지
- ✅ 결제페이지
- ✅ 장바구니
- ✅ 카테고리별 상품페이지
- ✅ 검색기능
- ✅ 배너 관리

#### 추가 기능

- ✅ 위시리스트(찜 목록)
- ✅ 상품 리뷰 및 평점
- ✅ 상품 문의 (Q&A)
- ✅ 주문 내역 조회
- ✅ 재고 관리
- ✅ 최근 본 상품
- ✅ FAQ 및 고객센터
- ✅ SEO 최적화

## 📁 프로젝트 구조

### Atomic Design Pattern

```
src/
├── components/
│   ├── atoms/          # 기본 UI 요소 (Button, Input, Typography)
│   ├── molecules/      # atoms 조합 (SearchBar, ProductCard)
│   ├── organisms/      # 복합 컴포넌트 (Header, ProductGrid)
│   ├── templates/      # 레이아웃 템플릿
│   └── pages/          # 페이지 컴포넌트
├── hooks/              # Custom React Hooks
├── lib/                # 유틸리티 및 설정
│   ├── api/           # API 함수들
│   ├── providers/     # Context Providers
│   ├── supabase/      # Supabase 설정
│   ├── constants/     # 상수 정의
│   ├── utils/         # 유틸리티 함수
│   └── data/          # Mock 데이터
├── stores/             # Zustand 상태 관리
└── types/              # TypeScript 타입 정의
```

### 2단계: UI 컴포넌트 구축 (완료)

- ✅ **Atom 컴포넌트 생성**

  - Typography, Loading, Badge, ExtendedButton
  - Price, Rating, Quantity, ImageWithFallback
  - shadcn/ui 스타일 기반 확장 완료

- ✅ **Molecule 컴포넌트 생성**

  - SearchBar, ProductCard, NavigationItem, CartItem
  - 상호작용과 상태를 가진 복합 컴포넌트

- ✅ **Organism 컴포넌트 생성**

  - Header, Footer, ProductGrid, ErrorBoundary
  - 완전한 UI 섹션 컴포넌트들

- ✅ **Template 컴포넌트 생성**
  - Layout, PageLayout
  - 페이지 레이아웃 템플릿 시스템

### 3단계: 페이지 구현 (진행 중)

- ✅ **메인 페이지 구현**
  - Hero, Features, Categories 섹션 (완료)
  - 추천 상품 및 신상품 섹션
- ⏳ 상품 목록/상세 페이지 (완료)
- ⏳ 인증 페이지 (로그인/회원가입)
- ⏳ 장바구니 및 결제 시스템

### 4단계: 핵심 페이지 구현

- ⏳ 상품 목록 페이지 (/products)
- ⏳ 상품 상세 페이지 (/products/[id])
- ⏳ 카테고리 페이지 (/categories/[slug])
- ⏳ 검색 결과 페이지 (/search)

### 5단계: 사용자 기능

- ⏳ 로그인/회원가입 페이지
- ⏳ 마이페이지 (/mypage)
- ⏳ 주문 내역 페이지
- ⏳ 위시리스트 페이지

### 6단계: 쇼핑 기능

- ⏳ 장바구니 페이지 (/cart)
- ⏳ 결제 페이지 (/checkout)
- ⏳ 주문 완료 페이지
- ⏳ 토스 페이먼츠 연동

### 7단계: 고급 기능

- ⏳ 이미지 최적화 및 CDN
- ⏳ SEO 및 성능 최적화

## 🔧 개발 가이드

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

### Import 순서

1. React 및 Next.js imports
2. Third-party libraries
3. Internal components (atoms → molecules → organisms)
4. Hooks and utilities
5. Types and constants

## 📊 성능 고려사항

- React.memo로 최적화
- 적절한 로딩 상태 구현
- Next.js Image 컴포넌트 사용
- TanStack Query 무한 스크롤
- 적절한 캐싱 전략

## 🎨 UI/UX 가이드라인

- shadcn/ui 컴포넌트 우선 사용
- 반응형 디자인 (모바일 퍼스트)
- 다크/라이트 테마 지원
- 일관된 스페이싱 및 타이포그래피
- 접근성 고려 (WCAG 2.1 AA)

## 📝 버전 관리

- Git Flow 전략 사용
- 커밋 메시지: Conventional Commits
- PR 리뷰 필수
- 자동화된 테스트 및 린팅

---

## 🎉 완성된 컴포넌트 시스템

### Atomic Design Pattern 완성

```
✅ Atoms (8개)
├── Typography        # 텍스트 표시
├── Loading          # 로딩 스피너
├── Badge            # 배지/태그
├── ExtendedButton   # 확장된 버튼
├── Price            # 가격 표시
├── Rating           # 별점 표시
├── Quantity         # 수량 선택
└── ImageWithFallback # 폴백 이미지

✅ Molecules (4개)
├── SearchBar        # 검색 바
├── ProductCard      # 상품 카드
├── NavigationItem   # 네비게이션 아이템
└── CartItem         # 장바구니 아이템

✅ Organisms (4개)
├── Header           # 헤더 (검색, 메뉴, 장바구니)
├── Footer           # 푸터 (링크, 뉴스레터)
├── ProductGrid      # 상품 그리드
└── ErrorBoundary    # 에러 경계

✅ Templates (2개)
├── Layout           # 기본 레이아웃
└── PageLayout       # 페이지 레이아웃
```
