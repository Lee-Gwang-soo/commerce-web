"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/atoms/Typography";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { AuthRequiredModal } from "@/components/molecules/AuthRequiredModal";
import { ErrorModal } from "@/components/molecules/ErrorModal";

export default function PasswordCheckPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const { mutate: verifyPassword, isPending } = useMutation({
    mutationFn: (password: string) => authApi.verifyPassword(password),
    onSuccess: () => {
      router.push("/mypage/update");
    },
    onError: (error: Error) => {
      setErrorModal({
        isOpen: true,
        message: error.message || "비밀번호 확인에 실패했습니다.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorModal({
        isOpen: true,
        message: "비밀번호를 입력해주세요.",
      });
      return;
    }
    verifyPassword(password);
  };

  if (!isAuthenticated) {
    return <AuthRequiredModal isOpen={showAuthModal} />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <Typography variant="h3" className="font-bold mb-2">
                비밀번호 확인
              </Typography>
              <Typography variant="small" className="text-gray-500 text-center">
                회원정보 수정을 위해 비밀번호를 입력해주세요
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="pr-10"
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

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isPending}
              >
                {isPending ? "확인 중..." : "확인"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/mypage")}
              >
                취소
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        type="error"
      />
    </Layout>
  );
}
