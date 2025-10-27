import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categories = searchParams.get("categories"); // 콤마로 구분된 카테고리들
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const isNew = searchParams.get("new") === "true"; // 신상품 필터
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from("products").select("*", { count: "exact" });

    // Category filter (OR 조건으로 처리)
    if (categories) {
      const categoryArray = categories.split(",").filter(Boolean);
      if (categoryArray.length > 0) {
        query = query.in("category", categoryArray);
      }
    }

    // Search filter (상품명 + 설명)
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 신상품 필터 (3개월 이내)
    if (isNew) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      query = query.gte("created_at", threeMonthsAgo.toISOString());
    }

    // 가격 범위 필터
    if (minPrice) {
      const min = parseInt(minPrice);
      if (!isNaN(min)) {
        query = query.gte("price", min);
      }
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      if (!isNaN(max)) {
        query = query.lte("price", max);
      }
    }

    // Sorting
    const validSorts = ["created_at", "price", "name", "review_count", "sales_count"];
    const sortField = validSorts.includes(sort) ? sort : "created_at";
    const sortOrder = order === "asc" ? { ascending: true } : { ascending: false };

    query = query.order(sortField, sortOrder);

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error("상품 목록 조회 실패:", error);
      return NextResponse.json(
        {
          code: "FETCH_FAILED",
          message: "상품 목록 조회 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: products || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("상품 목록 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "상품 목록 조회 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
