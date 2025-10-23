// Mock 장바구니 데이터 관리

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  options?: Record<string, string>; // 선택한 옵션들
  added_at: string;
}

// 로컬 스토리지에서 장바구니 관리
const CART_STORAGE_KEY = "commerce_cart";

export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart items:", error);
  }
};

export const addToCart = (
  productId: string,
  quantity: number = 1,
  options?: Record<string, string>
): CartItem => {
  const cartItems = getCartItems();

  // 같은 상품, 같은 옵션의 아이템이 있는지 확인
  const existingItemIndex = cartItems.findIndex(
    (item) =>
      item.product_id === productId &&
      JSON.stringify(item.options || {}) === JSON.stringify(options || {})
  );

  const newItem: CartItem = {
    id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    product_id: productId,
    quantity,
    options,
    added_at: new Date().toISOString(),
  };

  if (existingItemIndex >= 0) {
    // 기존 아이템이 있으면 수량 증가
    cartItems[existingItemIndex].quantity += quantity;
    saveCartItems(cartItems);
    return cartItems[existingItemIndex];
  } else {
    // 새 아이템 추가
    const updatedItems = [...cartItems, newItem];
    saveCartItems(updatedItems);
    return newItem;
  }
};

export const updateCartItemQuantity = (
  itemId: string,
  quantity: number
): void => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // 수량이 0 이하면 아이템 제거
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }
    saveCartItems(cartItems);
  }
};

export const removeFromCart = (itemId: string): void => {
  const cartItems = getCartItems();
  const filteredItems = cartItems.filter((item) => item.id !== itemId);
  saveCartItems(filteredItems);
};

export const clearCart = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
};

export const getCartItemCount = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const isProductInCart = (
  productId: string,
  options?: Record<string, string>
): boolean => {
  const cartItems = getCartItems();
  return cartItems.some(
    (item) =>
      item.product_id === productId &&
      JSON.stringify(item.options || {}) === JSON.stringify(options || {})
  );
};

// 장바구니 전체 가격 계산을 위한 헬퍼 함수들
export const calculateCartTotal = (
  cartItems: CartItem[],
  productPrices: Record<string, number>
): number => {
  return cartItems.reduce((total, item) => {
    const price = productPrices[item.product_id] || 0;
    return total + price * item.quantity;
  }, 0);
};






















