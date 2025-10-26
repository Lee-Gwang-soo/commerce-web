"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />

          <Typography variant="h2" className="mb-2">
            결제에 실패했습니다
          </Typography>

          <Typography variant="muted" className="mb-8">
            {errorMessage || "결제 처리 중 문제가 발생했습니다."}
          </Typography>

          {errorCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <Typography variant="small" color="muted">
                오류 코드: {errorCode}
              </Typography>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push("/checkout")}
            >
              다시 시도하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/cart")}
            >
              장바구니로 돌아가기
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => router.push("/")}
            >
              홈으로 이동
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <Typography variant="small" className="text-blue-800">
              문제가 계속되면 고객센터(1588-1234)로 문의해주세요.
            </Typography>
          </div>
        </div>
      </div>
    </Layout>
  );
}
