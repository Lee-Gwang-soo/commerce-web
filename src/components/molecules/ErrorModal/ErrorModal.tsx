"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/Typography";
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?: "error" | "warning" | "info";
}

export function ErrorModal({
  isOpen,
  title,
  message,
  onClose,
  type = "error",
}: ErrorModalProps) {
  if (!isOpen) return null;

  const config = {
    error: {
      icon: XCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      buttonColor: "bg-red-600 hover:bg-red-700",
      defaultTitle: "오류",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      defaultTitle: "경고",
    },
    info: {
      icon: AlertCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      defaultTitle: "알림",
    },
  };

  const { icon: Icon, iconColor, bgColor, buttonColor, defaultTitle } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>

          {/* Title */}
          <Typography variant="h3" className="font-bold text-gray-900 mb-3">
            {title || defaultTitle}
          </Typography>

          {/* Message */}
          <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </Typography>

          {/* Button */}
          <Button
            onClick={onClose}
            className={`w-full ${buttonColor} text-white py-6 rounded-xl font-medium text-base transition-colors`}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
