"use client";

import { useState } from "react";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { useInfiniteProducts } from "@/hooks/products/use-products";
import { useAddToCart } from "@/hooks/cart/use-cart";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BestProductsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useAddToCart();
  const [sortBy, setSortBy] = useState("sales_count");

  // 베스트 상품 조회 (판매량 순)
  const {
    data: products = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    sortBy,
    limit: 20,
  });

  // 장바구니 담기 핸들러
  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    addToCart.mutate({ product_id: productId, quantity: 1 });
  };

  return (
    <Layout>
      <PageLayout
        title="베스트 상품"
        description="판매량이 높은 인기 상품들을 만나보세요"
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "베스트" }]}
      >
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="muted">
            총 {products.length}개 상품
          </Typography>

          <ProductSort
            value={sortBy}
            onValueChange={setSortBy}
            showLabel={false}
          />
        </div>

        {/* 상품 그리드 */}
        <ProductGrid
          products={products}
          loading={isLoading}
          error={error?.message}
          emptyMessage="베스트 상품이 없습니다"
          emptyDescription="인기 상품들을 준비 중입니다"
          columns="auto"
          gap="lg"
          showLoadMore={hasNextPage}
          onLoadMore={fetchNextPage}
          loadMoreLoading={isFetchingNextPage}
          loadMoreText="더 많은 상품 보기"
          onAddToCart={handleAddToCart}
        />
      </PageLayout>
    </Layout>
  );
}
