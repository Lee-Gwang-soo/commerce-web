"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductFilters } from "@/components/molecules/ProductFilters";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useProducts,
  useInfiniteProducts,
} from "@/hooks/products/use-products";
import type {
  FilterOption,
  PriceRange,
} from "@/components/molecules/ProductFilters/ProductFilters";

// 임시 필터 데이터 (실제로는 API에서 가져올 예정)
const mockCategories: FilterOption[] = [
  { id: "electronics", label: "전자기기", count: 152 },
  { id: "fashion", label: "패션", count: 234 },
  { id: "home", label: "홈&리빙", count: 89 },
  { id: "beauty", label: "뷰티", count: 67 },
  { id: "sports", label: "스포츠", count: 123 },
  { id: "books", label: "도서", count: 45 },
];

const mockBrands: FilterOption[] = [
  { id: "samsung", label: "삼성", count: 45 },
  { id: "lg", label: "LG", count: 32 },
  { id: "apple", label: "Apple", count: 28 },
  { id: "nike", label: "Nike", count: 56 },
  { id: "adidas", label: "Adidas", count: 41 },
];

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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000000,
  });
  const [sortBy, setSortBy] = useState(initialSort);

  // 필터 적용된 상품 조회
  const {
    data: products = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange: selectedPriceRange,
    sortBy,
    search: initialSearch,
    limit: 12,
  });

  // 활성 필터 수 계산
  const activeFiltersCount = useMemo(() => {
    return (
      selectedCategories.length +
      selectedBrands.length +
      (selectedPriceRange.min > 0 || selectedPriceRange.max < 1000000 ? 1 : 0)
    );
  }, [selectedCategories, selectedBrands, selectedPriceRange]);

  // 필터 초기화
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange({ min: 0, max: 1000000 });
  };

  // 활성 필터 제거
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "category":
        setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
        break;
      case "brand":
        setSelectedBrands((prev) => prev.filter((brand) => brand !== value));
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
    if (initialCategory) {
      const category = mockCategories.find((cat) => cat.id === initialCategory);
      return category ? `${category.label} 상품` : "전체 상품";
    }
    return "전체 상품";
  }, [initialSearch, initialCategory]);

  // 상품 총 개수 (실제로는 API에서 받을 예정)
  const totalProducts = products.length;

  return (
    <Layout>
      <PageLayout
        title={pageTitle}
        description={`${totalProducts}개의 상품을 찾았습니다`}
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상품", href: "/products" },
          ...(initialCategory ? [{ label: pageTitle }] : []),
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={mockCategories}
              brands={mockBrands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedPriceRange={selectedPriceRange}
              onCategoryChange={setSelectedCategories}
              onBrandChange={setSelectedBrands}
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
                <Typography variant="muted">
                  총 {totalProducts}개 상품
                </Typography>

                {/* 활성 필터 표시 */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((categoryId) => {
                      const category = mockCategories.find(
                        (cat) => cat.id === categoryId
                      );
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

                    {selectedBrands.map((brandId) => {
                      const brand = mockBrands.find((b) => b.id === brandId);
                      return brand ? (
                        <Badge
                          key={brandId}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFilter("brand", brandId)}
                        >
                          {brand.label} ×
                        </Badge>
                      ) : null;
                    })}

                    {(selectedPriceRange.min > 0 ||
                      selectedPriceRange.max < 1000000) && (
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
              emptyMessage="조건에 맞는 상품이 없습니다"
              emptyDescription="다른 필터를 시도해보세요"
              showEmptyAction={activeFiltersCount > 0}
              emptyActionText="필터 초기화"
              onEmptyAction={handleClearFilters}
              columns="auto"
              gap="lg"
              showLoadMore={hasNextPage}
              onLoadMore={fetchNextPage}
              loadMoreLoading={isFetchingNextPage}
              loadMoreText="더 많은 상품 보기"
            />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}





















