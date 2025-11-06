"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { useInfiniteProducts } from "@/hooks/products/use-products";
import { useProductActions } from "@/hooks/products/use-product-actions";

export default function NewProductsPage() {
  const { handleAddToCart, handleToggleWishlist } = useProductActions();
  const [sortBy, setSortBy] = useState("created_at");

  // 신상품 조회 (3개월 이내, 최신순)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      isNew: true,
      sortBy,
      limit: 20,
    });

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;

  // Infinite scroll을 위한 intersection observer
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // 스크롤이 끝에 도달하면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Layout>
      <PageLayout
        title="신상품"
        description="최근 2개월 이내에 출시된 따끈따끈한 신상품들을 만나보세요"
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "신상품" }]}
      >
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="muted">총 {totalCount}개 상품</Typography>

          <ProductSort value={sortBy} onValueChange={setSortBy} showLabel={false} />
        </div>

        {/* 상품 그리드 */}
        <ProductGrid
          products={products}
          loading={isLoading}
          error={error?.message}
          emptyMessage="신상품이 없습니다"
          emptyDescription="새로운 상품들을 준비 중입니다"
          columns="auto"
          gap="lg"
          showLoadMore={false}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleToggleWishlist}
        />

        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                <Typography variant="muted">상품을 불러오는 중...</Typography>
              </div>
            )}
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}
