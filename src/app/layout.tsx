import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import StoreHeader from "@/components/tienda/StoreHeader";
import { CategoryProvider } from "@/components/tienda/CategoryFilter";
import { getProducts } from "@/data/products";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const headingFont = Geist({ subsets: ["latin"], variable: "--font-geist" });

export default async function Layout({ children }: { children: ReactNode }) {
  const models = (await getProducts()).map(({ id, name, category, variants }) => ({
    id, name, category, available: [...new Set(variants.filter(v => v.stock > 0).map(v => v.size))],
  }));
  return <html lang="es-CO" className={`${bodyFont.variable} ${headingFont.variable}`}>
    <body className="bg-neutral-50 text-neutral-900 antialiased">
      <CategoryProvider>
        <StoreHeader models={models} />
        {children}
      </CategoryProvider>
    </body>
  </html>;
}
