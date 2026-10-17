/*
 * Ribbon geometry, shared by every surface that draws the brand ribbons: the landing backdrop,
 * the docs banner and the Open Graph images. Each ribbon is a translucent band with one bright
 * edge, pinched at both ends. Ribbons.astro draws them for the site; og.tsx for the images.
 */

export type Point = [x: number, y: number];
export type Ribbon = {
	/** The bright edge: a start point followed by cubic segments (c1, c2, end), smooth at each joint. */
	points: Point[];
	/** How far the faint edge sits from the bright edge at its widest: the ribbon's width. */
	spread: Point;
	colors: string[];
	opacity?: number;
};

// Ribbon colours are theme tokens (Ribbons.astro), so light mode can set its own.
export const INDIGO = 'var(--ribbon-indigo)';
export const BLUE = 'var(--ribbon-blue)';
export const ACCENT = 'var(--ribbon-accent)';
export const TEAL = 'var(--ribbon-teal)';
export const MAGENTA = 'var(--ribbon-magenta)';
export const PINK = 'var(--ribbon-pink)';
export const CORAL = 'var(--ribbon-coral)';
export const PALETTE = [INDIGO, BLUE, ACCENT, TEAL, MAGENTA, PINK, CORAL];

/** The dark palette as plain colours, for renderers without CSS variables (the OG images). */
export const darkColors: Record<string, string> = {
	[INDIGO]: '#8b5cf6',
	[BLUE]: '#3b6cff',
	[ACCENT]: '#61dafb',
	[TEAL]: '#14b8a6',
	[MAGENTA]: '#c026d3',
	[PINK]: '#ec4899',
	[CORAL]: '#ff8a65',
};

/** A one-segment ribbon, the faint edge offset by `spread` at both control points. */
export const hero = (from: Point, c1: Point, c2: Point, to: Point, spread: Point, colors: string[], opacity?: number): Ribbon => ({
	points: [from, c1, c2, to],
	spread,
	colors,
	opacity,
});

/** One decimal is finer than a pixel: the rest is only bytes in the page. */
export const round = (n: number) => Math.round(n * 10) / 10;

export const rounded = (ribbons: Ribbon[]): Ribbon[] =>
	ribbons.map((r) => ({
		...r,
		points: r.points.map(([x, y]): Point => [round(x), round(y)]),
		opacity: r.opacity && Math.round(r.opacity * 100) / 100,
	}));

/**
 * Gradient stops, with three mixed between each pair of colours in `--ribbon-mix`. In sRGB
 * (dark mode) they land exactly on the plain gradient; in OKLCH (light mode) they carry it
 * round the hue wheel at full strength, so violet to teal never passes through grey.
 */
export const gradientStops = (colors: string[]) =>
	colors.flatMap((color, j) => {
		const at = (t: number) => (j + t) / (colors.length - 1);
		const next = colors[j + 1];
		if (!next) return [{ offset: at(0), color }];
		return [0, 25, 50, 75].map((mix) => ({
			offset: Math.round(at(mix / 100) * 1000) / 1000,
			color: mix ? `color-mix(in var(--ribbon-mix), ${color} ${100 - mix}%, ${next})` : color,
		}));
	});

/** The ribbon's width at its widest: how far the faint edge strays from the bright one. */
export const width = (r: Ribbon) => Math.round(Math.hypot(...r.spread));
/** A box around the ribbon and its blurs: the curve stays inside its control points. */
export const bounds = (r: Ribbon) => {
	const margin = width(r) + 120;
	const xs = r.points.map(([x]) => x);
	const ys = r.points.map(([, y]) => y);
	const x = Math.min(...xs) - margin;
	const y = Math.min(...ys) - margin;
	return { x, y, width: round(Math.max(...xs) + margin - x), height: round(Math.max(...ys) + margin - y) };
};

const pt = ([x, y]: Point) => `${round(x)} ${round(y)}`;
const segments = (points: Point[]) => {
	let d = '';
	for (let i = 1; i < points.length; i += 3) d += ` C ${pt(points[i])}, ${pt(points[i + 1])}, ${pt(points[i + 2])}`;
	return d;
};

export const edge = (r: Ribbon) => `M ${pt(r.points[0])}${segments(r.points)}`;
// The faint edge swells away from the bright one in the middle and meets it at both ends.
const faintPoints = (r: Ribbon) => {
	const last = r.points.length - 1;
	return r.points.map(([x, y], k): Point => {
		const swell = Math.sin((Math.PI * k) / last) / Math.sin(Math.PI / 3);
		return [x + r.spread[0] * swell, y + r.spread[1] * swell];
	});
};
export const faintEdge = (r: Ribbon) => {
	const back = faintPoints(r).reverse();
	return `M ${pt(back[0])}${segments(back)}`;
};
// Bright edge out, faint edge back; sharing end points pinches the ribbon at both ends.
export const shape = (r: Ribbon) => `${edge(r)}${segments(faintPoints(r).reverse())} Z`;

/*
 * The brand banner (docs introduction, Open Graph image): a 1672×941 scene with the logo and
 * tagline on the left, so the ribbons rise from below it and sweep off past the right edge,
 * behind whatever sits there.
 */
export const BANNER_WIDTH = 1672;
export const BANNER_HEIGHT = 941;
export const bannerRibbons: Ribbon[] = [
	hero([700, 1040], [950, 450], [1350, 150], [1760, 260], [70, 240], [INDIGO, BLUE, ACCENT, TEAL]),
	hero([900, 1060], [1150, 660], [1450, 540], [1760, 660], [20, 80], [INDIGO, PINK, CORAL], 0.8),
	hero([-80, 720], [350, 780], [650, 920], [900, 1060], [-40, -140], [BLUE, INDIGO], 0.5),
];
