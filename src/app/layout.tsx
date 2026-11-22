import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import StoreHeader from "@/components/tienda/StoreHeader";
import { CategoryProvider } from "@/components/tienda/CategoryFilter";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const headingFont = Geist({ subsets: ["latin"], variable: "--font-geist" });

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="es-CO" className={`${bodyFont.variable} ${headingFont.variable}`}>
    <body className="bg-neutral-50 text-neutral-900 antialiased">
      <CategoryProvider>
        <StoreHeader />
        {children}
      </CategoryProvider>
    </body>
  </html>;
}
