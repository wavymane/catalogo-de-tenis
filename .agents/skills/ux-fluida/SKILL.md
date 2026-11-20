---
name: ux-fluida
description: Reglas de transiciones y micro-interacciones para que la interfaz se sienta suave. Úsala al crear o modificar botones, selectores de talla o color, tarjetas, menús, notificaciones o cualquier estado visual que cambie (hover, selección, foco, deshabilitado, carga).
---

# UX fluida

Objetivo: que ningún cambio de estado sea instantáneo ni brusco. Todo cambio visible debe transicionar.

## Reglas generales

- Duración: 150 a 250 ms para botones y selecciones; hasta 300 ms para paneles, menús y notificaciones. Nunca más de 400 ms.
- Easing: `ease-out` al aparecer o activarse, `ease-in` al desaparecer. No usar `linear` salvo en barras de progreso.
- Anima solo propiedades baratas: `opacity`, `transform` (scale, translate), colores, `box-shadow`. No animes `width`, `height`, `margin` ni `top/left`.
- Prohibido `transition-all`. Lista las propiedades que cambian, por ejemplo `transition-[background-color,border-color,color,transform,box-shadow]`.
- El cambio de estado no debe mover el diseño. No cambies el grosor del borde al seleccionar: usa `ring` o `box-shadow`, que no ocupan espacio.
- Todo elemento con transición lleva `motion-reduce:transition-none` (o `motion-reduce:transform-none` si usa transform).

## Botones y selectores

Estados que siempre deben existir y transicionar: normal, hover, presionado (`active`), foco con teclado (`focus-visible`), seleccionado y deshabilitado.

**Botón de talla**
- Base: `transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-95 motion-reduce:transition-none motion-reduce:transform-none`
- No seleccionado: `bg-white border border-neutral-200 hover:border-neutral-900`
- Seleccionado: `bg-neutral-900 text-white border border-neutral-900`
- Deshabilitado: `opacity-40 cursor-not-allowed`, sin hover ni escala (no lleva `hover:` ni `active:`).

**Botón de color (círculo)**
- Base: `ring-2 ring-offset-2 ring-transparent transition-shadow duration-200 ease-out active:scale-95`
- Seleccionado: `ring-neutral-900`
- El ícono `check` entra con transición: oculto `scale-50 opacity-0`, visible `scale-100 opacity-100`, con `transition-[transform,opacity] duration-200`. El ícono siempre está en el DOM; solo cambian las clases.

**Botón principal (Añadir al carrito)**
- `transition-[transform,background-color] duration-200 hover:scale-[1.03] active:scale-95`
- Mientras procesa, muestra estado de carga con transición de opacidad, no un cambio seco de texto.

## Aparición y desaparición

- Menús, desplegables y notificaciones: entran con `opacity` + pequeño `translate-y` (8 a 12 px), no aparecen de golpe.
- Para ocultar, anima primero y quita del DOM después (o usa `invisible` tras la transición). Evita `display: none` inmediato.
- Contenido que carga: usa esqueleto (`animate-pulse`) en lugar de un salto de vacío a contenido.
- Listas y tarjetas: aparición con `fade-in` o `slide-up`, con retraso escalonado de 40 a 60 ms entre elementos (máximo 6 elementos).

## Pantallas táctiles

- El hover no debe dejar estados "pegados" tras tocar. Aplica estilos de hover solo cuando el dispositivo lo soporta (`@media (hover: hover)`).
- En móvil, el feedback principal es el estado `active` (presionado).
- Áreas táctiles de al menos 40 x 40 px.

## Accesibilidad

- Con `prefers-reduced-motion: reduce`, quita escalas y desplazamientos; deja solo cambios de color u opacidad.
- El foco con teclado debe ser visible (`focus-visible:ring-2`) y también transicionar.
- Las animaciones no deben ser la única señal de un cambio: el estado seleccionado también se distingue por color/ícono y por `aria-pressed` o `aria-checked`.

## Verificación

- Selecciona una talla y luego otra: el cambio se ve suave, sin saltos del diseño.
- Pasa el cursor y presiona rápido varios botones: no hay parpadeos ni "rebotes" extraños.
- Con "reducir movimiento" activado, no hay escalas ni desplazamientos.
- En móvil (~375 px), tocar un botón no deja el hover pegado.
- El inspector de rendimiento no muestra recálculo de layout al seleccionar.