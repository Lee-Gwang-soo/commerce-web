"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { Rating } from "@/components/atoms/Rating";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback";
import { Typography } from "@/components/atoms/Typography";
import type { Product } from "@/types/database";

const productCardVariants = cva(
  "group overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border-gray-200 hover:border-blue-200",
  {
    variants: {
      size: {
        sm: "w-full max-w-xs",
        md: "w-full max-w-sm",
        lg: "w-full max-w-md",
        full: "w-full",
      },
      layout: {
        vertical: "flex-col",
        horizontal: "flex-row",
      },
    },
    defaultVariants: {
      size: "md",
      layout: "vertical",
    },
  }
);

const imageContainerVariants = cva("relative overflow-hidden bg-gray-50", {
  variants: {
    layout: {
      vertical: "aspect-[4/5] md:aspect-square",
      horizontal: "aspect-square w-32 shrink-0",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

export interface ProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof productCardVariants> {
  product: Partial<Product> & {
    id: string;
    name: string;
    price: number;
    images?: string[];
  };
  showWishlistButton?: boolean;
  showCartButton?: boolean;
  showQuickView?: boolean;
  showRating?: boolean;
  showBadges?: boolean;
  onWishlistClick?: (productId: string) => void;
  onCartClick?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onClick?: (productId: string) => void;
  isInWishlist?: boolean;
  isLoading?: boolean;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      product,
      size,
      layout = "vertical",
      showWishlistButton = true,
      showCartButton = true,
      showQuickView = false,
      showRating = true,
      showBadges = true,
      onWishlistClick,
      onCartClick,
      onQuickView,
      onClick,
      isInWishlist = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const {
      id,
      name,
      price,
      sale_price,
      images = [],
      short_description,
      stock_quantity = 0,
      is_featured,
      tags = [],
    } = product;

    const mainImage = images[0] || "/images/placeholder-product.jpg";
    const hasDiscount = sale_price && sale_price < price;
    const isOutOfStock = stock_quantity <= 0;
    const finalPrice = sale_price || price;

    const handleWishlistClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onWishlistClick?.(id);
    };

    const handleCartClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isOutOfStock) {
        onCartClick?.(id);
      }
    };

    const handleQuickView = (e: React.MouseEvent) => {
      e.stopPropagation();
      onQuickView?.(id);
    };

    const handleCardClick = () => {
      onClick?.(id);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          productCardVariants({ size, layout }),
          onClick && "cursor-pointer",
          isLoading && "opacity-50 pointer-events-none",
          className
        )}
        onClick={handleCardClick}
        {...props}
      >
        {/* Image Container */}
        <Link href={`/products/${id}`} className="block">
          <div className={cn(imageContainerVariants({ layout }))}>
            <ImageWithFallback
              src={mainImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            {showBadges && (
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                {is_featured && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="bg-blue-100 text-blue-700 border-blue-200"
                  >
                    추천
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge
                    variant="destructive"
                    size="sm"
                    className="bg-red-100 text-red-700 border-red-200 whitespace-nowrap"
                  >
                    할인
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 text-gray-700 border-gray-200"
                  >
                    품절
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {showWishlistButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                  onClick={handleWishlistClick}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isInWishlist && "fill-red-500 text-red-500"
                    )}
                  />
                </Button>
              )}
              {showQuickView && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                  onClick={handleQuickView}
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Add to Cart (Overlay) */}
            {showCartButton && layout === "vertical" && (
              <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
                  onClick={handleCartClick}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isOutOfStock ? "품절" : "장바구니 담기"}
                </Button>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <CardContent
          className={cn("p-4 pb-6", layout === "horizontal" && "flex-1")}
        >
          <div className="space-y-4">
            {/* Product Name */}
            <Typography
              variant="h6"
              className="line-clamp-2 font-medium leading-tight text-gray-900 hover:text-blue-600 transition-colors min-h-[2.5rem]"
            >
              {name}
            </Typography>

            {/* Description */}
            {short_description && (
              <Typography
                variant="small"
                className="line-clamp-2 text-gray-600"
              >
                {short_description}
              </Typography>
            )}

            {/* Rating */}
            {showRating && (
              <Rating
                rating={4.5} // TODO: Get from product data
                size="sm"
                showText
                showCount
                count={128} // TODO: Get from product data
              />
            )}

            {/* Price */}
            <div className="min-h-[60px] flex flex-col justify-start">
              <Price
                price={finalPrice}
                originalPrice={hasDiscount ? price : undefined}
                size="lg"
                showDiscount
                vertical
              />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer (for horizontal layout cart button) */}
        {showCartButton && layout === "horizontal" && (
          <CardFooter className="p-4 pt-0">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCartClick}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isOutOfStock ? "품절" : "장바구니 담기"}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard, productCardVariants };
export default ProductCard;
