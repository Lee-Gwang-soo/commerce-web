"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/atoms/Typography";

const optionVariants = cva("space-y-6", {
  variants: {
    spacing: {
      sm: "space-y-4",
      md: "space-y-6",
      lg: "space-y-8",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

const optionGroupVariants = cva("space-y-3", {
  variants: {
    layout: {
      vertical: "space-y-3",
      horizontal: "space-y-2",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

const optionButtonVariants = cva(
  "relative min-h-[44px] justify-start text-left border-2 transition-all",
  {
    variants: {
      variant: {
        default: "border-border hover:border-primary/50",
        selected: "border-primary bg-primary/5",
        disabled: "border-border opacity-50 cursor-not-allowed",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-lg",
      },
      type: {
        text: "",
        color: "w-11 h-11 p-1",
        image: "w-16 h-16 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      type: "text",
    },
  }
);

export interface ProductOptionValue {
  id: string;
  label: string;
  value: string;
  available?: boolean;
  color?: string;
  image?: string;
  price?: number; // 추가 가격
  description?: string;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  type: "text" | "color" | "image";
  required?: boolean;
  values: ProductOptionValue[];
}

export interface SelectedOptions {
  [groupId: string]: string; // value ID
}

export interface ProductOptionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof optionVariants> {
  options: ProductOptionGroup[];
  selectedOptions?: SelectedOptions;
  onOptionChange?: (groupId: string, valueId: string) => void;
  disabled?: boolean;
  showPrices?: boolean;
}

const ProductOptions = forwardRef<HTMLDivElement, ProductOptionsProps>(
  (
    {
      className,
      options,
      selectedOptions = {},
      onOptionChange,
      disabled = false,
      showPrices = true,
      spacing,
      ...props
    },
    ref
  ) => {
    const handleOptionSelect = (groupId: string, valueId: string) => {
      if (disabled) return;
      onOptionChange?.(groupId, valueId);
    };

    const isOptionSelected = (groupId: string, valueId: string) => {
      return selectedOptions[groupId] === valueId;
    };

    const isOptionAvailable = (option: ProductOptionValue) => {
      return option.available !== false && !disabled;
    };

    const renderColorOption = (
      group: ProductOptionGroup,
      option: ProductOptionValue
    ) => {
      const isSelected = isOptionSelected(group.id, option.id);
      const isAvailable = isOptionAvailable(option);

      return (
        <Button
          key={option.id}
          variant="outline"
          className={cn(
            optionButtonVariants({
              type: "color",
              variant: isSelected
                ? "selected"
                : isAvailable
                ? "default"
                : "disabled",
            })
          )}
          onClick={() => handleOptionSelect(group.id, option.id)}
          disabled={!isAvailable}
          title={option.label}
        >
          <div
            className="w-full h-full rounded border"
            style={{ backgroundColor: option.color }}
          />
          {isSelected && (
            <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
          )}
        </Button>
      );
    };

    const renderImageOption = (
      group: ProductOptionGroup,
      option: ProductOptionValue
    ) => {
      const isSelected = isOptionSelected(group.id, option.id);
      const isAvailable = isOptionAvailable(option);

      return (
        <Button
          key={option.id}
          variant="outline"
          className={cn(
            optionButtonVariants({
              type: "image",
              variant: isSelected
                ? "selected"
                : isAvailable
                ? "default"
                : "disabled",
            })
          )}
          onClick={() => handleOptionSelect(group.id, option.id)}
          disabled={!isAvailable}
        >
          {option.image && (
            <img
              src={option.image}
              alt={option.label}
              className="w-full h-full object-cover rounded"
            />
          )}
          {isSelected && (
            <Check className="absolute top-1 right-1 h-3 w-3 text-primary bg-background rounded-full p-0.5" />
          )}
        </Button>
      );
    };

    const renderTextOption = (
      group: ProductOptionGroup,
      option: ProductOptionValue
    ) => {
      const isSelected = isOptionSelected(group.id, option.id);
      const isAvailable = isOptionAvailable(option);

      return (
        <Button
          key={option.id}
          variant="outline"
          className={cn(
            optionButtonVariants({
              variant: isSelected
                ? "selected"
                : isAvailable
                ? "default"
                : "disabled",
            }),
            "flex-col items-start h-auto py-3"
          )}
          onClick={() => handleOptionSelect(group.id, option.id)}
          disabled={!isAvailable}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">{option.label}</span>
            {isSelected && <Check className="h-4 w-4 text-primary" />}
          </div>

          {option.description && (
            <Typography variant="small" color="muted" className="text-left">
              {option.description}
            </Typography>
          )}

          {showPrices && option.price && option.price > 0 && (
            <Badge variant="secondary" className="mt-2">
              +{option.price.toLocaleString()}원
            </Badge>
          )}
        </Button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(optionVariants({ spacing }), className)}
        {...props}
      >
        {options.map((group) => (
          <div key={group.id} className={cn(optionGroupVariants())}>
            {/* 옵션 그룹 헤더 */}
            <div className="flex items-center gap-2">
              <Typography variant="h6" className="font-semibold">
                {group.name}
              </Typography>
              {group.required && (
                <Badge variant="destructive" size="sm">
                  필수
                </Badge>
              )}
            </div>

            {/* 선택된 옵션 표시 */}
            {selectedOptions[group.id] && (
              <div className="text-sm text-muted-foreground">
                선택됨:{" "}
                {
                  group.values.find((v) => v.id === selectedOptions[group.id])
                    ?.label
                }
              </div>
            )}

            {/* 옵션 값들 */}
            <div className="flex flex-wrap gap-2">
              {group.values.map((option) => {
                switch (group.type) {
                  case "color":
                    return renderColorOption(group, option);
                  case "image":
                    return renderImageOption(group, option);
                  default:
                    return renderTextOption(group, option);
                }
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

ProductOptions.displayName = "ProductOptions";

export { ProductOptions, optionVariants };
export default ProductOptions;




















