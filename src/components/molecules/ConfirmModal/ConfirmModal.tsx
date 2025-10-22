"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/Typography";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "default";
}

export function ConfirmModal({
  isOpen,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  type = "default",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const config = {
    danger: {
      confirmButtonColor: "bg-red-600 hover:bg-red-700",
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
    },
    warning: {
      confirmButtonColor: "bg-yellow-600 hover:bg-yellow-700",
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    default: {
      confirmButtonColor: "bg-purple-600 hover:bg-purple-700",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  };

  const { confirmButtonColor, iconColor, bgColor } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
            <AlertCircle className={`w-8 h-8 ${iconColor}`} />
          </div>

          {/* Title */}
          <Typography variant="h3" className="font-bold text-gray-900 mb-3">
            {title}
          </Typography>

          {/* Message */}
          <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </Typography>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-6 rounded-xl font-medium text-base border-gray-300 hover:bg-gray-50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${confirmButtonColor} text-white py-6 rounded-xl font-medium text-base transition-colors`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
