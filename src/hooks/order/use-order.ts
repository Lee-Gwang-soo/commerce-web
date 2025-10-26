import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi, CreateOrderRequest } from "@/lib/api/order";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// 주문 목록 조회 훅
export const useOrders = (params?: { page?: number; limit?: number }) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["orders", "list", params],
    queryFn: () => orderApi.getOrders(params),
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

// 주문 상세 조회 훅
export const useOrder = (orderId: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: () => orderApi.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
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

// 주문 생성 훅
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      orderApi.createOrder(orderData),
    onSuccess: () => {
      // 주문 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // 장바구니 쿼리 무효화 (주문 후 장바구니가 비워지므로)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "주문 생성에 실패했습니다.");
    },
  });
};

// 주문 상태 업데이트 훅
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      updateData,
    }: {
      orderId: string;
      updateData: {
        status?: string;
        payment_status?: string;
        payment_key?: string;
      };
    }) => orderApi.updateOrder(orderId, updateData),
    onSuccess: (_, variables) => {
      // 해당 주문 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["orders", "detail", variables.orderId],
      });
      // 주문 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      toast.success("주문 상태가 업데이트되었습니다.");
    },
    onError: (error: any) => {
      toast.error(error.message || "주문 업데이트에 실패했습니다.");
    },
  });
};
