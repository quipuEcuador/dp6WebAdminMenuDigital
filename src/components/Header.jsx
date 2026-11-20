export default function Header({ theme, commerce }) {
	const title = theme.title || commerce.name || 'Menú Digital';
	const subtitle = theme.subtitle || commerce.description || '';
	const logo = theme.coverImage || commerce.logo;

	return (
		<header className="mdx-header">
			<div className="mdx-header__inner">
				{logo ? <img className="mdx-header__logo" src={logo} alt={title} /> : null}
				<div>
					<h1 className="mdx-header__title">{title}</h1>
					{subtitle ? <p className="mdx-header__subtitle">{subtitle}</p> : null}
				</div>
			</div>
		</header>
	);
}
