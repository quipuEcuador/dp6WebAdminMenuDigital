import { http, authHeader } from './http';
import { API_PRODUCTS } from '../config/env';

const LIMIT = 100;

/**
 * Mismo servicio público del catálogo (sin token):
 * GET /products-public?flagCommerce=true&flagGrouper=1&showCatalog=true&commerceId=<id>
 * Header: Authorization: Bearer <tokenStore del comercio>
 *
 * Tanto el commerceId como el token llegan por parámetro; nada está escrito
 * en el código: salen del comercio que resolvió el dominio.
 */
export async function getPublicProducts(commerceId, categories, options = {}) {
	const { tokenStore, onProgress } = options;
	const byId = new Map((categories || []).map(category => [String(category.id), category]));
	const all = [];
	let page = 1;
	let total = null;

	const headers = authHeader(tokenStore);

	/* eslint-disable no-await-in-loop */
	while (true) {
		const params = new URLSearchParams({
			flagCommerce: 'true',
			flagGrouper: '1',
			showCatalog: 'true',
			page: String(page),
			limit: String(LIMIT),
		});

		const response = await http.get(`${API_PRODUCTS}/products-public?${params}`, { headers });

		const list = Array.isArray(response) ? response : response.data || [];
		if (total === null) {
			total = (response && response.pagination && response.pagination.total) || null;
		}

		all.push(...list);
		if (typeof onProgress === 'function') onProgress(all.length, total);

		if (list.length < LIMIT) break;
		if (total !== null && all.length >= total) break;
		page += 1;
		if (page > 60) break; // tope de seguridad
	}

	return all
		.map(product => normalizeProduct(product, byId, commerceId))
		.filter(Boolean);
}

/**
 * Red de seguridad: aunque el backend ignorara el commerceId, aquí solo
 * pasan los productos que pertenecen a ESTE comercio.
 */
function belongsToCommerce(product, commerceId, byId) {
	const id = String(commerceId);
	const com = product.comCategories || [];
	if (com.length) {
		return com.some(category => String(category.commerceId) === id);
	}
	// Si no trae comCategories, validamos contra las categorías del comercio
	const ids = product.eCategories || [];
	if (ids.length) return ids.some(categoryId => byId.has(String(categoryId)));
	return true;
}

function pickCategory(product, byId) {
	const ids = product.eCategories || [];
	for (let i = 0; i < ids.length; i += 1) {
		const found = byId.get(String(ids[i]));
		if (found) return { id: found.id, name: found.name, order: found.order };
	}
	const com = (product.comCategories || [])[0];
	if (com && (com.title || com.name)) {
		return { id: com.id, name: String(com.title || com.name).trim(), order: 998 };
	}
	if (product.category && product.category.name) {
		return { id: product.category.id, name: product.category.name.trim(), order: 999 };
	}
	return { id: 0, name: 'OTROS', order: 1000 };
}

function pickImages(product) {
	const images = (product.images || [])
		.filter(image => image && image.urlImage && image.flagActive !== 0)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
		.map(image => image.urlImage);
	return [...new Set([product.urlImage, ...images].filter(Boolean))];
}

function pickStock(product) {
	if (Number.isFinite(product.stockWarehouse)) return Number(product.stockWarehouse);
	if (product.warehouseProduct && Number.isFinite(product.warehouseProduct.stock)) {
		return Number(product.warehouseProduct.stock);
	}
	return Number(product.stock || 0);
}

function normalizeProduct(product, byId, commerceId) {
	if (!product) return null;
	if (product.flagActive === 0) return null;
	if (!belongsToCommerce(product, commerceId, byId)) return null;

	const images = pickImages(product);

	return {
		id: product.id,
		name: (product.name || '').trim(),
		description: (product.description || '').trim(),
		code: product.code || '',
		price: Number(product.price || 0),
		priceList: product.priceList || {},
		images,
		image: images[0] || '',
		stock: pickStock(product),
		unit: (product.unit && product.unit.name) || '',
		brand: ((product.brands || [])[0] || {}).name || '',
		category: pickCategory(product, byId),
		raw: product,
	};
}
