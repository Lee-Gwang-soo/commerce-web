"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const extendedButtonVariants = cva("", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    fullWidth: false,
    rounded: "md",
  },
});

export interface ExtendedButtonProps
  extends ButtonProps,
    VariantProps<typeof extendedButtonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ExtendedButton = forwardRef<HTMLButtonElement, ExtendedButtonProps>(
  (
    {
      className,
      children,
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth,
      rounded,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        className={cn(
          extendedButtonVariants({ fullWidth, rounded }),
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {loading ? loadingText || "로딩 중..." : children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Button>
    );
  }
);

ExtendedButton.displayName = "ExtendedButton";

export { ExtendedButton, extendedButtonVariants };
export default ExtendedButton;
