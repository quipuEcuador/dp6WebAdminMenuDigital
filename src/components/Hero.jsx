export default function Hero({ theme, commerce, stats, dark, onToggleDark }) {
	// Todo llega del comercio que resolvió el dominio: nada está fijo.
	const title = theme.title || commerce.name || 'Menú Digital';
	const subtitle = theme.subtitle || commerce.subsidiaryName || commerce.rzSocial || '';
	const logo = theme.logo || commerce.logo;
	const cover = theme.coverImage || logo;
	const place = commerce.city || commerce.address;

	return (
		<header className="mdx-hero">
			{cover ? <div className="mdx-hero__photo" style={{ backgroundImage: `url(${cover})` }} /> : null}
			<div className="mdx-hero__scrim" />
			<div className="mdx-hero__glow" />

			{/* Escenario 3D: esferas flotando y piso en perspectiva */}
			<span className="mdx-hero__orb mdx-hero__orb--a" aria-hidden="true" />
			<span className="mdx-hero__orb mdx-hero__orb--b" aria-hidden="true" />
			<span className="mdx-hero__floor" aria-hidden="true" />

			<button
				type="button"
				className="mdx-hero__toggle"
				onClick={onToggleDark}
				aria-label="Cambiar modo"
			>
				{dark ? '☀' : '☾'}
			</button>

			<div className="mdx-hero__content">
				{logo ? (
					<span className="mdx-hero__badge">
						<img src={logo} alt="" />
					</span>
				) : null}

				<span className="mdx-hero__eyebrow">Menú digital</span>
				<h1 className="mdx-hero__title">{title}</h1>
				{subtitle ? <p className="mdx-hero__subtitle">{subtitle}</p> : null}

				<div className="mdx-hero__meta">
					<span>
						<i className="mdx-dot" />
						Abierto
					</span>
					<em />
					<span>{stats.products} productos</span>
					<em />
					<span>{stats.categories} categorías</span>
					{place ? (
						<>
							<em />
							<span>{place}</span>
						</>
					) : null}
				</div>
			</div>

			<span className="mdx-hero__scroll" aria-hidden="true" />
		</header>
	);
}
