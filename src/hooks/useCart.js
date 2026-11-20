import { useCallback, useMemo, useState } from 'react';
import { getPrice } from '../utils/price';

export function useCart() {
	const [items, setItems] = useState([]);

	const add = useCallback((product, quantity = 1, note = '') => {
		setItems(previous => {
			const index = previous.findIndex(i => i.product.id === product.id && i.note === note);
			if (index >= 0) {
				const copy = [...previous];
				copy[index] = { ...copy[index], quantity: copy[index].quantity + quantity };
				return copy;
			}
			return [...previous, { product, quantity, note }];
		});
	}, []);

	const remove = useCallback(productId => {
		setItems(previous => previous.filter(i => i.product.id !== productId));
	}, []);

	const setQuantity = useCallback((productId, quantity) => {
		setItems(previous =>
			previous
				.map(i => (i.product.id === productId ? { ...i, quantity } : i))
				.filter(i => i.quantity > 0),
		);
	}, []);

	const clear = useCallback(() => setItems([]), []);

	const total = useMemo(
		() => items.reduce((sum, i) => sum + getPrice(i.product) * i.quantity, 0),
		[items],
	);

	const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

	return { items, add, remove, setQuantity, clear, total, count };
}
