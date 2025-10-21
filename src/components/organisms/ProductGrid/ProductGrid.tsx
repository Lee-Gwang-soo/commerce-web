"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Loading } from "@/components/atoms/Loading";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";

const productGridVariants = cva("", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      // Make cards larger on small/medium screens by reducing columns
      auto: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    },
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    columns: "auto",
    gap: "md",
  },
});

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center py-12 px-4 text-center",
  {
    variants: {
      size: {
        sm: "py-8",
        md: "py-12",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ProductGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof productGridVariants> {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyDescription?: string;
  showEmptyAction?: boolean;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  wishlistItems?: string[];
  cardSize?: "sm" | "md" | "lg" | "full";
  cardLayout?: "vertical" | "horizontal";
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLoading?: boolean;
  loadMoreText?: string;
}

const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  (
    {
      className,
      products,
      loading = false,
      error = null,
      emptyMessage = "상품이 없습니다",
      emptyDescription = "다른 카테고리를 확인해보세요",
      showEmptyAction = false,
      emptyActionText = "전체 상품 보기",
      onEmptyAction,
      onProductClick,
      onAddToCart,
      onAddToWishlist,
      onQuickView,
      wishlistItems = [],
      cardSize = "full",
      cardLayout = "vertical",
      columns,
      gap,
      showLoadMore = false,
      onLoadMore,
      loadMoreLoading = false,
      loadMoreText = "더 보기",
      ...props
    },
    ref
  ) => {
    // Loading State
    if (loading && products.length === 0) {
      return (
        <div
          className={cn(emptyStateVariants(), className)}
          ref={ref}
          {...props}
        >
          <Loading size="lg" text="상품을 불러오는 중..." />
        </div>
      );
    }

    // Error State
    if (error) {
      return (
        <div
          className={cn(emptyStateVariants(), className)}
          ref={ref}
          {...props}
        >
          <Typography variant="h5" color="destructive" className="mb-2">
            오류가 발생했습니다
          </Typography>
          <Typography variant="muted" className="mb-6">
            {error}
          </Typography>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      );
    }

    // Empty State
    if (products.length === 0) {
      return (
        <div
          className={cn(emptyStateVariants(), className)}
          ref={ref}
          {...props}
        >
          <Typography variant="h5" className="mb-2">
            {emptyMessage}
          </Typography>
          <Typography variant="muted" className="mb-6">
            {emptyDescription}
          </Typography>
          {showEmptyAction && onEmptyAction && (
            <Button onClick={onEmptyAction}>{emptyActionText}</Button>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        {/* Product Grid */}
        <div className={cn("grid", productGridVariants({ columns, gap }))}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size={cardSize}
              layout={cardLayout}
              onClick={onProductClick}
              onCartClick={onAddToCart}
              onWishlistClick={onAddToWishlist}
              onQuickView={onQuickView}
              isInWishlist={wishlistItems.includes(product.id)}
              showQuickView={!!onQuickView}
            />
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && onLoadMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={loadMoreLoading}
            >
              {loadMoreLoading ? "로딩 중..." : loadMoreText}
            </Button>
          </div>
        )}

        {/* Loading Overlay for Additional Items */}
        {loading && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <Loading text="추가 상품을 불러오는 중..." />
          </div>
        )}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";

export { ProductGrid, productGridVariants };
export default ProductGrid;
