"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { toast } from "sonner";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // 전역 에러 핸들링
            if (query.meta?.errorMessage) {
              toast.error(query.meta.errorMessage as string);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // mutation 에러는 각 hook에서 처리하므로 여기서는 로깅만
            console.error("Mutation error:", error);
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
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
