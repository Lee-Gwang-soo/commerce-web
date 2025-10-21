// app/checkout/fail/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">결제 실패</h1>
          <p className="text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="mb-2">
            <span className="text-sm text-gray-600">에러 코드</span>
            <p className="font-semibold text-red-700">
              {errorCode || "알 수 없음"}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">실패 사유</span>
            <p className="font-semibold text-red-700">
              {errorMessage || "알 수 없는 오류가 발생했습니다."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="block w-full text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p>로딩 중...</p>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
