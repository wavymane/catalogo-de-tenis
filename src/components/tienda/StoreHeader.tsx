"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CategoryFilter, { matchesSizes, useCategory } from "./CategoryFilter";
import type { Product } from "@/types/product";

type Props = { models: (Pick<Product, "id" | "name" | "category"> & { available: number[] })[] };

function ThemePicker() {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      const saved = localStorage.getItem("catalog-theme");
      if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
    } catch { /* La selección sigue funcionando sin almacenamiento local. */ }
    function sync() {
      const theme = document.documentElement.dataset.theme;
      if (input.current) input.current.checked = theme === "dark" || (theme !== "light" && system.matches);
    }
    sync();
    system.addEventListener("change", sync);
    return () => system.removeEventListener("change", sync);
  }, []);

  return <label className="relative inline-flex h-10 w-[76px] shrink-0 cursor-pointer items-center">
    <input ref={input} type="checkbox" role="switch" aria-label="Modo oscuro" className="peer sr-only"
      onChange={({ target: { checked } }) => {
        const value = checked ? "dark" : "light";
        document.documentElement.dataset.theme = value;
        try { localStorage.setItem("catalog-theme", value); } catch { /* Solo para esta visita. */ }
      }} />
    <span aria-hidden="true" className="absolute inset-0 rounded-full border border-neutral-300 bg-neutral-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" />
    <span aria-hidden="true" className="absolute left-1 size-8 rounded-full border border-neutral-400 bg-white transition-transform duration-200 ease-out peer-checked:translate-x-9 motion-reduce:transition-none" />
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="absolute left-[10px] size-5">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className="absolute right-[10px] size-5">
      <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />
    </svg>
  </label>;
}

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
        <nav aria-label="Principal" className="flex items-center gap-3 text-sm">
          <Link href="/#modelos">Explorar</Link><Link href="/#tallas">Guía de tallas</Link>
        </nav>
        <ThemePicker />
      </div>
    </header>
  );
}
