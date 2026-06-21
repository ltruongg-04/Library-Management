"use client";

import { SessionProvider } from "next-auth/react";

import { AuthProvider } from "@/providers/auth";
import ThemeProvider from "@/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
