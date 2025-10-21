"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductFilters } from "@/components/molecules/ProductFilters";
import { ProductSort } from "@/components/molecules/ProductSort";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInfiniteProducts } from "@/hooks/products/use-products";
import type {
  FilterOption,
  PriceRange,
} from "@/components/molecules/ProductFilters/ProductFilters";

// 카테고리 매핑 (실제로는 API에서 가져올 예정)
const categoryMap: Record<
  string,
  { id: string; name: string; description: string; parentId?: string }
> = {
  electronics: {
    id: "electronics",
    name: "전자기기",
    description: "스마트폰, 노트북, 태블릿 등 최신 전자제품",
  },
  sports: {
    id: "sports",
    name: "스포츠",
    description: "운동복, 운동기구, 스포츠 용품",
  },
  lifestyle: {
    id: "lifestyle",
    name: "생활용품",
    description: "주방용품, 욕실용품, 청소용품 등 생활 필수품",
  },
  fashion: {
    id: "fashion",
    name: "패션",
    description: "의류, 신발, 액세서리 등 패션 아이템",
  },
  home: {
    id: "home",
    name: "홈&리빙",
    description: "가구, 인테리어, 생활용품",
  },
  beauty: {
    id: "beauty",
    name: "뷰티",
    description: "화장품, 스킨케어, 향수 등 뷰티 제품",
  },
  books: {
    id: "books",
    name: "도서",
    description: "소설, 전문서, 만화 등 다양한 도서",
  },
  new: {
    id: "new",
    name: "신상품",
    description: "최신 출시 상품",
  },
  best: {
    id: "best",
    name: "베스트",
    description: "인기 상품",
  },
};

// 카테고리별 서브카테고리 (실제로는 API에서 가져올 예정)
const subcategoryMap: Record<string, FilterOption[]> = {
  electronics: [
    { id: "smartphones", label: "스마트폰", count: 45 },
    { id: "laptops", label: "노트북", count: 32 },
    { id: "tablets", label: "태블릿", count: 28 },
    { id: "headphones", label: "헤드폰", count: 67 },
    { id: "cameras", label: "카메라", count: 23 },
  ],
  sports: [
    { id: "exercise-equipment", label: "운동기구", count: 56 },
    { id: "sports-wear", label: "운동복", count: 89 },
    { id: "shoes", label: "운동화", count: 67 },
    { id: "outdoor", label: "아웃도어", count: 45 },
    { id: "yoga", label: "요가용품", count: 34 },
  ],
  lifestyle: [
    { id: "kitchen", label: "주방용품", count: 78 },
    { id: "bathroom", label: "욕실용품", count: 56 },
    { id: "cleaning", label: "청소용품", count: 45 },
    { id: "storage", label: "수납/정리", count: 67 },
    { id: "laundry", label: "세탁용품", count: 34 },
  ],
  fashion: [
    { id: "mens", label: "남성의류", count: 89 },
    { id: "womens", label: "여성의류", count: 124 },
    { id: "shoes", label: "신발", count: 67 },
    { id: "accessories", label: "액세서리", count: 45 },
    { id: "bags", label: "가방", count: 34 },
  ],
  home: [
    { id: "furniture", label: "가구", count: 56 },
    { id: "decor", label: "인테리어", count: 78 },
    { id: "kitchen", label: "주방용품", count: 89 },
    { id: "bedding", label: "침구", count: 45 },
  ],
  beauty: [
    { id: "skincare", label: "스킨케어", count: 67 },
    { id: "makeup", label: "메이크업", count: 89 },
    { id: "fragrance", label: "향수", count: 23 },
    { id: "haircare", label: "헤어케어", count: 34 },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // 카테고리 정보
  const category = categoryMap[slug];
  const subcategories = subcategoryMap[slug] || [];

  // 필터 상태
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000000,
  });
  const [sortBy, setSortBy] = useState("latest");

  // 필터 적용된 상품 조회
  const {
    data: products = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    categories: [category?.id, ...selectedSubcategories].filter(Boolean),
    priceRange: selectedPriceRange,
    sortBy,
    limit: 12,
  });

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

  const totalProducts = products.length;

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
                <Typography variant="muted">
                  총 {totalProducts}개 상품
                </Typography>

                {/* 활성 필터 표시 */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubcategories.map((subcategoryId) => {
                      const subcategory = subcategories.find(
                        (cat) => cat.id === subcategoryId
                      );
                      return subcategory ? (
                        <Badge
                          key={subcategoryId}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            removeFilter("subcategory", subcategoryId)
                          }
                        >
                          {subcategory.label} ×
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
              emptyMessage={`${category.name} 카테고리에 상품이 없습니다`}
              emptyDescription="다른 카테고리를 확인해보거나 필터를 초기화해보세요"
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
