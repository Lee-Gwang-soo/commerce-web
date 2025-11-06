import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/lib/api/wishlist";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// 찜목록 조회 훅
export const useWishlistItems = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["wishlist", "items"],
    queryFn: () => wishlistApi.getWishlistItems(),
    enabled: isAuthenticated,
    staleTime: 0, // 항상 최신 상태 유지
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("로그인") || error?.message?.includes("권한")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// 찜목록 아이템 수 조회 훅
export const useWishlistItemCount = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["wishlist", "count"],
    queryFn: async () => {
      // 캐시에 이미 값이 있으면 사용 (optimistic update용)
      const cachedCount = queryClient.getQueryData(["wishlist", "count"]);
      if (typeof cachedCount === "number") {
        return cachedCount;
      }

      // 캐시에 없으면 fetch
      const wishlistItems = await wishlistApi.getWishlistItems();
      return wishlistItems.length;
    },
    enabled: isAuthenticated,
    staleTime: 0, // 항상 최신 상태 유지
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("로그인") || error?.message?.includes("권한")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// 찜목록에 추가 훅
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product_id: string) => wishlistApi.addToWishlist(product_id),
    onMutate: async (product_id: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousWishlistItems = queryClient.getQueryData(["wishlist", "items"]);
      const previousWishlistCount = queryClient.getQueryData(["wishlist", "count"]);

      // Optimistic update: 즉시 UI 업데이트
      queryClient.setQueryData(["wishlist", "check", product_id], true);

      // 카운트 증가
      if (typeof previousWishlistCount === "number") {
        queryClient.setQueryData(["wishlist", "count"], previousWishlistCount + 1);
      }

      // 롤백용 데이터 반환
      return { previousWishlistItems, previousWishlistCount, product_id };
    },
    onSuccess: () => {
      toast.success("찜목록에 추가되었습니다.");
    },
    onError: (error: any, _product_id, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context) {
        queryClient.setQueryData(["wishlist", "items"], context.previousWishlistItems);
        queryClient.setQueryData(["wishlist", "count"], context.previousWishlistCount);
        queryClient.setQueryData(["wishlist", "check", context.product_id], false);
      }
      toast.error(error.message || "찜목록 추가에 실패했습니다.");
    },
    onSettled: () => {
      // 완료 후 실제 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// 찜목록에서 제거 훅
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => wishlistApi.removeFromWishlist(itemId),
    onMutate: async (itemId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // 이전 데이터 스냅샷 저장
      const previousWishlistItems = queryClient.getQueryData(["wishlist", "items"]) as any[];
      const previousWishlistCount = queryClient.getQueryData(["wishlist", "count"]);

      // 제거할 아이템의 product_id 찾기
      const removedItem = previousWishlistItems?.find((item: any) => item.id === itemId);
      const product_id = removedItem?.product?.id;

      // Optimistic update: 즉시 UI 업데이트
      if (product_id) {
        queryClient.setQueryData(["wishlist", "check", product_id], false);
      }

      // 카운트 감소
      if (typeof previousWishlistCount === "number" && previousWishlistCount > 0) {
        queryClient.setQueryData(["wishlist", "count"], previousWishlistCount - 1);
      }

      // 롤백용 데이터 반환
      return { previousWishlistItems, previousWishlistCount, product_id };
    },
    onSuccess: () => {
      toast.success("찜목록에서 제거되었습니다.");
    },
    onError: (error: any, _itemId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context) {
        queryClient.setQueryData(["wishlist", "items"], context.previousWishlistItems);
        queryClient.setQueryData(["wishlist", "count"], context.previousWishlistCount);
        if (context.product_id) {
          queryClient.setQueryData(["wishlist", "check", context.product_id], true);
        }
      }
      toast.error(error.message || "찜목록 제거에 실패했습니다.");
    },
    onSettled: () => {
      // 완료 후 실제 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// 상품이 찜목록에 있는지 확인 훅
export const useIsInWishlist = (productId: string) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["wishlist", "check", productId],
    queryFn: async () => {
      // 캐시에 이미 값이 있으면 사용 (optimistic update용)
      const cachedValue = queryClient.getQueryData(["wishlist", "check", productId]);
      if (typeof cachedValue === "boolean") {
        return cachedValue;
      }

      // 캐시에 없으면 wishlistItems에서 확인
      const wishlistItems = queryClient.getQueryData(["wishlist", "items"]) as any[];
      if (!wishlistItems) {
        // wishlistItems도 없으면 fetch
        const items = await wishlistApi.getWishlistItems();
        const isInWishlist = items.some((item) => item.product.id === productId);
        return isInWishlist;
      }

      const isInWishlist = wishlistItems.some((item) => item.product.id === productId);
      return isInWishlist;
    },
    enabled: isAuthenticated && !!productId,
    staleTime: 0, // 항상 최신 상태 유지
    gcTime: 1000 * 60 * 5, // 5분
  });
};
