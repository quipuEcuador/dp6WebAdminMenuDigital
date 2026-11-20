import { http } from './http';
import { API_SALES } from '../config/env';

/**
 * Igual que el catálogo digital: se envía el dominio completo y el backend
 * responde CON EL COMERCIO que le corresponde. De aquí sale el commerceId,
 * el logo, el WhatsApp y el nombre. Nada se escribe a mano en el proyecto.
 *
 *   POST /ecommerce-companies/public  { domain: "https://menu.makipos.la/c/radiador" }
 */
export async function getCommerceByDomain(domain) {
	const data = await http.post(`${API_SALES}/ecommerce-companies/public`, { domain });
	return normalizeCommerce(data);
}

function onlyDigits(value) {
	return String(value || '').replace(/\D/g, '');
}

function normalizeCommerce(raw) {
	if (!raw) return null;
	const item = Array.isArray(raw) ? raw[0] : raw.data || raw;
	if (!item) return null;

	// El servicio devuelve el comercio con su id -> ESE es el commerceId
	const commerceId = item.commerceId || item.id || null;
	const settings = item.settings || {};

	// Lo visual que ya viene cargado por cliente en Maki
	const fromCommerce = {
		title: (item.name || '').trim(),
		logo: item.urlImage || '',
		whatsapp: onlyDigits(item.whatsappNumber || item.phone),
	};

	return {
		raw: item,
		commerceId,
		slug: item.slug || '',
		name: (item.name || '').trim(),
		rzSocial: (item.rzSocial || '').trim(),
		logo: item.urlImage || '',
		phone: item.phone || '',
		whatsapp: onlyDigits(item.whatsappNumber || item.phone),
		email: item.email || '',
		address: item.address || '',
		city: (item.ubigeoData && item.ubigeoData.city && item.ubigeoData.city.name) || '',
		subsidiaryName: (item.subsidiary && item.subsidiary.sucursalName) || '',
		// Token del comercio: solo se usa si activas VITE_COMMERCE_HEADER
		tokenStore: item.tokenStore || '',
		// default del proyecto  <  lo que ya trae el comercio  <  tema guardado en settings
		theme: { ...fromCommerce, ...(settings.theme || item.theme || {}) },
	};
}
