"use client";

import { useState } from "react";

const centimeters = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function SizeGuide({ sizes }: { sizes: number[] }) {
  const [selected, setSelected] = useState(sizes.includes(40) ? 40 : sizes[0]);
  // Un punto de París equivale a 2/3 cm de horma. Se descuentan dos puntos como margen orientativo.
  const footLength = (selected - 2) * 2 / 3;

  return (
    <section id="tallas" aria-labelledby="titulo-tallas" className="my-6 scroll-mt-32 rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 id="titulo-tallas" className="text-xl font-semibold">Guía de tallas</h2>
      <p className="mt-2 text-sm text-neutral-700">
        Mide ambos pies de pie, desde el talón hasta el dedo más largo. Usa la medida del pie más largo.
      </p>
      {sizes.length > 0 ? (
        <div className="my-4 flex flex-wrap items-end gap-x-8 gap-y-3">
          <label className="grid gap-1 text-sm">
            Talla europea (EU)
            <select value={selected} onChange={event => setSelected(Number(event.target.value))}
              className="rounded-lg border border-neutral-400 bg-white px-3 py-2">
              {sizes.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <div>
            <p className="text-sm text-neutral-600">Longitud aproximada del pie</p>
            <output className="text-2xl font-semibold">{centimeters.format(footLength)} cm</output>
          </div>
        </div>
      ) : <p className="my-3">Aún no hay tallas para consultar.</p>}
      <p className="text-sm text-neutral-600">La equivalencia es orientativa y puede variar según la marca y el modelo. Cada ficha muestra solo las tallas disponibles para el color elegido.</p>
    </section>
  );
}
