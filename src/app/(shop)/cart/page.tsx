"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Price } from "@/components/atoms/Price";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useCartItems,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/hooks/cart/use-cart";

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data: cartItems = [], isLoading } = useCartItems();
  // 총합은 선택된 항목 기준 우측 요약에서 계산하므로 훅 반환값은 미사용
  // const { data: cartTotal = 0 } = useCartTotal();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 개별 선택/해제
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // 수량 변경
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem.mutate({ itemId, quantity: newQuantity });
  };

  // 아이템 제거
  const handleRemoveItem = (itemId: string) => {
    removeFromCart.mutate(itemId);
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  // 선택된 아이템들 제거
  const handleRemoveSelected = () => {
    selectedItems.forEach((itemId) => {
      removeFromCart.mutate(itemId);
    });
    setSelectedItems([]);
  };

  // 장바구니 비우기 (모든 아이템 삭제)
  const handleClearCart = () => {
    if (confirm("장바구니를 모두 비우시겠습니까?")) {
      cartItems.forEach((item) => {
        removeFromCart.mutate(item.id);
      });
      setSelectedItems([]);
    }
  };

  // 선택된 아이템들의 총 가격 계산
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => {
      const price = item.product?.sale_price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);

  const selectedCount = selectedItems.length;
  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">장바구니를 불러오는 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <PageLayout
          title="장바구니"
          description="담으신 상품을 확인하고 주문하세요"
          breadcrumbs={[{ label: "홈", href: "/" }, { label: "장바구니" }]}
        >
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <Typography variant="h4" className="mb-2">
              장바구니가 비어있습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              원하는 상품을 장바구니에 담아보세요
            </Typography>
            <Button asChild>
              <Link href="/products">쇼핑 계속하기</Link>
            </Button>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout
        title="장바구니"
        description={`${cartItems.length}개의 상품`}
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "장바구니" }]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onCheckedChange={(val) => handleSelectAll(val === true)}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      전체선택 ({selectedCount}/{cartItems.length})
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    {selectedCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveSelected}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        선택삭제
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      전체삭제
                    </Button>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* 아이템 목록 */}
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(val) =>
                          handleSelectItem(item.id, val === true)
                        }
                      />

                      <div className="flex-1 flex gap-4">
                        {/* 상품 이미지 */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <ImageWithFallback
                            src={item.product?.images?.[0] || ""}
                            alt={item.product?.name || "상품"}
                            fill
                            className="object-cover rounded border"
                          />
                        </div>

                        {/* 상품 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link
                                href={`/products/${item.product.id}`}
                                className="text-sm font-medium hover:text-primary line-clamp-2"
                              >
                                {item.product?.name}
                              </Link>

                              {/* 카테고리 표시 */}
                              {item.product?.category && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {item.product.category}
                                </Badge>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* 수량 조절 */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              <span className="w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* 가격 */}
                            <div className="text-right">
                              <Price
                                price={
                                  (item.product?.sale_price ||
                                    item.product?.price ||
                                    0) * item.quantity
                                }
                                originalPrice={
                                  item.product?.sale_price &&
                                  item.product?.price !==
                                    item.product?.sale_price
                                    ? item.product.price * item.quantity
                                    : undefined
                                }
                                size="sm"
                                showDiscount
                              />
                              {item.quantity > 1 && (
                                <Typography
                                  variant="small"
                                  className="text-muted-foreground"
                                >
                                  개당{" "}
                                  {(
                                    item.product?.sale_price ||
                                    item.product?.price ||
                                    0
                                  ).toLocaleString()}
                                  원
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 추천 상품 */}
            <div className="mt-8">
              <Typography variant="h5" className="mb-4">
                이런 상품은 어떠세요?
              </Typography>
              <Typography variant="muted" className="text-center py-8">
                추천 상품 영역 (구현 예정)
              </Typography>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardContent className="p-6">
                  <Typography variant="h6" className="mb-4">
                    주문 요약
                  </Typography>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>선택상품 ({selectedCount}개)</span>
                      <span>{selectedTotal.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>배송비</span>
                      <span>{selectedTotal >= 30000 ? "무료" : "3,000원"}</span>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>총 결제금액</span>
                    <span className="text-primary">
                      {(
                        selectedTotal + (selectedTotal >= 30000 ? 0 : 3000)
                      ).toLocaleString()}
                      원
                    </span>
                  </div>

                  {selectedTotal < 30000 && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {(30000 - selectedTotal).toLocaleString()}원 더 담으면
                        무료배송!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={selectedCount === 0}
                      asChild={selectedCount > 0}
                    >
                      {selectedCount > 0 ? (
                        <Link href="/checkout">
                          주문하기 ({selectedCount}개)
                        </Link>
                      ) : (
                        <span>상품을 선택해주세요</span>
                      )}
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/products">쇼핑 계속하기</Link>
                    </Button>
                  </div>

                  <div className="mt-6 text-xs text-muted-foreground space-y-1">
                    <p>• 장바구니에 담긴 상품은 최대 30일간 보관됩니다.</p>
                    <p>• 일부 상품은 품절될 수 있습니다.</p>
                    <p>• 배송비는 3만원 이상 무료입니다.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}
