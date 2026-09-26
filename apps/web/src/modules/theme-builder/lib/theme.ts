// Turns the Axiom palette and the choices made in the builder into the whole
// theme: the semantic roles of both schemes, and the CSS the previews read.
//
// Colors are the shipped palette (@docs/lib/tokens) as is: a role points at
// one of its steps, or at a hex picked by hand. Nothing is generated.

import {
	colorRoles,
	palette,
	paletteSteps,
	radius as defaultRadius,
	spacing as defaultSpacing,
	type ColorRole,
	type ColorScheme,
	type PaletteStep,
} from "@docs/lib/tokens";
import { SYSTEM_FONT, fontStack } from "./fonts";
import { hslaToHex } from "./color";

export type PaletteHue = keyof typeof palette;

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

// Density: one factor over the whole spacing scale, so every padding, gap and
// margin keeps its proportion to the others. Components still ask for
// `spacing[4]`; what that is depends on the theme.
export const spacingScales = {
	compact: { label: "Compact", factor: 0.75 },
	default: { label: "Default", factor: 1 },
	comfortable: { label: "Comfortable", factor: 1.25 },
	spacious: { label: "Spacious", factor: 1.5 },
} as const;

export type SpacingScale = keyof typeof spacingScales;

/** The spacing tokens at a density, `{ 0: 0, 1: 4, 2: 8, … }` at `default`. */
export const spacingValues = (scale: SpacingScale) => {
	const { factor } = spacingScales[scale];
	return Object.fromEntries(
		Object.entries(defaultSpacing).map(([step, value]) => [
			step,
			Math.round(value * factor),
		]),
	) as Record<keyof typeof defaultSpacing, number>;
};

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

/**
 * Roles set by hand, per scheme, keyed by role path:
 * `{ "content.muted": { light: "gray.700", dark: "#9a9aa0" } }`. A palette step
 * (or raw white/black) keeps the export a reference; a hex is a fixed color,
 * written out as is.
 */
export type RoleOverrides = Record<
	string,
	Partial<Record<ColorScheme, string>>
>;

export type Theme = {
	name: string;
	overrides: RoleOverrides;
	radius: RadiusScale;
	controls: ControlShape;
	spacing: SpacingScale;
	fonts: { heading: FontFamily; body: FontFamily };
};

