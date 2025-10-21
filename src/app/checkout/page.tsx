// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

// TossPayments 타입 선언
declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function CheckoutPage() {
  const [amount, setAmount] = useState(15000);
  const [orderName, setOrderName] = useState("토스 티셔츠 외 2건");
  const [customerName, setCustomerName] = useState("김토스");
  const [customerEmail, setCustomerEmail] = useState("customer123@gmail.com");
  const [selectedMethod, setSelectedMethod] = useState<
    "카드" | "가상계좌" | "계좌이체" | "휴대폰"
  >("카드");
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const handlePayment = async () => {
    if (!isSDKLoaded) {
      alert("결제 모듈을 로딩중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      // TossPayments 객체 초기화
      const tossPayments = window.TossPayments(clientKey);

      const orderId = `order-${Date.now()}`; // 주문 고유 ID (6자 이상 64자 이하)

      // 공통 결제 정보
      const commonPaymentData = {
        amount,
        orderId,
        orderName,
        customerName,
        customerEmail,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      };

      // 결제 수단별로 다른 파라미터
      switch (selectedMethod) {
        case "카드":
          await tossPayments.requestPayment("카드", commonPaymentData);
          break;
        case "가상계좌":
          await tossPayments.requestPayment("가상계좌", {
            ...commonPaymentData,
            validHours: 24, // 입금 유효 시간 (1~720시간)
          });
          break;
        case "계좌이체":
          await tossPayments.requestPayment("계좌이체", commonPaymentData);
          break;
        case "휴대폰":
          await tossPayments.requestPayment("휴대폰", commonPaymentData);
          break;
      }
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청에 실패했습니다.");
    }
  };

  return (
    <>
      {/* 토스페이먼츠 SDK 로드 */}
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={() => setIsSDKLoaded(true)}
        onError={() => alert("결제 모듈 로딩에 실패했습니다.")}
      />

      <div className="max-w-md mx-auto p-6 mt-10">
        <h1 className="text-2xl font-bold mb-6">결제하기</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* 상품 정보 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">상품명</label>
            <input
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 결제 금액 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">결제 금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 주문자명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">주문자명</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">이메일</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 결제 수단 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">결제 수단</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="카드"
                  checked={selectedMethod === "카드"}
                  onChange={(e) => setSelectedMethod(e.target.value as any)}
                  className="mr-3"
                />
                <span>💳 신용/체크카드</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="가상계좌"
                  checked={selectedMethod === "가상계좌"}
                  onChange={(e) => setSelectedMethod(e.target.value as any)}
                  className="mr-3"
                />
                <span>🏦 가상계좌</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="계좌이체"
                  checked={selectedMethod === "계좌이체"}
                  onChange={(e) => setSelectedMethod(e.target.value as any)}
                  className="mr-3"
                />
                <span>🏧 계좌이체</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="휴대폰"
                  checked={selectedMethod === "휴대폰"}
                  onChange={(e) => setSelectedMethod(e.target.value as any)}
                  className="mr-3"
                />
                <span>📱 휴대폰</span>
              </label>
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <button
            onClick={handlePayment}
            disabled={!isSDKLoaded}
            className={`w-full py-4 rounded-lg font-semibold transition ${
              isSDKLoaded
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSDKLoaded
              ? `${amount.toLocaleString()}원 결제하기`
              : "로딩중..."}
          </button>
        </div>

        {/* 테스트 안내 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-semibold mb-2">💡 테스트 결제 안내</p>
          <ul className="space-y-1 text-gray-700">
            <li>• 카드번호: 아무 번호나 입력 가능</li>
            <li>• 유효기간: 미래 날짜면 OK (예: 12/30)</li>
            <li>• CVC: 아무 숫자 3자리 (예: 123)</li>
            <li>• 비밀번호: 앞 2자리 (예: 12)</li>
            <li className="text-red-600 font-semibold">
              • 테스트 환경에서는 실제 결제되지 않습니다
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
