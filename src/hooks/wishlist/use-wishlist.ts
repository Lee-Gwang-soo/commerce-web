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
    staleTime: 1000 * 60 * 2, // 2분
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

  return useQuery({
    queryKey: ["wishlist", "count"],
    queryFn: async () => {
      const wishlistItems = await wishlistApi.getWishlistItems();
      return wishlistItems.length;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2분
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
    onSuccess: () => {
      toast.success("찜목록에 추가되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "찜목록 추가에 실패했습니다.");
    },
  });
};

// 찜목록에서 제거 훅
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => wishlistApi.removeFromWishlist(itemId),
    onSuccess: () => {
      toast.success("찜목록에서 제거되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "찜목록 제거에 실패했습니다.");
    },
  });
};

// 상품이 찜목록에 있는지 확인 훅
export const useIsInWishlist = (productId: string) => {
  const { isAuthenticated } = useAuthStore();
  const { data: wishlistItems } = useWishlistItems();

  return useQuery({
    queryKey: ["wishlist", "check", productId],
    queryFn: () => {
      const isInWishlist = wishlistItems?.some(
        (item) => item.product.id === productId
      );
      return Promise.resolve(isInWishlist || false);
    },
    enabled: isAuthenticated && !!productId && !!wishlistItems,
    staleTime: 1000 * 60 * 2, // 2분
  });
};
