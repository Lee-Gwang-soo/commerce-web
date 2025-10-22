import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        {
          code: "PRODUCT_NOT_FOUND",
          message: "상품을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // Calculate discount information
    const discount_rate = product.sale_price
      ? Math.round(
          ((product.price - product.sale_price) / product.price) * 100
        )
      : null;

    const discount_amount = product.sale_price
      ? product.price - product.sale_price
      : null;

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        discount_rate,
        discount_amount,
      },
    });
  } catch (error) {
    console.error("상품 상세 조회 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "상품 상세 조회 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
