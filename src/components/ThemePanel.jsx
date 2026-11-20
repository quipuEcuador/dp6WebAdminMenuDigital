import { useState } from 'react';
import { presets } from '../config/theme';

const COLORS = [
	['primary', 'Color principal'],
	['primaryDark', 'Principal oscuro'],
	['accent', 'Acento'],
	['bg', 'Fondo'],
	['surface', 'Tarjetas'],
	['text', 'Texto'],
	['muted', 'Texto suave'],
	['border', 'Bordes'],
];

export default function ThemePanel({ theme, update, reset }) {
	const [open, setOpen] = useState(true);
	const [copied, setCopied] = useState(false);

	function copyJson() {
		const json = JSON.stringify(theme, null, 2);
		navigator.clipboard.writeText(json).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	}

	if (!open) {
		return (
			<button type="button" className="mdx-themefab" onClick={() => setOpen(true)}>
				🎨
			</button>
		);
	}

	return (
		<aside className="mdx-theme">
			<div className="mdx-theme__head">
				<strong>Personalizar menú</strong>
				<button type="button" onClick={() => setOpen(false)}>
					×
				</button>
			</div>

			<div className="mdx-theme__body">
				<p className="mdx-theme__label">Paletas rápidas</p>
				<div className="mdx-theme__presets">
					{Object.entries(presets).map(([name, values]) => (
						<button
							key={name}
							type="button"
							style={{ background: values.primary }}
							title={name}
							onClick={() => update(values)}
						/>
					))}
				</div>

				<p className="mdx-theme__label">Colores</p>
				{COLORS.map(([key, label]) => (
					<div className="mdx-theme__row" key={key}>
						<label>{label}</label>
						<input
							type="color"
							value={theme[key]}
							onChange={event => update({ [key]: event.target.value })}
						/>
					</div>
				))}

				<p className="mdx-theme__label">Textos</p>
				<input
					className="mdx-input"
					placeholder="Título del menú"
					value={theme.title}
					onChange={event => update({ title: event.target.value })}
				/>
				<input
					className="mdx-input"
					placeholder="Subtítulo / eslogan"
					value={theme.subtitle}
					onChange={event => update({ subtitle: event.target.value })}
				/>
				<input
					className="mdx-input"
					placeholder="URL del logo"
					value={theme.coverImage}
					onChange={event => update({ coverImage: event.target.value })}
				/>
				<input
					className="mdx-input"
					placeholder="WhatsApp (593990000000)"
					value={theme.whatsapp}
					onChange={event => update({ whatsapp: event.target.value })}
				/>

				<p className="mdx-theme__label">Opciones</p>
				<label className="mdx-theme__check">
					<input
						type="checkbox"
						checked={theme.showImages}
						onChange={event => update({ showImages: event.target.checked })}
					/>
					Mostrar fotos
				</label>
				<label className="mdx-theme__check">
					<input
						type="checkbox"
						checked={theme.showPrices}
						onChange={event => update({ showPrices: event.target.checked })}
					/>
					Mostrar precios
				</label>
				<label className="mdx-theme__check">
					<input
						type="checkbox"
						checked={theme.showCodes}
						onChange={event => update({ showCodes: event.target.checked })}
					/>
					Mostrar códigos
				</label>
				<label className="mdx-theme__check">
					<input
						type="checkbox"
						checked={theme.showStock}
						onChange={event => update({ showStock: event.target.checked })}
					/>
					Marcar agotados
				</label>
				<label className="mdx-theme__check">
					<input
						type="checkbox"
						checked={theme.showFeatured}
						onChange={event => update({ showFeatured: event.target.checked })}
					/>
					Mostrar recomendados
				</label>

				<p className="mdx-theme__label">Diseño</p>
				<select
					className="mdx-input"
					value={theme.layout}
					onChange={event => update({ layout: event.target.value })}
				>
					<option value="grid">Cuadrícula</option>
					<option value="list">Lista</option>
				</select>
				<select
					className="mdx-input"
					value={theme.cardRadius}
					onChange={event => update({ cardRadius: event.target.value })}
				>
					<option value="0px">Esquinas rectas</option>
					<option value="10px">Esquinas suaves</option>
					<option value="18px">Esquinas redondas</option>
					<option value="28px">Muy redondas</option>
				</select>
				<select
					className="mdx-input"
					value={theme.heroHeight}
					onChange={event => update({ heroHeight: event.target.value })}
				>
					<option value="260px">Portada baja</option>
					<option value="380px">Portada media</option>
					<option value="520px">Portada alta</option>
				</select>
				<select
					className="mdx-input"
					value={theme.fontDisplay}
					onChange={event => update({ fontDisplay: event.target.value })}
				>
					<option value="'Fraunces', Georgia, 'Times New Roman', serif">Títulos elegantes</option>
					<option value="'Inter', system-ui, sans-serif">Títulos modernos</option>
				</select>
			</div>

			<div className="mdx-theme__foot">
				<button type="button" className="mdx-link" onClick={reset}>
					Restablecer
				</button>
				<button type="button" className="mdx-btn mdx-btn--sm" onClick={copyJson}>
					{copied ? '¡Copiado!' : 'Copiar JSON'}
				</button>
			</div>
		</aside>
	);
}
