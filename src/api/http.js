async function request(url, options = {}) {
	let response;
	try {
		response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
		});
	} catch (error) {
		throw new Error(`No se pudo conectar con el servicio (${new URL(url).pathname}).`);
	}

	const text = await response.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch (error) {
		data = text;
	}

	if (!response.ok) {
		if (response.status === 401 || response.status === 403) {
			throw new Error(
				`${new URL(url).pathname}: el comercio no autorizó la consulta (${response.status}).`,
			);
		}
		const detail = (data && (data.message || data.error)) || `HTTP ${response.status}`;
		throw new Error(`${new URL(url).pathname}: ${detail}`);
	}
	return data;
}

/**
 * El API de productos identifica al comercio con el tokenStore que devolvió
 * ecommerce-companies/public:   Authorization: Bearer <tokenStore>
 * El token se resuelve en tiempo de ejecución; no se guarda en el proyecto.
 */
export function authHeader(tokenStore) {
	return tokenStore ? { Authorization: `Bearer ${tokenStore}` } : {};
}

export const http = {
	get: (url, options) => request(url, { ...options, method: 'GET' }),
	post: (url, body, options) =>
		request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
};
