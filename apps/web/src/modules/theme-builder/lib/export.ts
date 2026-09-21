// Builds the export payload from a theme and the choices made in the export
// modal. Every format reads the same derived data as the previews, so what is
// downloaded is what was on screen.

import { paletteSteps, type ColorScheme } from "@docs/lib/tokens";
import { hslaToHex } from "./color";
import { fontStack } from "./fonts";
import {
	buildPalette,
	buildScheme,
	radiusValues,
	seedNames,
	seeds,
	type Theme,
} from "./theme";

export const exportFormats = {
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
	/** Eleven-step ramps for the five seeds. */
	palette: boolean;
	/** Semantic roles for the light scheme. */
	light: boolean;
	/** Semantic roles for the dark scheme. */
	dark: boolean;
	radius: boolean;
	typography: boolean;
};

export const defaultExportOptions: ExportOptions = {
	format: "ts",
	palette: true,
	light: true,
	dark: true,
	radius: true,
	typography: true,
};

export const slugify = (value: string) =>
	value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
	"theme";

const camel = (value: string) => value.replace(/-(.)/g, (_, c) => c.toUpperCase());

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
		hue: seeds[name].hue,
		steps: paletteSteps.map((step) => ({
			step,
			hex: hslaToHex(generated[name][step]),
		})),
	}));
};

/* ---------- Formats ---------- */

function toJson(theme: Theme, options: ExportOptions): string {
	const payload: Record<string, unknown> = { name: theme.name, seeds: theme.seeds };

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
		payload.typography = { family: theme.font, stack: fontStack(theme.font) };

	return JSON.stringify(payload, null, 2);
}

function toTs(theme: Theme, options: ExportOptions): string {
	const lines = [`// ${theme.name} — generated with the Axiom theme builder.`, ""];

	if (options.palette) {
		lines.push("export const palette = {");
		for (const { hue, steps } of ramps(theme)) {
			lines.push(`\t${hue}: {`);
			for (const { step, hex } of steps) lines.push(`\t\t${step}: "${hex}",`);
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
			"export const typography = {",
			`\tfontFamily: "${fontStack(theme.font)}",`,
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

	if (options.typography) shared.push(`\t--ax-font: ${fontStack(theme.font)};`);

	const blocks = [`/* ${theme.name} — generated with the Axiom theme builder. */`];

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
	if (options.dark)
		blocks.push(scheme("dark", '[data-scheme="dark"], .dark'));

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
		lines.push(`\t--font-sans: ${fontStack(theme.font)};`);

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
			"\ttypography: {",
			`\t\tfontFamily: "${theme.font}",`,
			"\t},",
		);

	lines.push("} as const;");
	return lines.join("\n");
}

const builders: Record<ExportFormat, (t: Theme, o: ExportOptions) => string> = {
	json: toJson,
	ts: toTs,
	css: toCss,
	tailwind: toTailwind,
	native: toNative,
};

export const buildExport = (theme: Theme, options: ExportOptions): string =>
	builders[options.format](theme, options);

export const exportFilename = (theme: Theme, options: ExportOptions) =>
	`${slugify(theme.name)}-theme.${exportFormats[options.format].extension}`;

export function downloadExport(theme: Theme, options: ExportOptions) {
	const blob = new Blob([buildExport(theme, options)], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = exportFilename(theme, options);
	anchor.click();
	URL.revokeObjectURL(url);
}
