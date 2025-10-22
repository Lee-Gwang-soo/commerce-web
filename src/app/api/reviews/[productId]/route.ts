import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const offset = (page - 1) * limit;

    // Fetch reviews with pagination
    const { data: reviews, error, count } = await supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("리뷰 목록 조회 실패:", error);
      return NextResponse.json(
        {
          code: "FETCH_FAILED",
          message: "리뷰 목록 조회 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reviews || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("리뷰 목록 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "리뷰 목록 조회 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
