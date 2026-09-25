// Turns seven seed colors into the whole Axiom theme: eleven-step ramps, the
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
	onColor,
	rgbToOklch,
} from "./color";

export type PaletteHue = keyof typeof palette;
export type Ramp = Record<PaletteStep, string>;
export type GeneratedPalette = Record<SeedName, Ramp>;

// The hues the semantic roles are built from — one seed each, like the core
// colors of a Material theme. Primary is the only one without a palette hue of
// its own: it borrows the curve of the closest hue (see `primaryReference`).
export const seeds = {
	neutral: {
		hue: "gray",
		label: "Neutral",
		usage: "Surfaces, text, borders — the whole grey ramp",
	},
	primary: {
		hue: "primary",
		label: "Primary",
		usage: "Solid buttons, selected chips and tabs, checked controls",
	},
	highlight: {
		hue: "yellow",
		label: "Highlight",
		usage: "The brand fill — featured badges",
	},
	link: {
		hue: "blue",
		label: "Link",
		usage: "Links, focus rings, info",
	},
	success: { hue: "green", label: "Success", usage: "Confirmations" },
	warning: { hue: "orange", label: "Warning", usage: "Cautions" },
	error: { hue: "red", label: "Error", usage: "Errors, destructive actions" },
} as const satisfies Record<
	string,
	{ hue: PaletteHue | "primary"; label: string; usage: string }
>;

export type SeedName = keyof typeof seeds;
export const seedNames = Object.keys(seeds) as SeedName[];

/** The seeds that regenerate a hue of the shipped palette. */
type PaletteSeed = Exclude<SeedName, "primary">;
const paletteSeedNames = seedNames.filter(
	(name): name is PaletteSeed => name !== "primary",
);

// Maps a palette hue back to the seed that generates it.
const hueToSeed = Object.fromEntries(
	paletteSeedNames.map((name) => [seeds[name].hue, name]),
) as Record<PaletteHue, SeedName>;

// Primary ships as the darkest neutral: black actions on white, white on black.
export const defaultSeeds = {
	...Object.fromEntries(
		paletteSeedNames.map((name) => [
			name,
			hslaToHex(palette[seeds[name].hue][500]),
		]),
	),
	primary: hslaToHex(palette.gray[950]),
} as Record<SeedName, string>;

/**
 * A primary with almost no chroma is an "ink" primary, like the default: it
 * flips to the lightest neutral in dark mode instead of lightening its own hue.
 */
export const isInk = (hex: string) => hexToOklch(hex).c < 0.03;

// The palette hue whose step 500 sits closest on the color wheel.
function primaryReference(hex: string): PaletteHue {
	if (isInk(hex)) return "gray";
	const { h } = hexToOklch(hex);
	const distance = (hue: PaletteHue) => {
		const d = Math.abs(rgbToOklch(hslaToRgb(palette[hue][500])).h - h) % 360;
		return Math.min(d, 360 - d);
	};
	return (Object.keys(palette) as PaletteHue[])
		.filter((hue) => hue !== "gray" && hue !== "brown")
		.reduce((best, hue) => (distance(hue) < distance(best) ? hue : best));
}

/* ---------- Shape and type ---------- */

export const radiusScales = {
	sharp: { label: "Sharp", factor: 0 },
	subtle: { label: "Subtle", factor: 0.5 },
	default: { label: "Default", factor: 1 },
	round: { label: "Round", factor: 1.6 },
} as const;

export type RadiusScale = keyof typeof radiusScales;

type RadiusKey = "sm" | "md" | "lg" | "xl" | "full";

// The corner of the controls, written into their component tokens. `rounded`
// is what Axiom ships: md controls, pill chips.
export const controlShapes = {
	square: { label: "Square", control: "sm", chip: "sm" },
	rounded: { label: "Rounded", control: "md", chip: "full" },
	pill: { label: "Pill", control: "full", chip: "full" },
} as const satisfies Record<
	string,
	{ label: string; control: RadiusKey; chip: RadiusKey }
>;

export type ControlShape = keyof typeof controlShapes;

