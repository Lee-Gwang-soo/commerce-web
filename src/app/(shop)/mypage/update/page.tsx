"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/atoms/Typography";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateUser, useCurrentUser } from "@/hooks/auth/useAuth";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { AuthRequiredModal } from "@/components/molecules/AuthRequiredModal";
import { ErrorModal } from "@/components/molecules/ErrorModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";

const updateSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    phone: z.string().regex(/^[0-9]+$/, "숫자만 입력해주세요"),
    address: z.string().min(1, "주소를 입력해주세요"),
  })
  .refine(
    (data) => {
      // 새 비밀번호나 확인 비밀번호가 있으면 현재 비밀번호도 필수
      if (data.newPassword || data.confirmPassword) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: "비밀번호 변경 시 현재 비밀번호를 입력해주세요",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // 현재 비밀번호가 있으면 새 비밀번호도 필수
      if (data.currentPassword) {
        return !!data.newPassword;
      }
      return true;
    },
    {
      message: "새 비밀번호를 입력해주세요",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // 새 비밀번호와 확인 비밀번호가 일치하는지
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "새 비밀번호가 일치하지 않습니다",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // 새 비밀번호 길이 검증
      if (data.newPassword) {
        return data.newPassword.length >= 8;
      }
      return true;
    },
    {
      message: "비밀번호는 8자 이상이어야 합니다",
      path: ["newPassword"],
    }
  );

type UpdateFormData = z.infer<typeof updateSchema>;

export default function UpdatePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
    title: "",
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      setSuccessModal({
        isOpen: true,
        message: "회원 탈퇴가 완료되었습니다.",
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
    onError: (error: Error) => {
      setErrorModal({
        isOpen: true,
        message: error.message || "회원 탈퇴에 실패했습니다.",
        title: "탈퇴 실패",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser) {
      reset({
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
      });
      setSelectedAddress(currentUser.address);
    }
  }, [isAuthenticated, currentUser, reset]);

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setValue("address", address, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setShowAddressModal(false);
  };

  const onSubmit = (data: UpdateFormData) => {
    const updateData: any = {
      email: data.email,
      phone: data.phone,
      address: data.address,
    };

    // 비밀번호 변경이 있는 경우
    if (data.currentPassword && data.newPassword) {
      updateData.currentPassword = data.currentPassword;
      updateData.newPassword = data.newPassword;
    }

    updateUser(updateData, {
      onSuccess: () => {
        setSuccessModal({
          isOpen: true,
          message: "회원정보가 수정되었습니다.",
        });
        setTimeout(() => {
          router.push("/mypage");
        }, 3000);
      },
      onError: (error) => {
        setErrorModal({
          isOpen: true,
          message: error.message || "회원정보 수정에 실패했습니다.",
          title: "수정 실패",
        });
      },
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteAccount();
  };

  if (!isAuthenticated || !currentUser) {
    return <AuthRequiredModal isOpen={showAuthModal} />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <Typography variant="h3" className="font-bold mb-8">
              회원정보 수정
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 아이디 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디
                </label>
                <Input
                  value={currentUser.userId}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* 이름 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <Input
                  value={currentUser.name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* 현재 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호 (변경 시에만 입력)
                </label>
                <div className="relative">
                  <Input
                    {...register("currentPassword")}
                    type={showPassword ? "text" : "password"}
                    placeholder="현재 비밀번호"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* 새 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호
                </label>
                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="새 비밀번호 (8자 이상)"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* 새 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="새 비밀번호 확인"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <Input
                  {...register("phone")}
                  placeholder="숫자만 입력해주세요"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openAddressModal}
                  className="w-full justify-start"
                >
                  주소 검색
                </Button>
                <input
                  type="hidden"
                  {...register("address")}
                  value={selectedAddress}
                />
                {selectedAddress && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedAddress}
                  </p>
                )}
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* 버튼 영역 - 탈퇴(좌) / 수정(우) */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "탈퇴 중..." : "회원 탈퇴"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "회원정보 수정"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSelect={handleAddressSelect}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: "", title: "" })}
        type="error"
      />

      {/* Success Modal */}
      <ErrorModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        type="info"
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
      />
    </Layout>
  );
}

// 주소 검색 모달 컴포넌트
function AddressModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (address: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    const dummyResults = [
      "서울시 강남구 테헤란로 123",
      "서울시 강남구 역삼동 456",
      "서울시 강남구 삼성동 789",
    ];
    setResults(dummyResults);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="주소를 입력하세요"
              className="flex-1"
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>
          <div className="space-y-2">
            {results.map((address, index) => (
              <div
                key={index}
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => onSelect(address)}
              >
                {address}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
