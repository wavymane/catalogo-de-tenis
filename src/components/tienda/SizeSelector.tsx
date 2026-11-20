"use client";

import { useState } from "react";
import type { Variant } from "@/types/product";

type Props = { variants: Variant[]; model: string };

const whatsappNumber = "573006452693";

export default function SizeSelector({ variants, model }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const available = variants.filter(variant => variant.stock > 0);
  const choice = available.find(variant => variant.size === selected);
  const message = choice
    ? `¡Hola! Quiero pedir este par:\nModelo: ${model}\nColor: ${choice.color ?? "El de la foto"}\nTalla EU: ${choice.size}`
    : "";
  if (!available.length) return <p className="mt-4 text-sm text-neutral-600">Sin tallas disponibles</p>;
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-sm">Tallas disponibles</legend>
      <div className="flex flex-wrap gap-2">
        {available.map(({ size }) => (
          <button key={size} type="button"
            aria-label={`Talla ${size}, ${model}`} aria-pressed={selected === size}
            onClick={() => setSelected(size)}
            className="min-h-10 min-w-10 rounded-lg border border-neutral-500 aria-pressed:bg-neutral-900 aria-pressed:text-white">
            {size}
          </button>
        ))}
      </div>
      <a href={choice ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : undefined}
        aria-hidden={!choice} aria-label="Pedir ahora por WhatsApp"
        className="order-preview mt-4 flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2 font-medium text-white">
        Pedir ahora
      </a>
    </fieldset>
  );
}
