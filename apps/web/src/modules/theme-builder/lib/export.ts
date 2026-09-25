// Builds the export payload from a theme and the choices made in the export
// modal. Every format reads the same derived data as the previews, so what is
// downloaded is what was on screen.

import { paletteSteps, type ColorScheme } from "@docs/lib/tokens";
import { hslaToHex } from "./color";
import { SYSTEM_FONT, fontStack } from "./fonts";
import {
	buildPalette,
	buildScheme,
	controlShapes,
	radiusValues,
	seedNames,
	seeds,
	shapedComponents,
	type Theme,
} from "./theme";

// The registry files a project copies. The Axiom export rewrites these, so
// what you download is the shipped file with your values in it.
import tokensSource from "../../../../../../packages/registry/foundations/tokens/tokens.ts?raw";
import colorsSource from "../../../../../../packages/registry/foundations/theme/colors.ts?raw";
import buttonSource from "../../../../../../packages/registry/atoms/button/button-tokens.ts?raw";
import iconButtonSource from "../../../../../../packages/registry/atoms/icon-button/icon-button-tokens.ts?raw";
import inputSource from "../../../../../../packages/registry/atoms/input/input-tokens.ts?raw";
import segmentedControlSource from "../../../../../../packages/registry/atoms/segmented-control/segmented-control-tokens.ts?raw";
import chipSource from "../../../../../../packages/registry/atoms/chip/chip-tokens.ts?raw";
import floatingButtonSource from "../../../../../../packages/registry/atoms/floating-button/floating-button-tokens.ts?raw";

const componentSources: Record<
	(typeof shapedComponents)[number]["name"],
	string
> = {
	button: buttonSource,
	"icon-button": iconButtonSource,
	input: inputSource,
	"segmented-control": segmentedControlSource,
	chip: chipSource,
	"floating-button": floatingButtonSource,
};

export const exportFormats = {
	axiom: {
		label: "Axiom theme files",
		extension: "ts",
		language: "typescript",
	},
	json: { label: "JSON", extension: "json", language: "json" },
	ts: { label: "TypeScript tokens", extension: "ts", language: "typescript" },
	css: { label: "CSS variables", extension: "css", language: "css" },
	tailwind: { label: "Tailwind v4 theme", extension: "css", language: "css" },
	native: {
		label: "React Native theme",
		extension: "ts",
		language: "typescript",
	},
} as const;

export type ExportFormat = keyof typeof exportFormats;

export type ExportOptions = {
	format: ExportFormat;
	/** Eleven-step ramps for the seeds. */
	palette: boolean;
	/** Semantic roles for the light scheme. */
	light: boolean;
	/** Semantic roles for the dark scheme. */
	dark: boolean;
	radius: boolean;
	typography: boolean;
};

export const defaultExportOptions: ExportOptions = {
	format: "axiom",
	palette: true,
	light: true,
	dark: true,
	radius: true,
	typography: true,
};

export const slugify = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "") || "theme";

const camel = (value: string) =>
	value.replace(/-(.)/g, (_, c) => c.toUpperCase());

const roleEntries = (theme: Theme, scheme: ColorScheme) =>
	buildScheme(buildPalette(theme), scheme).map((swatch) => ({
		// `--ax-content-muted` → `content-muted`
		name: swatch.variable.slice("--ax-".length),
		variable: swatch.variable,
		path: `${swatch.role}.${swatch.key}`,
		role: swatch.role,
		key: swatch.key,
		hex: swatch.hex,
	}));

const ramps = (theme: Theme) => {
	const generated = buildPalette(theme);
	return seedNames.map((name) => ({
		name,
		// Primary has no hue of its own in the palette: it keeps its seed name.
		hue: seeds[name].hue as string,
		steps: paletteSteps.map((step) => ({
			step,
			hex: hslaToHex(generated[name][step]),
		})),
	}));
};

/* ---------- Formats ---------- */

