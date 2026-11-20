"use client";

import { useState } from "react";
import type { Variant } from "@/types/product";

type Props = { variants: Variant[]; model: string };

export default function SizeSelector({ variants, model }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-sm">Tallas disponibles</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map(({ size, stock }) => (
          <button key={size} type="button" disabled={stock === 0}
            aria-label={`Talla ${size}, ${model}`} aria-pressed={selected === size}
            onClick={() => setSelected(size)}
            className="min-h-10 min-w-10 rounded-lg border border-neutral-500 aria-pressed:bg-neutral-900 aria-pressed:text-white disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-500">
            {size}
          </button>
        ))}
      </div>
      {selected !== null && (
        <button type="button" disabled className="mt-4 w-full rounded-full bg-neutral-200 px-4 py-2 text-neutral-600">
          Pedir ahora
        </button>
      )}
    </fieldset>
  );
}
