import { PRICE_LIST_ID } from '../config/env';

export function getPrice(product) {
	if (PRICE_LIST_ID && product.priceList && product.priceList[PRICE_LIST_ID]) {
		const item = product.priceList[PRICE_LIST_ID];
		return Number(item.price || 0);
	}
	return Number(product.price || 0);
}

export function formatMoney(value, symbol = '$') {
	const number = Number(value || 0);
	return `${symbol} ${number.toFixed(2)}`;
}
