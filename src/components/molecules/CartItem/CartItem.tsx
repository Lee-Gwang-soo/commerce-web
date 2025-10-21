"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback";
import { Typography } from "@/components/atoms/Typography";
import { Price } from "@/components/atoms/Price";
import { Quantity } from "@/components/atoms/Quantity";
import type { CartItem as CartItemType, Product } from "@/types/database";

const cartItemVariants = cva("transition-all duration-200", {
  variants: {
    layout: {
      horizontal: "flex flex-row",
      vertical: "flex flex-col",
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    layout: "horizontal",
    size: "md",
  },
});

const imageContainerVariants = cva("flex-shrink-0", {
  variants: {
    layout: {
      horizontal: "w-20 h-20 md:w-24 md:h-24",
      vertical: "w-full aspect-square",
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

export interface CartItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cartItemVariants> {
  item: CartItemType & {
    products?: Partial<Product>;
  };
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  onMoveToWishlist?: (itemId: string) => void;
  showMoveToWishlist?: boolean;
  showRemoveButton?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(
  (
    {
      className,
      item,
      layout = "horizontal",
      size,
      onQuantityChange,
      onRemove,
      onMoveToWishlist,
      showMoveToWishlist = true,
      showRemoveButton = true,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const product = item.products;
    const { id: itemId, quantity, product_id } = item;

    if (!product) {
      return null;
    }

    const {
      name,
      images = [],
      price,
      sale_price,
      stock_quantity = 0,
    } = product;

    const mainImage = images[0] || "/images/placeholder-product.jpg";
    const finalPrice = sale_price || price || 0;
    const totalPrice = finalPrice * quantity;
    const isOutOfStock = stock_quantity <= 0;
    const maxQuantity = Math.min(stock_quantity, 99);

    const handleQuantityChange = (newQuantity: number) => {
      if (!disabled && onQuantityChange) {
        onQuantityChange(itemId, newQuantity);
      }
    };

    const handleRemove = () => {
      if (!disabled && onRemove) {
        onRemove(itemId);
      }
    };

    const handleMoveToWishlist = () => {
      if (!disabled && onMoveToWishlist) {
        onMoveToWishlist(itemId);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden",
          isLoading && "opacity-50",
          disabled && "pointer-events-none",
          className
        )}
        {...props}
      >
        <CardContent className={cn(cartItemVariants({ layout, size }))}>
          {/* Product Image */}
          <div className={cn(imageContainerVariants({ layout }))}>
            <ImageWithFallback
              src={mainImage}
              alt={name || "Product"}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>

          {/* Product Info */}
          <div
            className={cn(
              "flex-1 space-y-3",
              layout === "horizontal" && "ml-4"
            )}
          >
            {/* Header: Name & Remove Button */}
            <div className="flex items-start justify-between gap-2">
              <Typography variant="h6" className="line-clamp-2 font-medium">
                {name}
              </Typography>
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={handleRemove}
                  disabled={disabled || isLoading}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Stock Status */}
            {isOutOfStock && (
              <Typography variant="small" color="destructive">
                품절
              </Typography>
            )}

            {/* Price */}
            <Price
              price={finalPrice}
              originalPrice={sale_price ? price : undefined}
              size="md"
              showDiscount
            />

            {/* Controls */}
            <div
              className={cn(
                "flex items-center gap-4",
                layout === "vertical" && "justify-between"
              )}
            >
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <Typography variant="small" color="muted">
                  수량:
                </Typography>
                <Quantity
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={maxQuantity}
                  disabled={disabled || isLoading || isOutOfStock}
                  size="sm"
                />
              </div>

              {/* Total Price */}
              <div className="flex items-center gap-2">
                <Typography variant="small" color="muted">
                  합계:
                </Typography>
                <Typography variant="large" className="font-bold">
                  {totalPrice.toLocaleString()}원
                </Typography>
              </div>
            </div>

            {/* Actions */}
            {showMoveToWishlist && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMoveToWishlist}
                  disabled={disabled || isLoading}
                  className="h-8"
                >
                  <Heart className="mr-2 h-3 w-3" />
                  찜목록으로 이동
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

CartItem.displayName = "CartItem";

export { CartItem, cartItemVariants };
export default CartItem;
