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
              <div className="px-2">
                <Slider
                  value={[selectedPriceRange.min, selectedPriceRange.max]}
                  max={maxPrice}
                  min={0}
                  step={10000}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{selectedPriceRange.min.toLocaleString()}원</span>
                  <span>{selectedPriceRange.max.toLocaleString()}원</span>
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