/** The components whose tokens carry a radius, and which slot drives it. */
export const shapedComponents = [
	{ name: "button", key: "button", slot: "control" },
	{ name: "icon-button", key: "iconButton", slot: "control" },
	{ name: "input", key: "input", slot: "control" },
	{ name: "segmented-control", key: "segmentedControl", slot: "control" },
	{ name: "chip", key: "chip", slot: "chip" },
	{ name: "floating-button", key: "floatingButton", slot: "chip" },
] as const;

/** The typeface a theme uses — a Google Fonts family, or `System`. */
export type FontFamily = string;

export type Theme = {
	name: string;
	seeds: Record<SeedName, string>;
	radius: RadiusScale;
	controls: ControlShape;
	fonts: { heading: FontFamily; body: FontFamily };
};

export const defaultTheme: Theme = {
	name: "Axiom",
	seeds: defaultSeeds,
	radius: "default",
	controls: "rounded",
	fonts: { heading: SYSTEM_FONT, body: SYSTEM_FONT },
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

const radiusPx = (theme: Theme, key: RadiusKey) =>
	key === "full" ? 999 : radiusValues(theme.radius)[key];

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
			buildRamp(
				theme.seeds[name],
				name === "primary"
					? primaryReference(theme.seeds.primary)
					: seeds[name as PaletteSeed].hue,
			),
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
	/** `gray.600`, `primary.500`, or `—` for the raw white and black values. */
	source: string;
	/** The raw value, `gray.600` or `hsla(…)`: what the exported colors.ts writes. */
	value: string;
};

const WHITE = "hsla(0, 0%, 100%, 1)";

const kebab = (value: string) =>
	value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const resolve = (value: string, generated: GeneratedPalette): string => {
	if (value.startsWith("hsla(")) return hslaToHex(value);
	const [hue, step] = value.split(".") as [PaletteHue | "primary", string];
	const seed = hue === "primary" ? "primary" : hueToSeed[hue];
	return hslaToHex(generated[seed][Number(step) as PaletteStep]);
};

// Primary reads its own ramp. An ink primary keeps the shipped behavior:
// the seed in light, the lightest neutral in dark.
function primaryValue(
	generated: GeneratedPalette,
	scheme: ColorScheme,
	key: string,
	shipped: string,
): string {
	const seed = hslaToHex(generated.primary[500]);
	const on = (step: PaletteStep) =>
		onColor(hslaToHex(generated.primary[step])) === "#ffffff"
			? WHITE
			: "gray.950";

	if (isInk(seed)) {
		if (scheme === "dark") return shipped;
		if (key === "default")
			return seed === defaultSeeds.primary ? shipped : "primary.500";
		if (key === "on") return on(500);
		return shipped;
	}

	const steps = {
		light: { default: 500, pressed: 600, subtle: 100 },
		dark: { default: 400, pressed: 300, subtle: 900 },
	} as const;
	const own = steps[scheme];
	if (key === "on") return on(own.default);
	return `primary.${own[key as keyof typeof own]}`;
}

export function buildScheme(
	generated: GeneratedPalette,
	scheme: ColorScheme,
): Swatch[] {
	return (Object.keys(colorRoles) as ColorRole[]).flatMap((role) =>
		Object.entries(colorRoles[role]).map(([key, entry]) => {
			const shipped = (entry as { light: string; dark: string })[scheme];
			const value =
				role === "primary"
					? primaryValue(generated, scheme, key, shipped)
					: shipped;
			return {
				role,
				key,
				variable: `--ax-${role}-${kebab(key)}`,
				usage: (entry as { usage: string }).usage,
				hex: resolve(value, generated),
				source: value.startsWith("hsla(") ? "—" : value,
				value,
			};
		}),
	);
}

/**
 * The seed behind a preview variable: `--ax-link-500` names its seed, and a
 * role like `--ax-content-muted` reads it off the palette step it resolves to.
 * The primary and highlight roles always belong to their own seed, even when
 * an ink primary borrows a neutral step. Raw white and black count as neutral.
 */
