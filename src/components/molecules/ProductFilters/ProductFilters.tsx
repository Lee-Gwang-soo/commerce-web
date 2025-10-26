"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Typography } from "@/components/atoms/Typography";

const filterSectionVariants = cva("border-b border-border pb-6 mb-6", {
  variants: {
    spacing: {
      sm: "pb-4 mb-4",
      md: "pb-6 mb-6",
      lg: "pb-8 mb-8",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFiltersProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterSectionVariants> {
  categories?: FilterOption[];
  brands?: FilterOption[];
  priceRange?: PriceRange;
  maxPrice?: number;
  selectedCategories?: string[];
  selectedBrands?: string[];
  selectedPriceRange?: PriceRange;
  onCategoryChange?: (categories: string[]) => void;
  onBrandChange?: (brands: string[]) => void;
  onPriceRangeChange?: (range: PriceRange) => void;
  onClearFilters?: () => void;
  showMobileButton?: boolean;
  activeFiltersCount?: number;
}

const ProductFilters = forwardRef<HTMLDivElement, ProductFiltersProps>(
  (
    {
      className,
      categories = [],
      brands = [],
      priceRange = { min: 0, max: 1000000 },
      maxPrice = 1000000,
      selectedCategories = [],
      selectedBrands = [],
      selectedPriceRange = { min: 0, max: 1000000 },
      onCategoryChange,
      onBrandChange,
      onPriceRangeChange,
      onClearFilters,
      showMobileButton = true,
      activeFiltersCount = 0,
      spacing,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(true);
    const [brandOpen, setBrandOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
      const newCategories = checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter((id) => id !== categoryId);
      onCategoryChange?.(newCategories);
    };

    const handleBrandChange = (brandId: string, checked: boolean) => {
      const newBrands = checked
        ? [...selectedBrands, brandId]
        : selectedBrands.filter((id) => id !== brandId);
      onBrandChange?.(newBrands);
    };

    const handlePriceChange = (values: number[]) => {
      onPriceRangeChange?.({ min: values[0], max: values[1] });
    };

    const FilterContent = () => (
      <div className="space-y-6">
        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
            <div className={cn(filterSectionVariants({ spacing }))}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto font-semibold"
                >
                  <Typography variant="h6">카테고리</Typography>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      categoryOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {category.label}
                      {category.count && (
                        <span className="ml-2 text-muted-foreground">
                          ({category.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* 가격 필터 */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
          <div className={cn(filterSectionVariants({ spacing }))}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-semibold"
              >
                <Typography variant="h6">가격</Typography>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    priceOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              {/* 가격 프리셋 버튼 */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedPriceRange.min === 0 && selectedPriceRange.max === maxPrice ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 0, max: maxPrice })}
                  className="text-xs"
                >
                  전체
                </Button>
                <Button
                  variant={selectedPriceRange.min === 0 && selectedPriceRange.max === 10000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 0, max: 10000 })}
                  className="text-xs"
                >
                  ~1만원
                </Button>
                <Button
                  variant={selectedPriceRange.min === 0 && selectedPriceRange.max === 30000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 0, max: 30000 })}
                  className="text-xs"
                >
                  ~3만원
                </Button>
                <Button
                  variant={selectedPriceRange.min === 0 && selectedPriceRange.max === 50000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 0, max: 50000 })}
                  className="text-xs"
                >
                  ~5만원
                </Button>
                <Button
                  variant={selectedPriceRange.min === 0 && selectedPriceRange.max === 100000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 0, max: 100000 })}
                  className="text-xs"
                >
                  ~10만원
                </Button>
                <Button
                  variant={selectedPriceRange.min === 100000 && selectedPriceRange.max === maxPrice ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPriceRangeChange?.({ min: 100000, max: maxPrice })}
                  className="text-xs"
                >
                  10만원~
                </Button>
              </div>

              {/* 가격 범위 슬라이더 */}
              <div className="pt-4 space-y-4">
                <div className="space-y-3">
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    직접 설정
                  </Typography>

                  {/* 입력 필드 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                        최소 금액
                      </Label>
                      <div className="relative">
                        <input
                          id="min-price"
                          type="number"
                          value={selectedPriceRange.min}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            onPriceRangeChange?.({
                              min: Math.max(0, Math.min(value, selectedPriceRange.max)),
                              max: selectedPriceRange.max
                            });
                          }}
                          className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          원
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                        최대 금액
                      </Label>
                      <div className="relative">
                        <input
                          id="max-price"
                          type="number"
                          value={selectedPriceRange.max}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || maxPrice;
                            onPriceRangeChange?.({
                              min: selectedPriceRange.min,
                              max: Math.min(maxPrice, Math.max(value, selectedPriceRange.min))
                            });
                          }}
                          className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                          placeholder={maxPrice.toString()}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          원
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 슬라이더 */}
                  <div className="pt-4 pb-2">
                    <Slider
                      value={[selectedPriceRange.min, selectedPriceRange.max]}
                      max={maxPrice}
                      min={0}
                      step={10000}
                      onValueChange={handlePriceChange}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                      <span>{selectedPriceRange.min.toLocaleString()}원</span>
                      <span>{selectedPriceRange.max.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* 브랜드 필터 */}
        {brands.length > 0 && (
          <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
            <div className={cn(filterSectionVariants({ spacing }))}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto font-semibold"
                >
                  <Typography variant="h6">브랜드</Typography>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      brandOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`brand-${brand.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {brand.label}
                      {brand.count && (
                        <span className="ml-2 text-muted-foreground">
                          ({brand.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* 필터 초기화 */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={onClearFilters} className="w-full">
            <X className="mr-2 h-4 w-4" />
            모든 필터 초기화
          </Button>
        )}
      </div>
    );

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {/* 모바일 필터 버튼 */}
        {showMobileButton && (
          <div className="lg:hidden mb-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  필터
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>상품 필터</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* 데스크톱 필터 */}
        <div className="hidden lg:block">
          <FilterContent />
        </div>
      </div>
    );
  }
);

ProductFilters.displayName = "ProductFilters";

export { ProductFilters, filterSectionVariants };
export default ProductFilters;

