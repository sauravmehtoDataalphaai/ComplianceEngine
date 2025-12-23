import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LayoutWithSidebar } from "./layout-with-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rule-Craft - Compliance Rules Engine",
  description: "Financial Compliance Rules Engine for building and managing data quality validation rules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
        </Providers>
      </body>
    </html>
  );
}

