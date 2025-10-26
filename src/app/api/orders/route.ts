import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET - 주문 목록 조회
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // 주문 목록 조회 (order_items 포함)
    const { data: orders, error, count } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:products (
            id,
            name,
            images,
            category
          )
        )
      `, { count: 'exact' })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json(
        { code: "FETCH_ERROR", message: "주문 목록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST - 주문 생성
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      cart_items,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_postcode,
      payment_method,
      order_id,
    } = body;

    // 필수 필드 검증
    if (!cart_items || cart_items.length === 0) {
      return NextResponse.json(
        { code: "INVALID_REQUEST", message: "주문할 상품이 없습니다." },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      return NextResponse.json(
        { code: "INVALID_REQUEST", message: "필수 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 장바구니 아이템 검증 및 가격 계산
    const productIds = cart_items.map((item: any) => item.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, sale_price, stock")
      .in("id", productIds);

    if (productsError || !products) {
      return NextResponse.json(
        { code: "FETCH_ERROR", message: "상품 정보 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // 재고 확인 및 총 금액 계산
    let subtotalAmount = 0; // 상품 금액 합계
    const orderItems = [];

    for (const cartItem of cart_items) {
      const product = products.find((p) => p.id === cartItem.product_id);

      if (!product) {
        return NextResponse.json(
          { code: "INVALID_PRODUCT", message: `상품을 찾을 수 없습니다: ${cartItem.product_id}` },
          { status: 400 }
        );
      }

      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { code: "OUT_OF_STOCK", message: `재고가 부족합니다: ${product.name}` },
          { status: 400 }
        );
      }

      const price = product.sale_price || product.price;
      subtotalAmount += price * cartItem.quantity;

      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        price,
      });
    }

    // 배송비 계산 (3만원 미만 3000원)
    const shippingFee = subtotalAmount >= 30000 ? 0 : 3000;
    const totalAmount = subtotalAmount + shippingFee;

    // 주문 생성
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        payment_status: "pending",
        total_amount: totalAmount,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_postcode,
        payment_method,
        order_id,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        {
          code: "CREATE_ERROR",
          message: "주문 생성에 실패했습니다.",
          details: orderError?.message || "Unknown error",
          hint: orderError?.hint,
        },
        { status: 500 }
      );
    }

    // 주문 아이템 생성
    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // 주문 롤백
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        {
          code: "CREATE_ERROR",
          message: "주문 아이템 생성에 실패했습니다.",
          details: itemsError?.message || "Unknown error",
          hint: itemsError?.hint,
        },
        { status: 500 }
      );
    }

    // 재고 감소
    for (const item of orderItems) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        await supabaseAdmin
          .from("products")
          .update({ stock: product.stock - item.quantity })
          .eq("id", item.product_id);
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "서버 오류가 발생했습니다.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
