import { supabase } from "@/lib/supabase/client";
import type { Product, ProductInsert, ProductUpdate } from "@/types/database";

// 상품 관련 API 함수들
export const productsApi = {
  // 모든 상품 조회 (페이지네이션)
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: "created_at" | "price" | "name";
    sortOrder?: "asc" | "desc";
    featured?: boolean;
  }) => {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      featured,
    } = params || {};

    let query = supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("is_active", true);

    // 카테고리 필터
    if (category) {
      query = query.eq("category_id", category);
    }

    // 검색 필터
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 추천 상품 필터
    if (featured !== undefined) {
      query = query.eq("is_featured", featured);
    }

    // 정렬
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data || [],
      totalCount: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // 단일 상품 조회
  getProduct: async (id: string) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    return data;
  },

  // 상품 슬러그로 조회
  getProductBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    return data;
  },

  // 관련 상품 조회
  getRelatedProducts: async (
    productId: string,
    categoryId: string,
    limit = 4
  ) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", productId)
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 추천 상품 조회
  getFeaturedProducts: async (limit = 8) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 최신 상품 조회
  getLatestProducts: async (limit = 8) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 상품 검색
  searchProducts: async (query: string, limit = 20) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 상품 재고 확인
  checkStock: async (productId: string, quantity = 1) => {
    const { data, error } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", productId)
      .single();

    if (error) throw error;
    return data.stock_quantity >= quantity;
  },

  // 카테고리별 상품 수 조회
  getProductCountByCategory: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("category_id, categories(name)")
      .eq("is_active", true);

    if (error) throw error;

    // 카테고리별 개수 집계
    const categoryCount = data?.reduce(
      (acc: Record<string, number>, product) => {
        const categoryId = product.category_id;
        acc[categoryId] = (acc[categoryId] || 0) + 1;
        return acc;
      },
      {}
    );

    return categoryCount || {};
  },
};
