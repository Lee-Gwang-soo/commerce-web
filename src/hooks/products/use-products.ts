import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import {
  mockProducts,
  getProductById,
  getFeaturedProducts,
  getLatestProducts,
  getRelatedProducts,
  searchProducts,
} from "@/lib/data/mockProducts";

// 상품 목록 조회 훅
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "created_at" | "price" | "name";
  sortOrder?: "asc" | "desc";
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 무한 스크롤 상품 목록 훅
export const useInfiniteProducts = (params?: {
  limit?: number;
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  search?: string;
  sortBy?: string;
  featured?: boolean;
}) => {
  // 빈 배열이나 기본값 처리
  const filteredParams = {
    ...params,
    categories: params?.categories?.length ? params.categories : undefined,
    brands: params?.brands?.length ? params.brands : undefined,
    priceRange:
      params?.priceRange?.min !== 0 || params?.priceRange?.max !== 1000000
        ? params.priceRange
        : undefined,
  };

  return useInfiniteQuery({
    queryKey: ["products", "infinite", filteredParams],
    queryFn: ({ pageParam = 1 }) => {
      // Mock 데이터 필터링
      let filteredProducts = [...mockProducts];

      // 카테고리 필터
      if (params?.categories?.length) {
        filteredProducts = filteredProducts.filter((product) =>
          params.categories!.includes(product.category_id)
        );
      }

      // 검색 필터
      if (params?.search) {
        filteredProducts = searchProducts(params.search);
      }

      // 정렬
      if (params?.sortBy) {
        switch (params.sortBy) {
          case "latest":
            filteredProducts.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            break;
          case "price-low":
            filteredProducts.sort(
              (a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)
            );
            break;
          case "price-high":
            filteredProducts.sort(
              (a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)
            );
            break;
          case "popular":
            filteredProducts.sort(
              (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
            );
            break;
        }
      }

      // 페이지네이션
      const limit = params?.limit || 12;
      const start = (pageParam - 1) * limit;
      const end = start + limit;
      const pageData = filteredProducts.slice(start, end);
      const totalPages = Math.ceil(filteredProducts.length / limit);

      return Promise.resolve({
        data: pageData,
        page: pageParam,
        totalPages,
        totalCount: filteredProducts.length,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분
    select: (data) => {
      // 페이지들의 데이터를 평탄화
      return data.pages.flatMap((page) => page.data);
    },
  });
};

// 단일 상품 조회 훅
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => Promise.resolve(getProductById(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 상품 슬러그로 조회 훅
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", "slug", slug],
    queryFn: () => productsApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 관련 상품 조회 훅
export const useRelatedProducts = (
  productId: string,
  categoryId: string,
  limit = 4
) => {
  return useQuery({
    queryKey: ["products", "related", productId, categoryId, limit],
    queryFn: () =>
      Promise.resolve(getRelatedProducts(productId, categoryId, limit)),
    enabled: !!productId && !!categoryId,
    staleTime: 1000 * 60 * 15, // 15분
  });
};

// 추천 상품 조회 훅
export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => Promise.resolve(getFeaturedProducts(limit)),
    staleTime: 1000 * 60 * 15, // 15분
  });
};

// 최신 상품 조회 훅
export const useLatestProducts = (limit = 8) => {
  return useQuery({
    queryKey: ["products", "latest", limit],
    queryFn: () => Promise.resolve(getLatestProducts(limit)),
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 상품 검색 훅
export const useSearchProducts = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => Promise.resolve(searchProducts(query)),
    enabled: enabled && !!query && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 상품 재고 확인 훅
export const useCheckStock = (productId: string, quantity = 1) => {
  return useQuery({
    queryKey: ["product", "stock", productId, quantity],
    queryFn: () => productsApi.checkStock(productId, quantity),
    enabled: !!productId,
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 재확인
  });
};

// 카테고리별 상품 수 조회 훅
export const useProductCountByCategory = () => {
  return useQuery({
    queryKey: ["products", "count", "by-category"],
    queryFn: productsApi.getProductCountByCategory,
    staleTime: 1000 * 60 * 30, // 30분
  });
};
