// Turns five seed colors into the whole Axiom theme: eleven-step ramps, the
// semantic roles of both schemes, and the CSS the previews read.
//
// The ramps keep the shape of the shipped palettes (@docs/lib/tokens): a seed
// only moves lightness, chroma and hue of step 500, and every other step
// follows the reference curve, so a generated theme still looks like Axiom.

import {
	colorRoles,
	palette,
	paletteSteps,
	radius as defaultRadius,
	type ColorRole,
	type ColorScheme,
	type PaletteStep,
} from "@docs/lib/tokens";
import { SYSTEM_FONT, fontStack } from "./fonts";
import {
	hexToOklch,
	hslaToHex,
	hslaToRgb,
	oklchToHex,
	oklchToHsla,
	rgbToOklch,
} from "./color";

export type PaletteHue = keyof typeof palette;
export type Ramp = Record<PaletteStep, string>;
export type GeneratedPalette = Record<SeedName, Ramp>;

// The five hues the semantic roles are built from — one seed each, like the
// core colors of a Material theme.
export const seeds = {
	neutral: {
		hue: "gray",
		label: "Neutral",
		usage: "Surfaces, text, borders — the whole grey ramp",
	},
	accent: {
		hue: "blue",
		label: "Accent",
		usage: "Links, focus rings, selection, info",
	},
	success: { hue: "green", label: "Success", usage: "Confirmations" },
	warning: { hue: "orange", label: "Warning", usage: "Cautions" },
	error: { hue: "red", label: "Error", usage: "Errors, destructive actions" },
} as const satisfies Record<
	string,
	{ hue: PaletteHue; label: string; usage: string }
>;

export type SeedName = keyof typeof seeds;
export const seedNames = Object.keys(seeds) as SeedName[];

// Maps a palette hue back to the seed that generates it.
const hueToSeed = Object.fromEntries(
	seedNames.map((name) => [seeds[name].hue, name]),
) as Record<PaletteHue, SeedName>;

export const defaultSeeds = Object.fromEntries(
	seedNames.map((name) => [name, hslaToHex(palette[seeds[name].hue][500])]),
) as Record<SeedName, string>;

/* ---------- Shape and type ---------- */

export const radiusScales = {
	sharp: { label: "Sharp", factor: 0 },
	subtle: { label: "Subtle", factor: 0.5 },
	default: { label: "Default", factor: 1 },
	round: { label: "Round", factor: 1.6 },
} as const;

export type RadiusScale = keyof typeof radiusScales;

/** The typeface a theme uses — a Google Fonts family, or `System`. */
export type FontFamily = string;

export type Theme = {
	name: string;
	seeds: Record<SeedName, string>;
	radius: RadiusScale;
	font: FontFamily;
};

export const defaultTheme: Theme = {
	name: "Axiom",
	seeds: defaultSeeds,
	radius: "default",
	font: SYSTEM_FONT,
};

export const radiusValues = (scale: RadiusScale) => {
	const { factor } = radiusScales[scale];
	return {
		sm: Math.round(defaultRadius.sm * factor),
		md: Math.round(defaultRadius.md * factor),
		lg: Math.round(defaultRadius.lg * factor),
		xl: Math.round(defaultRadius.xl * factor),
	};
};

/* ---------- Ramps ---------- */

const stepIndex = (step: PaletteStep) => paletteSteps.indexOf(step);
const anchor = stepIndex(500);

// How much of the seed's own lightness shift a step inherits: all of it at 500,
// a sixth of it at the ends, so the ramp keeps usable extremes.
const weight = (step: PaletteStep) =>
	1 - 0.85 * (Math.abs(stepIndex(step) - anchor) / anchor);

