"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/atoms/Typography";

const sortVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "gap-4",
      vertical: "flex-col gap-2 items-start",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});

export interface SortOption {
  value: string;
  label: string;
}

export interface ProductSortProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sortVariants> {
  options?: SortOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  showLabel?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const defaultSortOptions: SortOption[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "price-low", label: "가격 낮은순" },
  { value: "price-high", label: "가격 높은순" },
  { value: "rating", label: "평점순" },
  { value: "sales", label: "판매순" },
];

const ProductSort = forwardRef<HTMLDivElement, ProductSortProps>(
  (
    {
      className,
      options = defaultSortOptions,
      value,
      onValueChange,
      showLabel = true,
      placeholder = "정렬 기준",
      disabled = false,
      orientation,
      size,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(sortVariants({ orientation, size }), className)}
        {...props}
      >
        {showLabel && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Typography variant="small" color="muted">
              정렬
            </Typography>
          </div>
        )}

        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

ProductSort.displayName = "ProductSort";

export { ProductSort, sortVariants, defaultSortOptions };
export default ProductSort;

