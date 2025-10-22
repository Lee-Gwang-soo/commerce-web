"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/Typography";
import { Lock } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onClose) {
      onClose();
    }
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleConfirm}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>

          {/* Title */}
          <Typography variant="h3" className="font-bold text-gray-900 mb-3">
            로그인이 필요합니다
          </Typography>

          {/* Message */}
          <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
            로그인하셔야 본 서비스를 이용하실 수 있습니다.
          </Typography>

          {/* Button */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl font-medium text-base transition-colors"
          >
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
