"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function FilterBar({ children }: { children: ReactNode }) {
  const start = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header || !start.current || !panel.current) return;
    let previous = window.scrollY;
    let headerHeight = header.offsetHeight;
    const observer = new ResizeObserver(() => {
      headerHeight = header.offsetHeight;
      setTop(headerHeight);
    });
    observer.observe(header);
    function onScroll() {
      const y = Math.max(0, window.scrollY);
      if (!start.current || !panel.current) return;
      // La barra siempre se ve en su posición original, incluso al llegar desde la portada.
      if (start.current.getBoundingClientRect().top >= headerHeight - panel.current.offsetHeight) {
        setHidden(false);
      } else if (Math.abs(y - previous) >= 8) {
        setHidden(y > previous);
      } else {
        return;
      }
      previous = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <>
    <div ref={start} aria-hidden="true" />
    <section ref={panel} style={{ top }} aria-labelledby="titulo-filtros"
      className={`sticky z-30 mb-5 rounded-xl border border-neutral-200 bg-white p-3 text-sm motion-safe:transition-[translate,opacity] ${
        hidden
          ? "pointer-events-none opacity-0 motion-safe:-translate-y-3 motion-safe:duration-200 motion-safe:ease-in has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:translate-y-0 has-[:focus-visible]:opacity-100"
          : "translate-y-0 opacity-100 motion-safe:duration-300 motion-safe:ease-out"
      }`}>
      <h3 id="titulo-filtros" className="mb-1 flex items-center gap-2 text-lg leading-tight font-semibold">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 5h5m4 0h9M3 12h11m4 0h3M3 19h3m4 0h11M8 3v4m6 3v4M6 17v4" />
        </svg>
        Filtros
      </h3>
      <div className="flex max-h-[45dvh] items-end gap-3 overflow-auto px-1 py-1 whitespace-nowrap [&>*]:shrink-0">
        {children}
      </div>
    </section>
  </>;
}
