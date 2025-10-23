"use client";

import { ReactQueryProvider } from "@/lib/react-query/provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}
