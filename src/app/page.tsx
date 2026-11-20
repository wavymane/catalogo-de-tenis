import { getProducts } from "@/data/products";
import ProductGrid from "@/components/tienda/ProductGrid";
import ProductPhoto from "@/components/tienda/ProductPhoto";
import SizeGuide from "@/components/tienda/SizeGuide";
import Link from "next/link";

export function generateMetadata() {
  return { title: "Catálogo de tenis", description: "Explora los modelos de tenis y consulta las tallas disponibles." };
}

export default async function Page() {
  const products = await getProducts();
  const featured = products[0];
  const sizes = [...new Set(products.flatMap(product => product.variants.map(variant => variant.size)))].sort((a, b) => a - b);
  return (
    <main className="mx-auto max-w-6xl px-4 pb-10">
      <nav aria-label="Ruta de navegación" className="py-4 text-xs text-neutral-600">
        <Link href="/">Inicio</Link> <span aria-hidden="true"> / </span> Catálogo de tenis
      </nav>
      <section className="grid items-center gap-8 rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white sm:grid-cols-2 sm:p-10">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-neutral-300">Encuentra tu par ideal</p>
          <h1 className="mb-4 text-5xl leading-none font-semibold tracking-tight md:text-7xl">Catálogo de tenis</h1>
          <p className="max-w-sm text-neutral-200">Explora los modelos y consulta las tallas disponibles para cada par.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
            <a href="#modelos" className="rounded-full bg-white px-5 py-3 text-neutral-900">Explorar modelos</a>
            <a href="#tallas" className="rounded-full border border-white/30 px-5 py-3">Guía de tallas</a>
          </div>
        </div>
        {featured && <div className="overflow-hidden rounded-3xl"><ProductPhoto filename={featured.image} name={featured.name} /></div>}
      </section>
      <SizeGuide sizes={sizes} />
      <ProductGrid products={products} />
    </main>
  );
}
