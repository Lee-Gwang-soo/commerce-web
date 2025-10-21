// app/api/confirm-payment/route.ts
import { NextRequest, NextResponse } from "next/server";

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

      return NextResponse.json(result, { status: response.status });
    }

    // 결제 승인 성공
    console.log("결제 승인 성공:", {
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
    });

    return NextResponse.json(result);
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
