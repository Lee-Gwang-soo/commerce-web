import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// 카테고리 목록 조회 훅
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("카테고리 조회 실패");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30분
  });
};
