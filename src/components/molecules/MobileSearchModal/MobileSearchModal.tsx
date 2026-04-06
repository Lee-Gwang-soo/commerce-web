"use client";

import { useState, useEffect } from "react";
import { X, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchHistory } from "@/hooks/useSearchHistory";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function MobileSearchModal({ isOpen, onClose, onSearch }: MobileSearchModalProps) {
  const [query, setQuery] = useState("");
  const { history, add, remove, clear } = useSearchHistory();

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
      add(query.trim());
      onSearch(query.trim());
      onClose();
      setQuery("");
    }
  };

  const handleHistorySelect = (item: string) => {
    add(item); // 선택 시 맨 위로 이동
    onSearch(item);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  const hasHistory = history.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl animate-in slide-in-from-top duration-300 max-h-[60vh] flex flex-col">
        {/* 검색 입력 */}
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

        {/* 콘텐츠 영역 */}
        <div className="p-4 overflow-y-auto flex-1">
          {query.trim() === "" ? (
            hasHistory ? (
              /* 최근 검색어 */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    최근 검색어
                  </span>
                  <button
                    onClick={clear}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
                <ul className="space-y-0.5">
                  {history.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                      onClick={() => handleHistorySelect(item)}
                    >
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm text-gray-700">{item}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-200 transition-all"
                        aria-label={`'${item}' 삭제`}
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              /* 히스토리 없을 때 */
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">검색어를 입력해주세요</p>
              </div>
            )
          ) : (
            /* 입력 중 */
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-3">'{query}' 검색하기</p>
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
