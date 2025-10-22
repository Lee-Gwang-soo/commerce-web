import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  Product,
  ProductWithDiscount,
  ProductsResponse,
  ProductDetailResponse,
  ReviewsResponse,
} from "@/types/product";

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

// Fetch products list
export const useProducts = (
  params: UseProductsParams = {},
  options?: Omit<UseQueryOptions<ProductsResponse>, "queryKey" | "queryFn">
) => {
  const { page = 1, limit = 20, category, search, sort, order } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);
  if (sort) queryParams.set("sort", sort);
  if (order) queryParams.set("order", order);

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Fetch product detail
export const useProduct = (
  productId: string | undefined,
  options?: Omit<UseQueryOptions<ProductDetailResponse>, "queryKey" | "queryFn">
) => {
  return useQuery<ProductDetailResponse>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Fetch product reviews
interface UseReviewsParams {
  page?: number;
  limit?: number;
}

export const useProductReviews = (
  productId: string | undefined,
  params: UseReviewsParams = {},
  options?: Omit<UseQueryOptions<ReviewsResponse>, "queryKey" | "queryFn">
) => {
  const { page = 1, limit = 10 } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", productId, params],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await fetch(
        `/api/reviews/${productId}?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 3, // 3 minutes
    ...options,
  });
};
