import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// PATCH - 장바구니 아이템 수량 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { code: "INVALID_QUANTITY", message: "수량은 1개 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 장바구니 아이템 조회 (소유자 확인 + 상품 정보)
    const { data: cartItems, error: fetchError } = await supabaseAdmin
      .from("cart_items")
      .select("id, user_id, product_id, quantity")
      .eq("id", id);

    if (fetchError || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { code: "CART_ITEM_NOT_FOUND", message: "장바구니 아이템을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const cartItem = cartItems[0];

    if (cartItem.user_id !== userId) {
      return NextResponse.json(
        { code: "FORBIDDEN", message: "권한이 없습니다." },
        { status: 403 }
      );
    }

    // 상품 재고 확인
    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("stock")
      .eq("id", cartItem.product_id);

    if (productError || !products || products.length === 0) {
      return NextResponse.json(
        { code: "PRODUCT_NOT_FOUND", message: "상품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const product = products[0];

    if (product.stock < quantity) {
      return NextResponse.json(
        {
          code: "INSUFFICIENT_STOCK",
          message: `재고가 부족합니다. (현재 재고: ${product.stock}개)`,
        },
        { status: 400 }
      );
    }

    // 수량 업데이트
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("장바구니 수량 업데이트 실패:", updateError);
      return NextResponse.json(
        {
          code: "UPDATE_FAILED",
          message: "수량 업데이트 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: "수량이 변경되었습니다.",
    });
  } catch (error) {
    console.error("장바구니 수량 변경 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "수량 변경 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// DELETE - 장바구니 아이템 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = params;

    // 장바구니 아이템 조회 (소유자 확인)
    const { data: cartItems, error: fetchError } = await supabaseAdmin
      .from("cart_items")
      .select("user_id")
      .eq("id", id);

    if (fetchError || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { code: "CART_ITEM_NOT_FOUND", message: "장바구니 아이템을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const cartItem = cartItems[0];

    if (cartItem.user_id !== userId) {
      return NextResponse.json(
        { code: "FORBIDDEN", message: "권한이 없습니다." },
        { status: 403 }
      );
    }

    // 삭제
    const { error: deleteError } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("장바구니 아이템 삭제 실패:", deleteError);
      return NextResponse.json(
        {
          code: "DELETE_FAILED",
          message: "장바구니 아이템 삭제 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "장바구니에서 상품이 제거되었습니다.",
    });
  } catch (error) {
    console.error("장바구니 삭제 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "장바구니 삭제 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
