# Menú Digital — Maki

Proyecto React (Vite) que arma un menú digital automático a partir de los
servicios de Maki, igual que el catálogo digital:

1. `POST {VITE_API_SALES}/ecommerce-companies/public` con `{ domain }`
   → devuelve el comercio: de ahí salen el `id` (commerceId) y el `tokenStore`.
   Las dos llamadas siguientes van firmadas con ese token:
   `Authorization: Bearer <tokenStore>`  (sin él responden 401).
2. `GET {VITE_API_PRODUCTS}/e-categories-public?commerceId=X&assignedOnly=true`
   → las secciones del menú, en su orden real.
3. `GET {VITE_API_PRODUCTS}/products-public?flagCommerce=true&flagGrouper=1&showCatalog=true&commerceId=X`
   → los productos, paginado hasta terminar.

Los tres son PÚBLICOS: no llevan token.

## Correr

```bash
cp .env.example .env
npm install
npm run dev
```

- Menú de un cliente: `http://localhost:5173/c/radiador`
- El que abre por defecto: `http://localhost:5173/` (usa VITE_DEV_SLUG)
- Otro menú sin cambiar la ruta: `http://localhost:5173/?slug=radiador`
- Panel de colores:   agrega `?theme=1` a cualquier URL

`VITE_RESOLVE_DOMAIN_BASE` es el dominio con el que se CONSULTA el comercio.
Es UN valor para todo el sitio (no uno por cliente) y sirve mientras los
comercios sigan registrados en Maki con el dominio del catálogo. Cuando
registres el dominio del menú, déjalo vacío.

## Qué se controla

Todo el aspecto vive en `src/config/theme.js` y se publica como variables CSS
`--mdx-*`. El panel (`?theme=1`) guarda los cambios en localStorage y permite
copiar el JSON para pegarlo en el backend (campo `theme` del comercio).

## Cómo se arman las secciones

El servicio público ya devuelve filtrado (`showCatalog=true`), así que el front
solo descarta lo que venga con `flagActive === 0`.

Cada producto cae en su sección buscando, en este orden:
1. `eCategories[0]` contra el catálogo de `e-categories-public`
2. `comCategories[0].title`
3. `category.name`
4. OTROS

## Un solo proyecto para todos los clientes

NO se despliega un sitio por cliente. El mismo build atiende a todos:

```
https://menu.makipos.la/c/parrilla-don-luis   -> comercio A
https://menu.makipos.la/c/cafe-central        -> comercio B
https://menu.makipos.la/c/pizzeria-roma       -> comercio C
```

El slug de la URL se envía a `ecommerce-companies/public` y ese servicio
decide qué comercio es: el `id` que responde ES el commerceId. Crear un menú
nuevo = dar de alta el comercio en Maki, no tocar Netlify.

El commerceId NO se configura en ninguna parte del build. `VITE_DEV_COMMERCE_ID`
solo existe con `npm run dev`; en el build de producción se ignora, así que es
imposible que un menú quede pegado a un comercio.

Del mismo objeto salen, por cliente y sin tocar código:
nombre, logo (`urlImage`), WhatsApp (`whatsappNumber`), ciudad y sucursal.

## Novedades del rediseño

- Hero con degradado, logo, contadores y modo oscuro (se guarda por navegador).
- Barra sticky con efecto vidrio (blur) y chips de categoría con scroll-spy:
  la categoría se resalta sola según la sección que estás viendo.
- Tarjetas con zoom en la foto, precio flotante y botón "+" circular.
- En móvil las tarjetas pasan a fila (foto a la izquierda), estilo app de delivery.
- Skeletons animados mientras carga, en vez de spinner.
- Modal tipo bottom-sheet con galería de fotos y comentario para la cocina.
