"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { UserProvider } from "../context/userContext";
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>
          <UserProvider>{children}</UserProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
