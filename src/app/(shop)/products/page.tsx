"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductFilters } from "@/components/molecules/ProductFilters";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { useInfiniteProducts } from "@/hooks/products/use-products";
import { useCategories } from "@/hooks/categories/use-categories";
import type {
  FilterOption,
  PriceRange,
} from "@/components/molecules/ProductFilters/ProductFilters";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // URL 파라미터에서 초기값 설정
  const initialCategory = searchParams.get("category");
  const initialSort = searchParams.get("sort") || "latest";
  const initialSearch = searchParams.get("search");

  // 필터 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000000,
  });
  const [sortBy, setSortBy] = useState(initialSort);

  // 카테고리 목록 조회
  const { data: categoriesData = [] } = useCategories();

  // 필터 적용된 상품 조회
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      sortBy,
      search: initialSearch,
      limit: 12,
    });

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;

  // 카테고리 데이터를 FilterOption 형식으로 변환
  const categories: FilterOption[] = categoriesData.map((category) => ({
    id: category.id,
    label: category.name,
    count: category.count,
  }));

  // 활성 필터 수 계산
  const activeFiltersCount = useMemo(() => {
    return (
      selectedCategories.length +
      (selectedPriceRange.min > 0 || selectedPriceRange.max < 1000000 ? 1 : 0)
    );
  }, [selectedCategories, selectedPriceRange]);

  // 필터 초기화
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange({ min: 0, max: 1000000 });
  };

  // 활성 필터 제거
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "category":
        setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
        break;
      case "price":
        setSelectedPriceRange({ min: 0, max: 1000000 });
        break;
    }
  };

  // 페이지 제목 생성
  const pageTitle = useMemo(() => {
    if (initialSearch) {
      return `"${initialSearch}" 검색 결과`;
    }
    return "전체 상품";
  }, [initialSearch]);

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
        title={pageTitle}
        description={`${totalCount}개의 상품을 찾았습니다`}
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상품", href: "/products" },
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              selectedCategories={selectedCategories}
              selectedPriceRange={selectedPriceRange}
              onCategoryChange={setSelectedCategories}
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
                    {selectedCategories.map((categoryId) => {
                      const category = categories.find((cat) => cat.id === categoryId);
                      return category ? (
                        <Badge
                          key={categoryId}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFilter("category", categoryId)}
                        >
                          {category.label} ×
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
              emptyMessage="조건에 맞는 상품이 없습니다"
              emptyDescription="다른 필터를 시도해보세요"
              showEmptyAction={activeFiltersCount > 0}
              emptyActionText="필터 초기화"
              onEmptyAction={handleClearFilters}
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
