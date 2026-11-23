# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~v50 líneas: resume o elimina 10 que ya no aporte.

## Estado actual
— `develop` es la rama fija para todos los cambios y la que se debe seleccionar en Vercel.
— La portada Next.js lee las fotos de `public/imagenes/`. `pnpm dev` abre el entorno de desarrollo y `pnpm build` regenera el sitio estático en `out/` al cambiar las fotos.

## Decisiones (y por qué)
— «Nuevo» señala el último lote de claves de ficha incorporadas: primero cambios locales frente a HEAD y, al publicarlos, la última incorporación en el historial de `public/imagenes/`. El contador es global; el interruptor «Últimos agregados» combina este filtro con los demás.
— `ProductBadges.tsx` define los colores por marca (fondo intenso) y categoría (fondo pastel). Las etiquetas sin identificar usan tonos neutros.
— Las fichas muestran marca y categoría por stock en dos etiquetas pequeñas. `displayName` quita D, H, Hombre y NIÑ solo del nombre visible; los archivos, identificadores y claves de agrupación conservan el nombre original.
— La búsqueda en vivo se aplica en `ProductGrid` junto con los filtros; no hay lista paralela de sugerencias. Limpiar la consulta solo restaura los resultados permitidos por los filtros activos.
— El filtro Marca y el buscador usan la marca normalizada en `src/data/brands.ts`. Los prefijos no reconocidos quedan como «Marca por confirmar».
— Separar tonos con ` con `, por ejemplo `_color-Blanco con negro con rojo`. `ColorSwatch.tsx` usa todos los tonos para el degradado. NIKE SKATE 36–39 tiene cuatro variantes; NIKE SKATE Hombre 40–44 tiene siete; la ficha 36–44 sigue aparte.
— Las microinteracciones de los controles se centralizan en `globals.css` según `ux-fluida`. En fichas con stock se reserva el espacio de «Pedir ahora» para que seleccionar talla no desplace las filas.
— El interruptor sol/luna sigue al sistema hasta la primera elección manual y la guarda en `catalog-theme`. El fondo y la portada usan una paleta neutra; las muestras de producto conservan sus colores reales.
— La talla exacta y el rango EU filtran solo tallas con stock (cualquier coincidencia dentro del rango inclusivo). Al ordenar por precio, los modelos sin precio van al final en ambos sentidos.
— La guía EU → cm estima la longitud del pie, no la de la plantilla. Usa las tallas numéricas de las fichas y no modifica su stock ni su selección.
— La portada y las fichas comparten `ProductPhoto`: la foto destacada también abre el visor, en lugar de navegar a la ficha.
— En móvil, la cabecera coloca el interruptor junto al nombre, los enlaces en la segunda fila y el buscador debajo. En escritorio conserva una sola fila. La primera foto del inventario se usa como destacada en la portada.
— `_color-Nombre` agrupa fotos del mismo modelo y precio. NEW BALANCE 1300 tiene dos fichas: 36–39 (cian/blanco, blanco/rosa y blanco/salmón) y «NEW BALANCE 1300 Hombre» 40–44 (negro, azul y gris).
— Categorías según tallas con stock: <36 niños, 36–39 mujer, 40–44 hombre; si hay tallas de ambos grupos adultos, unisex. Buscador y catálogo comparten la categoría.
— La apertura con doble clic corresponde al prototipo; la nueva fase será un frontend Next.js con datos locales.

## Próximos pasos
— Usar `MODELO_PRECIO_TALLAS.jpg`, con precio entero en COP. El guion indica rango inclusivo y la coma separa tallas o rangos. Los campos posteriores no cambian el precio ni el stock.
— Si falta el precio se muestra «Precio por confirmar»; sin tallas con stock, «Sin tallas disponibles». El README documenta la diferencia entre el precio base del archivo y el precio de venta mostrado (×1,8).
— «Pedir ahora» abre WhatsApp con modelo, color y talla EU, sin enlace a la foto. El número se configura en `SizeSelector.tsx`.
