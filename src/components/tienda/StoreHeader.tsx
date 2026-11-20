"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryFilter, { matchesSizes, useCategory } from "./CategoryFilter";
import type { Product } from "@/types/product";

type Props = { models: (Pick<Product, "id" | "name" | "category"> & { available: number[] })[] };

export default function StoreHeader({ models }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const search = query.trim().toLowerCase();
  const { filter, sizeFilter } = useCategory();
  const matches = open && search.length > 2
    ? models.filter(model => (filter === "Todos" || model.category === filter)
      && matchesSizes(model.available, sizeFilter) && model.name.toLowerCase().includes(search))
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap">
        <Link href="/" className="font-semibold tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>Catálogo de tenis</Link>
        <div role="search" className="relative order-last w-full sm:order-none sm:max-w-sm"
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
          onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
          <input type="search" aria-label="Buscar modelo por nombre o número" placeholder="Buscar modelo por nombre o número"
            className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-2 pr-24 pl-3 text-sm"
            value={query} onFocus={() => setOpen(true)}
            onChange={event => { setQuery(event.target.value); setOpen(true); }} />
          <CategoryFilter />
          {open && search.length > 2 && (
            <div className="absolute top-full mt-1 max-h-64 w-full overflow-auto rounded-xl border border-neutral-200 bg-white p-2 text-sm">
              {matches.length === 0 && <p role="status" className="p-2">No encontramos modelos.</p>}
              {matches.map(model => <a key={model.id} href={`/#modelo-${model.id}`}
                onClick={() => setOpen(false)} className="block rounded-lg p-2 hover:bg-neutral-100">{model.name}</a>)}
            </div>
          )}
        </div>
        <nav aria-label="Principal" className="flex gap-4 text-sm">
          <Link href="/#modelos">Explorar</Link><Link href="/#tallas">Guía de tallas</Link>
        </nav>
      </div>
    </header>
  );
}
