"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/templates/Layout";
import { PageLayout } from "@/components/templates/PageLayout";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMyReviews, useUpdateReview, useDeleteReview } from "@/hooks/review/use-review";
import { Edit2, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { Loading } from "@/components/atoms/Loading";
import Image from "next/image";
import { Review } from "@/lib/api/review";

export default function MyReviewsPage() {
  const router = useRouter();
  const { data: reviews, isLoading } = useMyReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleEditStart = (review: Review) => {
    setEditingId(review.id);
    setEditContent(review.content);
    setEditImages(review.images || []);
    setPreviewImages(review.images || []);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
    setEditImages([]);
    setPreviewImages([]);
  };

  const handleEditSave = async (id: string) => {
    if (!editContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    if (editContent.length < 10) {
      alert("리뷰는 최소 10자 이상 작성해주세요.");
      return;
    }

    try {
      await updateReview.mutateAsync({
        id,
        input: {
          content: editContent.trim(),
          images: editImages,
        },
      });
      handleEditCancel();
    } catch (error) {
      console.error("리뷰 수정 실패:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview.mutateAsync(id);
      } catch (error) {
        console.error("리뷰 삭제 실패:", error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (previewImages.length + files.length > 5) {
      alert("이미지는 최대 5개까지 업로드 가능합니다.");
      return;
    }

    const newPreviews: string[] = [];
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        newPreviews.push(base64);
        newImages.push(base64);

        if (newPreviews.length === files.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews]);
          setEditImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLayout>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" text="리뷰 목록을 불러오는 중..." />
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
          { label: "리뷰 관리" },
        ]}
      >
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <Typography variant="h2" className="mb-2">
              내 리뷰 관리
            </Typography>
            <Typography variant="muted">작성한 리뷰를 확인하고 수정할 수 있습니다.</Typography>
          </div>

          {/* 리뷰 목록 */}
          {!reviews || reviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Typography variant="h5" className="mb-4">
                  작성한 리뷰가 없습니다.
                </Typography>
                <Typography variant="muted" className="mb-6">
                  구매하신 상품에 대한 리뷰를 작성해보세요.
                </Typography>
                <Button onClick={() => router.push("/mypage/orders")}>주문 내역 보기</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    {/* 상품 정보 */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {review.product?.images && review.product.images.length > 0 ? (
                          <Image
                            src={review.product.images[0]}
                            alt={review.product?.name || "상품"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Typography variant="h6" className="mb-1">
                          {review.product?.name}
                        </Typography>
                        <Typography variant="small" color="muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>

                    {/* 리뷰 내용 */}
                    {editingId === review.id ? (
                      /* 수정 모드 */
                      <div className="space-y-4">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[150px] resize-none"
                          maxLength={1000}
                        />
                        <div className="text-right">
                          <Typography variant="small" color="muted">
                            {editContent.length} / 1000
                          </Typography>
                        </div>

                        {/* 이미지 수정 */}
                        <div>
                          <label
                            htmlFor={`image-upload-${review.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Upload className="w-4 h-4" />
                            <span>이미지 추가</span>
                            <input
                              id={`image-upload-${review.id}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={previewImages.length >= 5}
                            />
                          </label>

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

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditCancel}
                            disabled={updateReview.isPending}
                          >
                            취소
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(review.id)}
                            disabled={updateReview.isPending || !editContent.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {updateReview.isPending ? "저장 중..." : "저장"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* 보기 모드 */
                      <>
                        <Typography className="mb-4 whitespace-pre-wrap">
                          {review.content}
                        </Typography>

                        {/* 리뷰 이미지 */}
                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-5 gap-4 mb-4">
                            {review.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={image}
                                  alt={`리뷰 이미지 ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 버튼 */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStart(review)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                            disabled={deleteReview.isPending}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </Layout>
  );
}
