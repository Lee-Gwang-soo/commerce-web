"use client";

import { useState } from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const galleryVariants = cva("", {
  variants: {
    aspectRatio: {
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    },
  },
  defaultVariants: {
    aspectRatio: "square",
  },
});

export interface ProductImageGalleryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof galleryVariants> {
  images: string[];
  alt: string;
  showThumbnails?: boolean;
  showZoom?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

const ProductImageGallery = forwardRef<
  HTMLDivElement,
  ProductImageGalleryProps
>(
  (
    {
      className,
      images = [],
      alt,
      aspectRatio,
      showThumbnails = true,
      showZoom = false,
      showNavigation = true,
      autoPlay = false,
      interval = 3000,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            galleryVariants({ aspectRatio }),
            "bg-muted flex items-center justify-center",
            className
          )}
          {...props}
        >
          <div className="text-muted-foreground text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm">이미지가 없습니다</p>
          </div>
        </div>
      );
    }

    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
      setCurrentIndex(index);
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {/* 메인 이미지 */}
        <div className="relative">
          <div
            className={cn(
              galleryVariants({ aspectRatio }),
              "relative overflow-hidden rounded-lg bg-muted"
            )}
          >
            <ImageWithFallback
              src={images[currentIndex]}
              alt={`${alt} - 이미지 ${currentIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300"
              priority={currentIndex === 0}
            />

            {/* 줌 버튼 */}
            {showZoom && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            )}

            {/* 네비게이션 버튼 */}
            {showNavigation && images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* 이미지 인디케이터 */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 줌 모달 */}
          {isZoomed && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setIsZoomed(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <ImageWithFallback
                  src={images[currentIndex]}
                  alt={`${alt} - 확대된 이미지`}
                  width={800}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setIsZoomed(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 썸네일 */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={cn(
                  "relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors",
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
                onClick={() => handleThumbnailClick(index)}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${alt} - 썸네일 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ProductImageGallery.displayName = "ProductImageGallery";

export { ProductImageGallery, galleryVariants };
export default ProductImageGallery;
