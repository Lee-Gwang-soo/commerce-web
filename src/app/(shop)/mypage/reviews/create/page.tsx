"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useProduct } from "@/hooks/product/useProducts";
import { useCreateReview } from "@/hooks/review/use-review";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Loading } from "@/components/atoms/Loading";
import Image from "next/image";

function CreateReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]); // Storage URL 배열
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용
  const [uploadingImages, setUploadingImages] = useState(false);

  const { data: productResponse, isLoading: productLoading } = useProduct(productId || "");
  const createReview = useCreateReview();

  // Extract product data from response
  const product = productResponse?.data;

  useEffect(() => {
    if (!productId) {
      router.push("/mypage/orders");
    }
  }, [productId, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 5개까지만 허용
    if (previewImages.length + files.length > 5) {
      alert("이미지는 최대 5개까지 업로드 가능합니다.");
      return;
    }

    setUploadingImages(true);

    try {
      // FormData 생성
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      // 서버에 업로드
      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "이미지 업로드 실패");
      }

      const data = await response.json();
      const uploadedUrls = data.urls;

      // 미리보기용 - FileReader로 로컬 URL 생성
      const newPreviews: string[] = [];
      for (const file of Array.from(files)) {
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      }

      setPreviewImages((prev) => [...prev, ...newPreviews]);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingImages(false);
      // input 초기화
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!productId) return;

    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      await createReview.mutateAsync({
        product_id: productId,
        content: content.trim(),
        images,
      });

      router.push("/mypage/reviews");
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
    }
  };

  const handleCancel = () => {
    if (content.trim() || images.length > 0) {
      if (confirm("작성 중인 리뷰가 있습니다. 취소하시겠습니까?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  if (productLoading) {
    return (
      <Layout>
        <PageLayout>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" text="상품 정보를 불러오는 중..." />
          </div>
        </PageLayout>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <PageLayout>
          <div className="text-center py-12">
            <Typography variant="h5" className="mb-4">
              상품을 찾을 수 없습니다.
            </Typography>
            <Button onClick={() => router.push("/mypage/orders")}>주문 목록으로 돌아가기</Button>
          </div>
        </PageLayout>
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
          { label: "리뷰 작성" },
        ]}
      >
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <Typography variant="h2" className="mb-2">
              리뷰 작성
            </Typography>
            <Typography variant="muted">구매하신 상품은 어떠셨나요?</Typography>
          </div>

          {/* 상품 정보 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <Typography variant="h6" className="mb-1">
                    {product.name}
                  </Typography>
                  <Typography variant="small" color="muted">
                    ₩{(product.sale_price ?? product.price ?? 0).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 리뷰 작성 폼 */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* 상품 상세 리뷰 */}
              <div>
                <label className="block mb-3">
                  <Typography variant="h6" className="mb-2">
                    상품 상세 리뷰
                  </Typography>
                  <Typography variant="small" color="muted" className="mb-3">
                    상품에 대한 솔직한 리뷰를 작성해주세요.
                  </Typography>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="상품의 품질, 배송, 만족도 등을 자유롭게 작성해주세요. (최소 10자 이상)"
                    className="min-h-[200px] resize-none"
                    maxLength={1000}
                  />
                  <div className="text-right mt-2">
                    <Typography variant="small" color="muted">
                      {content.length} / 1000
                    </Typography>
                  </div>
                </label>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <Typography variant="h6" className="mb-3">
                  상품 이미지 첨부하기
                </Typography>
                <Typography variant="small" color="muted" className="mb-4">
                  상품 사진을 첨부하면 다른 구매자에게 도움이 됩니다. (최대 5장)
                </Typography>

                {/* 업로드 버튼 */}
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${
                    uploadingImages || previewImages.length >= 5
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {uploadingImages ? "업로드 중..." : "이미지 선택"}
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages || previewImages.length >= 5}
                  />
                </label>
                {uploadingImages && (
                  <div className="text-sm text-gray-500">
                    이미지를 업로드하는 중입니다. 잠시만 기다려주세요...
                  </div>
                )}

                {/* 이미지 미리보기 */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <Image
                          src={preview}
                          alt={`미리보기 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={createReview.isPending}
                  className="flex-1"
                >
                  취소하기
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={
                    createReview.isPending ||
                    uploadingImages ||
                    !content.trim() ||
                    content.length < 10
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createReview.isPending ? "등록 중..." : "등록하기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </Layout>
  );
}

export default function CreateReviewPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <PageLayout>
            <div className="flex justify-center items-center min-h-[400px]">
              <Loading size="lg" />
            </div>
          </PageLayout>
        </Layout>
      }
    >
      <CreateReviewContent />
    </Suspense>
  );
}
