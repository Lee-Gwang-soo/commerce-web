"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/Typography";

export default function RegisterCompletePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "회원";

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <Typography variant="h3" className="font-bold text-gray-900 mb-2">
                {name}님 환영합니다.
              </Typography>
              <Typography variant="p" className="text-gray-600 mb-6">
                회원가입이 완료되었습니다. 로그인 버튼을 눌러서 로그인해주시기
                바랍니다.
              </Typography>
            </div>

            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
            >
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
