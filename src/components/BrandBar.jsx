// Marca compacta que aparece en la barra al bajar
export default function BrandBar({ theme, commerce, show }) {
	const title = theme.title || commerce.name || 'Menú';
	const logo = theme.logo || commerce.logo;

	return (
		<div className={`mdx-brand ${show ? 'is-on' : ''}`}>
			{logo ? <img src={logo} alt="" /> : <span className="mdx-brand__dot">{title.charAt(0)}</span>}
			<strong>{title}</strong>
		</div>
	);
}
