"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartItems } from "@/hooks/cart/use-cart";
import { useCreateOrder } from "@/hooks/order/use-order";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { user } = useAuth();
  const { data: cartItems = [], isLoading } = useCartItems();
  const createOrder = useCreateOrder();

  // 선택된 상품만 주문 (selectedIds가 URL에 있는 경우)
  const selectedIdsParam = searchParams.get("selectedIds");
  const selectedIds = selectedIdsParam ? selectedIdsParam.split(",") : [];
  const itemsToOrder =
    selectedIds.length > 0
      ? cartItems.filter((item) => selectedIds.includes(item.id))
      : cartItems;

  // 주문자 정보 상태
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
  });

  // 사용자 정보 자동 입력
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        postcode: "",
      });
    }
  }, [user]);

  // 로그인 체크
  if (!isAuthenticated) {
    router.push("/login?redirect=/checkout");
    return null;
  }

  // 장바구니가 비어있는 경우
  if (!isLoading && itemsToOrder.length === 0) {
    return (
      <Layout>
        <PageLayout breadcrumbs={[{ label: "홈", href: "/" }, { label: "주문하기" }]}>
          <div className="text-center py-16">
            <Typography variant="h3" className="mb-4">
              주문할 상품이 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              장바구니에서 상품을 선택해주세요.
            </Typography>
            <Button onClick={() => router.push("/cart")}>장바구니로 이동</Button>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // 총 금액 계산
  const totalAmount = itemsToOrder.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingFee = totalAmount >= 30000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  // 주문하기 버튼 클릭
  const handleCheckout = async () => {
    // 유효성 검사
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("모든 필수 정보를 입력해주세요.");
      return;
    }

    try {
      // orderId 생성 (고유값)
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 주문 생성
      const cart_items = itemsToOrder.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const order = await createOrder.mutateAsync({
        cart_items,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        shipping_postcode: customerInfo.postcode || undefined,
        payment_method: "토스페이먼츠",
        order_id: orderId,
      });

      // 토스페이먼츠 결제 연동
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount: finalAmount,
        orderId: orderId,
        orderName:
          itemsToOrder.length === 1
            ? itemsToOrder[0].product.name
            : `${itemsToOrder[0].product.name} 외 ${itemsToOrder.length - 1}건`,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (error: any) {
      console.error("결제 요청 실패:", error);
      toast.error(error.message || "결제 요청에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">주문 정보를 불러오는 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout breadcrumbs={[{ label: "홈", href: "/" }, { label: "주문하기" }]}>
        <Typography variant="h1" className="mb-8">
          주문하기
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 주문자 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="border rounded-lg p-6">
              <Typography variant="h3" className="mb-4">
                주문 상품
              </Typography>
              <div className="space-y-4">
                {itemsToOrder.map((item) => {
                  const product = item.product;
                  const price = product.sale_price || product.price;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={product.images[0] || "/placeholder-product.png"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="small" color="muted">
                          {price.toLocaleString()}원 × {item.quantity}개
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="h6">
                          {(price * item.quantity).toLocaleString()}원
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 주문자 정보 */}
            <div className="border rounded-lg p-6">
              <Typography variant="h3" className="mb-4">
                주문자 정보
              </Typography>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    placeholder="전화번호를 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* 배송지 정보 */}
            <div className="border rounded-lg p-6">
              <Typography variant="h3" className="mb-4">
                배송지 정보
              </Typography>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="postcode">우편번호</Label>
                  <Input
                    id="postcode"
                    value={customerInfo.postcode}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        postcode: e.target.value,
                      })
                    }
                    placeholder="우편번호"
                  />
                </div>
                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="주소를 입력하세요"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 정보 */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-20">
              <Typography variant="h3" className="mb-4">
                결제 정보
              </Typography>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <Typography variant="muted">상품 금액</Typography>
                  <Typography>{totalAmount.toLocaleString()}원</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="muted">배송비</Typography>
                  <Typography>
                    {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                  </Typography>
                </div>
                {totalAmount < 30000 && (
                  <Typography variant="small" color="muted">
                    3만원 이상 구매 시 무료배송
                  </Typography>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <Typography variant="h4">최종 결제 금액</Typography>
                <Typography variant="h4" className="text-purple-600">
                  {finalAmount.toLocaleString()}원
                </Typography>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "처리 중..." : "결제하기"}
              </Button>

              <Typography variant="small" color="muted" className="mt-4 text-center">
                결제 시 토스페이먼츠로 이동합니다
              </Typography>
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}
