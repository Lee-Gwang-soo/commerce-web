// Supabase 스키마에서 자동 생성되는 타입들을 위한 기본 구조
// 실제 사용 시에는 `supabase gen types typescript` 명령어로 생성합니다

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          slug?: string;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          short_description: string | null;
          sku: string;
          price: number;
          sale_price: number | null;
          stock_quantity: number;
          category_id: string;
          images: string[];
          tags: string[];
          is_active: boolean;
          is_featured: boolean;
          weight: number | null;
          dimensions: Record<string, any> | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          short_description?: string | null;
          sku: string;
          price: number;
          sale_price?: number | null;
          stock_quantity?: number;
          category_id: string;
          images?: string[];
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          weight?: number | null;
          dimensions?: Record<string, any> | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          short_description?: string | null;
          sku?: string;
          price?: number;
          sale_price?: number | null;
          stock_quantity?: number;
          category_id?: string;
          images?: string[];
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          weight?: number | null;
          dimensions?: Record<string, any> | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_address: Record<string, any>;
          billing_address: Record<string, any>;
          payment_method: string;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_address: Record<string, any>;
          billing_address: Record<string, any>;
          payment_method: string;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?:
            | "pending"
            | "confirmed"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount?: number;
          shipping_address?: Record<string, any>;
          billing_address?: Record<string, any>;
          payment_method?: string;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
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
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          content: string;
          images: string[];
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          content: string;
          images?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          content?: string;
          images?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 편의를 위한 타입 별칭들
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

// Insert 타입들
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];
export type CartItemInsert =
  Database["public"]["Tables"]["cart_items"]["Insert"];
export type WishlistInsert =
  Database["public"]["Tables"]["wishlists"]["Insert"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

// Update 타입들
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
export type OrderItemUpdate =
  Database["public"]["Tables"]["order_items"]["Update"];
export type CartItemUpdate =
  Database["public"]["Tables"]["cart_items"]["Update"];
export type WishlistUpdate =
  Database["public"]["Tables"]["wishlists"]["Update"];
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];
