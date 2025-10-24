"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/atoms/Price";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, Heart } from "lucide-react";
import {
  useWishlistItems,
  useRemoveFromWishlist,
} from "@/hooks/wishlist/use-wishlist";
import { useAddToCart } from "@/hooks/cart/use-cart";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: wishlistItems = [], isLoading } = useWishlistItems();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  // 로그인 체크
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h3" className="mb-4">
              로그인이 필요합니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              찜목록을 확인하려면 로그인해주세요.
            </Typography>
            <Button onClick={() => router.push("/login")}>로그인하기</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">
                찜목록을 불러오는 중...
              </Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist.mutate(itemId);
  };

  const handleAddToCart = (productId: string, itemId: string) => {
    addToCart.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          // 장바구니에 추가 후 찜목록에서 제거
          removeFromWishlist.mutate(itemId);
        },
      }
    );
  };

  return (
    <Layout>
      <PageLayout
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "찜목록" },
        ]}
      >
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            찜목록
          </Typography>
          <Typography variant="muted">
            {wishlistItems.length}개의 상품
          </Typography>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h3" className="mb-2">
              찜한 상품이 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              마음에 드는 상품을 찜목록에 추가해보세요.
            </Typography>
            <Button asChild>
              <Link href="/products">상품 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product;
              const hasDiscount =
                product.sale_price && product.sale_price < product.price;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={item.id}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="찜목록에서 제거"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* 상품 이미지 */}
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.images[0] || "/placeholder-product.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {hasDiscount && (
                        <Badge
                          variant="destructive"
                          className="absolute top-2 left-2"
                        >
                          {Math.round(
                            ((product.price - product.sale_price!) /
                              product.price) *
                              100
                          )}
                          % 할인
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Badge variant="outline" className="bg-white">
                            품절
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* 상품 정보 */}
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <Typography
                        variant="small"
                        color="muted"
                        className="mb-1"
                      >
                        {product.category}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="mb-2 line-clamp-2 hover:text-purple-600 transition-colors"
                      >
                        {product.name}
                      </Typography>
                    </Link>

                    <Price
                      price={product.sale_price || product.price}
                      originalPrice={hasDiscount ? product.price : undefined}
                      size="md"
                      showDiscount
                      className="mb-3"
                    />

                    {/* 장바구니 담기 버튼 */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => handleAddToCart(product.id, item.id)}
                      disabled={
                        isOutOfStock ||
                        addToCart.isPending ||
                        removeFromWishlist.isPending
                      }
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니 담기
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}
