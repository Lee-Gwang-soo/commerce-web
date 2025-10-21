import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "../auth/use-auth";
import { toast } from "sonner";
import {
  getCartItems,
  addToCart as addToCartMock,
  updateCartItemQuantity,
  removeFromCart as removeFromCartMock,
  clearCart as clearCartMock,
  getCartItemCount as getCartCountMock,
  isProductInCart as isInCartMock,
  calculateCartTotal,
  type CartItem,
} from "@/lib/data/mockCart";
import { mockProducts } from "@/lib/data/mockProducts";
import type { CartItemInsert, CartItemUpdate } from "@/types/database";

// 장바구니 아이템 조회 훅
export const useCartItems = () => {
  return useQuery({
    queryKey: ["cart", "items"],
    queryFn: () => {
      const cartItems = getCartItems();
      // 상품 정보와 함께 반환
      return cartItems.map((item) => ({
        ...item,
        product: mockProducts.find((p) => p.id === item.product_id),
      }));
    },
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// 장바구니 아이템 수 조회 훅
export const useCartItemCount = () => {
  return useQuery({
    queryKey: ["cart", "count"],
    queryFn: () => Promise.resolve(getCartCountMock()),
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// 장바구니 총액 조회 훅
export const useCartTotal = () => {
  return useQuery({
    queryKey: ["cart", "total"],
    queryFn: () => {
      const cartItems = getCartItems();
      const productPrices = mockProducts.reduce((acc, product) => {
        acc[product.id] = product.sale_price || product.price;
        return acc;
      }, {} as Record<string, number>);
      return Promise.resolve(calculateCartTotal(cartItems, productPrices));
    },
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
      options,
    }: {
      product_id: string;
      quantity?: number;
      options?: Record<string, string>;
    }) => {
      const result = addToCartMock(product_id, quantity, options);
      return Promise.resolve(result);
    },
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
    }) => {
      updateCartItemQuantity(itemId, quantity);
      return Promise.resolve();
    },
    onSuccess: () => {
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
    mutationFn: (itemId: string) => {
      removeFromCartMock(itemId);
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("상품이 장바구니에서 제거되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "상품 제거에 실패했습니다.");
    },
  });
};

// 장바구니 전체 비우기 훅
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      clearCartMock();
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("장바구니가 비워졌습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "장바구니 비우기에 실패했습니다.");
    },
  });
};

// 상품이 장바구니에 있는지 확인 훅
export const useIsInCart = (
  productId: string,
  options?: Record<string, string>
) => {
  return useQuery({
    queryKey: ["cart", "check", productId, options],
    queryFn: () => Promise.resolve(isInCartMock(productId, options)),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// 여러 상품을 한번에 장바구니에 추가 훅
export const useAddMultipleToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      items: {
        product_id: string;
        quantity: number;
        options?: Record<string, string>;
      }[]
    ) => {
      items.forEach((item) => {
        addToCartMock(item.product_id, item.quantity, item.options);
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("상품들이 장바구니에 추가되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "장바구니 추가에 실패했습니다.");
    },
  });
};
