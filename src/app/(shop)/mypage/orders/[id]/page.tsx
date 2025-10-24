"use client";

import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/order/use-order";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  pending: "주문 대기",
  payment_confirmed: "결제 완료",
  preparing: "상품 준비 중",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
  returned: "반품 완료",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  failed: "결제 실패",
  cancelled: "결제 취소",
  refunded: "환불 완료",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isAuthenticated } = useAuthStore();
  const { data: order, isLoading, error } = useOrder(orderId);

  // 로그인 체크
  if (!isAuthenticated) {
    router.push("/login?redirect=/mypage/orders");
    return null;
  }

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

  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Typography variant="h3" className="mb-4">
              주문을 찾을 수 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              주문 정보가 존재하지 않거나 권한이 없습니다.
            </Typography>
            <Button onClick={() => router.push("/mypage/orders")}>
              주문 내역으로 이동
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "마이페이지", href: "/mypage" },
          { label: "주문 내역", href: "/mypage/orders" },
          { label: "주문 상세" },
        ]}
      >
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            주문 상세
          </Typography>
          <div className="flex items-center gap-2">
            <Typography variant="muted" className="font-mono">
              {order.order_id || order.id}
            </Typography>
            <Badge>{statusLabels[order.status] || order.status}</Badge>
            <Badge variant="outline">
              {paymentStatusLabels[order.payment_status] || order.payment_status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 주문 상품 및 배송 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="border rounded-lg p-6">
              <Typography variant="h3" className="mb-4">
                주문 상품
              </Typography>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={item.product.images[0] || "/placeholder-product.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="hover:text-purple-600 transition-colors"
                      >
                        <Typography variant="h6">{item.product.name}</Typography>
                      </Link>
                      <Typography variant="small" color="muted">
                        {item.price.toLocaleString()}원 × {item.quantity}개
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="h6">
                        {(item.price * item.quantity).toLocaleString()}원
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="border rounded-lg p-6">
              <Typography variant="h3" className="mb-4">
                배송 정보
              </Typography>
              <div className="space-y-3">
                <div className="flex">
                  <Typography variant="small" color="muted" className="w-24">
                    수령인
                  </Typography>
                  <Typography variant="small">{order.customer_name}</Typography>
                </div>
                <div className="flex">
                  <Typography variant="small" color="muted" className="w-24">
                    연락처
                  </Typography>
                  <Typography variant="small">{order.customer_phone}</Typography>
                </div>
                <div className="flex">
                  <Typography variant="small" color="muted" className="w-24">
                    이메일
                  </Typography>
                  <Typography variant="small">{order.customer_email}</Typography>
                </div>
                <Separator />
                <div className="flex">
                  <Typography variant="small" color="muted" className="w-24">
                    배송지
                  </Typography>
                  <div className="flex-1">
                    {order.shipping_postcode && (
                      <Typography variant="small" className="block mb-1">
                        [{order.shipping_postcode}]
                      </Typography>
                    )}
                    <Typography variant="small">{order.shipping_address}</Typography>
                  </div>
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
                  <Typography variant="small" color="muted">
                    주문일시
                  </Typography>
                  <Typography variant="small">
                    {new Date(order.created_at).toLocaleDateString("ko-KR")}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="muted">
                    결제방법
                  </Typography>
                  <Typography variant="small">{order.payment_method}</Typography>
                </div>
                {order.payment_key && (
                  <div className="flex justify-between">
                    <Typography variant="small" color="muted">
                      결제키
                    </Typography>
                    <Typography variant="small" className="font-mono text-xs">
                      {order.payment_key.slice(0, 16)}...
                    </Typography>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Typography variant="small" color="muted">
                    상품 금액
                  </Typography>
                  <Typography variant="small">
                    {order.total_amount.toLocaleString()}원
                  </Typography>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <Typography variant="h6">결제 금액</Typography>
                <Typography variant="h5" className="text-purple-600">
                  {order.total_amount.toLocaleString()}원
                </Typography>
              </div>

              <Button
                className="w-full mb-3"
                variant="outline"
                onClick={() => router.push("/mypage/orders")}
              >
                주문 목록으로
              </Button>

              {order.payment_status === "paid" && order.status === "payment_confirmed" && (
                <Button className="w-full" variant="destructive" disabled>
                  주문 취소 (개발 예정)
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}
