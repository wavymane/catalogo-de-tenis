"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { matchesSizes, useCategory } from "./CategoryFilter";
import SizeFilterControls, { selectStyle } from "./SizeFilterControls";
import ProductPhoto from "./ProductPhoto";
import SizeSelector from "./SizeSelector";
import ColorSwatch from "./ColorSwatch";
import ProductBadges from "./ProductBadges";

const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function searchText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function ProductCard({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? null);
  const photo = product.colors.find(option => option.name === color)?.image ?? product.image;
  return <article id={`modelo-${product.id}`} tabIndex={-1} className="scroll-mt-32 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
    <ProductPhoto key={photo} filename={photo} name={color ? `${product.name}, ${color}` : product.name} />
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
  const availableSizes = (product: Product) => product.variants.filter(v => v.stock > 0).map(v => v.size);
  const sizes = [...new Set(products.flatMap(availableSizes))].sort((a, b) => a - b);
  const visible = products.filter(product => {
    const text = searchText(`${product.name} ${product.brand}`);
    return terms.every(term => text.includes(term)) && (filter === "Todos" || product.category === filter)
      && (!brand || product.brand === brand) && matchesSizes(availableSizes(product), sizeFilter);
  });
  if (order !== "default") visible.sort((a, b) => {
    if (a.price === null || b.price === null) return Number(a.price === null) - Number(b.price === null);
    return order === "ascending" ? a.price - b.price : b.price - a.price;
  });
  return <>
    <h2 id="modelos" className="mb-5 scroll-mt-32 text-3xl font-semibold tracking-tight">Explorar modelos <span aria-live="polite" className="text-base text-neutral-500">{filter} ({visible.length})</span></h2>
    <div className="mb-5 grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <SizeFilterControls sizes={sizes} />
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
    </div>
    {!visible.length && <p>No encontramos modelos. Prueba otro texto o cambia los filtros.</p>}
    <div id="resultados" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </>;
}
