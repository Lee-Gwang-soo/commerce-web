"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const ratingVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    align: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: {
    size: "md",
    align: "left",
  },
});

const starVariants = cva("", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface RatingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ratingVariants> {
  rating: number;
  maxRating?: number;
  showText?: boolean;
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  precision?: number; // 0.5 for half stars, 1 for full stars only
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      rating,
      maxRating = 5,
      showText = false,
      showCount = false,
      count,
      interactive = false,
      onRatingChange,
      precision = 1,
      size,
      align,
      ...props
    },
    ref
  ) => {
    const normalizedRating = Math.max(0, Math.min(maxRating, rating));

    const renderStar = (index: number) => {
      const starRating = index + 1;
      const isFilled = normalizedRating >= starRating;
      const isHalfFilled =
        !isFilled && normalizedRating >= starRating - 0.5 && precision === 0.5;

      const handleClick = () => {
        if (interactive && onRatingChange) {
          onRatingChange(starRating);
        }
      };

      return (
        <button
          key={index}
          type="button"
          className={cn(
            "relative transition-colors",
            interactive && "hover:scale-110 cursor-pointer",
            !interactive && "cursor-default"
          )}
          onClick={handleClick}
          disabled={!interactive}
          aria-label={`Rate ${starRating} out of ${maxRating} stars`}
        >
          <Star
            className={cn(
              starVariants({ size }),
              "transition-colors",
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            )}
          />
          {isHalfFilled && (
            <Star
              className={cn(
                starVariants({ size }),
                "absolute left-0 top-0 fill-yellow-400 text-yellow-400",
                "overflow-hidden"
              )}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          )}
        </button>
      );
    };

    return (
      <div
        className={cn(ratingVariants({ size, align }), className)}
        ref={ref}
        {...props}
      >
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
        </div>

        {/* Rating text */}
        {showText && (
          <span className="ml-2 text-sm text-muted-foreground">
            {normalizedRating.toFixed(precision === 0.5 ? 1 : 0)}
          </span>
        )}

        {/* Count */}
        {showCount && count !== undefined && (
          <span className="ml-1 text-sm text-muted-foreground">
            ({count.toLocaleString()})
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating, ratingVariants };
export default Rating;
