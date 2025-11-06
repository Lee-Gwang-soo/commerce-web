import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAddToCart } from "@/hooks/cart/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistItems,
} from "@/hooks/wishlist/use-wishlist";

/**
 * 상품 카드 액션 핸들러 훅
 * 장바구니 담기, 찜하기/찜 취소 기능을 제공
 *
 * @example
 * const { handleAddToCart, handleToggleWishlist, getIsInWishlist } = useProductActions();
 *
 * <ProductCard
 *   product={product}
 *   onCartClick={handleAddToCart}
 *   onWishlistClick={handleToggleWishlist}
 *   isInWishlist={getIsInWishlist(product.id)}
 * />
 */
export const useProductActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { data: wishlistItems = [] } = useWishlistItems();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  /**
   * 장바구니 담기 핸들러
   * - 로그인 체크
   * - 장바구니 추가 API 호출
   */
  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    addToCart.mutate({ product_id: productId, quantity: 1 });
  };

  /**
   * 상품이 찜목록에 있는지 확인
   */
  const getIsInWishlist = (productId: string): boolean => {
    if (!isAuthenticated) return false;

    // React Query 캐시에서 먼저 확인 (optimistic update 반영)
    const cachedValue = queryClient.getQueryData<boolean>(["wishlist", "check", productId]);
    if (typeof cachedValue === "boolean") {
      return cachedValue;
    }

    // wishlistItems에서 확인
    return wishlistItems.some((item) => item.product.id === productId);
  };

  /**
   * 찜하기/찜 취소 토글 핸들러
   * - 로그인 체크
   * - 이미 찜한 상품이면 제거, 아니면 추가
   * - Optimistic update로 즉시 UI 반영
   */
  const handleToggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const isInWishlist = getIsInWishlist(productId);

    if (isInWishlist) {
      // 찜목록에서 제거
      const wishlistItem = wishlistItems.find((item) => item.product.id === productId);
      if (wishlistItem) {
        removeFromWishlist.mutate(wishlistItem.id);
      }
    } else {
      // 찜목록에 추가
      addToWishlist.mutate(productId);
    }
  };

  return {
    handleAddToCart,
    handleToggleWishlist,
    getIsInWishlist,
    isAddingToCart: addToCart.isPending,
    isTogglingWishlist: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};
