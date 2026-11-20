// ============================================================
//  TEMA: TODO LO VISUAL SE CONTROLA DESDE AQUÍ
//  Cada clave se publica como variable CSS --mdx-<clave>
// ============================================================
export const defaultTheme = {
	// --- Marca ---
	primary: '#10b981',
	primaryDark: '#047857',
	accent: '#fbbf24',
	onPrimary: '#ffffff',

	// --- Superficies (modo claro) ---
	bg: '#fbfaf9',
	surface: '#ffffff',
	surfaceAlt: '#f5f4f2',
	text: '#1c1917',
	muted: '#78716c',
	border: '#e7e5e4',

	// --- Superficies (modo oscuro, cálido) ---
	darkBg: '#0c0a09',
	darkSurface: '#1c1917',
	darkSurfaceAlt: '#292524',
	darkText: '#fafaf9',
	darkMuted: '#a8a29e',
	darkBorder: '#292524',

	// --- Forma ---
	radius: '14px',
	cardRadius: '22px',
	font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
	fontDisplay: "'Fraunces', Georgia, 'Times New Roman', serif",

	// --- Layout ---
	layout: 'grid', // 'grid' | 'list'
	heroHeight: '380px',
	showFeatured: true,
	showImages: true,
	showCodes: false,
	showPrices: true,
	showStock: false,

	// --- Contenido (se llena solo desde el comercio) ---
	title: '',
	subtitle: '',
	coverImage: '',
	logo: '',

	// --- Pedido ---
	whatsapp: '',
	orderMessage: 'Hola, quiero hacer un pedido:',
};

// Paletas listas
export const presets = {
	Esmeralda: { primary: '#10b981', primaryDark: '#047857', accent: '#fbbf24' },
	Carmesí: { primary: '#e11d48', primaryDark: '#9f1239', accent: '#fb923c' },
	Índigo: { primary: '#6366f1', primaryDark: '#4338ca', accent: '#22d3ee' },
	Ámbar: { primary: '#f59e0b', primaryDark: '#b45309', accent: '#84cc16' },
	Grafito: { primary: '#27272a', primaryDark: '#09090b', accent: '#fbbf24' },
	Violeta: { primary: '#a855f7', primaryDark: '#7e22ce', accent: '#f472b6' },
	Océano: { primary: '#0ea5e9', primaryDark: '#0369a1', accent: '#14b8a6' },
	Terracota: { primary: '#c2410c', primaryDark: '#7c2d12', accent: '#eab308' },
};

function toVar(key) {
	return `--mdx-${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
}

export function applyTheme(theme) {
	const root = document.documentElement;
	Object.entries(theme).forEach(([key, value]) => {
		if (typeof value === 'string' || typeof value === 'number') {
			root.style.setProperty(toVar(key), String(value));
		}
	});
}
