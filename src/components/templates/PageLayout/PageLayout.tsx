"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/atoms/Typography";

const pageLayoutVariants = cva("", {
  variants: {
    maxWidth: {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
    centered: {
      true: "mx-auto",
      false: "",
    },
  },
  defaultVariants: {
    maxWidth: "xl",
    centered: true,
  },
});

const headerVariants = cva("", {
  variants: {
    spacing: {
      sm: "mb-4",
      md: "mb-6",
      lg: "mb-8",
      xl: "mb-12",
    },
    background: {
      none: "",
      muted: "bg-muted/30 -mx-4 px-4 py-6 mb-8",
      card: "bg-card border rounded-lg p-6 mb-8",
    },
  },
  defaultVariants: {
    spacing: "lg",
    background: "none",
  },
});

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageLayoutVariants> {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonHref?: string;
  onBackClick?: () => void;
  headerSpacing?: "sm" | "md" | "lg" | "xl";
  headerBackground?: "none" | "muted" | "card";
  actions?: React.ReactNode;
  showSeparator?: boolean;
}

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      className,
      children,
      title,
      description,
      breadcrumbs,
      showBackButton = false,
      backButtonHref,
      onBackClick,
      headerSpacing = "lg",
      headerBackground = "none",
      actions,
      showSeparator = true,
      maxWidth,
      centered,
      ...props
    },
    ref
  ) => {
    const handleBackClick = () => {
      if (onBackClick) {
        onBackClick();
      } else if (backButtonHref) {
        window.location.href = backButtonHref;
      } else {
        window.history.back();
      }
    };

    const hasHeader =
      title || description || breadcrumbs || showBackButton || actions;

    return (
      <div
        ref={ref}
        className={cn(pageLayoutVariants({ maxWidth, centered }), className)}
        {...props}
      >
        {/* Page Header */}
        {hasHeader && (
          <div
            className={cn(
              headerVariants({
                spacing: headerSpacing,
                background: headerBackground,
              })
            )}
          >
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      {breadcrumb.href ? (
                        <a
                          href={breadcrumb.href}
                          className="hover:text-foreground transition-colors"
                        >
                          {breadcrumb.label}
                        </a>
                      ) : (
                        <span
                          className={
                            index === breadcrumbs.length - 1
                              ? "text-foreground font-medium"
                              : ""
                          }
                        >
                          {breadcrumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Back Button & Title Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {showBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackClick}
                    className="mt-1"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                <div className="min-w-0 flex-1">
                  {title && (
                    <Typography variant="h1" className="mb-2">
                      {title}
                    </Typography>
                  )}
                  {description && (
                    <Typography variant="lead" color="muted">
                      {description}
                    </Typography>
                  )}
                </div>
              </div>

              {/* Actions */}
              {actions && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>

            {/* Separator */}
            {showSeparator && headerBackground === "none" && (
              <Separator className="mt-6" />
            )}
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);

PageLayout.displayName = "PageLayout";

export { PageLayout, pageLayoutVariants };
export default PageLayout;
