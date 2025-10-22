"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/Typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Package, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useAuth";
import { useEffect, useState } from "react";
import { AuthRequiredModal } from "@/components/molecules/AuthRequiredModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";

export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return <AuthRequiredModal isOpen={showAuthModal} />;
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const menuItems = [
    {
      icon: Package,
      title: "주문내역",
      description: "주문한 상품의 배송 현황을 확인하세요",
      onClick: () => router.push("/mypage/orders"),
      disabled: true,
    },
    {
      icon: Settings,
      title: "정보수정",
      description: "회원정보를 수정하세요",
      onClick: () => router.push("/mypage/password-check"),
      disabled: false,
    },
    {
      icon: LogOut,
      title: "로그아웃",
      description: "안전하게 로그아웃하세요",
      onClick: handleLogout,
      disabled: false,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 pb-6">
            <div className="flex items-center gap-4 pb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex flex-col space-y-2">
                <Typography variant="h3" className="font-bold">
                  {user.name}님
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  {user.email}
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    item.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={!item.disabled ? item.onClick : undefined}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="로그아웃"
        message="로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        type="warning"
      />
    </Layout>
  );
}
