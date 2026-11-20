import { useEffect, useState } from 'react';

// true cuando ya se pasó la portada: la barra se compacta y muestra la marca
export function useScrolled(offset = 220) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		let frame = null;
		function onScroll() {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				setScrolled(window.scrollY > offset);
				frame = null;
			});
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [offset]);

	return scrolled;
}
