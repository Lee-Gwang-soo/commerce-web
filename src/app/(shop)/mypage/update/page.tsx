"use client";

import { useEffect, useState, useCallback } from "react";
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
import { KakaoAddressSearch, type AddressData } from "@/components/molecules/KakaoAddressSearch";

const updateSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    phone: z.string().regex(/^[0-9]+$/, "숫자만 입력해주세요"),
    address: z.string().min(1, "주소를 입력해주세요"),
    addressDetail: z.string().optional(),
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
  const { isAuthenticated, isHydrated } = useAuthStore();
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
  const [updateSuccessModal, setUpdateSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [deleteSuccessModal, setDeleteSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      setDeleteSuccessModal({
        isOpen: true,
        message: "회원 탈퇴가 완료되었습니다.",
      });
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

  // 로그인 체크 (hydration 완료 후)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser) {
      reset({
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
        addressDetail: currentUser.address_detail || "",
      });
      setSelectedAddress(currentUser.address);
    }
  }, [isHydrated, isAuthenticated, currentUser, reset]);

  const openAddressModal = useCallback(() => {
    setShowAddressModal(true);
  }, []);

  const handleAddressSelect = useCallback(
    (data: AddressData) => {
      setSelectedAddress(data.address);
      setValue("address", data.address, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setShowAddressModal(false);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    (data: UpdateFormData) => {
      const updateData: any = {
        email: data.email,
        phone: data.phone,
        address: data.address,
        address_detail: data.addressDetail || null,
      };

      // 비밀번호 변경이 있는 경우
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      updateUser(updateData, {
        onSuccess: () => {
          setUpdateSuccessModal({
            isOpen: true,
            message: "회원정보가 수정되었습니다.",
          });
        },
        onError: (error) => {
          setErrorModal({
            isOpen: true,
            message: error.message || "회원정보 수정에 실패했습니다.",
            title: "수정 실패",
          });
        },
      });
    },
    [updateUser]
  );

  const handleDeleteAccount = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    deleteAccount();
  }, [deleteAccount]);

  // 회원정보 수정 성공 후 페이지 이동
  const handleUpdateSuccessClose = useCallback(() => {
    setUpdateSuccessModal({ isOpen: false, message: "" });
    router.push("/mypage");
  }, [router]);

  // 회원 탈퇴 성공 후 페이지 이동
  const handleDeleteSuccessClose = useCallback(() => {
    setDeleteSuccessModal({ isOpen: false, message: "" });
    router.push("/");
  }, [router]);

  // Hydration 대기 중
  if (!isHydrated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">로딩 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 인증되지 않음
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
                <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
                <Input value={currentUser.userId} readOnly className="bg-gray-50" />
              </div>

              {/* 이름 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <Input
                  value={currentUser.name}
                  readOnly
                  autoComplete="user-name"
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
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* 새 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="새 비밀번호 (8자 이상)"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
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
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="숫자만 입력해주세요"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* 주소 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">주소</label>

                {/* 주소 검색 버튼 */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={openAddressModal}
                  className="w-full justify-center gap-2 h-11 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  우편번호 찾기
                </Button>

                {/* RHF 주소 값 동기화를 위한 hidden input */}
                <input type="hidden" {...register("address")} value={selectedAddress} />

                {/* 주소 표시 영역 */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      기본 주소
                    </label>
                    <div
                      className={`w-full px-3 py-2.5 rounded-md border ${
                        selectedAddress
                          ? "bg-gray-50 border-gray-200 text-gray-900"
                          : "bg-white border-gray-300 text-gray-400"
                      } text-sm`}
                    >
                      {selectedAddress || "주소 검색 버튼을 눌러 주소를 입력해주세요"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      상세 주소
                    </label>
                    <Input
                      {...register("addressDetail")}
                      placeholder="동/호수를 입력해주세요 (예: 101동 101호)"
                      autoComplete="address-line2"
                      className="w-full h-11"
                      disabled={!selectedAddress}
                    />
                  </div>
                </div>

                {errors.address && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.address.message}
                  </div>
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
      <KakaoAddressSearch
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onComplete={handleAddressSelect}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: "", title: "" })}
        type="error"
      />

      {/* Update Success Modal */}
      <ErrorModal
        isOpen={updateSuccessModal.isOpen}
        message={updateSuccessModal.message}
        onClose={handleUpdateSuccessClose}
        type="info"
      />

      {/* Delete Success Modal */}
      <ErrorModal
        isOpen={deleteSuccessModal.isOpen}
        message={deleteSuccessModal.message}
        onClose={handleDeleteSuccessClose}
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
