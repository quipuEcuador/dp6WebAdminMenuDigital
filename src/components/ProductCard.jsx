import { useRef } from 'react';
import { formatMoney, getPrice } from '../utils/price';

export default function ProductCard({ product, theme, onOpen, onAdd, index = 0 }) {
	const price = getPrice(product);
	const agotado = theme.showStock && product.stock <= 0;
	const innerRef = useRef(null);

	// Inclinación 3D siguiendo al cursor (se escribe directo al DOM, sin re-render)
	function handleMove(event) {
		const node = innerRef.current;
		if (!node || window.matchMedia('(hover: none)').matches) return;
		const box = node.getBoundingClientRect();
		const px = (event.clientX - box.left) / box.width - 0.5;
		const py = (event.clientY - box.top) / box.height - 0.5;
		node.style.setProperty('--ry', `${px * 13}deg`);
		node.style.setProperty('--rx', `${-py * 13}deg`);
		node.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
		node.style.setProperty('--my', `${(py + 0.5) * 100}%`);
	}

	function handleLeave() {
		const node = innerRef.current;
		if (!node) return;
		node.style.setProperty('--ry', '0deg');
		node.style.setProperty('--rx', '0deg');
	}

	return (
		<article
			className={`mdx-card ${agotado ? 'is-out' : ''}`}
			data-reveal
			style={{ '--i': index % 12 }}
			onPointerMove={handleMove}
			onPointerLeave={handleLeave}
			onClick={() => onOpen(product)}
		>
			<div className="mdx-card__inner" ref={innerRef}>
				<span className="mdx-card__glow" />

				{theme.showImages ? (
					<div className="mdx-card__media">
						{product.image ? (
							<img src={product.image} alt={product.name} loading="lazy" />
						) : (
							<div className="mdx-card__placeholder">
								<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.3">
									<path d="M3 17l5.5-6 4 4.5L16 12l5 5" strokeLinecap="round" strokeLinejoin="round" />
									<rect x="3" y="4" width="18" height="16" rx="3" />
								</svg>
							</div>
						)}
						{agotado ? <span className="mdx-card__out">Agotado</span> : null}
					</div>
				) : null}

				<div className="mdx-card__body">
					<h3 className="mdx-card__title">{product.name}</h3>
					{product.description ? <p className="mdx-card__desc">{product.description}</p> : null}

					<div className="mdx-card__foot">
						<div className="mdx-card__meta">
							{theme.showPrices ? (
								<span className="mdx-card__price">{formatMoney(price)}</span>
							) : null}
							{theme.showCodes && product.code ? (
								<span className="mdx-card__code">{product.code}</span>
							) : null}
						</div>

						{onAdd && !agotado ? (
							<button
								type="button"
								className="mdx-add"
								aria-label={`Agregar ${product.name}`}
								onClick={event => {
									event.stopPropagation();
									onAdd(product, 1);
								}}
							>
								<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
									<path d="M12 5v14M5 12h14" />
								</svg>
							</button>
						) : null}
					</div>
				</div>
			</div>
		</article>
	);
}
