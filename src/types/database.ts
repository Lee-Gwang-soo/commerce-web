// Supabase Database Types
// Generated based on actual database schema

export interface Database {
  public: {
    Tables: {
      commerce_user: {
        Row: {
          id: string;
          user_id: string;
          password: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          address_detail: string | null;
          marketing_agreed: boolean | null;
          benefits_agreed: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          password: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          address_detail?: string | null;
          marketing_agreed?: boolean | null;
          benefits_agreed?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          password?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          address_detail?: string | null;
          marketing_agreed?: boolean | null;
          benefits_agreed?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          sale_price: number | null;
          description: string | null;
          images: string[];
          stock: number | null;
          review_count: number | null;
          sales_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          price: number;
          sale_price?: number | null;
          description?: string | null;
          images?: string[];
          stock?: number | null;
          review_count?: number | null;
          sales_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          price?: number;
          sale_price?: number | null;
          description?: string | null;
          images?: string[];
          stock?: number | null;
          review_count?: number | null;
          sales_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total_amount: number;
          customer_name: string | null;
          customer_email: string | null;
          customer_phone: string | null;
          shipping_address: string | null;
          shipping_address_detail: string | null;
          shipping_postcode: string | null;
          payment_method: string | null;
          payment_key: string | null;
          order_id: string | null;
          payment_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: string;
          total_amount: number;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_address?: string | null;
          shipping_address_detail?: string | null;
          shipping_postcode?: string | null;
          payment_method?: string | null;
          payment_key?: string | null;
          order_id?: string | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          total_amount?: number;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_address?: string | null;
          shipping_address_detail?: string | null;
          shipping_postcode?: string | null;
          payment_method?: string | null;
          payment_key?: string | null;
          order_id?: string | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          user_name: string;
          content: string;
          images: string[];
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          user_name: string;
          content: string;
          images?: string[];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          user_name?: string;
          content?: string;
          images?: string[];
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Specific table types
export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderUpdate = TablesUpdate<"orders">;

export type OrderItem = Tables<"order_items">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type OrderItemUpdate = TablesUpdate<"order_items">;

export type Review = Tables<"reviews">;
export type ReviewInsert = TablesInsert<"reviews">;
export type ReviewUpdate = TablesUpdate<"reviews">;

export type CartItem = Tables<"cart_items">;
export type CartItemInsert = TablesInsert<"cart_items">;
export type CartItemUpdate = TablesUpdate<"cart_items">;

export type Wishlist = Tables<"wishlist">;
export type WishlistInsert = TablesInsert<"wishlist">;
export type WishlistUpdate = TablesUpdate<"wishlist">;

export type CommerceUser = Tables<"commerce_user">;
export type CommerceUserInsert = TablesInsert<"commerce_user">;
export type CommerceUserUpdate = TablesUpdate<"commerce_user">;

// Auth-related types
export interface RegisterRequest {
  user_id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address_detail?: string | null;
  marketing_agreed?: boolean;
  benefits_agreed?: boolean;
}

export interface LoginRequest {
  user_id: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  address?: string;
  address_detail?: string | null;
  password?: string;
  current_password?: string;
}

// API 응답용 UserData (camelCase)
export interface UserData {
  id: string;
  userId: string; // API 응답에서 camelCase로 변환됨
  name: string;
  email: string;
  phone: string;
  address: string;
  address_detail?: string | null;
  addressDetail?: string | null; // camelCase 버전도 지원
  marketing_agreed: boolean | null;
  benefits_agreed: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserData;
  data?: UserData;
}
