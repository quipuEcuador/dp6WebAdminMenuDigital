// Agrupa productos por categoría del comercio (las secciones del menú).
// Si llega el catálogo de categorías, respeta SU orden.
export function groupByCategory(products, categories) {
	const map = new Map();

	products.forEach(product => {
		const key = product.category.name || 'OTROS';
		if (!map.has(key)) {
			map.set(key, {
				name: key,
				id: product.category.id,
				order: product.category.order,
				items: [],
			});
		}
		map.get(key).items.push(product);
	});

	const orderByName = new Map((categories || []).map((c, i) => [c.name, i]));

	return [...map.values()]
		.sort((a, b) => {
			const ia = orderByName.has(a.name) ? orderByName.get(a.name) : a.order ?? 999;
			const ib = orderByName.has(b.name) ? orderByName.get(b.name) : b.order ?? 999;
			return ia - ib || a.name.localeCompare(b.name);
		})
		.map(group => ({
			...group,
			items: group.items.sort((a, b) => a.name.localeCompare(b.name)),
		}));
}

export function slugify(text) {
	return String(text)
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
