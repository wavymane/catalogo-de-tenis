"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Category } from "@/types/product";

type Filter = Category | "Todos";
export type SizeFilter = { mode: "all" } | { mode: "exact"; size: number } | { mode: "range"; from: number; to: number };
const FilterContext = createContext<{
  filter: Filter; setFilter: (value: Filter) => void;
  sizeFilter: SizeFilter; setSizeFilter: (value: SizeFilter) => void;
} | null>(null);

export function matchesSizes(available: number[], selection: SizeFilter) {
  if (selection.mode === "all") return true;
  if (selection.mode === "exact") return available.includes(selection.size);
  return available.some(size => size >= selection.from && size <= selection.to);
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>({ mode: "all" });
  return <FilterContext.Provider value={{ filter, setFilter, sizeFilter, setSizeFilter }}>{children}</FilterContext.Provider>;
}

export function useCategory() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("Missing CategoryProvider");
  return context;
}

export default function CategoryFilter() {
  const { filter, setFilter } = useCategory();
  const options: Filter[] = ["Todos", "Mujer", "Hombre", "Unisex", "Niños"];
  return <select aria-label="Filtrar modelos por categoría" value={filter}
    onChange={event => {
      const next = options.find(option => option === event.target.value);
      if (next) setFilter(next);
      document.getElementById("modelos")?.scrollIntoView();
    }}
    className="absolute top-1/2 right-0.5 -translate-y-1/2 rounded-full border border-neutral-300 bg-white px-2 py-1 text-sm">
    {options.map(option => <option key={option}>{option}</option>)}
  </select>;
}