function toJson(theme: Theme, options: ExportOptions): string {
	const payload: Record<string, unknown> = {
		name: theme.name,
		seeds: theme.seeds,
	};

	if (options.palette)
		payload.palette = Object.fromEntries(
			ramps(theme).map(({ hue, steps }) => [
				hue,
				Object.fromEntries(steps.map(({ step, hex }) => [step, hex])),
			]),
		);

	const colors: Record<string, unknown> = {};
	for (const scheme of ["light", "dark"] as const)
		if (options[scheme])
			colors[scheme] = Object.fromEntries(
				roleEntries(theme, scheme).map((entry) => [entry.path, entry.hex]),
			);
	if (Object.keys(colors).length) payload.colors = colors;

	if (options.radius) payload.radius = radiusValues(theme.radius);
	if (options.typography)
		payload.fonts = {
			heading: {
				family: theme.fonts.heading,
				stack: fontStack(theme.fonts.heading),
			},
			body: { family: theme.fonts.body, stack: fontStack(theme.fonts.body) },
		};
	payload.controls = theme.controls;

	return JSON.stringify(payload, null, 2);
}

function toTs(theme: Theme, options: ExportOptions): string {
	const lines = [
		`// ${theme.name} — generated with the Axiom theme builder.`,
		"",
	];

	if (options.palette) {
		lines.push("export const palette = {");
		for (const { hue, steps } of ramps(theme)) {
			lines.push(`\t${hue}: {`);
			for (const { step, hex } of steps)
				lines.push(`\t\t${step}: "${hex}",`);
			lines.push("\t},");
		}
		lines.push("};", "");
	}

	for (const scheme of ["light", "dark"] as const) {
		if (!options[scheme]) continue;
		lines.push(`export const ${scheme} = {`);
		let role = "";
		for (const entry of roleEntries(theme, scheme)) {
			if (entry.role !== role) {
				if (role) lines.push("\t},");
				lines.push(`\t${entry.role}: {`);
				role = entry.role;
			}
			lines.push(`\t\t${entry.key}: "${entry.hex}",`);
		}
		if (role) lines.push("\t},");
		lines.push("};", "");
	}

	if (options.radius) {
		const { sm, md, lg, xl } = radiusValues(theme.radius);
		lines.push(
			"export const radius = {",
			"\tnone: 0,",
			`\tsm: ${sm},`,
			`\tmd: ${md},`,
			`\tlg: ${lg},`,
			`\txl: ${xl},`,
			"\tfull: 9999,",
			"};",
			"",
		);
	}

	if (options.typography)
		lines.push(
			"export const fonts = {",
			`\theading: "${fontStack(theme.fonts.heading)}",`,
			`\tbody: "${fontStack(theme.fonts.body)}",`,
			"};",
			"",
		);

	return lines.join("\n").trimEnd();
}

function toCss(theme: Theme, options: ExportOptions): string {
	const shared: string[] = [];

	if (options.palette)
		for (const { name, steps } of ramps(theme))
			for (const { step, hex } of steps)
				shared.push(`\t--ax-${name}-${step}: ${hex};`);

	if (options.radius) {
		const { sm, md, lg, xl } = radiusValues(theme.radius);
		shared.push(
			`\t--ax-radius-sm: ${sm}px;`,
			`\t--ax-radius-md: ${md}px;`,
			`\t--ax-radius-lg: ${lg}px;`,
			`\t--ax-radius-xl: ${xl}px;`,
		);
	}

	if (options.typography)
		shared.push(
			`\t--ax-font: ${fontStack(theme.fonts.body)};`,
			`\t--ax-font-heading: ${fontStack(theme.fonts.heading)};`,
		);

	const blocks = [
		`/* ${theme.name} — generated with the Axiom theme builder. */`,
	];

	const scheme = (name: ColorScheme, selector: string) =>
		[
			`${selector} {`,
			`\tcolor-scheme: ${name};`,
			...roleEntries(theme, name).map(
				(entry) => `\t${entry.variable}: ${entry.hex};`,
			),
			"}",
		].join("\n");

	if (shared.length) blocks.push([":root {", ...shared, "}"].join("\n"));
	if (options.light) blocks.push(scheme("light", ":root"));
	if (options.dark) blocks.push(scheme("dark", '[data-scheme="dark"], .dark'));

	return blocks.join("\n\n");
}