export function buildRamp(seedHex: string, hue: PaletteHue): Ramp {
	const reference = paletteSteps.map((step) => ({
		step,
		oklch: rgbToOklch(hslaToRgb(palette[hue][step])),
	}));
	const base = reference[anchor].oklch;
	const seed = hexToOklch(seedHex);

	const lightnessShift = seed.l - base.l;
	const chromaRatio = base.c < 0.004 ? 1 : seed.c / base.c;
	const hueShift = seed.h - base.h;

	const ramp = {} as Ramp;
	let previous = 1;

	for (const { step, oklch } of reference) {
		const w = weight(step);
		const lightness =
			step === 500
				? seed.l
				: Math.min(0.995, Math.max(0.02, oklch.l + lightnessShift * w));
		const chroma =
			step === 500
				? seed.c
				: Math.min(
						0.37,
						base.c < 0.004
							? oklch.c + (seed.c - base.c) * w * 0.35
							: oklch.c * chromaRatio,
					);

		// Ramps must stay monotonic: a step is never lighter than the one above it.
		const corrected = Math.min(lightness, previous - 0.012);
		previous = corrected;

		ramp[step] = oklchToHsla({
			l: corrected,
			c: Math.max(0, chroma),
			h: (((step === 500 ? seed.h : oklch.h + hueShift) % 360) + 360) % 360,
		});
	}

	return ramp;
}

export const buildPalette = (theme: Theme): GeneratedPalette =>
	Object.fromEntries(
		seedNames.map((name) => [
			name,
			buildRamp(theme.seeds[name], seeds[name].hue),
		]),
	) as GeneratedPalette;

/* ---------- Semantic roles ---------- */

export type Swatch = {
	role: ColorRole;
	key: string;
	/** `--ax-content-muted` */
	variable: string;
	usage: string;
	hex: string;
	/** `gray.600`, or `—` for the raw white and black values. */
	source: string;
};

const kebab = (value: string) =>
	value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const resolve = (value: string, generated: GeneratedPalette): string => {
	if (value.startsWith("hsla(")) return hslaToHex(value);
	const [hue, step] = value.split(".") as [PaletteHue, string];
	return hslaToHex(
		generated[hueToSeed[hue]][Number(step) as PaletteStep],
	);
};

export function buildScheme(
	generated: GeneratedPalette,
	scheme: ColorScheme,
): Swatch[] {
	return (Object.keys(colorRoles) as ColorRole[]).flatMap((role) =>
		Object.entries(colorRoles[role]).map(([key, entry]) => {
			const value = (entry as { light: string; dark: string; usage: string })[
				scheme
			];
			return {
				role,
				key,
				variable: `--ax-${role}-${kebab(key)}`,
				usage: (entry as { usage: string }).usage,
				hex: resolve(value, generated),
				source: value.startsWith("hsla(") ? "—" : value,
			};
		}),
	);
}

/* ---------- Contrast ---------- */

// The pairs worth watching when a seed moves: text on its surface, and the
// feedback colors on their own subtle backgrounds.
export const contrastPairs = [
	{
		label: "Body text on screen",
		on: "content.default",
		over: "background.default",
	},
	{
		label: "Secondary text on screen",
		on: "content.muted",
		over: "background.default",
	},
	{
		label: "Link on screen",
		on: "content.link",
		over: "background.default",
	},
	{
		label: "Label on inverse surface",
		on: "content.inverse",
		over: "background.inverse",
	},
	{
		label: "Error text on its alert",
		on: "feedback.error",
		over: "feedback.errorSubtle",
	},
] as const;

// WCAG 2.2: 7 for AAA body text, 4.5 for AA, 3 for large text and UI shapes.
export const contrastGrade = (ratio: number) =>
	ratio >= 7
		? { label: "AAA", tone: "pass" }
		: ratio >= 4.5
			? { label: "AA", tone: "pass" }
			: ratio >= 3
				? { label: "AA large", tone: "warn" }
				: { label: "Fail", tone: "fail" };

/* ---------- CSS the previews read ---------- */

