import { useEffect, useState } from 'react';
import { formatMoney, getPrice } from '../utils/price';

export default function ProductModal({ product, theme, onClose, onAdd }) {
	const [quantity, setQuantity] = useState(1);
	const [note, setNote] = useState('');
	const [imageIndex, setImageIndex] = useState(0);

	useEffect(() => {
		setQuantity(1);
		setNote('');
		setImageIndex(0);
		document.body.style.overflow = product ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [product]);

	useEffect(() => {
		function onKey(event) {
			if (event.key === 'Escape') onClose();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	if (!product) return null;
	const price = getPrice(product);
	const agotado = theme.showStock && product.stock <= 0;

	return (
		<div className="mdx-modal" onClick={onClose}>
			<div className="mdx-modal__card" onClick={event => event.stopPropagation()}>
				<span className="mdx-modal__grab" />
				<button type="button" className="mdx-modal__close" onClick={onClose} aria-label="Cerrar">
					×
				</button>

				{theme.showImages && product.images.length ? (
					<div className="mdx-modal__media">
						<img src={product.images[imageIndex]} alt={product.name} />
						{product.images.length > 1 ? (
							<div className="mdx-modal__dots">
								{product.images.map((image, index) => (
									<button
										key={image}
										type="button"
										className={index === imageIndex ? 'is-active' : ''}
										aria-label={`Foto ${index + 1}`}
										onClick={() => setImageIndex(index)}
									/>
								))}
							</div>
						) : null}
					</div>
				) : null}

				<div className="mdx-modal__body">
					<span className="mdx-modal__cat">{product.category.name}</span>
					<h2>{product.name}</h2>
					{product.description ? <p className="mdx-modal__desc">{product.description}</p> : null}

					<div className="mdx-modal__priceRow">
						{theme.showPrices ? (
							<span className="mdx-modal__price">{formatMoney(price)}</span>
						) : (
							<span />
						)}
						{product.unit ? <span className="mdx-modal__unit">por {product.unit.toLowerCase()}</span> : null}
					</div>

					{onAdd && !agotado ? (
						<>
							<label className="mdx-label" htmlFor="mdx-note">
								¿Alguna indicación?
							</label>
							<input
								id="mdx-note"
								className="mdx-input"
								value={note}
								placeholder="Ej: sin cebolla, término medio…"
								onChange={event => setNote(event.target.value)}
							/>

							<div className="mdx-modal__actions">
								<div className="mdx-stepper">
									<button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
										−
									</button>
									<span>{quantity}</span>
									<button type="button" onClick={() => setQuantity(q => q + 1)}>
										+
									</button>
								</div>
								<button
									type="button"
									className="mdx-btn mdx-btn--grow"
									onClick={() => {
										onAdd(product, quantity, note);
										onClose();
									}}
								>
									Agregar · {formatMoney(price * quantity)}
								</button>
							</div>
						</>
					) : null}

					{agotado ? <p className="mdx-modal__note">Por ahora no está disponible.</p> : null}
				</div>
			</div>
		</div>
	);
}
