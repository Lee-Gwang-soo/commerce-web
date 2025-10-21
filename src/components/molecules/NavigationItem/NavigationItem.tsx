"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";

const navigationItemVariants = cva(
  "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary hover:bg-accent",
        active: "text-primary bg-accent",
        muted: "text-muted-foreground hover:text-foreground hover:bg-accent",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      orientation: "horizontal",
    },
  }
);

export interface NavigationItemProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navigationItemVariants> {
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  external?: boolean;
  disabled?: boolean;
  as?: "a" | "button" | "div";
}

const NavigationItem = forwardRef<HTMLElement, NavigationItemProps>(
  (
    {
      className,
      children,
      href,
      icon,
      badge,
      hasSubmenu,
      isExpanded,
      onToggle,
      external = false,
      disabled = false,
      variant,
      size,
      orientation,
      onClick,
      ...props
    },
    ref
  ) => {
    const content = (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span
            className={cn(
              "truncate",
              orientation === "vertical" && "text-left"
            )}
          >
            {children}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant="secondary" size="sm">
              {badge}
            </Badge>
          )}
          {hasSubmenu && (
            <span className="flex-shrink-0">
              {orientation === "vertical" ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </span>
          )}
        </div>
      </div>
    );

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (hasSubmenu && onToggle) {
        e.preventDefault();
        onToggle();
      }

      onClick?.(e);
    };

    const baseClassName = cn(
      navigationItemVariants({ variant, size, orientation }),
      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      className
    );

    // Link 컴포넌트 사용 (href가 있고 서브메뉴가 없는 경우)
    if (href && !hasSubmenu && !disabled) {
      const linkProps = external
        ? {
            href,
            target: "_blank" as const,
            rel: "noopener noreferrer",
          }
        : { href };

      return (
        <Link
          {...linkProps}
          className={baseClassName}
          onClick={handleClick}
          {...props}
        >
          {content}
        </Link>
      );
    }

    // Button 컴포넌트 사용 (서브메뉴가 있거나 클릭 가능한 경우)
    if (hasSubmenu || onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={baseClassName}
          onClick={handleClick}
          aria-expanded={hasSubmenu ? isExpanded : undefined}
          disabled={disabled}
          {...props}
        >
          {content}
        </button>
      );
    }

    // Div 컴포넌트 사용 (기본 케이스)
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseClassName}
        onClick={handleClick}
        {...props}
      >
        {content}
      </div>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

export { NavigationItem, navigationItemVariants };
export default NavigationItem;
