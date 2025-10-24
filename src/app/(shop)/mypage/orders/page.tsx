"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/order/use-order";
import { useAuthStore } from "@/store/authStore";
import { Package, ChevronRight } from "lucide-react";
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

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  payment_confirmed: "secondary",
  preparing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
  returned: "destructive",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading } = useOrders({ page, limit: 10 });

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
              <Typography variant="muted">주문 내역을 불러오는 중...</Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const orders = ordersData?.data || [];
  const totalPages = ordersData?.totalPages || 1;

  return (
    <Layout>
      <PageLayout
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "마이페이지", href: "/mypage" },
          { label: "주문 내역" },
        ]}
      >
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            주문 내역
          </Typography>
          <Typography variant="muted">
            총 {ordersData?.total || 0}개의 주문
          </Typography>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h3" className="mb-2">
              주문 내역이 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              첫 주문을 시작해보세요!
            </Typography>
            <Button asChild>
              <Link href="/products">상품 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 주문 헤더 */}
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <Typography variant="small" color="muted">
                        주문번호
                      </Typography>
                      <Typography variant="small" className="font-mono">
                        {order.order_id || order.id.slice(0, 8).toUpperCase()}
                      </Typography>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <Typography variant="small" color="muted">
                        주문일시
                      </Typography>
                      <Typography variant="small">
                        {new Date(order.created_at).toLocaleDateString("ko-KR")}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusColors[order.status] || "default"}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                    <Badge variant="outline">
                      {paymentStatusLabels[order.payment_status] || order.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="p-4">
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

                  <Separator className="my-4" />

                  {/* 주문 금액 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="small" color="muted">
                        총 결제 금액
                      </Typography>
                      <Typography variant="h5" className="text-purple-600">
                        {order.total_amount.toLocaleString()}원
                      </Typography>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/mypage/orders/${order.id}`)}
                    >
                      주문 상세
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  이전
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      onClick={() => setPage(p)}
                      size="sm"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  다음
                </Button>
              </div>
            )}
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}
