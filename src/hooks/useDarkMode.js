import { useCallback, useEffect, useState } from 'react';

const KEY = 'mdx-dark';

export function useDarkMode() {
	const [dark, setDark] = useState(() => {
		try {
			const saved = localStorage.getItem(KEY);
			if (saved !== null) return saved === '1';
		} catch (error) {
			/* modo privado */
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		document.documentElement.dataset.theme = dark ? 'dark' : 'light';
		try {
			localStorage.setItem(KEY, dark ? '1' : '0');
		} catch (error) {
			/* noop */
		}
	}, [dark]);

	const toggle = useCallback(() => setDark(value => !value), []);
	return { dark, toggle };
}