// Same contract as docs/components/preview/preview-theme.astro: one block per
// scheme, scoped to `[data-ax-preview]`, so preview.css needs no change.
export function themeCss(theme: Theme): string {
	const generated = buildPalette(theme);
	const { sm, md, lg, xl } = radiusValues(theme.radius);

	const block = (scheme: ColorScheme) =>
		buildScheme(generated, scheme)
			.map((swatch) => `${swatch.variable}:${swatch.hex};`)
			.join("");

	// Palette steps too: the settings tiles and other accented surfaces use them.
	const ramps = seedNames
		.map((name) =>
			paletteSteps
				.map((step) => `--ax-${name}-${step}:${hslaToHex(generated[name][step])};`)
				.join(""),
		)
		.join("");

	// preview.css declares the radius tokens on `.ax-screen` itself, so the
	// override has to land on the same element, not on an ancestor.
	const shape = `--ax-radius-sm:${sm}px;--ax-radius-md:${md}px;--ax-radius-lg:${lg}px;--ax-radius-xl:${xl}px;--ax-font:${fontStack(theme.font)};`;

	return [
		`[data-ax-preview]{${ramps}}`,
		`[data-ax-preview] .ax-screen{${shape}}`,
		`[data-ax-preview][data-scheme='light']{color-scheme:light;${block("light")}}`,
		`[data-ax-preview][data-scheme='dark']{color-scheme:dark;${block("dark")}}`,
	].join("");
}

/* ---------- Export ---------- */

export function exportJson(theme: Theme): string {
	const generated = buildPalette(theme);
	return JSON.stringify(
		{
			name: theme.name,
			seeds: theme.seeds,
			radius: radiusValues(theme.radius),
			fontFamily: fontStack(theme.font),
			palette: Object.fromEntries(
				seedNames.map((name) => [seeds[name].hue, generated[name]]),
			),
			colors: {
				light: Object.fromEntries(
					buildScheme(generated, "light").map((s) => [
						`${s.role}.${s.key}`,
						s.hex,
					]),
				),
				dark: Object.fromEntries(
					buildScheme(generated, "dark").map((s) => [
						`${s.role}.${s.key}`,
						s.hex,
					]),
				),
			},
		},
		null,
		2,
	);
}

// A drop-in replacement for the `palette` object of the token file.
export function exportTokens(theme: Theme): string {
	const generated = buildPalette(theme);
	const ramp = (name: SeedName) =>
		[
			`\t${seeds[name].hue}: {`,
			...paletteSteps.map(
				(step) => `\t\t${step}: "${generated[name][step]}",`,
			),
			"\t},",
		].join("\n");

	const { sm, md, lg, xl } = radiusValues(theme.radius);

	return [
		`// ${theme.name} — generated with the Axiom theme builder.`,
		"export const palette = {",
		...seedNames.map(ramp),
		"};",
		"",
		"export const radius = {",
		"\tnone: 0,",
		`\tsm: ${sm},`,
		`\tmd: ${md},`,
		`\tlg: ${lg},`,
		`\txl: ${xl},`,
		"\tfull: 9999,",
		"};",
	].join("\n");
}

/* ---------- URL state ---------- */

export function encodeTheme(theme: Theme): string {
	const params = new URLSearchParams();
	for (const name of seedNames)
		params.set(name, theme.seeds[name].replace("#", ""));
	params.set("radius", theme.radius);
	params.set("font", theme.font);
	if (theme.name !== defaultTheme.name) params.set("name", theme.name);
	return params.toString();
}

export function decodeTheme(search: string): Theme {
	const params = new URLSearchParams(search);
	const hex = (name: SeedName) => {
		const value = params.get(name);
		return value && /^#?[0-9a-f]{6}$/i.test(value)
			? `#${value.replace("#", "").toLowerCase()}`
			: defaultSeeds[name];
	};
	const radius = params.get("radius");
	const font = params.get("font");

	return {
		name: params.get("name") ?? defaultTheme.name,
		seeds: Object.fromEntries(seedNames.map((name) => [name, hex(name)])) as Record<
			SeedName,
			string
		>,
		radius:
			radius && radius in radiusScales
				? (radius as RadiusScale)
				: defaultTheme.radius,
		font: font || defaultTheme.font,
	};
}

export { oklchToHex, hexToOklch };
