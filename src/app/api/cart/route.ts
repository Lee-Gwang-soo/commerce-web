import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import type { CartItem, Product } from "@/types/database";

// GET - 장바구니 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.id; // UUID (commerce_user.id)

    // 장바구니 아이템 조회 (상품 정보 포함)
    const { data: cartItems, error } = await supabaseAdmin
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        created_at,
        updated_at,
        product:products (
          id,
          name,
          price,
          sale_price,
          stock,
          images,
          category
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("장바구니 조회 실패:", error);
      return NextResponse.json(
        {
          code: "FETCH_FAILED",
          message: "장바구니 조회 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cartItems || [],
    });
  } catch (error) {
    console.error("장바구니 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "장바구니 조회 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// POST - 장바구니에 상품 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.id; // UUID (commerce_user.id)

    const body = await request.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      return NextResponse.json(
        { code: "INVALID_REQUEST", message: "상품 ID가 필요합니다." },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { code: "INVALID_QUANTITY", message: "수량은 1개 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 상품 재고 확인
    const { data: products, error: productError } = (await supabaseAdmin
      .from("products")
      .select("stock")
      .eq("id", product_id)) as any;

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

    // 이미 장바구니에 있는지 확인
    const { data: existingItems } = await supabaseAdmin
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", product_id);

    const existingItem = existingItems && existingItems.length > 0 ? existingItems[0] : null;

    if (existingItem) {
      // 이미 있으면 수량 증가
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json(
          {
            code: "INSUFFICIENT_STOCK",
            message: `재고가 부족합니다. (현재 재고: ${product.stock}개, 장바구니: ${existingItem.quantity}개)`,
          },
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabaseAdmin
        .from("cart_items")
        // @ts-expect-error - Supabase type issue
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() } as any)
        .eq("id", existingItem.id)
        .select()
        .single<CartItem>();

      if (updateError) {
        console.error("장바구니 수량 업데이트 실패:", updateError);
        return NextResponse.json(
          {
            code: "UPDATE_FAILED",
            message: "장바구니 업데이트 중 오류가 발생했습니다.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: "장바구니에 상품이 추가되었습니다.",
      });
    }

    // 새로 추가
    const { data: newItem, error: insertError } = await supabaseAdmin
      .from("cart_items")
      .insert({
        user_id: userId,
        product_id,
        quantity,
      } as any)
      .select()
      .single<CartItem>();

    if (insertError) {
      console.error("장바구니 추가 실패:", insertError);
      return NextResponse.json(
        {
          code: "INSERT_FAILED",
          message: "장바구니 추가 중 오류가 발생했습니다.",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newItem,
        message: "장바구니에 상품이 추가되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("장바구니 추가 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "장바구니 추가 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// DELETE - 장바구니 전체 비우기
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.id; // UUID (commerce_user.id)

    // 사용자의 모든 장바구니 아이템 삭제
    const { error } = await supabaseAdmin.from("cart_items").delete().eq("user_id", userId);

    if (error) {
      console.error("장바구니 전체 삭제 실패:", error);
      return NextResponse.json(
        {
          code: "DELETE_FAILED",
          message: "장바구니 비우기 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "장바구니를 비웠습니다.",
    });
  } catch (error) {
    console.error("장바구니 전체 삭제 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "장바구니 비우기 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
