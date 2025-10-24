export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    category: string;
    price?: number;
    sale_price?: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_postcode?: string;
  payment_method: string;
  payment_key?: string;
  order_id?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface CreateOrderRequest {
  cart_items: {
    product_id: string;
    quantity: number;
  }[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_postcode?: string;
  payment_method: string;
  order_id: string; // 토스 페이먼츠용 orderId
}

export const orderApi = {
  // 주문 목록 조회
  getOrders: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(`/api/orders?${searchParams.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 목록 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 주문 상세 조회
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 조회에 실패했습니다.");
    }

    return response.json();
  },

  // 주문 생성
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 생성에 실패했습니다.");
    }

    return response.json();
  },

  // 주문 상태 업데이트
  updateOrder: async (
    orderId: string,
    updateData: {
      status?: string;
      payment_status?: string;
      payment_key?: string;
    }
  ): Promise<Order> => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "주문 업데이트에 실패했습니다.");
    }

    return response.json();
  },
};
