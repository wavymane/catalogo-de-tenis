"use client";

import { useCategory } from "./CategoryFilter";

export const selectStyle = "mt-1 block w-full rounded-lg border border-neutral-400 bg-white px-3 py-2";

export default function SizeFilterControls({ sizes }: { sizes: number[] }) {
  const { sizeFilter, setSizeFilter } = useCategory();
  const options = (minimum = 0) => sizes.filter(size => size >= minimum).map(size => <option key={size} value={size}>{size}</option>);
  return <>
    <label>Talla europea
      <select className={selectStyle} value={sizeFilter.mode === "exact" ? sizeFilter.size : sizeFilter.mode}
        onChange={({ target: { value } }) => {
          if (value === "all") setSizeFilter({ mode: "all" });
          else if (value === "range") setSizeFilter({ mode: "range", from: sizes[0], to: sizes[sizes.length - 1] });
          else setSizeFilter({ mode: "exact", size: Number(value) });
        }}>
        <option value="all">Todas las tallas</option>
        {sizes.length > 0 && <option value="range">Rango de tallas</option>}
        {options()}
      </select>
    </label>
    {sizeFilter.mode === "range" && <>
      <label>Desde
        <select className={selectStyle} value={sizeFilter.from} onChange={event => {
          const from = Number(event.target.value);
          setSizeFilter({ ...sizeFilter, from, to: Math.max(from, sizeFilter.to) });
        }}>{options()}</select>
      </label>
      <label>Hasta
        <select className={selectStyle} value={sizeFilter.to} onChange={event => setSizeFilter({ ...sizeFilter, to: Number(event.target.value) })}>
          {options(sizeFilter.from)}
        </select>
      </label>
    </>}
  </>;
}
