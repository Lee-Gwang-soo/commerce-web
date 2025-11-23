import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi, CreateReviewInput, UpdateReviewInput } from "@/lib/api/review";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// 내 리뷰 목록 조회 (무한 스크롤)
export const useMyReviews = () => {
  const { isAuthenticated } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ["reviews", "my"],
    queryFn: ({ pageParam = 1 }) => reviewApi.getMyReviews(pageParam, 10),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};

// 리뷰 작성
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => reviewApi.createReview(input),
    onSuccess: () => {
      toast.success("리뷰가 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "리뷰 작성에 실패했습니다.");
    },
  });
};

// 리뷰 수정
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReviewInput }) =>
      reviewApi.updateReview(id, input),
    onSuccess: () => {
      toast.success("리뷰가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "리뷰 수정에 실패했습니다.");
    },
  });
};

// 리뷰 삭제
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: () => {
      toast.success("리뷰가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "리뷰 삭제에 실패했습니다.");
    },
  });
};
