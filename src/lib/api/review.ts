export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    images: string[];
    price: number;
    sale_price: number | null;
  };
}

export interface CreateReviewInput {
  product_id: string;
  content: string;
  images?: string[];
}

export interface UpdateReviewInput {
  content: string;
  images?: string[];
}

export interface MyReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const reviewApi = {
  // 리뷰 작성
  createReview: async (input: CreateReviewInput): Promise<Review> => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "리뷰 작성에 실패했습니다.");
    }

    return response.json();
  },

  // 내 리뷰 목록 조회 (무한 스크롤)
  getMyReviews: async (page: number = 1, limit: number = 10): Promise<MyReviewsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`/api/reviews?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "리뷰 목록 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 리뷰 수정
  updateReview: async (id: string, input: UpdateReviewInput): Promise<Review> => {
    const response = await fetch(`/api/reviews/my/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "리뷰 수정에 실패했습니다.");
    }

    return response.json();
  },

  // 리뷰 삭제
  deleteReview: async (id: string): Promise<void> => {
    const response = await fetch(`/api/reviews/my/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "리뷰 삭제에 실패했습니다.");
    }
  },
};
