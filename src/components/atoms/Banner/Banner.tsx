"use client";

import { forwardRef, useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const bannerVariants = cva("w-full relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-gradient-to-r from-purple-600 to-purple-700 text-white",
      sale: "bg-gradient-to-r from-red-600 to-red-700 text-white",
      info: "bg-gradient-to-r from-green-600 to-green-700 text-white",
      hero: "bg-transparent text-white",
    },
    size: {
      sm: "py-1 text-sm min-h-[20px]",
      md: "py-3 text-base min-h-[48px]",
      lg: "py-4 text-lg min-h-[56px]",
      hero: "h-[400px] md:h-[500px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  messages?: string[];
  images?: string[];
  autoRotate?: boolean;
  showClose?: boolean;
  showNavigation?: boolean;
  interval?: number;
  isHero?: boolean;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      size,
      messages = [
        "🎉 신규 회원가입 시 10% 할인 쿠폰 지급!",
        "🚚 무료배송 이벤트 진행 중",
      ],
      images = [],
      autoRotate = true,
      showClose = true,
      showNavigation = true,
      interval = 4000,
      isHero = false,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [imageError, setImageError] = useState<Record<number, boolean>>({});

    const totalItems =
      isHero && images.length > 0 ? images.length : messages.length;

    // Auto-rotate functionality
    useEffect(() => {
      if (!autoRotate || totalItems <= 1 || !isVisible) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
      }, interval);

      return () => clearInterval(timer);
    }, [autoRotate, totalItems, interval, isVisible]);

    const handleClose = () => {
      setIsVisible(false);
    };

    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    };

    const handleImageError = (index: number) => {
      setImageError((prev) => ({ ...prev, [index]: true }));
    };

    if (!isVisible || totalItems === 0) {
      return null;
    }

    // Hero banner with images
    if (isHero && images.length > 0) {
      return (
        <div
          ref={ref}
          className={cn(
            bannerVariants({ variant: "hero", size: "hero" }),
            className
          )}
          {...props}
        >
          {/* Background Image */}
          {!imageError[currentIndex] ? (
            <Image
              src={images[currentIndex]}
              alt={`Hero banner ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              onError={() => handleImageError(currentIndex)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto text-center text-white space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  신선한 식재료
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl leading-relaxed opacity-95 drop-shadow-md">
                  매일 새벽 배송으로 더 신선하게
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    지금 쇼핑하기
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {showNavigation && images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/40 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-6 w-6 text-white drop-shadow-sm" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/40 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-6 w-6 text-white drop-shadow-sm" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-200 border-2 shadow-md",
                    index === currentIndex
                      ? "bg-white border-white scale-110"
                      : "bg-white/40 border-white/60 hover:bg-white/70 hover:scale-105"
                  )}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`${index + 1}번째 슬라이드로 이동`}
                />
              ))}
            </div>
          )}

          {/* Progress bar */}
          {autoRotate && images.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-30">
              <div
                className="h-full bg-white transition-all duration-300 ease-linear shadow-sm"
                style={{
                  width: `${((currentIndex + 1) / images.length) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // Regular message banner
    return (
      <div
        ref={ref}
        className={cn(bannerVariants({ variant, size }), className)}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 min-h-[40px]">
            {/* Left Navigation */}
            {showNavigation && messages.length > 1 ? (
              <button
                onClick={handlePrevious}
                className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                aria-label="이전 메시지"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="w-8" />
            )}

            {/* Message */}
            <div className="flex-1 text-center px-2">
              <p className="font-medium text-sm sm:text-base">
                {messages[currentIndex]}
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Right Navigation */}
              {showNavigation && messages.length > 1 && (
                <button
                  onClick={handleNext}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label="다음 메시지"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {/* Close Button */}
              {showClose && (
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label="배너 닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dots indicator for messages */}
          {messages.length > 1 && (
            <div className="flex justify-center gap-1 mt-2 pb-1">
              {messages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`메시지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Banner.displayName = "Banner";

export { Banner, bannerVariants };
export default Banner;
