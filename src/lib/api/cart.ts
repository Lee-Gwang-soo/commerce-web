import { supabase } from "@/lib/supabase/client";
import type {
  CartItem,
  CartItemInsert,
  CartItemUpdate,
} from "@/types/database";

// 장바구니 관련 API 함수들
export const cartApi = {
  // 사용자 장바구니 조회
  getCartItems: async (userId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (
          id,
          name,
          price,
          sale_price,
          images,
          stock_quantity,
          sku
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 장바구니에 상품 추가
  addToCart: async (item: CartItemInsert) => {
    // 기존 아이템이 있는지 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", item.user_id)
      .eq("product_id", item.product_id)
      .single();

    if (existingItem) {
      // 기존 아이템이 있으면 수량 업데이트
      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select(
          `
          *,
          products (
            id,
            name,
            price,
            sale_price,
            images,
            stock_quantity,
            sku
          )
        `
        )
        .single();

      if (error) throw error;
      return data;
    } else {
      // 새 아이템 추가
      const { data, error } = await supabase
        .from("cart_items")
        .insert(item)
        .select(
          `
          *,
          products (
            id,
            name,
            price,
            sale_price,
            images,
            stock_quantity,
            sku
          )
        `
        )
        .single();

      if (error) throw error;
      return data;
    }
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItem: async (itemId: string, updates: CartItemUpdate) => {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select(
        `
        *,
        products (
          id,
          name,
          price,
          sale_price,
          images,
          stock_quantity,
          sku
        )
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // 장바구니에서 아이템 제거
  removeFromCart: async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  },

  // 장바구니 전체 비우기
  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },

  // 장바구니 아이템 수 조회
  getCartItemCount: async (userId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", userId);

    if (error) throw error;

    const totalCount = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    return totalCount;
  },

  // 장바구니 총액 계산
  getCartTotal: async (userId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        quantity,
        products (
          price,
          sale_price
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    const total =
      data?.reduce((sum, item) => {
        const price = item.products?.sale_price || item.products?.price || 0;
        return sum + price * item.quantity;
      }, 0) || 0;

    return total;
  },

  // 상품이 장바구니에 있는지 확인
  isInCart: async (userId: string, productId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },

  // 여러 상품을 한번에 장바구니에 추가
  addMultipleToCart: async (items: CartItemInsert[]) => {
    const { data, error } = await supabase.from("cart_items").insert(items)
      .select(`
        *,
        products (
          id,
          name,
          price,
          sale_price,
          images,
          stock_quantity,
          sku
        )
      `);

    if (error) throw error;
    return data || [];
  },
};
