import type { Product } from "@/types/database";

// Mock 상품 데이터
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "프리미엄 무선 헤드폰",
    short_description:
      "고음질 노이즈 캔슬링 기능이 탑재된 프리미엄 무선 헤드폰",
    description:
      "액티브 노이즈 캔슬링(ANC) 기술로 주변 소음을 효과적으로 차단하며, 최대 30시간의 연속 재생이 가능합니다. 고해상도 오디오를 지원하여 스튜디오급 음질을 경험할 수 있습니다.",
    price: 299000,
    sale_price: 249000,
    stock_quantity: 50,
    category_id: "electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500",
    ],
    is_featured: true,
    tags: ["무선", "노이즈캔슬링", "프리미엄"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "스마트워치 Pro",
    short_description: "건강 관리와 스마트 기능이 결합된 차세대 스마트워치",
    description:
      "심박수, 혈중산소, 수면 패턴을 실시간으로 모니터링하며, GPS 기능과 50M 방수를 지원합니다. 다양한 운동 모드와 스마트 알림 기능을 제공합니다.",
    price: 450000,
    sale_price: null,
    stock_quantity: 30,
    category_id: "electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
    ],
    is_featured: true,
    tags: ["스마트워치", "건강", "GPS"],
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: "3",
    name: "게이밍 키보드 RGB",
    short_description: "기계식 스위치와 RGB 백라이트를 갖춘 게이밍 키보드",
    description:
      "체리 MX 기계식 스위치를 사용하여 정확하고 빠른 타이핑을 제공합니다. 1680만 컬러 RGB 백라이트와 매크로 기능을 지원하여 게이밍 경험을 극대화합니다.",
    price: 180000,
    sale_price: 150000,
    stock_quantity: 25,
    category_id: "electronics",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ],
    is_featured: false,
    tags: ["게이밍", "키보드", "RGB"],
    created_at: "2024-01-13T10:00:00Z",
    updated_at: "2024-01-13T10:00:00Z",
  },
  {
    id: "4",
    name: "블루투스 스피커",
    short_description: "휴대용 고음질 블루투스 스피커",
    description:
      "IPX7 방수 등급으로 야외 활동에 적합하며, 12시간 연속 재생이 가능합니다. 360도 사운드 기술로 어느 방향에서든 균일한 음질을 제공합니다.",
    price: 120000,
    sale_price: 95000,
    stock_quantity: 40,
    category_id: "electronics",
    images: [
      "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=500",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    ],
    is_featured: false,
    tags: ["블루투스", "스피커", "방수"],
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
  },
  {
    id: "5",
    name: "캐주얼 후드티",
    short_description: "편안한 착용감의 기본 후드티",
    description:
      "100% 코튼 소재로 부드럽고 편안한 착용감을 제공합니다. 세련된 디자인으로 데일리 룩부터 스포츠 웨어까지 다양하게 활용할 수 있습니다.",
    price: 59000,
    sale_price: 45000,
    stock_quantity: 100,
    category_id: "fashion",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
    ],
    is_featured: false,
    tags: ["후드티", "캐주얼", "코튼"],
    created_at: "2024-01-11T10:00:00Z",
    updated_at: "2024-01-11T10:00:00Z",
  },
  {
    id: "6",
    name: "러닝화 Ultimate",
    short_description: "경량 쿠셔닝 러닝화",
    description:
      "혁신적인 폼 기술로 뛰어난 쿠셔닝과 에너지 리턴을 제공합니다. 통기성이 우수한 메시 소재로 장시간 러닝에도 편안함을 유지합니다.",
    price: 220000,
    sale_price: null,
    stock_quantity: 60,
    category_id: "fashion",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
    ],
    is_featured: true,
    tags: ["러닝화", "스포츠", "경량"],
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "7",
    name: "아로마 디퓨저",
    short_description: "초음파 방식의 아로마 디퓨저",
    description:
      "초음파 진동으로 에센셜 오일을 미세하게 분사하여 공간에 은은한 향을 퍼뜨립니다. 7가지 컬러 LED 조명과 타이머 기능을 제공합니다.",
    price: 85000,
    sale_price: 68000,
    stock_quantity: 35,
    category_id: "home",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      "https://images.unsplash.com/photo-1615486363419-b7b0b9e48ddc?w=500",
    ],
    is_featured: false,
    tags: ["아로마", "디퓨저", "홈"],
    created_at: "2024-01-09T10:00:00Z",
    updated_at: "2024-01-09T10:00:00Z",
  },
  {
    id: "8",
    name: "미니멀 책상",
    short_description: "심플한 디자인의 원목 책상",
    description:
      "천연 원목을 사용한 미니멀 디자인의 책상입니다. 넓은 작업 공간과 숨겨진 수납공간을 제공하여 깔끔한 작업 환경을 만들어줍니다.",
    price: 350000,
    sale_price: 280000,
    stock_quantity: 15,
    category_id: "home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=500",
    ],
    is_featured: true,
    tags: ["책상", "원목", "미니멀"],
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z",
  },
];

// ID로 상품 찾기
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

// 카테고리별 상품 필터링
export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter((product) => product.category_id === categoryId);
};

// 추천 상품 가져오기
export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return mockProducts.filter((product) => product.is_featured).slice(0, limit);
};

// 최신 상품 가져오기
export const getLatestProducts = (limit: number = 4): Product[] => {
  return mockProducts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
};

// 관련 상품 가져오기
export const getRelatedProducts = (
  productId: string,
  categoryId: string,
  limit: number = 4
): Product[] => {
  return mockProducts
    .filter(
      (product) =>
        product.id !== productId && product.category_id === categoryId
    )
    .slice(0, limit);
};

// 상품 검색
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.short_description.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};





















