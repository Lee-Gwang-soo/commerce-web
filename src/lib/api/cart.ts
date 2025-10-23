// 장바구니 API 응답 타입
export interface CartItemWithProduct {
  id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    stock: number;
    images: string[];
    category: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

// 장바구니 관련 API 함수들
export const cartApi = {
  // 사용자 장바구니 조회
  getCartItems: async (): Promise<CartItemWithProduct[]> => {
    const response = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "장바구니 조회에 실패했습니다.");
    }

    const result: ApiResponse<CartItemWithProduct[]> = await response.json();
    return result.data || [];
  },

  // 장바구니에 상품 추가
  addToCart: async (product_id: string, quantity: number = 1) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product_id, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "장바구니 추가에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "수량 업데이트에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
  },

  // 장바구니에서 아이템 제거
  removeFromCart: async (itemId: string) => {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "장바구니 삭제에 실패했습니다.");
    }

    return;
  },
};
