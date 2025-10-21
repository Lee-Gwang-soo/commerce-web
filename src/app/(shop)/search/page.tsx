"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductFilters } from "@/components/molecules/ProductFilters";
import { ProductSort } from "@/components/molecules/ProductSort";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Typography } from "@/components/atoms/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useSearchProducts,
  useInfiniteProducts,
} from "@/hooks/products/use-products";
import type {
  FilterOption,
  PriceRange,
} from "@/components/molecules/ProductFilters/ProductFilters";

// 임시 필터 데이터
const mockCategories: FilterOption[] = [
  { id: "electronics", label: "전자기기", count: 152 },
  { id: "fashion", label: "패션", count: 234 },
  { id: "home", label: "홈&리빙", count: 89 },
];

const mockBrands: FilterOption[] = [
  { id: "samsung", label: "삼성", count: 45 },
  { id: "lg", label: "LG", count: 32 },
  { id: "apple", label: "Apple", count: 28 },
  { id: "nike", label: "Nike", count: 56 },
  { id: "adidas", label: "Adidas", count: 41 },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 검색어 가져오기
  const initialQuery = searchParams.get("q") || "";

  // 상태
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000000,
  });
  const [sortBy, setSortBy] = useState("relevance");

  // 검색 결과 조회
  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    search: searchQuery,
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange: selectedPriceRange,
    sortBy: sortBy === "relevance" ? "latest" : sortBy,
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

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // URL 업데이트
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    router.push(`/search?${params.toString()}`);
  };

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

  // URL 파라미터 변경 시 검색어 동기화
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const hasQuery = searchQuery.length > 0;
  const totalResults = searchResults.length;

  return (
    <Layout>
      <PageLayout
        title="상품 검색"
        description={
          hasQuery
            ? `"${searchQuery}"에 대한 검색 결과`
            : "원하는 상품을 검색해보세요"
        }
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "검색" }]}
      >
        {/* 검색바 */}
        <div className="mb-8">
          <SearchBar
            placeholder="상품명, 브랜드, 카테고리로 검색해보세요"
            value={searchQuery}
            onSearch={handleSearch}
            showRecentSearches
            showSuggestions
            className="max-w-2xl mx-auto"
          />
        </div>

        {hasQuery ? (
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

            {/* 검색 결과 영역 */}
            <div className="lg:col-span-3">
              {/* 검색 결과 헤더 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <Typography variant="h4" className="mb-1">
                    "{searchQuery}" 검색 결과
                  </Typography>
                  <Typography variant="muted">
                    총 {totalResults}개 상품
                  </Typography>

                  {/* 활성 필터 표시 */}
                  {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
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
                  options={[
                    { value: "relevance", label: "관련도순" },
                    { value: "latest", label: "최신순" },
                    { value: "price-low", label: "낮은 가격순" },
                    { value: "price-high", label: "높은 가격순" },
                    { value: "popular", label: "인기순" },
                  ]}
                />
              </div>

              {/* 검색 결과 그리드 */}
              <ProductGrid
                products={searchResults}
                loading={searchLoading}
                error={searchError?.message}
                emptyMessage={`"${searchQuery}"에 대한 검색 결과가 없습니다`}
                emptyDescription="다른 키워드로 검색해보거나 필터를 조정해보세요"
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
        ) : (
          /* 검색어가 없을 때 */
          <div className="text-center py-12">
            <Typography variant="h5" className="mb-4">
              인기 검색어
            </Typography>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                "헤드폰",
                "스마트워치",
                "키보드",
                "후드티",
                "러닝화",
                "아로마",
              ].map((keyword) => (
                <Button
                  key={keyword}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(keyword)}
                >
                  {keyword}
                </Button>
              ))}
            </div>

            <Typography variant="muted" className="mb-6">
              위의 인기 검색어를 클릭하거나 원하는 상품을 검색해보세요
            </Typography>

            <Button asChild>
              <a href="/products">전체 상품 보기</a>
            </Button>
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}




















