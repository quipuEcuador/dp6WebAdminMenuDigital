import { http, authHeader } from './http';
import { API_PRODUCTS } from '../config/env';

/**
 * GET /e-categories-public?commerceId=<id>&assignedOnly=true
 * Header: Authorization: Bearer <tokenStore del comercio>
 */
export async function getPublicCategories(commerceId, tokenStore) {
	const url = `${API_PRODUCTS}/e-categories-public?commerceId=${commerceId}&assignedOnly=true`;
	const response = await http.get(url, { headers: authHeader(tokenStore) });
	const list = Array.isArray(response) ? response : response.data || [];

	return list
		.filter(item => item && item.flagActive !== 0)
		.map((item, index) => ({
			id: item.id,
			name: String(item.title || item.name || '').trim(),
			slug: item.slug || '',
			image: item.urlImage || item.webImage || item.mobileImage || '',
			order: Number.isFinite(item.order) ? item.order : index,
		}))
		.filter(item => item.name)
		.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}
