import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultTheme, applyTheme } from '../config/theme';

const STORAGE_KEY = 'mdx-theme';

function readLocal(commerceId) {
	try {
		const raw = localStorage.getItem(`${STORAGE_KEY}-${commerceId}`);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		return null;
	}
}

export function useTheme(commerceId, remoteTheme) {
	const [overrides, setOverrides] = useState(null);

	useEffect(() => {
		if (commerceId) setOverrides(readLocal(commerceId));
	}, [commerceId]);

	// Prioridad: localStorage (panel) > backend > default
	const theme = useMemo(
		() => ({ ...defaultTheme, ...(remoteTheme || {}), ...(overrides || {}) }),
		[remoteTheme, overrides],
	);

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const update = useCallback(
		patch => {
			setOverrides(previous => {
				const next = { ...(previous || {}), ...patch };
				try {
					localStorage.setItem(`${STORAGE_KEY}-${commerceId}`, JSON.stringify(next));
				} catch (error) {
					/* modo privado */
				}
				return next;
			});
		},
		[commerceId],
	);

	const reset = useCallback(() => {
		try {
			localStorage.removeItem(`${STORAGE_KEY}-${commerceId}`);
		} catch (error) {
			/* noop */
		}
		setOverrides(null);
	}, [commerceId]);

	return { theme, update, reset };
}
