export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    images: string[];
    category: string;
    stock: number;
  };
}

export const wishlistApi = {
  // 찜목록 조회
  getWishlistItems: async (): Promise<WishlistItem[]> => {
    const response = await fetch("/api/wishlist", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜목록 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 찜목록에 추가
  addToWishlist: async (product_id: string): Promise<WishlistItem> => {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product_id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜목록 추가에 실패했습니다.");
    }

    return response.json();
  },

  // 찜목록에서 제거
  removeFromWishlist: async (itemId: string): Promise<void> => {
    const response = await fetch(`/api/wishlist/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "찜목록 삭제에 실패했습니다.");
    }
  },
};
