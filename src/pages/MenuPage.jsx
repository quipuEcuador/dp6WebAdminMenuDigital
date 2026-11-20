import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMenuData } from '../hooks/useMenuData';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/useCart';
import { useDarkMode } from '../hooks/useDarkMode';
import { useReveal } from '../hooks/useReveal';
import { useScrolled } from '../hooks/useScrolled';
import { groupByCategory, slugify } from '../utils/group';
import { ENABLE_ORDER } from '../config/env';

import Hero from '../components/Hero';
import BrandBar from '../components/BrandBar';
import SearchBar from '../components/SearchBar';
import CategoryNav from '../components/CategoryNav';
import Featured from '../components/Featured';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartBar from '../components/CartBar';
import ThemePanel from '../components/ThemePanel';
import Loader from '../components/Loader';

export default function MenuPage() {
	const { slug } = useParams();
	const [searchParams] = useSearchParams();
	const editMode = searchParams.get('theme') === '1';

	const { loading, error, commerce, products, categories } = useMenuData(slug);
	const { theme, update, reset } = useTheme(
		(commerce && commerce.commerceId) || 'default',
		commerce && commerce.theme,
	);
	const { dark, toggle } = useDarkMode();
	const cart = useCart();
	const scrolled = useScrolled(240);

	const [search, setSearch] = useState('');
	const [active, setActive] = useState('all');
	const [selected, setSelected] = useState(null);
	const sectionRefs = useRef({});
	const clickScroll = useRef(false);

	// El servicio público ya viene filtrado (showCatalog=true) y products.js
	// descarta lo de otros comercios: aquí ya no se vuelve a filtrar.
	const visible = products;

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return visible;
		return visible.filter(
			p =>
				p.name.toLowerCase().includes(term) ||
				p.description.toLowerCase().includes(term) ||
				p.code.toLowerCase().includes(term) ||
				p.category.name.toLowerCase().includes(term),
		);
	}, [visible, search]);

	const groups = useMemo(() => groupByCategory(filtered, categories), [filtered, categories]);

	// Recomendados: los primeros productos con foto, uno por categoría primero
	const featured = useMemo(() => {
		if (!theme.showFeatured || !theme.showImages) return [];
		const withPhoto = visible.filter(product => product.image);
		const seen = new Set();
		const first = [];
		const rest = [];
		withPhoto.forEach(product => {
			const key = product.category.name;
			if (!seen.has(key)) {
				seen.add(key);
				first.push(product);
			} else {
				rest.push(product);
			}
		});
		return [...first, ...rest].slice(0, 10);
	}, [visible, theme.showFeatured, theme.showImages]);

	// Aparición suave de secciones y tarjetas
	useReveal([groups, featured, loading]);

	// Resalta la categoría de la sección que se está viendo
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (clickScroll.current) return;
				const visibleEntry = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
				if (visibleEntry) setActive(visibleEntry.target.id);
			},
			{ rootMargin: '-140px 0px -65% 0px', threshold: 0 },
		);

		Object.values(sectionRefs.current).forEach(node => {
			if (node) observer.observe(node);
		});
		return () => observer.disconnect();
	}, [groups]);

	function goTo(key) {
		setActive(key);
		if (key === 'all') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		const node = sectionRefs.current[key];
		if (!node) return;
		clickScroll.current = true;
		const top = node.getBoundingClientRect().top + window.scrollY - 124;
		window.scrollTo({ top, behavior: 'smooth' });
		setTimeout(() => {
			clickScroll.current = false;
		}, 700);
	}

	if (loading) return <Loader />;

	if (error) {
		return (
			<div className="mdx-error">
				<div className="mdx-error__icon">!</div>
				<h2>No pudimos cargar el menú</h2>
				<p>{error}</p>
			</div>
		);
	}

	const onAdd = ENABLE_ORDER ? cart.add : null;

	return (
		<div className={`mdx-app mdx-app--${theme.layout}`}>
			<Hero
				theme={theme}
				commerce={commerce}
				dark={dark}
				onToggleDark={toggle}
				stats={{ products: visible.length, categories: groupByCategory(visible, categories).length }}
			/>

			<div className={`mdx-bar ${scrolled ? 'is-stuck' : ''}`}>
				<div className="mdx-bar__inner">
					<div className="mdx-bar__top">
						<BrandBar theme={theme} commerce={commerce} show={scrolled} />
						<SearchBar value={search} onChange={setSearch} />
					</div>
					<CategoryNav groups={groups} active={active} onSelect={goTo} />
				</div>
			</div>

			<main className="mdx-main">
				{!search && featured.length > 2 ? (
					<Featured products={featured} theme={theme} onOpen={setSelected} />
				) : null}

				{groups.length === 0 ? (
					<div className="mdx-empty">
						<p>No encontramos nada con “{search}”.</p>
						<button type="button" className="mdx-btn mdx-btn--ghost" onClick={() => setSearch('')}>
							Limpiar búsqueda
						</button>
					</div>
				) : (
					groups.map(group => {
						const key = slugify(group.name);
						return (
							<section
								className="mdx-section"
								key={group.name}
								id={key}
								ref={node => {
									sectionRefs.current[key] = node;
								}}
							>
								<div className="mdx-section__head" data-reveal>
									<h2>{group.name}</h2>
									<span>{group.items.length}</span>
								</div>
								<div className="mdx-grid">
									{group.items.map((product, index) => (
										<ProductCard
											key={product.id}
											product={product}
											theme={theme}
											index={index}
											onOpen={setSelected}
											onAdd={onAdd}
										/>
									))}
								</div>
							</section>
						);
					})
				)}
			</main>

			<footer className="mdx-footer">
				<strong>{commerce.name || 'Menú digital'}</strong>
				<span>Menú digital · Maki</span>
			</footer>

			<ProductModal product={selected} theme={theme} onClose={() => setSelected(null)} onAdd={onAdd} />
			{ENABLE_ORDER ? <CartBar cart={cart} theme={theme} commerce={commerce} /> : null}
			{editMode ? <ThemePanel theme={theme} update={update} reset={reset} /> : null}
		</div>
	);
}
