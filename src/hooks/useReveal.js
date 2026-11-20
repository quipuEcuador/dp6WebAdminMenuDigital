import { useEffect } from 'react';

// Aparición suave de las secciones al entrar en pantalla
export function useReveal(deps = []) {
	useEffect(() => {
		const nodes = document.querySelectorAll('[data-reveal]:not(.is-in)');
		if (!nodes.length) return undefined;

		if (!('IntersectionObserver' in window)) {
			nodes.forEach(node => node.classList.add('is-in'));
			return undefined;
		}

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-in');
						observer.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
		);

		nodes.forEach(node => observer.observe(node));
		return () => observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
