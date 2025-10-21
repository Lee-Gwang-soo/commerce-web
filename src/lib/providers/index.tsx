"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import AuthProvider from "./auth-provider";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
            />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
