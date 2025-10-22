export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category: string;
  stock: number;
  images: string[];
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithDiscount extends Product {
  discount_rate: number | null;
  discount_amount: number | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductDetailResponse {
  success: boolean;
  data: ProductWithDiscount;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  total: number;
}
