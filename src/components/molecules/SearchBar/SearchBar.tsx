"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Search, X, Loader2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchHistory } from "@/hooks/useSearchHistory";

const searchBarVariants = cva("relative flex items-center border rounded-md bg-background", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
    variant: {
      default: "border-input",
      outlined: "border-2 border-primary",
      filled: "bg-muted border-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchBarVariants> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  showSearchIcon?: boolean;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  clearButtonPosition?: "inside" | "outside";
  containerClassName?: string;
  showHistory?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      containerClassName,
      size,
      variant,
      value,
      onChange,
      onSearch,
      onClear,
      loading = false,
      showSearchIcon = true,
      showSearchButton = true,
      showClearButton = true,
      clearButtonPosition = "inside",
      showHistory = true,
      placeholder = "검색어를 입력하세요.",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { history, add, remove, clear } = useSearchHistory();

    const currentValue = value !== undefined ? value : internalValue;

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) setInternalValue(newValue);
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        const val = currentValue as string;
        if (val.trim()) add(val.trim());
        onSearch(val);
        setIsDropdownOpen(false);
      }
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    const handleClear = () => {
      if (value === undefined) setInternalValue("");
      const syntheticEvent = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      onClear?.();
    };

    const handleSearchClick = () => {
      if (onSearch) {
        const val = currentValue as string;
        if (val.trim()) add(val.trim());
        onSearch(val);
        setIsDropdownOpen(false);
      }
    };

    const handleHistorySelect = (query: string) => {
      add(query); // 선택 시 맨 위로 이동
      if (value === undefined) setInternalValue(query);
      const syntheticEvent = { target: { value: query } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      onSearch?.(query);
      setIsDropdownOpen(false);
    };

    const hasValue = Boolean(currentValue && String(currentValue).length > 0);
    const showDropdown = showHistory && isDropdownOpen && history.length > 0;

    return (
      <div
        ref={containerRef}
        className={cn("relative flex items-center gap-2", containerClassName)}
      >
        <div className={cn(searchBarVariants({ size, variant }), "flex-1", className)}>
          {/* Search Icon */}
          {showSearchIcon && (
            <div className="absolute left-3 flex items-center">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Search className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Input */}
          <Input
            ref={ref}
            className={cn(
              "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              showSearchIcon && "pl-10",
              showClearButton && clearButtonPosition === "inside" && hasValue && "pr-10"
            )}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (history.length > 0) setIsDropdownOpen(true);
            }}
            placeholder={placeholder}
            disabled={loading}
            {...props}
          />

          {/* Clear Button (Inside) */}
          {showClearButton && clearButtonPosition === "inside" && hasValue && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 h-6 w-6 p-0 hover:bg-muted"
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Clear Button (Outside) */}
        {showClearButton && clearButtonPosition === "outside" && hasValue && !loading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Search Button */}
        {onSearch && showSearchButton && (
          <Button
            type="button"
            onClick={handleSearchClick}
            disabled={loading || !hasValue}
            className="shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="sr-only md:not-sr-only md:ml-2">검색</span>
          </Button>
        )}

        {/* 최근 검색어 드롭다운 */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                최근 검색어
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  clear();
                  setIsDropdownOpen(false);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                전체 삭제
              </button>
            </div>

            {/* 검색어 목록 */}
            <ul className="py-1 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer group transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleHistorySelect(item);
                  }}
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="flex-1 text-sm text-gray-700">{item}</span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      remove(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-200 transition-all"
                    aria-label={`'${item}' 삭제`}
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar, searchBarVariants };
export default SearchBar;
