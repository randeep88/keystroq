import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Toast } from "@heroui/react";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "keystroq",
  description: "Type Fast, Win Wars",
  icons: {
    icon: "/logo.png",       
    apple: "/logo.png",    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${sora.className}`}
    >
      <body className="min-h-full w-[90%] mx-auto flex flex-col bg-background">
        <Toast.Provider placement="bottom end" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
