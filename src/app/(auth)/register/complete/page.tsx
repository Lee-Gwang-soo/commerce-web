"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default function RegisterCompletePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "회원";

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Success Icon with Animation */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 mx-auto relative">
              {/* Outer circle with pulse animation */}
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
              {/* Inner circle */}
              <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white animate-[checkmark_0.5s_ease-in-out]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {name}님, 환영합니다! 🎉
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              회원가입이 완료되었습니다.
              <br />
              지금 바로 로그인하고 쇼핑을 시작하세요!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-base group"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                로그인하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium h-12 text-base group"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              로그인 후 다양한 혜택과 이벤트를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animation for checkmark */}
      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  );
}
