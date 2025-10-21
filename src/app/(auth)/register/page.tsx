"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/atoms/Typography";
import { CircleCheck } from "lucide-react";

// Zod 스키마 정의
const signupSchema = z
  .object({
    userId: z
      .string()
      .min(1, "아이디를 입력해주세요")
      .min(4, "아이디는 4자 이상이어야 합니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 8자 이상이어야 합니다"),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    emailDomain: z.string().min(1, "이메일 도메인을 선택해주세요"),
    phone: z
      .string()
      .min(1, "휴대폰 번호를 입력해주세요")
      .regex(/^[0-9]+$/, "숫자만 입력해주세요"),
    address: z.string().min(1, "주소를 입력해주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const terms = [
  { id: "terms", label: "이용약관 동의 (필수)", required: true },
  { id: "privacy", label: "개인정보 수집·이용 동의 (필수)", required: true },
  {
    id: "marketing",
    label: "마케팅 광고 활용을 위한 수집 및 이용 동의 (선택)",
    required: false,
  },
  {
    id: "benefits",
    label: "무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)",
    required: false,
  },
  { id: "age", label: "본인은 만 14세 이상입니다. (필수)", required: true },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [agreements, setAgreements] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    marketing: false,
    benefits: false,
    age: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordMatch = password === confirmPassword;

  // 전체 동의 상태 확인
  const isAllAgreed = Object.values(agreements).every(Boolean);
  const requiredAgreements = terms.filter((term) => term.required);
  const isRequiredAgreed = requiredAgreements.every(
    (term) => agreements[term.id]
  );

  // 전체 동의 토글
  const handleAllAgreement = (checked: boolean) => {
    const newAgreements = terms.reduce((acc, term) => {
      acc[term.id] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setAgreements(newAgreements);
  };

  // 개별 동의 토글
  const handleIndividualAgreement = (termId: string, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [termId]: checked,
    }));
  };

  // 주소 검색 모달 열기
  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  // 주소 선택 완료
  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setValue("address", address);
    setShowAddressModal(false);
  };

  // 폼 제출
  const onSubmit = (data: SignupFormData) => {
    // 임시로 회원가입 완료 페이지로 이동
    router.push(`/register/complete?name=${encodeURIComponent(data.name)}`);
  };

  // 폼 유효성 검사
  const isFormValid = isValid && isRequiredAgreed && selectedAddress;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <Typography variant="h3" className="font-bold">
                회원가입
              </Typography>
              <Typography variant="small" className="text-red-500 flex gap-1">
                *
                <Typography variant="small" className="text-gray-500">
                  필수입력사항
                </Typography>
              </Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("userId")}
                  placeholder="아이디를 입력해주세요"
                  className={errors.userId ? "border-red-500" : ""}
                />
                {errors.userId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userId.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호확인 <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="비밀번호를 한번 더 입력해주세요"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {!passwordMatch && confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="이름을 입력해 주세요"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    {...register("email")}
                    placeholder="예: marketkurly"
                    className={`flex-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
                {errors.emailDomain && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emailDomain.message}
                  </p>
                )}
              </div>

              {/* 휴대폰 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  휴대폰 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    {...register("phone")}
                    placeholder="숫자만 입력해주세요."
                    className={errors.phone ? "border-red-500" : ""}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openAddressModal}
                  className="w-full justify-start"
                >
                  Q 주소 검색
                </Button>
                {selectedAddress && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedAddress}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  배송지에 따라 상품 정보가 달라질 수 있습니다.
                </p>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* 이용약관동의 */}
              <div className="border-t pt-6">
                <div className="space-y-6">
                  {/* 전체 동의 */}
                  <div className="flex items-center gap-2">
                    <CircleCheck
                      className={`h-5 w-5 cursor-pointer ${
                        isAllAgreed ? "text-purple-600" : "text-gray-400"
                      }`}
                      onClick={() => handleAllAgreement(!isAllAgreed)}
                    />
                    <span className="font-medium">전체 동의합니다.</span>
                  </div>

                  {/* 개별 약관 */}
                  <div className="space-y-3">
                    {terms.map((term) => (
                      <div key={term.id} className="flex items-center gap-2">
                        <CircleCheck
                          className={`h-4 w-4 cursor-pointer ${
                            agreements[term.id]
                              ? "text-purple-600"
                              : "text-gray-400"
                          }`}
                          onClick={() =>
                            handleIndividualAgreement(
                              term.id,
                              !agreements[term.id]
                            )
                          }
                        />
                        <span className="text-sm">{term.label}</span>
                        <Link
                          href="#"
                          className="text-sm text-purple-600 ml-auto"
                        >
                          약관보기 &gt;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 가입하기 버튼 */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
                disabled={!isFormValid}
              >
                가입하기
              </Button>
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
    // 임시 더미 데이터 (실제로는 카카오 API 연동)
    const dummyResults = [
      "서울특별시 강남구 테헤란로 123",
      "서울특별시 강남구 역삼동 456",
      "서울특별시 강남구 삼성동 789",
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
