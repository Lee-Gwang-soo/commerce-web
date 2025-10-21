"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

const imageVariants = cva("overflow-hidden", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    aspectRatio: {
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
      wide: "aspect-[16/9]",
      auto: "",
    },
  },
  defaultVariants: {
    rounded: "md",
    aspectRatio: "auto",
  },
});

const fallbackVariants = cva(
  "flex items-center justify-center bg-muted text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-20 w-20",
        md: "h-40 w-40",
        lg: "h-60 w-60",
        xl: "h-80 w-80",
        full: "h-full w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ImageWithFallbackProps
  extends Omit<ImageProps, "onError">,
    VariantProps<typeof imageVariants> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  showFallbackIcon?: boolean;
  fallbackText?: string;
  onError?: (error: any) => void;
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  (
    {
      className,
      src,
      alt,
      fallbackSrc,
      fallbackIcon,
      showFallbackIcon = true,
      fallbackText,
      rounded,
      aspectRatio,
      onError,
      ...props
    },
    ref
  ) => {
    const [error, setError] = useState(false);
    const [fallbackError, setFallbackError] = useState(false);

    const handleError = (error: any) => {
      setError(true);
      onError?.(error);
    };

    const handleFallbackError = () => {
      setFallbackError(true);
    };

    // Show fallback UI if both main image and fallback image failed
    if (error && (!fallbackSrc || fallbackError)) {
      return (
        <div
          className={cn(
            imageVariants({ rounded, aspectRatio }),
            fallbackVariants({ size: "full" }),
            className
          )}
        >
          {fallbackIcon ||
            (showFallbackIcon && <ImageIcon className="h-8 w-8" />)}
          {fallbackText && (
            <span className="mt-2 text-sm font-medium">{fallbackText}</span>
          )}
        </div>
      );
    }

    // Show fallback image if main image failed but fallback is available
    if (error && fallbackSrc && !fallbackError) {
      return (
        <Image
          ref={ref}
          className={cn(imageVariants({ rounded, aspectRatio }), className)}
          src={fallbackSrc}
          alt={alt}
          onError={handleFallbackError}
          {...props}
        />
      );
    }

    // Show main image
    return (
      <Image
        ref={ref}
        className={cn(imageVariants({ rounded, aspectRatio }), className)}
        src={src}
        alt={alt}
        onError={handleError}
        {...props}
      />
    );
  }
);

ImageWithFallback.displayName = "ImageWithFallback";

export { ImageWithFallback, imageVariants };
export default ImageWithFallback;
