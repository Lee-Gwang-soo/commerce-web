"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

const layoutVariants = cva("min-h-screen flex flex-col", {
  variants: {
    variant: {
      default: "",
      centered: "items-center justify-center",
      fullHeight: "h-screen",
    },
    spacing: {
      none: "",
      sm: "gap-4",
      md: "gap-8",
      lg: "gap-12",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "none",
  },
});

const mainVariants = cva("flex-1", {
  variants: {
    container: {
      true: "container mx-auto px-4",
      false: "",
      fluid: "px-4",
    },
    padding: {
      none: "",
      sm: "py-4",
      md: "py-8",
      lg: "py-12",
      xl: "py-16",
    },
  },
  defaultVariants: {
    container: true,
    padding: "md",
  },
});

export interface LayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof layoutVariants> {
  showHeader?: boolean;
  showFooter?: boolean;
  showBanner?: boolean;
  headerProps?: any;
  footerProps?: any;
  mainContainer?: boolean | "fluid";
  mainPadding?: "none" | "sm" | "md" | "lg" | "xl";
  mainClassName?: string;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      className,
      children,
      variant,
      spacing,
      showHeader = true,
      showFooter = true,
      showBanner = true,
      headerProps = {},
      footerProps = {},
      mainContainer = true,
      mainPadding = "md",
      mainClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(layoutVariants({ variant, spacing }), className)}
        {...props}
      >
        {/* Header */}
        {showHeader && <Header {...headerProps} showBanner={showBanner} />}

        {/* Main Content */}
        <main
          className={cn(
            mainVariants({
              container:
                mainContainer === true
                  ? true
                  : mainContainer === "fluid"
                  ? false
                  : false,
              padding: mainPadding,
            }),
            mainContainer === "fluid" && "px-4",
            mainClassName
          )}
        >
          {children}
        </main>

        {/* Footer */}
        {showFooter && <Footer {...footerProps} />}
      </div>
    );
  }
);

Layout.displayName = "Layout";

export { Layout, layoutVariants };
export default Layout;
