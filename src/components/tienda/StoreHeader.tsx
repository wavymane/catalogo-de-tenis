"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CategoryFilter, { useCategory } from "./CategoryFilter";

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

  return <label className="relative inline-flex h-10 w-[76px] shrink-0 cursor-pointer items-center sm:order-3">
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

export default function StoreHeader() {
  const { query, setQuery } = useCategory();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 px-4 py-0.5 sm:flex-nowrap sm:gap-3 sm:py-3">
        <Link href="/" className="font-semibold tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>Catálogo de tenis</Link>
        <ThemePicker />
        <nav aria-label="Principal" className="flex w-full items-center gap-3 text-sm sm:order-2 sm:w-auto">
          <Link href="/#modelos">Explorar</Link><Link href="/#tallas">Guía de tallas</Link>
        </nav>
        <div role="search" className="relative w-full sm:order-1 sm:max-w-sm">
          <input type="search" aria-label="Buscar por modelo, referencia o marca" placeholder="Modelo, referencia o marca" aria-controls="resultados"
            className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-2 pr-24 pl-3 text-sm"
            value={query} onChange={event => {
              const next = event.target.value;
              if (!query.trim() && next.trim()) document.getElementById("modelos")?.scrollIntoView();
              setQuery(next);
            }} />
          <CategoryFilter />
        </div>
      </div>
    </header>
  );
}
