"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = { filename: string; name: string };

export default function ProductPhoto({ filename, name }: Props) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `/imagenes/${encodeURIComponent(filename)}`;
  const alt = `Tenis del ${name.toLowerCase()}`;

  return (
    <div className="relative grid aspect-square place-items-center overflow-hidden bg-neutral-100 text-neutral-900">
      {failed ? <span>Foto no disponible</span> : (
        <button type="button" aria-label={`Ampliar foto: ${name}`} aria-haspopup="dialog"
          className="product-photo relative h-full w-full cursor-zoom-in focus-visible:-outline-offset-4"
          onClick={() => { setExpanded(true); dialog.current?.showModal(); }}>
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            className="object-contain" onError={() => setFailed(true)} />
        </button>
      )}
      <dialog ref={dialog} aria-label={`Foto ampliada: ${name}`} className="photo-viewer"
        onClose={() => setExpanded(false)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {expanded && <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-100">
          <div className="flex items-center justify-between gap-4 bg-white px-4 py-2">
            <strong>{name}</strong>
            <button type="button" onClick={() => dialog.current?.close()}
              className="rounded-full border border-neutral-300 px-4 py-2">Cerrar</button>
          </div>
          <div className="relative grow"><Image src={src} alt={alt} fill sizes="96vw" className="object-contain" /></div>
        </div>}
      </dialog>
    </div>
  );
}
