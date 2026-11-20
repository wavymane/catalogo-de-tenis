# AGENTS.md

Tienda online de zapatos (Colombia). **Fase actual: solo frontend.**
Interfaz y textos de usuario en español. Código, nombres de variables y commits en inglés.

## 0. Alcance de la fase actual

Se construye únicamente la parte visual e interactiva. **No existe backend todavía.**

- Los datos salen de archivos locales con datos de ejemplo (mock), no de una base de datos.
- El carrito y los filtros funcionan en el navegador; nada se guarda en un servidor.
- El checkout es solo una maqueta visual: no cobra ni envía nada.
- Si una tarea parece requerir backend, detente y avisa en lugar de implementarlo.

El backend (Supabase, Prisma, pagos, autenticación, panel admin) llegará en una fase posterior. Por eso el código debe quedar **preparado para conectarlo después** (ver sección 4, capa de datos).

## 1. Stack tecnológico

- **Framework:** Next.js (App Router) con React y TypeScript en modo estricto.
- **Estilos:** Tailwind CSS.
- **Iconos:** lucide-react.
- **Estado del cliente:** React Context + `useReducer` para el carrito. Sin librerías de estado externas por ahora.
- **Gestor de paquetes:** pnpm. No mezclar con npm ni yarn.
- **Despliegue previsto:** Vercel.

Antes de añadir cualquier dependencia nueva, pregunta. Prefiere lo que ya trae Next.js o React.

## 2. Estructura del proyecto

```
/
├── prototipo/            # HTML/CSS/JS estático inicial. Solo referencia, NO modificar.
├── src/
│   ├── app/              # Rutas (App Router)
│   │   ├── page.tsx                  # Inicio
│   │   ├── [genero]/page.tsx         # Categorías (mujer, hombre, ninos)
│   │   ├── producto/[slug]/page.tsx  # Detalle de producto
│   │   ├── carrito/page.tsx
│   │   └── checkout/page.tsx         # Maqueta visual
│   ├── components/
│   │   ├── ui/           # Genéricos: Button, Badge, Input, Modal
│   │   └── tienda/       # Del dominio: ProductCard, SizeSelector, CartDrawer, Filters
│   ├── data/             # Datos de ejemplo y funciones de acceso (ver sección 4)
│   │   ├── productos.ts
│   │   └── categorias.ts
│   ├── context/          # CartContext
│   ├── lib/utils/        # Helpers (formatear precio, etc.)
│   └── types/            # Tipos compartidos (Producto, Variante, ItemCarrito)
├── public/
│   └── imagenes/         # Fotos de producto
└── AGENTS.md
```

## 3. Convenciones de código

- TypeScript estricto. Prohibido `any`; usa `unknown` y estrecha el tipo.
- Componentes en `PascalCase.tsx`; el resto de archivos en `kebab-case.ts`.
- URLs públicas en español y `kebab-case` (`/mujer/tenis-running`).
- Componentes funcionales con tipos de props explícitos.
- Imports con alias `@/` desde `src/`.
- Comenta solo el porqué, nunca lo que el código ya dice.
- Componentes pequeños con una sola responsabilidad.
- Precios como entero en pesos COP. Se formatean solo al mostrar con `Intl.NumberFormat("es-CO")`.
- Todo texto visible, `alt` de imágenes y `aria-label` en español.
- Mobile first: diseña para celular y luego amplía con los breakpoints de Tailwind.

## 4. Patrones obligatorios

- **Server Components por defecto.** Usa `"use client"` solo donde haya interactividad (carrito, selector de talla, filtros, menú móvil).
- **Capa de datos aislada.** Ningún componente importa el array de productos directamente. Siempre usa funciones de `src/data/`, por ejemplo `obtenerProductos()`, `obtenerProductoPorSlug(slug)`, `obtenerProductosPorCategoria(cat)`. Que sean `async` aunque hoy devuelvan datos locales: así, cuando exista la base de datos, solo se cambia el interior de esas funciones y no las páginas.
- **Tipos primero.** Define `Producto`, `Variante` (talla, color, stock) y `ItemCarrito` en `src/types/` antes de construir componentes. Las tallas y colores son variantes con stock propio, no productos separados.
- **Tallas como números** (`38`, no `"38"`). Una talla sin stock se muestra deshabilitada.
- **Carrito:** estado en `CartContext`. Se puede persistir en `localStorage` con try/catch y valores por defecto si falla.
- **SEO desde ya** (aunque los datos sean de ejemplo):
  - `generateMetadata` con título y descripción únicos por página.
  - Páginas de categoría y producto con `generateStaticParams`.
  - JSON-LD de tipo `Product` en la página de producto.
  - Imágenes con `next/image`, tamaños definidos y `alt` descriptivo.
  - Un solo `<h1>` por página, jerarquía de encabezados correcta.
