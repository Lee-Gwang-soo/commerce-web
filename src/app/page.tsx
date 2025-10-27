"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/templates/Layout";
import { Typography } from "@/components/atoms/Typography";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import Banner from "@/components/atoms/Banner";
import { useProducts } from "@/hooks/product/useProducts";
import { useAddToCart } from "@/hooks/cart/use-cart";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants/categories";
import Link from "next/link";

// Hero 배너 섹션
function HeroBannerSection() {
  const heroImages = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80",
    "https://images.unsplash.com/photo-1556909114-5ce10c3e8068?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80",
  ];

  return (
    <Banner isHero images={heroImages} autoRotate showNavigation interval={5000} className="mb-0" />
  );
}

// 카테고리 섹션 컴포넌트
function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50 mb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Typography variant="h2" className="mb-4 text-gray-900">
            카테고리별 쇼핑
          </Typography>
          <Typography variant="lead" className="text-gray-600">
            원하시는 카테고리의 상품을 만나보세요
          </Typography>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="text-center p-8 hover:shadow-xl transition-all cursor-pointer group bg-white border-2 border-gray-200 hover:border-purple-400 h-full">
                <CardContent className="p-0">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <Typography variant="h5" className="mb-2 text-gray-900 font-bold">
                    {category.label}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// 메인 페이지 컴포넌트
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useAddToCart();

  // 최신 상품 조회 (8개, 최신순)
  const { data: latestProductsData, isLoading: latestLoading } = useProducts({
    page: 1,
    limit: 8,
    sort: "created_at",
    order: "desc",
  });

  // 할인 상품 조회 (8개, 리뷰 많은 순) - featured 대신 사용
  const { data: featuredProductsData, isLoading: featuredLoading } = useProducts({
    page: 1,
    limit: 8,
    sort: "review_count",
    order: "desc",
  });

  const featuredProducts = featuredProductsData?.data || [];
  const latestProducts = latestProductsData?.data || [];

  // 장바구니 담기 핸들러
  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    addToCart.mutate({ product_id: productId, quantity: 1 });
  };

  return (
    <Layout showBanner={true}>
      <div className="space-y-0">
        {/* Hero Banner Section */}
        <HeroBannerSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <Typography variant="h2" className="mb-2 text-gray-900">
                  지금 가장 많이 담는 특가
                </Typography>
                <Typography variant="muted" className="text-gray-600">
                  놓치면 후회할 베스트 상품 특가
                </Typography>
              </div>
              <Button
                variant="outline"
                asChild
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <a href="/products?featured=true">전체보기</a>
              </Button>
            </div>

            <ProductGrid
              products={featuredProducts}
              loading={featuredLoading}
              columns="auto"
              gap="md"
              emptyMessage="추천 상품이 없습니다"
              emptyDescription="다양한 상품들을 준비 중입니다"
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <Typography variant="h2" className="mb-2 text-gray-900">
                  신상품
                </Typography>
                <Typography variant="muted" className="text-gray-600">
                  방금 입고된 따끈따끈한 신상품들
                </Typography>
              </div>
              <Button
                variant="outline"
                asChild
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <a href="/products?sort=latest">전체보기</a>
              </Button>
            </div>

            <ProductGrid
              products={latestProducts}
              loading={latestLoading}
              columns="auto"
              gap="md"
              emptyMessage="신상품이 없습니다"
              emptyDescription="새로운 상품들을 준비 중입니다"
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
