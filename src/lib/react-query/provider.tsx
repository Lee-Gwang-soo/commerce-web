"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            // 401 에러: 세션 만료 처리
            if (error?.status === 401 || error?.message?.includes("로그인")) {
              // 현재 페이지가 로그인/회원가입 페이지가 아닐 때만 처리
              if (
                typeof window !== "undefined" &&
                !window.location.pathname.match(/\/(login|register)/)
              ) {
                const { logout, isAuthenticated } = useAuthStore.getState();

                // 로그인 상태였다면 세션 만료 알림
                if (isAuthenticated) {
                  toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
                  logout();
                  queryClient.clear();

                  // 로그인 페이지로 리디렉션
                  setTimeout(() => {
                    window.location.href = "/login";
                  }, 1000);
                }
              }
            } else if (query.meta?.errorMessage) {
              toast.error(query.meta.errorMessage as string);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            // 401 에러: 세션 만료 처리
            if (error?.status === 401 || error?.message?.includes("로그인")) {
              if (
                typeof window !== "undefined" &&
                !window.location.pathname.match(/\/(login|register)/)
              ) {
                const { logout, isAuthenticated } = useAuthStore.getState();

                if (isAuthenticated) {
                  toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
                  logout();

                  setTimeout(() => {
                    window.location.href = "/login";
                  }, 1000);
                }
              }
            } else {
              // mutation 에러는 각 hook에서 처리하므로 여기서는 로깅만
              console.error("Mutation error:", error);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분 (이전 cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount, error: any) => {
              // 401, 403, 404는 재시도 안함
              if ([401, 403, 404].includes(error?.status)) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
