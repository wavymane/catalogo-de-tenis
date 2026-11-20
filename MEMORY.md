# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~v50 líneas: resume o elimina 10 que ya no aporte.

## Estado actual
— Se inicializó Git en la carpeta del proyecto; la base inicial está en la rama `feat/catalog-baseline`.
— La portada Next.js lee las fotos de `public/imagenes/`. `pnpm dev` abre el entorno de desarrollo y `pnpm build` regenera el sitio estático en `out/` al cambiar las fotos.

## Decisiones (y por qué)
— La talla exacta y el rango EU filtran solo tallas con stock (cualquier coincidencia dentro del rango inclusivo). Al ordenar por precio, los modelos sin precio van al final en ambos sentidos.
— La guía EU → cm estima la longitud del pie, no la de la plantilla. Usa las tallas numéricas de las fichas y no modifica su stock ni su selección.
— La portada y las fichas comparten `ProductPhoto`: la foto destacada también abre el visor, en lugar de navegar a la ficha.
— La cabecera busca por nombre o número y enlaza a cada ficha. La primera foto del inventario se usa como destacada en la portada.
— Solo el sufijo `_color-Nombre` agrupa fotos del mismo modelo y precio en una ficha con selector. Se usa para los cuatro SUPER STAR Br de $75.000. Los demás sufijos mantienen fichas independientes.
— Categorías según tallas con stock: <36 niños, 36–39 mujer, 40–44 hombre; si hay tallas de ambos grupos adultos, unisex. Buscador y catálogo comparten la categoría.
— La apertura con doble clic corresponde al prototipo; la nueva fase será un frontend Next.js con datos locales.

## Próximos pasos
— Usar `MODELO_PRECIO_TALLAS.jpg`, con precio entero en COP. El guion indica rango inclusivo y la coma separa tallas o rangos. Los campos posteriores no cambian el precio ni el stock.
— Si falta el precio se muestra «Precio por confirmar»; sin tallas, todas quedan deshabilitadas. Retro 11 Gamuza continúa sin precio.
— «Pedir ahora» aparece al seleccionar talla y seguirá deshabilitado hasta configurar el contacto.
