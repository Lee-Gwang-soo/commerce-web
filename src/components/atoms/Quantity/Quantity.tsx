"use client";

import { forwardRef, useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quantityVariants = cva("flex items-center border rounded-md", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
    variant: {
      default: "border-input",
      outline: "border-2 border-primary",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

const buttonVariants = cva(
  "flex items-center justify-center border-0 rounded-none",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const inputVariants = cva(
  "border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0",
  {
    variants: {
      size: {
        sm: "h-6 text-sm px-1",
        md: "h-8 text-base px-2",
        lg: "h-10 text-lg px-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface QuantityProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof quantityVariants> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showInput?: boolean;
}

const Quantity = forwardRef<HTMLDivElement, QuantityProps>(
  (
    {
      className,
      value,
      onChange,
      min = 1,
      max = 99,
      step = 1,
      disabled = false,
      showInput = true,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    const handleIncrement = () => {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
    };

    const handleDecrement = () => {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;
      setInputValue(inputVal);

      // Only update parent if it's a valid number
      const numValue = parseInt(inputVal, 10);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    };

    const handleInputBlur = () => {
      // Reset to current value if input is invalid
      const numValue = parseInt(inputValue, 10);
      if (isNaN(numValue) || numValue < min || numValue > max) {
        setInputValue(value.toString());
      } else {
        onChange(numValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleInputBlur();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleDecrement();
      }
    };

    const canDecrement = value > min && !disabled;
    const canIncrement = value < max && !disabled;

    return (
      <div
        className={cn(quantityVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      >
        {/* Decrement Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            buttonVariants({ size }),
            "hover:bg-muted rounded-l-md rounded-r-none",
            !canDecrement && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>

        {/* Input Field */}
        {showInput ? (
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(inputVariants({ size }), "flex-1")}
            min={min}
            max={max}
            aria-label="Quantity"
          />
        ) : (
          <div
            className={cn(
              "flex flex-1 items-center justify-center font-medium",
              inputVariants({ size })
            )}
          >
            {value}
          </div>
        )}

        {/* Increment Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            buttonVariants({ size }),
            "hover:bg-muted rounded-r-md rounded-l-none",
            !canIncrement && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    );
  }
);

Quantity.displayName = "Quantity";

export { Quantity, quantityVariants };
export default Quantity;
