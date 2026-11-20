// Toda la configuración "de ambiente" en un solo lugar.
const env = import.meta.env;

export const API_SALES = env.VITE_API_SALES || 'https://ec-sales.makipos.la';
export const API_PRODUCTS = env.VITE_API_PRODUCTS || 'https://ec-products.makipos.la';
export const PRICE_LIST_ID = env.VITE_PRICE_LIST_ID || '';
export const ENABLE_ORDER = String(env.VITE_ENABLE_ORDER || '1') === '1';

/**
 * Dominio con el que se CONSULTA el comercio.
 *
 * Es UN valor para todo el sitio, no uno por cliente: el menú siempre pregunta
 *      <base>/c/<slug-de-la-url>
 * así que un mismo build atiende a todos los comercios.
 *
 * Vacío  -> usa el dominio donde está abierta la página (lo ideal, cuando
 *           el dominio del menú ya está registrado en Maki).
 * Lleno  -> usa ese dominio para resolver. Sirve mientras los comercios
 *           sigan registrados con el dominio del catálogo, y en localhost.
 */
export const RESOLVE_DOMAIN_BASE = env.VITE_RESOLVE_DOMAIN_BASE || '';

// SOLO DESARROLLO: menú que abre http://localhost:5173 sin /c/<slug>
export const DEV_SLUG = env.DEV ? env.VITE_DEV_SLUG || '' : '';
