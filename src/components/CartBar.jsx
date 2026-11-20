import { useState } from 'react';
import { formatMoney, getPrice } from '../utils/price';

export default function CartBar({ cart, theme, commerce }) {
	const [open, setOpen] = useState(false);
	if (!cart.count) return null;

	function buildMessage() {
		const lines = [theme.orderMessage || 'Hola, quiero hacer un pedido:', ''];
		cart.items.forEach(item => {
			lines.push(
				`• ${item.quantity} x ${item.product.name} — ${formatMoney(
					getPrice(item.product) * item.quantity,
				)}`,
			);
			if (item.note) lines.push(`   (${item.note})`);
		});
		lines.push('', `TOTAL: ${formatMoney(cart.total)}`);
		if (commerce && commerce.name) lines.push('', `— ${commerce.name}`);
		return lines.join('\n');
	}

	function send() {
		const phone = (theme.whatsapp || '').replace(/\D/g, '');
		const text = encodeURIComponent(buildMessage());
		const url = phone
			? `https://wa.me/${phone}?text=${text}`
			: `https://wa.me/?text=${text}`;
		window.open(url, '_blank', 'noopener');
	}

	return (
		<>
			{open ? (
				<div className="mdx-sheet" onClick={() => setOpen(false)}>
					<div className="mdx-sheet__card" onClick={event => event.stopPropagation()}>
						<div className="mdx-sheet__head">
							<strong>Tu pedido</strong>
							<button type="button" onClick={() => setOpen(false)}>
								×
							</button>
						</div>
						<div className="mdx-sheet__list">
							{cart.items.map(item => (
								<div className="mdx-sheet__row" key={`${item.product.id}-${item.note}`}>
									<div>
										<p>{item.product.name}</p>
										{item.note ? <small>{item.note}</small> : null}
									</div>
									<div className="mdx-stepper mdx-stepper--sm">
										<button
											type="button"
											onClick={() => cart.setQuantity(item.product.id, item.quantity - 1)}
										>
											−
										</button>
										<span>{item.quantity}</span>
										<button
											type="button"
											onClick={() => cart.setQuantity(item.product.id, item.quantity + 1)}
										>
											+
										</button>
									</div>
									<strong>{formatMoney(getPrice(item.product) * item.quantity)}</strong>
								</div>
							))}
						</div>
						<div className="mdx-sheet__foot">
							<button type="button" className="mdx-link" onClick={cart.clear}>
								Vaciar
							</button>
							<strong>{formatMoney(cart.total)}</strong>
						</div>
						<button type="button" className="mdx-btn mdx-btn--block" onClick={send}>
							Enviar pedido por WhatsApp
						</button>
					</div>
				</div>
			) : null}

			<button type="button" className="mdx-cartbar" onClick={() => setOpen(true)}>
				<span className="mdx-cartbar__badge">{cart.count}</span>
				<span>Ver pedido</span>
				<strong>{formatMoney(cart.total)}</strong>
			</button>
		</>
	);
}
