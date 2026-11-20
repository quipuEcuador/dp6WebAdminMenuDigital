import { useEffect, useState } from 'react';
import { getCommerceByDomain } from '../api/commerce';
import { getPublicCategories } from '../api/categories';
import { getPublicProducts } from '../api/products';
import { RESOLVE_DOMAIN_BASE, DEV_SLUG } from '../config/env';

const EMPTY = {
	loading: true,
	error: null,
	commerce: null,
	categories: [],
	products: [],
	progress: 0,
};

export function useMenuData(slug) {
	const [state, setState] = useState(EMPTY);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setState({ ...EMPTY });
			try {
				const query = new URLSearchParams(window.location.search);

				// Qué menú es: la ruta /c/<slug>  (?slug= sirve para previsualizar)
				const menuSlug = query.get('slug') || slug || DEV_SLUG;
				if (!menuSlug) {
					throw new Error('Falta el identificador del menú en la dirección (…/c/tu-negocio).');
				}

				// 1) DOMINIO -> COMERCIO. De aquí salen el commerceId y el token.
				const base = RESOLVE_DOMAIN_BASE || window.location.origin;
				const commerce = await getCommerceByDomain(`${base}/c/${menuSlug}`);
				if (!commerce || !commerce.commerceId) {
					throw new Error(`Este menú (/c/${menuSlug}) todavía no está asignado a un comercio.`);
				}

				const { commerceId, tokenStore } = commerce;

				// 2) Categorías y productos, autenticados con el token de ESE comercio
				const categories = await getPublicCategories(commerceId, tokenStore);
				const products = await getPublicProducts(commerceId, categories, {
					tokenStore,
					onProgress: loaded => {
						if (!cancelled) setState(s => ({ ...s, progress: loaded }));
					},
				});

				if (cancelled) return;
				setState({ loading: false, error: null, commerce, categories, products, progress: products.length });
			} catch (error) {
				if (cancelled) return;
				setState(s => ({ ...s, loading: false, error: error.message || 'Error al cargar el menú' }));
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [slug]);

	return state;
}