function toTailwind(theme: Theme, options: ExportOptions): string {
	const lines = [
		`/* ${theme.name} — generated with the Axiom theme builder. */`,
		'@import "tailwindcss";',
		"",
		"@theme {",
	];

	if (options.palette)
		for (const { name, steps } of ramps(theme))
			for (const { step, hex } of steps)
				lines.push(`\t--color-${name}-${step}: ${hex};`);

	if (options.light)
		for (const entry of roleEntries(theme, "light"))
			lines.push(`\t--color-${entry.name}: ${entry.hex};`);

	if (options.radius) {
		const { sm, md, lg, xl } = radiusValues(theme.radius);
		lines.push(
			`\t--radius-sm: ${sm}px;`,
			`\t--radius-md: ${md}px;`,
			`\t--radius-lg: ${lg}px;`,
			`\t--radius-xl: ${xl}px;`,
		);
	}

	if (options.typography)
		lines.push(
			`\t--font-sans: ${fontStack(theme.fonts.body)};`,
			`\t--font-heading: ${fontStack(theme.fonts.heading)};`,
		);

	lines.push("}");

	if (options.dark) {
		lines.push("", "@layer base {", "\t.dark {");
		for (const entry of roleEntries(theme, "dark"))
			lines.push(`\t\t--color-${entry.name}: ${entry.hex};`);
		lines.push("\t}", "}");
	}

	return lines.join("\n");
}

function toNative(theme: Theme, options: ExportOptions): string {
	const lines = [
		`// ${theme.name} — generated with the Axiom theme builder.`,
		"",
		"export const theme = {",
	];

	for (const scheme of ["light", "dark"] as const) {
		if (!options[scheme]) continue;
		lines.push(`\t${scheme}: {`);
		for (const entry of roleEntries(theme, scheme))
			lines.push(`\t\t${camel(entry.name)}: "${entry.hex}",`);
		lines.push("\t},");
	}

	if (options.palette) {
		lines.push("\tpalette: {");
		for (const { name, steps } of ramps(theme)) {
			lines.push(`\t\t${name}: {`);
			for (const { step, hex } of steps)
				lines.push(`\t\t\t"${step}": "${hex}",`);
			lines.push("\t\t},");
		}
		lines.push("\t},");
	}

	if (options.radius) {
		const { sm, md, lg, xl } = radiusValues(theme.radius);
		lines.push(
			"\tradius: {",
			"\t\tnone: 0,",
			`\t\tsm: ${sm},`,
			`\t\tmd: ${md},`,
			`\t\tlg: ${lg},`,
			`\t\txl: ${xl},`,
			"\t\tfull: 9999,",
			"\t},",
		);
	}

	if (options.typography)
		lines.push(
			"\tfonts: {",
			`\t\theading: "${theme.fonts.heading}",`,
			`\t\tbody: "${theme.fonts.body}",`,
			"\t},",
		);

	lines.push("} as const;");
	return lines.join("\n");
}

/* ---------- Axiom theme files ---------- */

export type ExportFile = { path: string; code: string };

const generatedBy = (theme: Theme) =>
	`// ${theme.name} — generated with the Axiom theme builder.`;

/** Replaces the `{ … }` body that follows `start` in `source`. */
function replaceBlock(source: string, start: string, body: string): string {
	const from = source.indexOf(start);
	if (from < 0) throw new Error(`The registry file has no "${start}".`);
	const open = source.indexOf("{", from + start.length - 1);
	let depth = 0;
	for (let i = open; i < source.length; i++) {
		if (source[i] === "{") depth++;
		if (source[i] === "}" && --depth === 0)
			return source.slice(0, open) + body + source.slice(i + 1);
	}
	throw new Error(`Unbalanced block after "${start}".`);
}

const fontValue = (family: string) =>
	family === SYSTEM_FONT ? "undefined" : JSON.stringify(family);

function tokensFile(theme: Theme): string {
	const generated = buildPalette(theme);
	let code = tokensSource;

	// Each palette seed rewrites its hue; the other hues stay as shipped.
	for (const name of seedNames) {
		if (name === "primary") continue;
		const hue = seeds[name].hue;
		const steps = paletteSteps
			.map((step) => `\t\t${step}: "${generated[name][step]}",`)
			.join("\n");
		code = replaceBlock(code, `\n\t${hue}: {`, `{\n${steps}\n\t}`);
	}

	const { sm, md, lg, xl } = radiusValues(theme.radius);
	code = replaceBlock(
		code,
		"export const radius = {",
		`{\n\tnone: 0,\n\tsm: ${sm},\n\tmd: ${md},\n\tlg: ${lg},\n\txl: ${xl},\n\tfull: 9999,\n}`,
	);

	code = replaceBlock(
		code,
		"export const fonts: Fonts = {",
		`{\n\theading: ${fontValue(theme.fonts.heading)},\n\tbody: ${fontValue(theme.fonts.body)},\n}`,
	);

	const faces = [...new Set([theme.fonts.heading, theme.fonts.body])].filter(
		(family) => family !== SYSTEM_FONT,
	);
	const note = faces.length
		? `// Load ${faces.map((f) => `"${f}"`).join(" and ")} with expo-font under the names used in \`fonts\`.\n`
		: "";

	return `${generatedBy(theme)}\n${note}\n${code}`;
}

