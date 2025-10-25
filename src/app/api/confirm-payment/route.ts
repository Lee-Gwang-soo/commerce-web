// app/api/confirm-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const secretKey = process.env.TOSS_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "필수 파라미터가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }


    // 주문 확인
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", userId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { code: "ORDER_NOT_FOUND", message: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 금액 검증
    if (order.total_amount !== amount) {
      return NextResponse.json(
        { code: "AMOUNT_MISMATCH", message: "주문 금액이 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      // 토스페이먼츠 API 오류 응답 로깅
      console.error("결제 승인 실패:", {
        status: response.status,
        code: result.code,
        message: result.message,
      });

      // 주문 상태를 결제 실패로 업데이트
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return NextResponse.json(result, { status: response.status });
    }

    // 결제 승인 성공 - 주문 상태 업데이트
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_key: paymentKey,
        status: "payment_confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("주문 상태 업데이트 실패:", updateError);
    }

    // 장바구니 비우기
    await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    // 결제 승인 성공
    console.log("결제 승인 성공:", {
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
    });

    return NextResponse.json({
      ...result,
      orderDbId: order.id,
    });
  } catch (error) {
    console.error("결제 승인 API 오류:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "결제 승인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
