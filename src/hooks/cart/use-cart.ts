import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// 장바구니 아이템 조회 훅
export const useCartItems = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["cart", "items"],
    queryFn: () => cartApi.getCartItems(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2분
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error: any) => {
      // 401, 403, 404는 재시도 안함
      if (error?.message?.includes("로그인") || error?.message?.includes("권한")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// 장바구니 아이템 수 조회 훅
export const useCartItemCount = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["cart", "count"],
    queryFn: async () => {
      const cartItems = await cartApi.getCartItems();
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      return totalCount;
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

// 장바구니 총액 조회 훅
export const useCartTotal = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: cartItems } = useCartItems();

  return useQuery({
    queryKey: ["cart", "total"],
    queryFn: () => {
      const total =
        cartItems?.reduce((sum, item) => {
          const price = item.product.sale_price || item.product.price;
          return sum + price * item.quantity;
        }, 0) || 0;
      return Promise.resolve(total);
    },
    enabled: isAuthenticated && !!cartItems,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// 장바구니에 상품 추가 훅
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      product_id,
      quantity = 1,
    }: {
      product_id: string;
      quantity?: number;
    }) => cartApi.addToCart(product_id, quantity),
    onSuccess: () => {
      toast.success("상품이 장바구니에 추가되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "장바구니 추가에 실패했습니다.");
    },
  });
};

// 장바구니 아이템 업데이트 훅
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => cartApi.updateCartItem(itemId, quantity),
    onSuccess: () => {
      toast.success("수량이 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "장바구니 업데이트에 실패했습니다.");
    },
  });
};

// 장바구니에서 아이템 제거 훅
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeFromCart(itemId),
    onSuccess: () => {
      toast.success("상품이 장바구니에서 제거되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "상품 제거에 실패했습니다.");
    },
  });
};

// 상품이 장바구니에 있는지 확인 훅
export const useIsInCart = (productId: string) => {
  const { isAuthenticated } = useAuthStore();
  const { data: cartItems } = useCartItems();

  return useQuery({
    queryKey: ["cart", "check", productId],
    queryFn: () => {
      const isInCart = cartItems?.some((item) => item.product.id === productId);
      return Promise.resolve(isInCart || false);
    },
    enabled: isAuthenticated && !!productId && !!cartItems,
    staleTime: 1000 * 60 * 2, // 2분
  });
};
