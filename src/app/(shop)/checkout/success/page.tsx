"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDbId, setOrderDbId] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsProcessing(false);
        return;
      }

      try {
        // 결제 승인 API 호출
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "결제 승인에 실패했습니다.");
        }

        // 결제 승인 성공
        setOrderDbId(result.orderDbId);
        setIsProcessing(false);
      } catch (err: any) {
        console.error("결제 승인 오류:", err);
        setError(err.message || "결제 승인 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
            <Typography variant="h3" className="mb-2">
              결제를 처리하고 있습니다
            </Typography>
            <Typography variant="muted">
              잠시만 기다려주세요. 페이지를 벗어나지 마세요.
            </Typography>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Typography variant="h1" className="text-red-600">
                ✕
              </Typography>
            </div>
            <Typography variant="h3" className="mb-2">
              결제 처리 실패
            </Typography>
            <Typography variant="muted" className="mb-6">
              {error}
            </Typography>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/cart")}>
                장바구니로 이동
              </Button>
              <Button onClick={() => router.push("/")}>홈으로 이동</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />

          <Typography variant="h2" className="mb-2">
            주문이 완료되었습니다!
          </Typography>

          <Typography variant="muted" className="mb-8">
            주문해주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.
          </Typography>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography variant="small" color="muted">
                  주문번호
                </Typography>
                <Typography variant="small" className="font-mono">
                  {searchParams.get("orderId")}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="small" color="muted">
                  결제금액
                </Typography>
                <Typography variant="small" className="font-semibold">
                  {parseInt(searchParams.get("amount") || "0").toLocaleString()}원
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push(`/mypage/orders`)}
            >
              주문 내역 보기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/")}
            >
              쇼핑 계속하기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
