import { useEffect, useRef } from 'react';
import { slugify } from '../utils/group';

export default function CategoryNav({ groups, active, onSelect }) {
	const scrollRef = useRef(null);

	// El chip activo siempre visible
	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		const chip = container.querySelector('.is-active');
		if (chip) {
			chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
		}
	}, [active]);

	if (!groups.length) return null;

	return (
		<nav className="mdx-cats" ref={scrollRef}>
			<button
				type="button"
				className={`mdx-chip ${active === 'all' ? 'is-active' : ''}`}
				onClick={() => onSelect('all')}
			>
				Todo
			</button>
			{groups.map(group => (
				<button
					key={group.name}
					type="button"
					className={`mdx-chip ${active === slugify(group.name) ? 'is-active' : ''}`}
					onClick={() => onSelect(slugify(group.name))}
				>
					{group.name}
					<span className="mdx-chip__count">{group.items.length}</span>
				</button>
			))}
		</nav>
	);
}
