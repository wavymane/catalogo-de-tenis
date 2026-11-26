import type { Category, Product } from "@/types/product";

const brandColors: Record<string, string> = {
  Adidas: "bg-blue-800",
  Nike: "bg-orange-800",
  "New Balance": "bg-teal-800",
  Jordan: "bg-red-800",
  On: "bg-cyan-800",
  Converse: "bg-indigo-800",
  Vans: "bg-fuchsia-800",
  Timberland: "bg-amber-800",
  Valentino: "bg-rose-900",
  "Alexander McQueen": "bg-purple-900",
  Bape: "bg-lime-800",
  "Dolce & Gabbana": "bg-stone-800",
  "Hugo Boss": "bg-zinc-950",
  Puma: "bg-emerald-800",
};

const categoryColors: Record<Category, string> = {
  Niños: "border-amber-300 bg-amber-100 text-amber-950",
  Hombre: "border-sky-300 bg-sky-100 text-sky-950",
  Mujer: "border-violet-300 bg-violet-100 text-violet-950",
  Unisex: "border-emerald-300 bg-emerald-100 text-emerald-950",
};

export default function ProductBadges({ brand, category }: Pick<Product, "brand" | "category">) {
  const categoryStyle = category ? categoryColors[category] : "border-neutral-300 bg-neutral-100 text-neutral-700";
  return (
    <div className="mb-2 flex flex-wrap gap-1.5 text-xs font-medium">
      <span className={`rounded-full px-2 py-0.5 text-[#fff] ${brandColors[brand] ?? "bg-slate-700"}`}>
        <span className="sr-only">Marca: </span>{brand}
      </span>
      <span className={`rounded-full border px-2 py-0.5 ${categoryStyle}`}>
        <span className="sr-only">Categoría: </span>{category ?? "Categoría por confirmar"}
      </span>
    </div>
  );
}
