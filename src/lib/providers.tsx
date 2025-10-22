"use client";

import { ReactQueryProvider } from "@/lib/react-query/provider";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
