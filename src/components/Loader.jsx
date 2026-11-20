export default function Loader() {
	return (
		<div className="mdx-skeleton">
			<div className="sk sk-hero" />
			<div className="sk-row">
				<div className="sk sk-search" />
			</div>
			<div className="sk-row">
				<div className="sk sk-chip" />
				<div className="sk sk-chip" />
				<div className="sk sk-chip" />
				<div className="sk sk-chip" />
			</div>
			<div className="sk sk-title" />
			<div className="sk-grid">
				{Array.from({ length: 6 }).map((_, index) => (
					<div className="sk sk-card" key={index} />
				))}
			</div>
		</div>
	);
}
