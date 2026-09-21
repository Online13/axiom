// sRGB ↔ OKLCH conversions and the ramp generator behind the builder.
// The token palettes store `hsla()` strings (see @docs/lib/tokens), so every
// public helper here speaks that format and keeps the rounding identical.

export type Oklch = { l: number; c: number; h: number };
export type Rgb = { r: number; g: number; b: number };

const clamp = (value: number, min = 0, max = 1) =>
	Math.min(max, Math.max(min, value));

/* ---------- Parsing and formatting ---------- */

export function hexToRgb(hex: string): Rgb {
	const value = hex.replace("#", "");
	const full =
		value.length === 3
			? value
					.split("")
					.map((char) => char + char)
					.join("")
			: value;
	return {
		r: Number.parseInt(full.slice(0, 2), 16) / 255,
		g: Number.parseInt(full.slice(2, 4), 16) / 255,
		b: Number.parseInt(full.slice(4, 6), 16) / 255,
	};
}

export function rgbToHex({ r, g, b }: Rgb): string {
	const channel = (value: number) =>
		Math.round(clamp(value) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${channel(r)}${channel(g)}${channel(b)}`;
}

// Accepts `hsla(240, 2%, 91%, 1)` — the shape used across the token file.
export function hslaToRgb(value: string): Rgb {
	const [h, s, l] = value
		.slice(value.indexOf("(") + 1, value.lastIndexOf(")"))
		.split(",")
		.map((part) => Number.parseFloat(part));
	const saturation = s / 100;
	const lightness = l / 100;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const segment = ((h % 360) + 360) / 60 % 6;
	const second = chroma * (1 - Math.abs((segment % 2) - 1));
	const [r, g, b] =
		segment < 1
			? [chroma, second, 0]
			: segment < 2
				? [second, chroma, 0]
				: segment < 3
					? [0, chroma, second]
					: segment < 4
						? [0, second, chroma]
						: segment < 5
							? [second, 0, chroma]
							: [chroma, 0, second];
	const offset = lightness - chroma / 2;
	return { r: r + offset, g: g + offset, b: b + offset };
}

export function rgbToHsla({ r, g, b }: Rgb): string {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	const lightness = (max + min) / 2;
	let hue = 0;
	if (delta !== 0) {
		if (max === r) hue = ((g - b) / delta) % 6;
		else if (max === g) hue = (b - r) / delta + 2;
		else hue = (r - g) / delta + 4;
		hue *= 60;
		if (hue < 0) hue += 360;
	}
	const saturation =
		delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
	return `hsla(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%, 1)`;
}

export const hslaToHex = (value: string) => rgbToHex(hslaToRgb(value));

/* ---------- OKLCH ---------- */

const toLinear = (channel: number) =>
	channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const toGamma = (channel: number) =>
	channel <= 0.0031308
		? channel * 12.92
		: 1.055 * channel ** (1 / 2.4) - 0.055;

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
	const lr = toLinear(r);
	const lg = toLinear(g);
	const lb = toLinear(b);

	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

	const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

	const hue = (Math.atan2(bb, a) * 180) / Math.PI;
	return {
		l: lightness,
		c: Math.hypot(a, bb),
		h: hue < 0 ? hue + 360 : hue,
	};
}

function oklchToRgbRaw({ l, c, h }: Oklch): Rgb {
	const radians = (h * Math.PI) / 180;
	const a = c * Math.cos(radians);
	const b = c * Math.sin(radians);

	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

	return {
		r: toGamma(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
		g: toGamma(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
		b: toGamma(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
	};
}

const inGamut = ({ r, g, b }: Rgb) =>
	[r, g, b].every((channel) => channel >= -0.0001 && channel <= 1.0001);

// Out-of-gamut colors lose chroma until they fit, which keeps lightness and hue.
export function oklchToRgb(color: Oklch): Rgb {
	const direct = oklchToRgbRaw(color);
	if (inGamut(direct)) {
		return { r: clamp(direct.r), g: clamp(direct.g), b: clamp(direct.b) };
	}

	let low = 0;
	let high = color.c;
	for (let step = 0; step < 18; step += 1) {
		const middle = (low + high) / 2;
		if (inGamut(oklchToRgbRaw({ ...color, c: middle }))) low = middle;
		else high = middle;
	}
	const raw = oklchToRgbRaw({ ...color, c: low });
	return { r: clamp(raw.r), g: clamp(raw.g), b: clamp(raw.b) };
}

export const hexToOklch = (hex: string) => rgbToOklch(hexToRgb(hex));
export const oklchToHex = (color: Oklch) => rgbToHex(oklchToRgb(color));
export const oklchToHsla = (color: Oklch) => rgbToHsla(oklchToRgb(color));

/* ---------- Contrast ---------- */

const relativeLuminance = ({ r, g, b }: Rgb) =>
	0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export function contrastRatio(a: string, b: string): number {
	const first = relativeLuminance(hexToRgb(a));
	const second = relativeLuminance(hexToRgb(b));
	const [light, dark] =
		first > second ? [first, second] : [second, first];
	return (light + 0.05) / (dark + 0.05);
}

// Readable foreground for a filled surface, picked the way the components do.
export const onColor = (hex: string) =>
	contrastRatio(hex, "#ffffff") >= 4.5 ? "#ffffff" : "#0a0a0a";
