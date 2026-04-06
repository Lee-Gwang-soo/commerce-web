"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/atoms/Price";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, Heart, CheckCircle } from "lucide-react";
import { useWishlistItems, useRemoveFromWishlist } from "@/hooks/wishlist/use-wishlist";
import { useAuthStore } from "@/store/authStore";
import { cartApi } from "@/lib/api/cart";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface CartPopupState {
  top: number;
  left: number;
  width: number;
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const { data: wishlistItems = [], isLoading } = useWishlistItems();
  const removeFromWishlist = useRemoveFromWishlist();
  const queryClient = useQueryClient();

  const [cartPopup, setCartPopup] = useState<CartPopupState | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToCartMutation = useMutation({
    mutationFn: ({ product_id, quantity }: { product_id: string; quantity: number }) =>
      cartApi.addToCart(product_id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "장바구니 추가에 실패했습니다.");
    },
  });

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  const handleAddToCart = (productId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    addToCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          setCartPopup({
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
          });
          if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
          popupTimerRef.current = setTimeout(() => setCartPopup(null), 5000);
        },
      }
    );
  };

  const handleClosePopup = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setCartPopup(null);
  };

  if (!isHydrated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">로딩 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h3" className="mb-4 text-center">
              로그인이 필요합니다
            </Typography>
            <Typography variant="muted" className="mb-6 text-center">
              찜목록을 확인하려면 로그인해주세요.
            </Typography>
            <Button onClick={() => router.push("/login")}>로그인하기</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">찜목록을 불러오는 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout breadcrumbs={[{ label: "홈", href: "/" }, { label: "찜목록" }]}>
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            찜목록
          </Typography>
          <Typography variant="muted">{wishlistItems.length}개의 상품</Typography>
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
              const hasDiscount = product.sale_price && product.sale_price < product.price;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={item.id}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* 찜목록 제거 버튼 */}
                  <button
                    onClick={() => removeFromWishlist.mutate(item.id)}
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
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          {Math.round(
                            ((product.price - product.sale_price!) / product.price) * 100
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
                      <Typography variant="small" color="muted" className="mb-1">
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

                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={isOutOfStock || addToCartMutation.isPending}
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

      {/* 장바구니 추가 팝업 */}
      {cartPopup && (
        <>
          <style>{`
            @keyframes cartTimerShrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
          <div
            style={{
              position: "fixed",
              top: cartPopup.top,
              left: cartPopup.left,
              width: Math.max(cartPopup.width, 220),
              zIndex: 50,
            }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="p-4">
              {/* 메시지 */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  상품이 장바구니에 담겼습니다.
                </span>
              </div>

              {/* 장바구니 이동 버튼 */}
              <button
                onClick={() => {
                  handleClosePopup();
                  router.push("/cart");
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                장바구니 확인하기
              </button>
            </div>

            {/* 타이머 프로그레스 바 */}
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full bg-purple-300 origin-left"
                style={{ animation: "cartTimerShrink 5s linear forwards" }}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
