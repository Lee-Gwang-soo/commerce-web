"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingCart, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavigationItem } from "@/components/molecules/NavigationItem";
import { Typography } from "@/components/atoms/Typography";
import Banner from "@/components/atoms/Banner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCartItemCount } from "@/hooks/cart/use-cart";
import { useWishlistItemCount } from "@/hooks/wishlist/use-wishlist";

const headerVariants = cva(
  "sticky top-0 z-50 w-full border-b bg-white shadow-sm",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        transparent: "border-transparent bg-transparent shadow-none",
      },
      size: {
        sm: "min-h-14",
        md: "min-h-16",
        lg: "min-h-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface NavigationItem {
  href: string;
  label: string;
  badge?: string | number;
}

interface Category {
  slug: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/categories/new", label: "신상품" },
  { href: "/categories/best", label: "베스트" },
];

const categories: Category[] = [
  { slug: "electronics", label: "전자기기" },
  { slug: "sports", label: "스포츠" },
  { slug: "lifestyle", label: "생활용품" },
  { slug: "fashion", label: "패션" },
];

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  showBanner?: boolean;
  showSearch?: boolean;
  showMobileMenu?: boolean;
  onSearchSubmit?: (query: string) => void;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      variant,
      size,
      showBanner = true,
      showSearch = true,
      onSearchSubmit,
    },
    ref
  ) => {
    const router = useRouter();
    const { user } = useAuth();
    const { data: cartItemCount = 0 } = useCartItemCount();
    const { data: wishlistItemCount = 0 } = useWishlistItemCount();
    const [categoryOpen, setCategoryOpen] = useState(false);

    const handleSearchSubmit = (query: string) => {
      onSearchSubmit?.(query);
      if (!onSearchSubmit && query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    };

    return (
      <>
        {/* Top Banner */}
        {showBanner && (
          <Banner
            messages={[
              "🎉 신규 회원가입 시 10% 할인 쿠폰 지급!",
              "🚚 전국 무료배송 이벤트 진행 중",
              "🔥 타임특가 상품 최대 70% 할인",
            ]}
            variant="sale"
            size="sm"
            autoRotate={true}
            interval={3000}
            showNavigation={true}
            showClose={true}
          />
        )}

        {/* Main Header */}
        <header
          ref={ref}
          className={cn(headerVariants({ variant, size }), className)}
        >
          <div className="max-w-6xl mx-auto px-4 py-2">
            {/* Top Row - Auth Links */}
            <div className="flex justify-end border-gray-100">
              <div className="flex items-center space-x-1 text-sm">
                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-purple-600 px-3 py-1 text-xs"
                    asChild
                  >
                    <Link href="/mypage">마이페이지</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-600 px-3 py-1 text-xs"
                      asChild
                    >
                      <Link href="/register">회원가입</Link>
                    </Button>
                    <div className="w-px h-3 bg-gray-300 mx-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 px-3 py-1 text-xs"
                      asChild
                    >
                      <Link href="/login">로그인</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Row - Main Navigation */}
            <div className="flex items-center gap-3 lg:gap-4 pb-2 py-2">
              {/* Left Section: Logo + Menu + Category */}
              <div className="flex items-center gap-2">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <Typography
                    variant="h4"
                    className="font-bold text-purple-600"
                  >
                    Commerce
                  </Typography>
                </Link>

                {/* Category Dropdown */}
                <div
                  onMouseEnter={() => setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                >
                  <DropdownMenu
                    open={categoryOpen}
                    onOpenChange={setCategoryOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 px-3 py-2 h-auto font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-transparent data-[state=open]:text-gray-700"
                      >
                        카테고리
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {categories.map((category) => (
                        <DropdownMenuItem key={category.slug} asChild>
                          <Link
                            href={`/categories/${category.slug}`}
                            className="cursor-pointer"
                          >
                            {category.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Center Section: Navigation */}
              <nav className="flex items-center gap-4 lg:gap-6">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Search Bar */}
              {showSearch && (
                <div className="flex ml-auto w-64 lg:w-80">
                  <SearchBar
                    placeholder="상품을 검색해보세요..."
                    onSearch={handleSearchSubmit}
                    className="w-full"
                    containerClassName="w-full"
                    showSearchButton={false}
                  />
                </div>
              )}

              {/* Right Section: Actions */}
              <div className="flex items-center gap-1 ml-10px">
                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-gray-100"
                  asChild
                  aria-label="Wishlist"
                >
                  <Link href="/wishlist">
                    <Heart className="h-6 w-6 text-gray-700 hover:text-purple-600" />
                    {wishlistItemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-gray-100"
                  asChild
                  aria-label="Shopping cart"
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-purple-600" />
                    {cartItemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }
);

Header.displayName = "Header";

export { Header, headerVariants };
export default Header;
