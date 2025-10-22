"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { ProductImageGallery } from "@/components/molecules/ProductImageGallery";
import { ProductOptions } from "@/components/molecules/ProductOptions";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Typography } from "@/components/atoms/Typography";
import { Price } from "@/components/atoms/Price";
import { Rating } from "@/components/atoms/Rating";
import { Quantity } from "@/components/atoms/Quantity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { useProduct, useProductReviews, useProducts } from "@/hooks/product/useProducts";
import { useAddToCart, useIsInCart } from "@/hooks/cart/use-cart";
import type {
  SelectedOptions,
  ProductOptionGroup,
} from "@/components/molecules/ProductOptions";

// 임시 상품 옵션 데이터 (실제로는 API에서 가져올 예정)
const getProductOptions = (productId: string): ProductOptionGroup[] => {
  // 상품별로 다른 옵션 반환
  const baseOptions: ProductOptionGroup[] = [
    {
      id: "color",
      name: "색상",
      type: "color",
      required: true,
      values: [
        {
          id: "black",
          label: "블랙",
          value: "black",
          color: "#000000",
          available: true,
        },
        {
          id: "white",
          label: "화이트",
          value: "white",
          color: "#FFFFFF",
          available: true,
        },
        {
          id: "gray",
          label: "그레이",
          value: "gray",
          color: "#808080",
          available: true,
        },
      ],
    },
  ];

  if (productId === "1" || productId === "2") {
    // 전자제품에는 보증 옵션 추가
    baseOptions.push({
      id: "warranty",
      name: "보증 옵션",
      type: "text",
      required: false,
      values: [
        {
          id: "basic",
          label: "기본 보증",
          value: "basic",
          description: "1년 제조사 보증",
          price: 0,
        },
        {
          id: "extended",
          label: "연장 보증",
          value: "extended",
          description: "3년 연장 보증",
          price: 50000,
        },
      ],
    });
  }

  if (productId === "5" || productId === "6") {
    // 의류/신발에는 사이즈 옵션 추가
    baseOptions.push({
      id: "size",
      name: "사이즈",
      type: "text",
      required: true,
      values: [
        { id: "s", label: "S", value: "s", available: true },
        { id: "m", label: "M", value: "m", available: true },
        { id: "l", label: "L", value: "l", available: true },
        { id: "xl", label: "XL", value: "xl", available: false },
      ],
    });
  }

  return baseOptions;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  // 상품 정보 조회 (새로운 API)
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useProduct(productId);

  const product = productData?.data;

  // 리뷰 데이터 조회 (새로운 API)
  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(productId, {
    page: 1,
    limit: 10,
  });

  const reviews = reviewsData?.data || [];
  const totalReviews = reviewsData?.total || 0;

  // 관련 상품 조회 (같은 카테고리의 다른 상품)
  const { data: relatedProductsData } = useProducts(
    {
      category: product?.category,
      limit: 4,
    },
    {
      enabled: !!product?.category,
    }
  );

  const relatedProducts = relatedProductsData?.data?.filter(p => p.id !== productId) || [];

  // 상태 관리
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // 장바구니 관련
  const { data: isInCart = false } = useIsInCart(productId);
  const addToCart = useAddToCart();

  // 상품 옵션
  const productOptions = product ? getProductOptions(productId) : [];

  // 가격 계산 (옵션 가격 포함)
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    let basePrice = product.sale_price || product.price;

    // 옵션 추가 가격 계산
    Object.entries(selectedOptions).forEach(([groupId, valueId]) => {
      const group = productOptions.find((g) => g.id === groupId);
      const value = group?.values.find((v) => v.id === valueId);
      if (value?.price) {
        basePrice += value.price;
      }
    });

    return basePrice;
  }, [selectedOptions, product, productOptions]);

  // 필수 옵션 선택 여부 확인
  const allRequiredOptionsSelected = useMemo(() => {
    return productOptions
      .filter((option) => option.required)
      .every((option) => selectedOptions[option.id]);
  }, [selectedOptions, productOptions]);

  // 장바구니 추가
  const handleAddToCart = () => {
    if (!allRequiredOptionsSelected) {
      alert("필수 옵션을 선택해주세요.");
      return;
    }

    addToCart.mutate({
      product_id: productId,
      quantity,
      options: selectedOptions,
    });
  };

  // 옵션 변경 핸들러
  const handleOptionChange = (groupId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: valueId,
    }));
  };

  // 로딩 상태
  if (productLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">
                상품 정보를 불러오는 중...
              </Typography>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 에러 상태
  if (productError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Typography variant="h3" className="mb-4">
              상품을 찾을 수 없습니다
            </Typography>
            <Typography variant="muted" className="mb-6">
              요청하신 상품이 존재하지 않거나 삭제되었을 수 있습니다.
            </Typography>
            <Button asChild>
              <a href="/products">전체 상품 보기</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // stock과 stock_quantity 둘 다 지원
  const availableStock = product.stock ?? product.stock_quantity ?? 0;
  const isOutOfStock = availableStock <= 0;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountRate = product.discount_rate || (hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0);

  return (
    <Layout>
      <PageLayout
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상품", href: "/products" },
          { label: "전자기기", href: "/categories/electronics" },
          { label: product.name },
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 상품 이미지 */}
          <div>
            <ProductImageGallery
              images={product.images}
              alt={product.name}
              aspectRatio="square"
              showThumbnails
              showZoom
            />
          </div>

          {/* 상품 정보 */}
          <div className="space-y-6">
            {/* 헤더 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Typography variant="small" color="muted">
                  {product.category || "일반 상품"}
                </Typography>
                {product.is_featured && <Badge variant="secondary">추천</Badge>}
                {hasDiscount && (
                  <Badge variant="destructive">{discountRate}% 할인</Badge>
                )}
                {isOutOfStock && <Badge variant="outline">품절</Badge>}
              </div>

              <Typography variant="h1" className="mb-2">
                {product.name}
              </Typography>

              <Typography variant="lead" color="muted" className="mb-4">
                {product.short_description}
              </Typography>

              {/* 평점 및 리뷰 */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <Rating rating={4.5} size="sm" showText showCount count={totalReviews} />
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("reviews")}
                  >
                    리뷰 {totalReviews}개 보기
                  </Button>
                </div>
              )}
              {totalReviews === 0 && (
                <Typography variant="small" color="muted" className="mb-4">
                  아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
                </Typography>
              )}
            </div>

            {/* 가격 */}
            <div>
              <Price
                price={totalPrice}
                originalPrice={hasDiscount ? product.price : undefined}
                size="xl"
                showDiscount
                className="mb-2"
              />

              {/* 수량별 가격 표시 */}
              {quantity > 1 && (
                <Typography variant="muted">
                  총 {(totalPrice * quantity).toLocaleString()}원 (개당{" "}
                  {totalPrice.toLocaleString()}원)
                </Typography>
              )}
            </div>

            <Separator />

            {/* 상품 옵션 */}
            {productOptions.length > 0 && (
              <div>
                <ProductOptions
                  options={productOptions}
                  selectedOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  showPrices
                />
              </div>
            )}

            <Separator />

            {/* 수량 선택 */}
            <div className="flex items-center gap-4">
              <Typography variant="h6">수량</Typography>
              <Quantity
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={Math.min(availableStock, 10)}
                disabled={isOutOfStock}
              />
              <Typography variant="small" color="muted">
                재고 {availableStock}개
              </Typography>
            </div>

            {/* 구매 버튼 */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={
                  isOutOfStock ||
                  !allRequiredOptionsSelected ||
                  addToCart.isPending
                }
                // loading={addToCart.isPending}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInCart ? "장바구니에 추가됨" : "장바구니 담기"}
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* 즉시 구매 */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled={isOutOfStock || !allRequiredOptionsSelected}
            >
              즉시 구매
            </Button>

            {/* 서비스 정보 */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <Typography variant="small">
                  무료배송 (3만원 이상 구매시)
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <Typography variant="small">정품보증 및 A/S 지원</Typography>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <Typography variant="small">7일 무료 반품/교환</Typography>
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="text-sm text-muted-foreground space-y-1">
              <div>상품 ID: {product.id.slice(0, 8).toUpperCase()}</div>
              <div>카테고리: {product.category}</div>
              <div>재고: {availableStock}개</div>
              {product.review_count > 0 && (
                <div>리뷰: {product.review_count}개</div>
              )}
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">상품 상세</TabsTrigger>
              <TabsTrigger value="reviews">
                리뷰 ({totalReviews})
              </TabsTrigger>
              <TabsTrigger value="qna">문의</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <Typography variant="p">{product.description}</Typography>
                {product.tags && (
                  <div className="mt-6">
                    <Typography variant="h6" className="mb-3">
                      태그
                    </Typography>
                    <div className="flex gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {reviewsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <Typography variant="muted">리뷰를 불러오는 중...</Typography>
                </div>
              ) : totalReviews === 0 ? (
                <div className="text-center py-12">
                  <Typography variant="h5" className="mb-2">
                    아직 리뷰가 없습니다
                  </Typography>
                  <Typography variant="muted" className="mb-6">
                    이 상품의 첫 번째 리뷰를 작성해보세요!
                  </Typography>
                  <Button>리뷰 작성하기</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 리뷰 요약 */}
                  <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Typography variant="h2" className="mb-1">
                        4.5
                      </Typography>
                      <Rating rating={4.5} size="sm" />
                      <Typography variant="small" color="muted" className="mt-1">
                        {totalReviews}개 리뷰
                      </Typography>
                    </div>
                  </div>

                  {/* 리뷰 목록 */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-b-0"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <Typography variant="h6">{review.user_name}</Typography>
                          <Typography variant="small" color="muted">
                            {new Date(review.created_at).toLocaleDateString("ko-KR")}
                          </Typography>
                        </div>
                        <Typography variant="p" className="whitespace-pre-wrap">
                          {review.content}
                        </Typography>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`리뷰 이미지 ${index + 1}`}
                                className="w-24 h-24 object-cover rounded border hover:scale-105 transition-transform cursor-pointer"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {totalReviews > 10 && (
                    <Button variant="outline" className="w-full">
                      리뷰 더보기
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="qna" className="mt-6">
              <div className="text-center py-12">
                <Typography variant="h5" className="mb-2">
                  문의사항이 있으신가요?
                </Typography>
                <Typography variant="muted" className="mb-6">
                  상품에 대한 궁금한 점을 문의해보세요.
                </Typography>
                <Button>문의 작성하기</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 관련 상품 */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Typography variant="h2" className="mb-6">
              관련 상품
            </Typography>
            <ProductGrid
              products={relatedProducts}
              columns={4}
              gap="md"
              emptyMessage="관련 상품이 없습니다"
            />
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}
