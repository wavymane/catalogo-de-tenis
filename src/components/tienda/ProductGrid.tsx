"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { matchesSizes, useCategory } from "./CategoryFilter";
import SizeFilterControls, { selectStyle } from "./SizeFilterControls";
import ProductPhoto from "./ProductPhoto";
import SizeSelector from "./SizeSelector";
import ColorSwatch from "./ColorSwatch";
import ProductBadges from "./ProductBadges";
import FilterBar from "./FilterBar";

const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function searchText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function ProductCard({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? null);
  const photo = product.colors.find(option => option.name === color)?.image ?? product.image;
  return <article id={`modelo-${product.id}`} tabIndex={-1} className="scroll-mt-32 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
    <div className="relative">
      <ProductPhoto key={photo} filename={photo} name={color ? `${product.name}, ${color}` : product.name} />
      {product.isNew && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-emerald-800 px-2.5 py-1 text-xs font-semibold text-[#fff]">Nuevo</span>}
    </div>
    <div className="p-5">
      <ProductBadges brand={product.brand} category={product.category} />
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <span className="text-right text-sm font-medium">{product.price === null ? "Precio por confirmar" : pesos.format(product.price * 1.8)}</span>
      </div>
      {product.colors.length > 0 && <fieldset className="mt-3">
        <legend className="text-sm">Color</legend>
        <div className="mt-2 flex flex-wrap gap-3">{product.colors.map(option =>
          <ColorSwatch key={option.name} name={option.name} selected={option.name === color} onSelect={() => setColor(option.name)} />
        )}</div>
      </fieldset>}
      <SizeSelector key={color} variants={product.variants.filter(variant => variant.color === color)} model={product.name} />
    </div>
  </article>;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const { filter, sizeFilter, brand, setBrand, query } = useCategory();
  const terms = searchText(query).trim().split(/\s+/).filter(Boolean);
  const brands = [...new Set(products.map(product => product.brand))].sort((a, b) => a.localeCompare(b, "es"));
  const [order, setOrder] = useState("default");
  const [onlyNew, setOnlyNew] = useState(false);
  const newCount = products.filter(product => product.isNew).length;
  const availableSizes = (product: Product) => product.variants.filter(v => v.stock > 0).map(v => v.size);
  const sizes = [...new Set(products.flatMap(availableSizes))].sort((a, b) => a - b);
  const visible = products.filter(product => {
    const text = searchText(`${product.name} ${product.brand}`);
    return (!onlyNew || product.isNew) && terms.every(term => text.includes(term)) && (filter === "Todos" || product.category === filter)
      && (!brand || product.brand === brand) && matchesSizes(availableSizes(product), sizeFilter);
  });
  if (order !== "default") visible.sort((a, b) => {
    if (a.price === null || b.price === null) return Number(a.price === null) - Number(b.price === null);
    return order === "ascending" ? a.price - b.price : b.price - a.price;
  });
  return <>
    <h2 id="modelos" className="mb-5 scroll-mt-32 text-3xl font-semibold tracking-tight">Explorar modelos <span aria-live="polite" className="text-base text-neutral-500">{filter} ({visible.length})</span>{" "}
      <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 align-middle text-xs font-semibold tracking-normal text-emerald-950">{newCount} {newCount === 1 ? "nuevo" : "nuevos"}</span>
    </h2>
    <FilterBar>
      <SizeFilterControls sizes={sizes} />
      <button type="button" role="switch" aria-checked={onlyNew} aria-controls="resultados"
        onClick={() => setOnlyNew(active => !active)}
        className="group flex min-h-10 cursor-pointer items-center justify-between gap-3 self-end rounded-lg border border-neutral-300 px-3 py-2 text-left font-medium hover:border-neutral-500">
        Últimos agregados
        <span aria-hidden="true" className="flex h-6 w-11 shrink-0 items-center rounded-full bg-neutral-500 p-0.5 group-aria-checked:bg-emerald-700 motion-safe:transition-colors motion-safe:duration-200">
          <span className="size-5 rounded-full bg-[#fff] group-aria-checked:translate-x-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out" />
        </span>
      </button>
      <label>Marca
        <select className={selectStyle} value={brand} onChange={event => setBrand(event.target.value)}>
          <option value="">Todas las marcas</option>
          {brands.map(name => <option key={name}>{name}</option>)}
        </select>
      </label>
      <label>Ordenar por precio
        <select className={selectStyle} value={order} onChange={event => setOrder(event.target.value)}>
          <option value="default">Orden del catálogo</option>
          <option value="ascending">Menor a mayor</option>
          <option value="descending">Mayor a menor</option>
        </select>
      </label>
    </FilterBar>
    {!visible.length && <p>No encontramos modelos. Prueba otro texto o cambia los filtros.</p>}
    <div id="resultados" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </>;
}
