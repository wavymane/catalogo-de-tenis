# Catálogo de tenis

Catálogo de calzado para Colombia. El cliente consulta modelos, colores, precios en pesos colombianos y tallas europeas disponibles. Al elegir una talla, **Pedir ahora** abre WhatsApp con el pedido listo para revisar y enviar. El sitio no cobra, reserva unidades ni registra ventas.

## Probarlo y publicarlo

Frontend en **Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4**. Usa pnpm; no requiere base de datos, claves ni variables de entorno. Entorno probado: Node.js 22.14 y pnpm 11.17.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre la dirección que imprima la terminal (normalmente `http://localhost:3000`). Para verificar la versión de producción:

```sh
pnpm lint
pnpm typecheck
pnpm build
```

La compilación genera **`out/`**. Publica su contenido en un alojamiento estático, en la raíz del dominio. No hace falta un servidor Node.js en producción. Después de cambiar fotos, precios o stock, vuelve a compilar y desplegar.

## Cómo funciona la tienda

- **Explorar:** desde la primera letra, el buscador filtra las fichas por nombre, referencia o marca, sin distinguir mayúsculas ni tildes. Borrar el texto conserva los filtros y el orden elegidos. Puedes buscar una talla exacta o un rango inclusivo: basta con que haya stock en una de las tallas del rango.
- **Categorías y precios:** las categorías se calculan a partir de las tallas con stock: niños por debajo de 36, mujer entre 36 y 39, hombre entre 40 y 44, y unisex si hay tallas de ambos grupos adultos. Puedes ordenar los precios en ambos sentidos; los modelos sin precio quedan al final.
- **Elegir variante:** los círculos sólidos o degradados cambian la foto y las tallas del color elegido. Las tallas agotadas no se muestran. La guía EU → cm estima la longitud del **pie**, no la de la plantilla; es orientativa y puede variar según el modelo.
- **Pedir:** al seleccionar una talla aparece **Pedir ahora**. El enlace `wa.me` prepara un mensaje con modelo, color y talla EU, sin adjuntar fotos ni enlaces a imágenes. Cambiar de color reinicia la selección de talla. El contacto se configura en [`SizeSelector.tsx`](src/components/tienda/SizeSelector.tsx).
- **Visualización:** la primera foto del catálogo aparece en la portada. Las fotos se pueden ampliar con un clic o toque; el visor se cierra con el botón, el fondo o Escape. El interruptor sol/luna sigue el tema del dispositivo hasta que eliges uno y recuerda tu elección. Las transiciones respetan la preferencia de movimiento reducido.

## Mantener el inventario

**Últimos agregados:** el distintivo «Nuevo», el contador global y el filtro usan las mismas fichas. Las altas locales se comparan con el último commit; después de publicarlo se conserva el lote hasta la siguiente incorporación. Añadir otro color a una ficha ya agrupada no la cuenta de nuevo. El cálculo ocurre al generar el catálogo: usa un checkout con historial Git completo para publicar; sin historial suficiente no se marcan novedades sin verificar.

El filtro **Marca** se combina con la categoría, la talla y el orden de precios. Se reconoce el prefijo del modelo: por ejemplo, `AD`, `SAMBA` y `SUPER STAR Br` aparecen bajo Adidas; `NB` y `NEW B` bajo New Balance. Para añadir un alias edita [`brands.ts`](src/data/brands.ts). Las referencias sin identificar aparecen en «Marca por confirmar».

La fuente de datos es [`public/imagenes/`](public/imagenes/). Añade o renombra una foto siguiendo `MODELO_PRECIO_TALLAS[_color-Nombre].jpg`. Se admiten JPG/JPEG, PNG, WebP y AVIF. Reserva `_` para separar campos; dentro del nombre del modelo usa espacios.

| Nombre de archivo | Qué representa |
| --- | --- |
| `NIKE AF1 1305_80000_40-44.jpg` | Modelo NIKE AF1 1305, precio base 80.000 COP y tallas 40, 41, 42, 43 y 44. |
| `TIMBERLAND 447D_80000_36,37,40-44.jpg` | Tallas 36 y 37, más el rango 40–44. No ofrece 38 ni 39. |
| `NIKE SKATE Hombre_75000_40-44_color-Blanco con negro con rojo.jpg` | Variante tricolor. Se agrupa con las demás fotos `_color-…` del mismo modelo y precio base. |

**Precio base y precio mostrado son distintos:** escribe el importe como entero, sin `$`, puntos ni comas. Hoy la tarjeta multiplica el precio base por **1,8**; por ejemplo, `80000` se muestra como **$144.000**. La regla está en [`ProductGrid.tsx`](src/components/tienda/ProductGrid.tsx). Si dejas vacío el precio (`MODELO__36-39.jpg`), aparece «Precio por confirmar».

**Fotos y colores:** usa ` con ` para combinar tonos, nunca `/` en el archivo. Los colores de las muestras están definidos en [`ColorSwatch.tsx`](src/components/tienda/ColorSwatch.tsx); añade allí cualquier tono nuevo. Una foto sin el sufijo `_color-…` mantiene su propia ficha. Si necesitas fichas independientes para dos rangos, distingue el modelo en el nombre (por ejemplo, `NEW BALANCE 1300` y `NEW BALANCE 1300 Hombre`). La lectura de archivos, tallas y categorías está en [`src/data/products.ts`](src/data/products.ts).

## Próximos pasos

1. **Antes de publicar:** revisar el precio final de venta, las fotos y la disponibilidad por color y talla. Contrastar la guía de centímetros con medidas reales de los modelos.
2. **Publicar la primera versión:** desplegar `out/`, configurar el dominio y probar desde un teléfono el recorrido completo: buscar → filtrar → elegir color y talla → revisar el mensaje en WhatsApp.
3. **Mejorar el mantenimiento:** añadir comprobaciones automáticas para nombres de archivo inválidos, tonos sin muestra y variantes duplicadas. Verificar que los filtros y el mensaje del pedido coincidan con el stock de cada color.
4. **En una fase posterior:** valorar fichas de producto con URL propia y mejoras de SEO. Si editar archivos deja de ser suficiente, conectar la capa de datos a un inventario administrable. Carrito, pagos y gestión de pedidos requerirán definir un flujo distinto al contacto actual por WhatsApp.
