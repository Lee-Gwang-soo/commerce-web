"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function MobileSearchModal({ isOpen, onClose, onSearch }: MobileSearchModalProps) {
  const [query, setQuery] = useState("");

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
      setQuery("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - 반투명 배경 */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content - 상단 절반 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl animate-in slide-in-from-top duration-300 max-h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-white shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="상품을 검색해보세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 text-base border-gray-300 focus:border-purple-500"
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Content - 스크롤 가능 */}
        <div className="p-4 overflow-y-auto flex-1">
          {query.trim() === "" ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">검색어를 입력해주세요</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">'{query}' 검색 결과</p>
              <Button
                onClick={handleSubmit}
                className="w-full justify-start h-12 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
              >
                <Search className="h-4 w-4 mr-2" />
                {query}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileSearchModal;
