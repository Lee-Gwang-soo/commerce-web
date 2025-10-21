"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { formatPrice, formatDiscountRate } from "@/lib/utils/format";
import { Badge } from "../Badge";

const priceVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "md",
    align: "left",
  },
});

const originalPriceVariants = cva("line-through text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface PriceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceVariants> {
  price: number;
  originalPrice?: number;
  currency?: string;
  showDiscount?: boolean;
  discountFormat?: "percentage" | "amount";
  vertical?: boolean;
}

const Price = forwardRef<HTMLDivElement, PriceProps>(
  (
    {
      className,
      price,
      originalPrice,
      currency = "KRW",
      showDiscount = true,
      discountFormat = "percentage",
      vertical = false,
      size,
      align,
      ...props
    },
    ref
  ) => {
    const hasDiscount = originalPrice && originalPrice > price;
    const discountAmount = hasDiscount ? originalPrice - price : 0;
    const discountPercentage = hasDiscount
      ? ((discountAmount / originalPrice) * 100).toFixed(0)
      : 0;

    return (
      <div
        className={cn(
          "flex items-center gap-2 flex-wrap",
          vertical && "flex-col items-start gap-1",
          priceVariants({ align }),
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            vertical && "flex-col items-start gap-1"
          )}
        >
          {/* 현재 가격 */}
          <span
            className={cn(
              "font-bold text-foreground leading-none",
              priceVariants({ size })
            )}
          >
            {formatPrice(price)}
          </span>

          {/* 원래 가격 (할인이 있을 때) */}
          {hasDiscount && (
            <span
              className={cn(originalPriceVariants({ size }), "leading-none")}
            >
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* 할인 배지 */}
        {hasDiscount && showDiscount && (
          <Badge variant="destructive" size="sm" className="whitespace-nowrap">
            {discountFormat === "percentage"
              ? `${discountPercentage}% 할인`
              : `-${formatPrice(discountAmount)}`}
          </Badge>
        )}
      </div>
    );
  }
);

Price.displayName = "Price";

export { Price, priceVariants };
export default Price;