export const defaultTheme: Theme = {
	name: "Axiom",
	overrides: {},
	radius: "default",
	controls: "rounded",
	spacing: "default",
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

/* ---------- Semantic roles ---------- */

export type Swatch = {
	role: ColorRole;
	key: string;
	/** `--ax-content-muted` */
	variable: string;
	usage: string;
	hex: string;
	/** `gray.600`, or `—` for raw values: white, black, a hex. */
	source: string;
	/** The raw value, `gray.600`, `hsla(…)` or `#rrggbb`: what the exported colors.ts writes. */
	value: string;
	/** What Axiom ships for this role. */
	auto: string;
	/** Set by hand rather than generated. */
	custom: boolean;
};

export const WHITE = "hsla(0, 0%, 100%, 1)";
export const BLACK = "hsla(0, 0%, 0%, 1)";

/**
 * Every value a role can take: the eleven steps of each palette hue, named the
 * way the shipped roles name them (`gray.600`, `blue.500`), then raw white and
 * black.
 */
export const primitives = (Object.keys(palette) as PaletteHue[]).map((hue) => ({
	hue,
	values: paletteSteps.map((step) => `${hue}.${step}`),
}));

/** The step numbers of every ramp, 50 to 950. */
export const primitiveSteps = paletteSteps;

const primitiveValues = new Set([
	...primitives.flatMap((row) => row.values),
	WHITE,
	BLACK,
]);

export const isPrimitive = (value: unknown): value is string =>
	typeof value === "string" && primitiveValues.has(value);

const HEX = /^#[0-9a-f]{6}$/;

/** A value a role can be set to: a primitive, or a lowercase `#rrggbb`. */
export const isRoleValue = (value: unknown): value is string =>
	isPrimitive(value) || (typeof value === "string" && HEX.test(value));

/** `gray.600` stays as is; raw values read `white`, `black` or their hex. */
export const primitiveLabel = (value: string) =>
	value === WHITE
		? "white"
		: value === BLACK
			? "black"
			: value.startsWith("#")
				? value.toUpperCase()
				: value;

/** Every role path, `content.muted` style. */
export const rolePaths = (Object.keys(colorRoles) as ColorRole[]).flatMap(
	(role) => Object.keys(colorRoles[role]).map((key) => `${role}.${key}`),
);

const kebab = (value: string) =>
	value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** The hex of a role value or primitive — `gray.600`, `hsla(…)`, `#rrggbb`. */
export const resolve = (value: string): string => {
	if (value.startsWith("#")) return value;
	if (value.startsWith("hsla(")) return hslaToHex(value);
	const [hue, step] = value.split(".") as [PaletteHue, string];
	return hslaToHex(palette[hue][Number(step) as PaletteStep]);
};

/** The roles of one scheme: what Axiom ships, then any hand-set role on top. */
export function buildScheme(
	scheme: ColorScheme,
	overrides: RoleOverrides = {},
): Swatch[] {
	return (Object.keys(colorRoles) as ColorRole[]).flatMap((role) =>
		Object.entries(colorRoles[role]).map(([key, entry]) => {
			const auto = (entry as { light: string; dark: string })[scheme];
			const custom = overrides[`${role}.${key}`]?.[scheme];
			const value = custom ?? auto;
			return {
				role,
				key,
				variable: `--ax-${role}-${kebab(key)}`,
				usage: (entry as { usage: string }).usage,
				hex: resolve(value),
				source: /^[a-z]+\.\d+$/.test(value) ? value : "—",
				value,
				auto,
				custom: custom !== undefined,
			};
		}),
	);
}

/** The role path a preview variable names — `--ax-content-muted` → `content.muted`. */
export const roleForVariable = (variable: string) =>
	rolePaths.find((path) => {
		const [role, key] = path.split(".");
		return `--ax-${role}-${kebab(key)}` === variable;
	});

/** The swatch a preview variable names, if it is a role. */
export const findSwatch = (swatches: Swatch[], variable: string) =>
	swatches.find((swatch) => swatch.variable === variable);

/* ---------- Contrast ---------- */

// The pairs worth watching when a role moves: text on its surface, and the
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
	const { sm, md, lg, xl } = radiusValues(theme.radius);

	const block = (scheme: ColorScheme) =>
		buildScheme(scheme, theme.overrides)
			.map((swatch) => `${swatch.variable}:${swatch.hex};`)
			.join("");

	// Palette steps too: the settings tiles and other accented surfaces use them.
	const ramps = primitives
		.flatMap(({ hue }) =>
			paletteSteps.map(
				(step) => `--ax-${hue}-${step}:${hslaToHex(palette[hue][step])};`,
			),
		)
		.join("");

	// preview.css declares the radius tokens on `.ax-screen` itself, so the
	// override has to land on the same element, not on an ancestor.
	const { control, chip } = controlShapes[theme.controls];
	const shape = [
		`--ax-radius-sm:${sm}px;--ax-radius-md:${md}px;--ax-radius-lg:${lg}px;--ax-radius-xl:${xl}px;`,
		`--ax-radius-control:${radiusPx(theme, control)}px;--ax-radius-chip:${radiusPx(theme, chip)}px;`,
		`--ax-space:${spacingScales[theme.spacing].factor}px;`,
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

/**
 * Fills whatever an older draft, saved theme or link lacks; their single `font`
 * is both faces. Seeds of earlier versions are ignored: colors are the palette.
 */
export function normalizeTheme(raw: unknown): Theme {
	const value = (raw ?? {}) as Record<string, unknown>;
	const rawFonts = (value.fonts ?? {}) as Record<string, unknown>;
	const font = typeof value.font === "string" ? value.font : undefined;
	const text = (field: unknown, fallback: string) =>
		typeof field === "string" && field ? field : fallback;

	return {
		name: text(value.name, defaultTheme.name),
		overrides: normalizeOverrides(value.overrides),
		radius:
			typeof value.radius === "string" && value.radius in radiusScales
				? (value.radius as RadiusScale)
				: defaultTheme.radius,
		controls:
			typeof value.controls === "string" && value.controls in controlShapes
				? (value.controls as ControlShape)
				: defaultTheme.controls,
		spacing:
			typeof value.spacing === "string" && value.spacing in spacingScales
				? (value.spacing as SpacingScale)
				: defaultTheme.spacing,
		fonts: {
			heading: text(rawFonts.heading, font ?? defaultTheme.fonts.heading),
			body: text(rawFonts.body, font ?? defaultTheme.fonts.body),
		},
	};
}

// Keeps only known roles set to primitives or hexes: a stale or hand-edited
// theme cannot inject arbitrary CSS through a role value.
function normalizeOverrides(raw: unknown): RoleOverrides {
	if (!raw || typeof raw !== "object") return {};
	const overrides: RoleOverrides = {};
	for (const path of rolePaths) {
		const entry = (raw as Record<string, unknown>)[path];
		if (!entry || typeof entry !== "object") continue;
		const { light, dark } = entry as Record<string, unknown>;
		const kept = {
			...(isRoleValue(light) && { light }),
			...(isRoleValue(dark) && { dark }),
		};
		if (Object.keys(kept).length) overrides[path] = kept;
	}
	return overrides;
}

/* ---------- URL state ---------- */

export function encodeTheme(theme: Theme): string {
	const params = new URLSearchParams();
	params.set("radius", theme.radius);
	params.set("controls", theme.controls);
	params.set("spacing", theme.spacing);
	params.set("heading", theme.fonts.heading);
	params.set("body", theme.fonts.body);
	if (theme.name !== defaultTheme.name) params.set("name", theme.name);
	if (Object.keys(theme.overrides).length)
		params.set("roles", JSON.stringify(theme.overrides));
	return params.toString();
}

export function decodeTheme(search: string): Theme {
	const params = new URLSearchParams(search);
	const get = (key: string) => params.get(key) ?? undefined;
	let overrides: unknown;
	try {
		overrides = JSON.parse(get("roles") ?? "{}");
	} catch {
		overrides = {};
	}
	return normalizeTheme({
		overrides,
		name: get("name"),
		radius: get("radius"),
		controls: get("controls"),
		spacing: get("spacing"),
		font: get("font"),
		fonts: { heading: get("heading"), body: get("body") },
	});
}
