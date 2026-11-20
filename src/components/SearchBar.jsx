export default function SearchBar({ value, onChange }) {
	return (
		<div className="mdx-search">
			<svg className="mdx-search__icon" viewBox="0 0 24 24" width="17" height="17">
				<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
				<path d="M20 20l-3.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			</svg>
			<input
				type="search"
				value={value}
				placeholder="Buscar en la carta…"
				onChange={event => onChange(event.target.value)}
			/>
			{value ? (
				<button type="button" className="mdx-search__clear" onClick={() => onChange('')}>
					×
				</button>
			) : null}
		</div>
	);
}