export function seedForVariable(
	variable: string,
	theme: Theme,
	scheme: ColorScheme,
): SeedName | null {
	const ramp = variable.match(/^--ax-([a-z]+)-\d+$/)?.[1];
	if (ramp && ramp in seeds) return ramp as SeedName;

	const swatch = buildScheme(buildPalette(theme), scheme).find(
		(entry) => entry.variable === variable,
	);
	if (!swatch) return null;
	if (swatch.role === "primary" || swatch.role === "highlight")
		return swatch.role;
	if (swatch.source === "—") return "neutral";
	const [hue] = swatch.source.split(".") as [PaletteHue | "primary"];
	return hue === "primary" ? "primary" : hueToSeed[hue];
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
		label: "Label on a primary button",
		on: "primary.on",
		over: "primary.default",
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
	{
		label: "Label on the highlight fill",
		on: "highlight.on",
		over: "highlight.default",
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
				.map(
					(step) =>
						`--ax-${name}-${step}:${hslaToHex(generated[name][step])};`,
				)
				.join(""),
		)
		.join("");

	// preview.css declares the radius tokens on `.ax-screen` itself, so the
	// override has to land on the same element, not on an ancestor.
	const { control, chip } = controlShapes[theme.controls];
	const shape = [
		`--ax-radius-sm:${sm}px;--ax-radius-md:${md}px;--ax-radius-lg:${lg}px;--ax-radius-xl:${xl}px;`,
		`--ax-radius-control:${radiusPx(theme, control)}px;--ax-radius-chip:${radiusPx(theme, chip)}px;`,
		`--ax-font:${fontStack(theme.fonts.body)};--ax-font-heading:${fontStack(theme.fonts.heading)};`,
	].join("");

	return [
		`[data-ax-preview]{${ramps}}`,
		`[data-ax-preview] .ax-screen{${shape}}`,
		`[data-ax-preview][data-scheme='light']{color-scheme:light;${block("light")}}`,
		`[data-ax-preview][data-scheme='dark']{color-scheme:dark;${block("dark")}}`,
	].join("");
}

/* ---------- Loading a theme ---------- */

const hex = (value: unknown) =>
	typeof value === "string" && /^#?[0-9a-f]{6}$/i.test(value)
		? `#${value.replace("#", "").toLowerCase()}`
		: undefined;

/**
 * Fills whatever an older draft, saved theme or link lacks. The `accent` seed
 * of earlier versions is the link seed, and their single `font` is both faces.
 */
export function normalizeTheme(raw: unknown): Theme {
	const value = (raw ?? {}) as Record<string, unknown>;
	const rawSeeds = (value.seeds ?? {}) as Record<string, unknown>;
	const rawFonts = (value.fonts ?? {}) as Record<string, unknown>;
	const font = typeof value.font === "string" ? value.font : undefined;
	const text = (field: unknown, fallback: string) =>
		typeof field === "string" && field ? field : fallback;

	return {
		name: text(value.name, defaultTheme.name),
		seeds: Object.fromEntries(
			seedNames.map((name) => [
				name,
				hex(rawSeeds[name]) ??
					(name === "link" ? hex(rawSeeds.accent) : undefined) ??
					defaultSeeds[name],
			]),
		) as Record<SeedName, string>,
		radius:
			typeof value.radius === "string" && value.radius in radiusScales
				? (value.radius as RadiusScale)
				: defaultTheme.radius,
		controls:
			typeof value.controls === "string" && value.controls in controlShapes
				? (value.controls as ControlShape)
				: defaultTheme.controls,
		fonts: {
			heading: text(rawFonts.heading, font ?? defaultTheme.fonts.heading),
			body: text(rawFonts.body, font ?? defaultTheme.fonts.body),
		},
	};
}

/* ---------- URL state ---------- */

export function encodeTheme(theme: Theme): string {
	const params = new URLSearchParams();
	for (const name of seedNames)
		params.set(name, theme.seeds[name].replace("#", ""));
	params.set("radius", theme.radius);
	params.set("controls", theme.controls);
	params.set("heading", theme.fonts.heading);
	params.set("body", theme.fonts.body);
	if (theme.name !== defaultTheme.name) params.set("name", theme.name);
	return params.toString();
}

export function decodeTheme(search: string): Theme {
	const params = new URLSearchParams(search);
	const get = (key: string) => params.get(key) ?? undefined;
	return normalizeTheme({
		name: get("name"),
		seeds: Object.fromEntries(
			[...seedNames, "accent"].map((name) => [name, get(name)]),
		),
		radius: get("radius"),
		controls: get("controls"),
		font: get("font"),
		fonts: { heading: get("heading"), body: get("body") },
	});
}

export { oklchToHex, hexToOklch };
