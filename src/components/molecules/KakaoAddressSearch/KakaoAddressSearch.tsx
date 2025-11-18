"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

declare global {
  interface Window {
    daum: any;
  }
}

export interface AddressData {
  address: string; // 기본 주소
  zonecode: string; // 우편번호
  addressType: string; // 주소 타입 (R: 도로명, J: 지번)
  buildingName?: string; // 건물명
}

interface KakaoAddressSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: AddressData) => void;
}

export function KakaoAddressSearch({ isOpen, onClose, onComplete }: KakaoAddressSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // 스크립트가 이미 로드되었거나 모달이 열리지 않았으면 리턴
    if (scriptLoaded.current || !isOpen) return;

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    script.onload = () => {
      scriptLoaded.current = true;
      initializeDaumPostcode();
    };

    script.onerror = () => {
      console.error("Kakao 주소 검색 스크립트 로드 실패");
      alert("주소 검색 서비스를 불러오는데 실패했습니다.");
      onClose();
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거하지 않음 (재사용)
    };
  }, [isOpen]);

  const initializeDaumPostcode = () => {
    if (!window.daum || !containerRef.current) return;

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        // 도로명 주소 또는 지번 주소 선택
        const address = data.roadAddress || data.jibunAddress;
        const addressData: AddressData = {
          address: address,
          zonecode: data.zonecode,
          addressType: data.addressType,
          buildingName: data.buildingName,
        };

        onComplete(addressData);
        onClose();
      },
      onclose: function () {
        onClose();
      },
      width: "100%",
      height: "100%",
    }).embed(containerRef.current);
  };

  useEffect(() => {
    // 스크립트가 이미 로드되어 있고 모달이 열리면 바로 초기화
    if (scriptLoaded.current && isOpen && window.daum) {
      initializeDaumPostcode();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Daum Postcode Container */}
        <div ref={containerRef} className="flex-1 overflow-hidden" />

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            주소를 검색한 후 선택하시면 자동으로 입력됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default KakaoAddressSearch;
