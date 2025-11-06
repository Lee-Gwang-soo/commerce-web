"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductFilters } from "@/components/molecules/ProductFilters";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInfiniteProducts } from "@/hooks/products/use-products";
import { useProductActions } from "@/hooks/products/use-product-actions";
import { CATEGORIES, getCategoryInfo } from "@/lib/constants/categories";
import type { Category } from "@/types/product";
import type {
  FilterOption,
  PriceRange,
} from "@/components/molecules/ProductFilters/ProductFilters";

// 카테고리 매핑
const categoryMap: Record<string, { id: string; name: string; description: string }> =
  CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.slug] = {
        id: cat.slug,
        name: cat.label,
        description: cat.description,
      };
      return acc;
    },
    {} as Record<string, { id: string; name: string; description: string }>
  );

// 서브카테고리는 일단 빈 배열로 (필요시 나중에 추가)
const subcategoryMap: Record<string, FilterOption[]> = {};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { handleAddToCart, handleToggleWishlist } = useProductActions();

  // 카테고리 정보
  const category = categoryMap[slug];
  const subcategories = subcategoryMap[slug] || [];

  // 필터 상태
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000000,
  });
  const [sortBy, setSortBy] = useState("latest");

  // 필터 적용된 상품 조회
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      categories: [category?.id, ...selectedSubcategories].filter(Boolean),
      priceRange: selectedPriceRange,
      sortBy,
      limit: 12,
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

  // 활성 필터 수 계산
  const activeFiltersCount = useMemo(() => {
    return (
      selectedSubcategories.length +
      (selectedPriceRange.min > 0 || selectedPriceRange.max < 1000000 ? 1 : 0)
    );
  }, [selectedSubcategories, selectedPriceRange]);

  // 필터 초기화
  const handleClearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedPriceRange({ min: 0, max: 1000000 });
  };

  // 활성 필터 제거
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "subcategory":
        setSelectedSubcategories((prev) => prev.filter((cat) => cat !== value));
        break;
      case "price":
        setSelectedPriceRange({ min: 0, max: 1000000 });
        break;
    }
  };

  // 카테고리가 존재하지 않는 경우
  if (!category) {
    return (
      <Layout>
        <PageLayout
          title="카테고리를 찾을 수 없습니다"
          description="요청하신 카테고리가 존재하지 않습니다"
          breadcrumbs={[{ label: "홈", href: "/" }, { label: "카테고리" }]}
        >
          <div className="text-center py-12">
            <Typography variant="h3" className="mb-4">
              404 - 카테고리를 찾을 수 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              요청하신 카테고리가 존재하지 않거나 삭제되었을 수 있습니다.
            </Typography>
            <Button asChild>
              <a href="/products">전체 상품 보기</a>
            </Button>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout
        title={category.name}
        description={category.description}
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "카테고리", href: "/categories" },
          { label: category.name },
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={subcategories}
              selectedCategories={selectedSubcategories}
              selectedPriceRange={selectedPriceRange}
              onCategoryChange={setSelectedSubcategories}
              onPriceRangeChange={setSelectedPriceRange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              maxPrice={1000000}
            />
          </div>

          {/* 상품 목록 영역 */}
          <div className="lg:col-span-3">
            {/* 필터 요약 및 정렬 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Typography variant="muted">총 {totalCount}개 상품</Typography>

                {/* 활성 필터 표시 */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubcategories.map((subcategoryId) => {
                      const subcategory = subcategories.find((cat) => cat.id === subcategoryId);
                      return subcategory ? (
                        <Badge
                          key={subcategoryId}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFilter("subcategory", subcategoryId)}
                        >
                          {subcategory.label} ×
                        </Badge>
                      ) : null;
                    })}

                    {(selectedPriceRange.min > 0 || selectedPriceRange.max < 1000000) && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeFilter("price")}
                      >
                        {selectedPriceRange.min.toLocaleString()}원 -{" "}
                        {selectedPriceRange.max.toLocaleString()}원 ×
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <ProductSort value={sortBy} onValueChange={setSortBy} showLabel={false} />
            </div>

            {/* 상품 그리드 */}
            <ProductGrid
              products={products}
              loading={isLoading}
              error={error?.message}
              emptyMessage={`${category.name} 카테고리에 상품이 없습니다`}
              emptyDescription="다른 카테고리를 확인해보거나 필터를 초기화해보세요"
              showEmptyAction={activeFiltersCount > 0}
              emptyActionText="필터 초기화"
              onEmptyAction={handleClearFilters}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleToggleWishlist}
              columns="auto"
              gap="lg"
              showLoadMore={false}
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
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}
