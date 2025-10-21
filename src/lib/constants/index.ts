// 애플리케이션 상수들

// API 관련 상수
export const API_ENDPOINTS = {
  AUTH: "/auth",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CART: "/cart",
  USERS: "/users",
  REVIEWS: "/reviews",
} as const;

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

// 상품 관련 상수
export const PRODUCT = {
  DEFAULT_IMAGE: "/images/placeholder-product.jpg",
  MAX_IMAGES: 5,
  MIN_STOCK_WARNING: 5,
} as const;

// 주문 상태
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "대기중",
  [ORDER_STATUS.CONFIRMED]: "확인됨",
  [ORDER_STATUS.SHIPPED]: "배송중",
  [ORDER_STATUS.DELIVERED]: "배송완료",
  [ORDER_STATUS.CANCELLED]: "취소됨",
} as const;

// 결제 상태
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "결제대기",
  [PAYMENT_STATUS.PAID]: "결제완료",
  [PAYMENT_STATUS.FAILED]: "결제실패",
  [PAYMENT_STATUS.REFUNDED]: "환불완료",
} as const;

// 쿼리 키
export const QUERY_KEYS = {
  AUTH: ["auth"],
  PROFILE: ["profile"],
  PRODUCTS: ["products"],
  PRODUCT: ["product"],
  CATEGORIES: ["categories"],
  CATEGORY: ["category"],
  CART: ["cart"],
  ORDERS: ["orders"],
  ORDER: ["order"],
  REVIEWS: ["reviews"],
  WISHLIST: ["wishlist"],
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  CART: "cart",
  RECENTLY_VIEWED: "recently-viewed",
  SEARCH_HISTORY: "search-history",
  USER_PREFERENCES: "user-preferences",
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCTS: "/products",
  PRODUCT: "/products/:id",
  CATEGORY: "/categories/:slug",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  PROFILE: "/mypage",
  SEARCH: "/search",
} as const;

// 이미지 크기
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 300 },
  MEDIUM: { width: 500, height: 500 },
  LARGE: { width: 800, height: 800 },
  HERO: { width: 1200, height: 600 },
} as const;

// 애니메이션 지속시간
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 검증 규칙
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^[0-9-+().\s]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
