"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/atoms/Typography";
import { useAuth } from "@/hooks/auth/use-auth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login - in real app would call actual auth service
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showBanner={false}>
      <div className="min-h-[calc(100vh-30rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Typography variant="h3" className="mb-2 text-purple-600 font-bold">
              로그인
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <Input
                id="email"
                type="email"
                placeholder="아이디를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                아이디 찾기 | 비밀번호 찾기
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

            {/* Register Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium"
              asChild
            >
              <Link href="/register">회원가입</Link>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">
                  간편 로그인
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="pt-4 space-y-3">
              <Button
                type="button"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                <span className="text-lg mr-2">N</span>
                네이버로 계속하기
              </Button>

              <Button
                type="button"
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              >
                <span className="text-lg mr-2">●</span>
                카카오로 계속하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
