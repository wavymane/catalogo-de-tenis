import { readdir } from "node:fs/promises";
import path from "node:path";
import { brandFor } from "./brands";
import { isPhoto, latestAdditions, photoDetails } from "./new-arrivals";
import type { Category, Product } from "@/types/product";

function displayName(name: string): string {
  return name
    .replace(/(^|\s)NIÑ(?=\s|$)/giu, " ")
    .replace(/\b(?:D|H|Hombre)\b/gi, "")
    .replace(/(\d)[DH]\b/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFor(sizes: Set<number>): Category | null {
  const values = [...sizes];
  const women = values.some(size => size >= 36 && size <= 39);
  const men = values.some(size => size >= 40 && size <= 44);
  if (women && men) return "Unisex";
  if (women) return "Mujer";
  if (men) return "Hombre";
  return values.some(size => size < 36) ? "Niños" : null;
}

function parseSizes(text: string): Set<number> {
  const sizes = new Set<number>();
  for (const part of text.split(",")) {
    const match = /^(\d{2})(?:-(\d{2}))?$/.exec(part.trim());
    if (!match) continue;
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    for (let size = first; size <= last; size++) sizes.add(size);
  }
  return sizes;
}

export async function getProducts(): Promise<Product[]> {
  const entries = await readdir(path.join(process.cwd(), "public", "imagenes"), { withFileTypes: true });
  const photos = entries.filter(entry => entry.isFile() && isPhoto(entry.name))
    .map(entry => entry.name).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  const products = new Map<string, Product>();
  const additions = await latestAdditions(photos);
  for (const image of photos) {
    const { name, priceText, sizeText, color, key } = photoDetails(image);
    const available = parseSizes(sizeText);
    const first = Math.min(36, ...available);
    const last = available.size && Math.max(...available) < 36 ? 35 : Math.max(44, ...available);
    const entry: Product = products.get(key) ?? {
      id: key.replace(/\s/g, "-"),
      isNew: additions.has(key),
      name: displayName(name),
      brand: brandFor(name),
      image,
      colors: [],
      category: null,
      price: /^\d+$/.test(priceText) ? Number(priceText) : null,
      variants: [],
    };
    if (color) entry.colors.push({ name: color, image });
    entry.variants.push(...Array.from({ length: last - first + 1 }, (_, index) => ({
        size: first + index,
        color,
        stock: available.has(first + index) ? 1 : 0,
      })));
    entry.category = categoryFor(new Set(entry.variants.filter(v => v.stock > 0).map(v => v.size)));
    products.set(key, entry);
  }
  return [...products.values()];
}
