"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const loadingVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    color: {
      default: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      white: "text-white",
      black: "text-black",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

const containerVariants = cva("flex items-center justify-center", {
  variants: {
    direction: {
      horizontal: "flex-row gap-2",
      vertical: "flex-col gap-2",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants>,
    VariantProps<typeof containerVariants> {
  text?: string;
  fullScreen?: boolean;
}

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, color, direction, text, fullScreen, ...props }, ref) => {
    const content = (
      <div
        className={cn(containerVariants({ direction }), className)}
        ref={ref}
        {...props}
      >
        <Loader2 className={cn(loadingVariants({ size, color }))} />
        {text && (
          <span className="text-sm font-medium text-muted-foreground">
            {text}
          </span>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          {content}
        </div>
      );
    }

    return content;
  }
);

Loading.displayName = "Loading";

export { Loading, loadingVariants };
export default Loading;
