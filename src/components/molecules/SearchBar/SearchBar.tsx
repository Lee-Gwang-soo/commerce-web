"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const searchBarVariants = cva(
  "relative flex items-center border rounded-md bg-background",
  {
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
  }
);

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
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      containerClassName,
      size,
      variant,
      value = "",
      onChange,
      onSearch,
      onClear,
      loading = false,
      showSearchIcon = true,
      showSearchButton = true,
      showClearButton = true,
      clearButtonPosition = "inside",
      placeholder = "검색어를 입력하세요.",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log("newValue", newValue);
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(e);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(currentValue as string);
      }
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      onClear?.();
    };

    const handleSearchClick = () => {
      if (onSearch) {
        onSearch(currentValue as string);
      }
    };

    const hasValue = Boolean(currentValue && String(currentValue).length > 0);

    return (
      <div
        className={cn("relative flex items-center gap-2", containerClassName)}
      >
        <div className={cn(searchBarVariants({ size, variant }), className)}>
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
              showClearButton &&
                clearButtonPosition === "inside" &&
                hasValue &&
                "pr-10"
            )}
            value={currentValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={loading}
            {...props}
          />

          {/* Clear Button (Inside) */}
          {showClearButton &&
            clearButtonPosition === "inside" &&
            hasValue &&
            !loading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 h-6 w-6 p-0 hover:bg-muted"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
        </div>

        {/* Clear Button (Outside) */}
        {showClearButton &&
          clearButtonPosition === "outside" &&
          hasValue &&
          !loading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

        {/* Search Button (Outside) */}
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
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar, searchBarVariants };
export default SearchBar;