- **Accesibilidad:** HTML semántico, botones con `<button>`, foco visible, contraste suficiente, todo operable con teclado.
- **Estados de interfaz:** cada lista o acción contempla estado vacío, carga y error aunque hoy no falle.

## 5. Prohibiciones

- No crear backend: nada de `src/app/api/`, Route Handlers, Server Actions que guarden datos, ni lógica de servidor persistente.
- No instalar ni configurar Prisma, Supabase, Wompi, Resend ni ninguna librería de autenticación o pagos.
- No crear variables de entorno ni archivos `.env`.
- No hacer `fetch` a servicios externos inventados ni simular llamadas de red con `setTimeout` salvo para probar estados de carga.
- No guardar datos de tarjeta ni crear formularios que parezcan procesarlos de verdad. El checkout es maqueta.
- No usar `any`, `// @ts-ignore` ni desactivar reglas de lint para que algo compile.
- No modificar `prototipo/` ni importar código desde ahí.
- No copiar descripciones de productos de otras tiendas o proveedores.
- No añadir dependencias, cambiar de framework o de sistema de estilos sin aprobación.
- No usar `--force` ni `--no-verify`.

## 6. Flujo de trabajo

1. Lee el código relacionado antes de modificar nada.
2. Si la tarea toca más de 3 archivos o cambia los tipos de `src/types/`, propone un plan breve y espera confirmación.
3. Haz cambios pequeños y enfocados, una cosa a la vez.
4. Reutiliza componentes de `components/ui/` antes de crear uno nuevo.
5. Verifica (sección 9) antes de dar la tarea por terminada.
6. Commits en inglés, formato convencional: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`.
7. Una rama por funcionalidad; no trabajar directo en `main`.

## Memoria
— Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
— Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a
evitar.
— Mantenlo breve (máximo ~v50 líneas): resume o elimina 10 que ya no aporte.
— Si algo se convierte en una regla permanente, propón moverlo a en lugar de dejarlo en la
memoria.
— No guardes nunca datos sensibles (claves, tokens, datos personales).

## 7. Forma de trabajar

- Responde en español, breve y directo.
- Si falta información o hay ambigüedad, pregunta antes de asumir.
- Si encuentras un problema fuera del alcance de la tarea, menciónalo sin arreglarlo por tu cuenta.
- Al terminar, resume qué cambiaste, en qué archivos y qué quedó pendiente.
- No inventes APIs ni opciones de configuración; ante la duda, consulta la documentación oficial.
- Prefiere la solución más simple que cumpla el requisito.

## 8. Límites

- **Pide confirmación antes de:** borrar archivos, cambiar los tipos de `src/types/`, instalar dependencias, cambiar la estructura de carpetas.
- **Fuera de alcance:** backend, base de datos, pagos, autenticación, panel de administración, emails.
- **Fuera de alcance salvo petición explícita:** rediseños completos, refactors masivos, optimizaciones prematuras.
- Si una tarea entra en conflicto con esta lista, detente y explica el conflicto.
- Siempre actualizar `MEMORY.md` al terminar cada tarea.

## 9. Verificación

Antes de terminar cualquier tarea, ejecuta y confirma que pasa:

```bash
pnpm lint
pnpm typecheck      # tsc --noEmit
pnpm build
```

Además, según el cambio:

- **Vista:** revisa en móvil (~375 px) y escritorio; sin scroll horizontal ni elementos cortados.
- **Textos:** todo lo visible, incluidas etiquetas accesibles, está en español.
- **Tallas:** con tallas disponibles `[38, 40]`, solo esas dos se pueden seleccionar y elegir una desmarca la otra.
- **Carrito:** añadir una variante, cambiar cantidad, quitarla y recargar la página (si hay persistencia) funciona sin errores.
- **Consola:** sin errores ni advertencias en el navegador.
- **SEO:** cada página pública tiene título, descripción y un solo `<h1>`; el JSON-LD del producto es válido.
- **Teclado:** se puede navegar y operar lo principal sin ratón.

Si algún comando falla, corrígelo o repórtalo. Nunca declares una tarea terminada con errores pendientes.
