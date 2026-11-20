"use client";

export default function CatalogError({ reset }: { reset: () => void }) {
  return <main className="p-6"><h1>No se pudo cargar el catálogo</h1>
    <button onClick={reset} className="mt-4 underline">Volver a intentar</button></main>;
}
