import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("products")
      .select("*", { count: "exact" });

    // Category filter
    if (category) {
      query = query.eq("category", category);
    }

    // Search filter
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Sorting
    const validSorts = ["created_at", "price", "name", "review_count"];
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
