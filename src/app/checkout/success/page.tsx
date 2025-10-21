// app/checkout/success/page.tsx
"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const hasConfirmed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 실행되었으면 리턴
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      console.log("결제 승인 시작:", { paymentKey, orderId, amount });

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsConfirming(false);
        return;
      }

      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const result = await response.json();
        console.log("API 응답:", { status: response.status, result });

        if (!response.ok) {
          console.error("결제 승인 실패:", result);
          setError(
            result.message || result.code || "결제 승인에 실패했습니다."
          );
        } else {
          console.log("결제 승인 성공:", result);
          setPaymentData(result);
        }
      } catch (err) {
        console.error("결제 승인 API 호출 오류:", err);
        setError("결제 승인 중 오류가 발생했습니다.");
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">결제를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">결제 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/checkout"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">결제 성공!</h1>
          <p className="text-gray-600">결제가 정상적으로 완료되었습니다.</p>
        </div>

        {paymentData && (
          <div className="border-t border-b py-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">주문번호</span>
              <span className="font-semibold">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상품명</span>
              <span className="font-semibold">{paymentData.orderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제금액</span>
              <span className="font-semibold text-lg text-blue-600">
                {paymentData.totalAmount?.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제수단</span>
              <span className="font-semibold">{paymentData.method}</span>
            </div>
            {paymentData.card && (
              <div className="flex justify-between">
                <span className="text-gray-600">카드정보</span>
                <span className="font-semibold">
                  {paymentData.card.cardType} ({paymentData.card.number})
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">승인일시</span>
              <span className="font-semibold text-sm">
                {new Date(paymentData.approvedAt).toLocaleString("ko-KR")}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          확인
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p>로딩 중...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