// `gray.600` → `palette.gray[600]`, `primary.500` → `primary[500]`.
const colorExpression = (value: string) => {
	if (value.startsWith("hsla(")) return JSON.stringify(value);
	const [hue, step] = value.split(".");
	return hue === "primary" ? `primary[${step}]` : `palette.${hue}[${step}]`;
};

function colorsFile(theme: Theme): string {
	const generated = buildPalette(theme);
	const block = (scheme: ColorScheme) => {
		const lines: string[] = [];
		let role = "";
		for (const swatch of buildScheme(generated, scheme)) {
			if (swatch.role !== role) {
				if (role) lines.push("\t},");
				lines.push(`\t${swatch.role}: {`);
				role = swatch.role;
			}
			lines.push(`\t\t${swatch.key}: ${colorExpression(swatch.value)},`);
		}
		lines.push("\t},");
		return lines.join("\n");
	};

	const light = block("light");
	const dark = block("dark");
	const usesPrimary = /primary\[/.test(light + dark);

	const head = colorsSource.slice(
		0,
		colorsSource.indexOf("export const lightColors"),
	);
	const primaryRamp = usesPrimary
		? [
				`// The primary ramp, generated from ${theme.seeds.primary}.`,
				"const primary = {",
				...paletteSteps.map(
					(step) => `\t${step}: "${generated.primary[step]}",`,
				),
				"};",
				"",
				"",
			].join("\n")
		: "";

	return [
		`${generatedBy(theme)}\n${head}${primaryRamp}export const lightColors = {`,
		light,
		"} satisfies ThemeColors;",
		"",
		"// Feedback and link colors use step 400 instead of 500 to stay readable on dark surfaces.",
		"export const darkColors = {",
		dark,
		"} satisfies ThemeColors;",
		"",
	].join("\n");
}

/** The component tokens files whose radius differs from the shipped one. */
function componentFiles(theme: Theme): ExportFile[] {
	const picked = controlShapes[theme.controls];
	const shipped = controlShapes.rounded;
	return shapedComponents
		.filter(({ slot }) => picked[slot] !== shipped[slot])
		.map(({ name, slot }) => ({
			path: `theme/components/${name}.ts`,
			code: componentSources[name].replace(
				/radius: tokens\.radius\.\w+,/,
				`radius: tokens.radius.${picked[slot]},`,
			),
		}));
}

const axiomFiles = (theme: Theme): ExportFile[] => [
	{ path: "theme/tokens.ts", code: tokensFile(theme) },
	{ path: "theme/colors.ts", code: colorsFile(theme) },
	...componentFiles(theme),
];

const builders: Record<
	Exclude<ExportFormat, "axiom">,
	(t: Theme, o: ExportOptions) => string
> = {
	json: toJson,
	ts: toTs,
	css: toCss,
	tailwind: toTailwind,
	native: toNative,
};

export const exportFilename = (theme: Theme, options: ExportOptions) =>
	`${slugify(theme.name)}-theme.${exportFormats[options.format].extension}`;

/**
 * Every file of an export. The Axiom format is several files dropped into the
 * project's theme folder; the others are one file each.
 */
export const buildExportFiles = (
	theme: Theme,
	options: ExportOptions,
): ExportFile[] =>
	options.format === "axiom"
		? axiomFiles(theme)
		: [
				{
					path: exportFilename(theme, options),
					code: builders[options.format](theme, options),
				},
			];

/** Whether the format reads the Include toggles. The Axiom files are always whole. */
export const usesIncludes = (format: ExportFormat) => format !== "axiom";

export function downloadFile(file: ExportFile) {
	const blob = new Blob([file.code], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = file.path.split("/").pop()!;
	anchor.click();
	URL.revokeObjectURL(url);
}
