# Sistema de diseño: Catálogo de tenis

Guía visual para la fase de frontend. Define el diseño, las secciones, la tipografía, los colores y las interacciones. Úsala junto con `AGENTS.md`: si hay conflicto, `AGENTS.md` manda.

Todo el texto visible va en español. Los nombres de clases, rutas y código van en inglés.

## 1. Marca y contenido

- **Nombre de la tienda:** "Catálogo de tenis". No hay marca externa, ni logos de terceros, ni eslóganes de otras marcas.
- **Logo:** solo texto. "Catálogo de tenis" en `font-geist`, peso semibold, sin imagen. Más adelante se podrá reemplazar por un logo propio en `public/`.
- **Imágenes de producto:** están en `public/imagenes/` y se sirven como `/imagenes/<archivo>`. En los datos, `imagen` contiene **solo el nombre del archivo** (por ejemplo `"tenis-01.jpg"`); la ruta se arma en un único helper. No usar URLs externas.
- **Imagen que falla o no existe:** se muestra un marcador de posición gris con un ícono de Lucide (`footprints`), nunca un recuadro roto.
- **Textos de ejemplo:** descripciones, reseñas, precios y mensajes son marcadores temporales y se marcarán como tales en los datos de ejemplo.

## 2. Reglas críticas de diseño

- Fondo de la página: `bg-neutral-50` con `text-neutral-900`.
- Cada sección usa la animación `fade-in` o `slide-up` al entrar en pantalla.
- Indicador de progreso de scroll: barra fija arriba de 3 px, con `linear-gradient(90deg, #f59e0b, #eab308, #84cc16)`.
- Selección de talla y de color con la lógica descrita en la sección 6.
- Sin sombras ni colores fuera de esta paleta (neutros, más el degradado del indicador).

## 3. Tipografía

- **Cuerpo:** Inter (pesos 300 a 600).
- **Encabezados y números destacados:** Geist (pesos 300 a 700), disponible como clase `font-geist`.
- Cargar solo estas dos fuentes con `next/font/google`. No importar otras.
- Un solo `<h1>` por página; el resto de títulos con jerarquía correcta (`h2`, `h3`), aunque visualmente se estilicen igual.

## 4. Animaciones (CSS global)

Se definen en `globals.css` y se aplican con clases:

| Clase | Uso |
|---|---|
| `.loading-bar` | Barra de carga sutil |
| `.fade-in` | Aparición con opacidad al entrar al viewport |
| `.slide-up` | Aparición deslizando hacia arriba |
| `.hover-lift` | Elevación leve al pasar el cursor |
| `.cart-bounce` | Rebote del ícono del carrito al añadir un producto |
| `.notification-enter` | Entrada de la notificación |
| `.ripple` | Efecto de onda al hacer clic (pseudo-elemento) |

Todas deben respetar `@media (prefers-reduced-motion: reduce)`: si el usuario lo pide, se desactivan o se reducen a un cambio de opacidad.

Las reglas detalladas de transiciones y micro-interacciones (duraciones, qué propiedades animar, estados de botones, pantallas táctiles) están en la skill `ux-fluida`.

## 5. Capas y posicionamiento

- **Superposición fija:** barra de progreso (`z-[1000]`) y contenedor de notificaciones (`z-50`, `top-4 right-4`).
- **Header:** `sticky top-0 z-40 backdrop-blur-sm`.
- **Desplegable de búsqueda:** `absolute top-full` dentro del contenedor de búsqueda, con transición de `max-height` y `opacity`.

## 6. Secciones

La referencia es una página larga. Al implementarla: anuncio, header y footer van en el `layout.tsx`; el resto de secciones, en la página de inicio.

### 6.1 Barra de anuncios

- Fondo `bg-neutral-900`, texto blanco.
- Texto con **animación de escritura** (100 ms por carácter) que cicla entre estos mensajes de ejemplo:
  - "Envío gratis en compras seleccionadas…"
  - "Nuevos modelos disponibles…"
  - "Tallas del 36 al 44…"
  - "Cambios y devoluciones fáciles…"
- Botón "Cambiar ciudad" con ícono `map-pin` y efecto `ripple`.
- Debe leerse bien con lector de pantalla: el mensaje completo va en un `aria-label` o texto oculto, no letra por letra.

### 6.2 Header de navegación

- Fondo blanco con `border-b`.
- Logo de texto centrado (contenedor de unos 100 x 40 px).
- **Búsqueda:** input con `padding-left` de 10 px y `padding-right` de 36 px, para alojar el botón de categoría **dentro del marco del input, a la derecha** (Todos, Hombre, Mujer, Niños). Este botón siempre queda dentro del input en escritorio.
- Enlaces: "Explorar", "Ofertas", "Ayuda", con `hover:scale-105`.
- Iconos: usuario y carrito, con insignia de cantidad en posición absoluta (`-top-[2px] -right-[2px]`).
- Migas de pan debajo del header: "Inicio > Catálogo de tenis".

