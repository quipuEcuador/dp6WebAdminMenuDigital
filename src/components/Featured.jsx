import { formatMoney, getPrice } from '../utils/price';

// Tira horizontal de recomendados, arriba del menú
export default function Featured({ products, theme, onOpen }) {
	if (!products.length) return null;

	return (
		<section className="mdx-featured" data-reveal>
			<div className="mdx-featured__head">
				<h2>Recomendados</h2>
				<span>Desliza →</span>
			</div>

			<div className="mdx-featured__rail">
				{products.map(product => (
					<button
						type="button"
						className="mdx-feat"
						key={product.id}
						onClick={() => onOpen(product)}
					>
						<div className="mdx-feat__media">
							{product.image ? <img src={product.image} alt="" loading="lazy" /> : null}
							<span className="mdx-feat__shade" />
							<span className="mdx-feat__cat">{product.category.name}</span>
						</div>
						<div className="mdx-feat__body">
							<strong>{product.name}</strong>
							{theme.showPrices ? <span>{formatMoney(getPrice(product))}</span> : null}
						</div>
					</button>
				))}
			</div>
		</section>
	);
}