### 6.3 Hero

- Degradado `bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900`.
- Columna izquierda: `<h1>` "Catálogo de tenis" (`font-geist`), frase corta ("Encuentra tu par ideal"), texto descriptivo, botón blanco "Ver novedades" y botón con `border-white/30` "Guía de tallas".
- Columna derecha: contenedor `rounded-3xl` con una imagen destacada de `public/imagenes/`.
- En móvil, las columnas se apilan.

### 6.4 Producto

- Grid de dos columnas (una en móvil).
- **Izquierda:** imagen principal `aspect-square` con clase `product-zoom`. Debajo, tira de 4 miniaturas; la activa lleva `border-2`.
- **Derecha:**
  - Nombre del producto.
  - Precio actual en negrita y precio anterior tachado, formateados con `Intl.NumberFormat("es-CO")` (por ejemplo `$320.000` y `$400.000`; valores de ejemplo).
  - **Colores:** círculos (Negro, Blanco, Rojo, Azul).
  - **Tallas:** grid de la 36 a la 44.
  - Botón "Añadir al carrito": `bg-neutral-900`, `hover:scale-105`.

**Lógica de talla:**
- Las tallas son números (`36`, no `"36"`): 36, 37, 38, 39, 40, 41, 42, 43, 44.
- Mostrar solo las tallas disponibles del color seleccionado. Sin stock, mostrar «Sin tallas disponibles» en lugar de botones.
- Solo una talla puede estar seleccionada; elegir otra desmarca la anterior.

**Lógica de color:**
- Botones circulares; el seleccionado muestra un ícono `check` y un anillo visible.
- Cada botón tiene `aria-label` con el nombre del color y `aria-pressed`.

**Añadir al carrito:**
- Si falta talla o color, se muestra un mensaje claro en español y no se añade.
- Si están ambos, se añade, se activa `.cart-bounce` en el ícono del header y aparece una notificación ("Producto añadido al carrito").

### 6.5 Reseñas y testimonios

Todo el contenido es de ejemplo y debe reemplazarse por reseñas reales antes de publicar.

- Título centrado y resumen de calificación (por ejemplo 4,8/5).
- Grid de 3 columnas con testimonios (degradado de `neutral-50` a `neutral-100`), avatares circulares con iniciales y estrellas (`star`).
- Barra de estadísticas de 4 columnas (Reseñas totales, Calificación promedio, etc.), números en `font-geist` negrita.
- Lista de 3 reseñas recientes con botón "Útil (n)" que incrementa el contador una sola vez por reseña.
- Tarjeta negra final: "Comparte tu experiencia".

### 6.6 Footer

- Parte superior: botón "Volver arriba" (`chevron-up`).
- Cuatro columnas de enlaces: "Conócenos", "Contacto", "Ayuda", "Legal".
- Iconos sociales: Facebook, X, Instagram.
- Parte inferior: botones "Español (CO)" y "Colombia", y fila de copyright con `bg-neutral-950`.

## 7. Reglas de interacción

- **Búsqueda:** con más de 2 caracteres se abre el desplegable (`search-dropdown.active`). Los resultados salen de las funciones de `src/data/`, no de un backend.
- **Scroll:** el ancho del indicador se calcula como `(window.pageYOffset / docHeight) * 100`, donde `docHeight` es la altura total del documento menos la ventana.
- **Intersection Observer:** añade `.fade-in` a los elementos con `.hover-lift` y a las etiquetas `article` cuando entran al viewport, y deja de observarlos después.
- **Estado del carrito:** vive en `CartContext`, según `AGENTS.md`.

## 8. Accesibilidad

- Todo se puede operar con teclado y el foco es visible.
- Botones con `<button>`, enlaces con `<a>`/`Link`.
- Contraste suficiente, sobre todo en texto blanco sobre fondos oscuros.
- Notificaciones en una región `aria-live="polite"`.
- Tallas y colores como grupos con etiqueta ("Talla", "Color").

## 9. Errores a evitar

- No usar CDN de Tailwind ni de Lucide: usar Tailwind instalado y `lucide-react`.
- No usar `<img>` suelto: usar `next/image` con tamaños definidos y `alt` descriptivo en español.
- No dejar el botón de categoría fuera del input de búsqueda en escritorio.
- No omitir la animación de escritura ni el `backdrop-blur-sm` del header.
- No guardar tallas como texto.
- No hacer que el desplegable de búsqueda o la animación de escritura rompan en móvil.

## 10. Verificación específica

- Con `disponibles: [38, 40]`, solo esas dos tallas se pueden elegir, y elegir una desmarca la otra.
- Sin talla o sin color, "Añadir al carrito" no añade y avisa.
- La barra de scroll llega al 100 % al final de la página.
- La animación de escritura cicla los 4 mensajes sin errores en consola.
- Con "reducir movimiento" activado en el sistema, las animaciones se suavizan o se detienen.
- Revisar en ~375 px de ancho y en escritorio.
