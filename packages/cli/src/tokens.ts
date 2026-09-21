import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

import { aliasToDir } from "./project.ts";
import {
	THEME_COMPONENTS_DIR,
	type Aliases,
	type RegistryItem,
} from "./types.ts";

// Every component's tokens file is copied to the theme's `components/` folder as `<component>.ts`.
// That folder's index.ts has two marked regions the CLI fills, one line per component:
//
//   // axiom:imports:start
//   import { buttonTokens } from './button';
//   // axiom:imports:end
//   ...
//     // axiom:components:start
//     button: buttonTokens(colors),
//     // axiom:components:end

export const COMPONENTS_FILE = join(THEME_COMPONENTS_DIR, "index.ts");

const IMPORTS_START = "// axiom:imports:start";
const IMPORTS_END = "// axiom:imports:end";
const COMPONENTS_START = "// axiom:components:start";
const COMPONENTS_END = "// axiom:components:end";

export type TokenEntry = {
	/** Key in `Components`, e.g. `bottomSheet`. */
	key: string;
	/** Exported function, e.g. `bottomSheetTokens`. */
	exportName: string;
	/** Import specifier, e.g. `@/components/ui/bottom-sheet-tokens`. */
	specifier: string;
};

const camelCase = (name: string) =>
	name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export function tokenEntries(
	items: RegistryItem[],
	aliases: Aliases,
): TokenEntry[] {
	return items
		.filter(
			(item): item is RegistryItem & { tokens: string } =>
				item.tokens !== undefined,
		)
		.map((item) => {
			const key = camelCase(item.name);
			return {
				key,
				exportName: `${key}Tokens`,
				// The tokens file sits next to the index.ts that imports it.
				specifier: `./${item.name}`,
			};
		})
		.sort((a, b) => a.key.localeCompare(b.key));
}

/** Adds the missing entries to the marked regions. Lines already there, and anything else, are left as they are. */
export function registerTokens(source: string, entries: TokenEntry[]): string {
	for (const marker of [
		IMPORTS_START,
		IMPORTS_END,
		COMPONENTS_START,
		COMPONENTS_END,
	]) {
		if (!source.includes(marker)) {
			throw new Error(
				`The theme's ${COMPONENTS_FILE} has no "${marker}" marker. It predates per-component tokens: run "axiom add theme" and overwrite it.`,
			);
		}
	}

	let next = source;
	for (const { key, exportName, specifier } of entries) {
		if (
			!new RegExp(`\\b${exportName}\\b`).test(
				region(next, IMPORTS_START, IMPORTS_END),
			)
		) {
			next = insertBefore(
				next,
				IMPORTS_END,
				`import { ${exportName} } from '${specifier}';`,
			);
		}
		if (
			!new RegExp(`^\\s*${key}:`, "m").test(
				region(next, COMPONENTS_START, COMPONENTS_END),
			)
		) {
			next = insertBefore(
				next,
				COMPONENTS_END,
				`${key}: ${exportName}(colors),`,
			);
		}
	}
	return next;
}

function region(source: string, start: string, end: string) {
	return source.slice(source.indexOf(start), source.indexOf(end));
}

/** Inserts `line` above the marker, with the marker's indentation. */
function insertBefore(source: string, marker: string, line: string) {
	const index = source.indexOf(marker);
	const lineStart = source.lastIndexOf("\n", index) + 1;
	const indent = source.slice(lineStart, index);
	return (
		source.slice(0, lineStart) +
		indent +
		line +
		"\n" +
		source.slice(lineStart)
	);
}

/** Entries whose tokens file is in the project, so the theme never imports a missing file. */
export function projectTokenEntries(
	items: RegistryItem[],
	aliases: Aliases,
	cwd: string,
): TokenEntry[] {
	return tokenEntries(items, aliases).filter((entry) => {
		const item = items.find(
			(candidate) => camelCase(candidate.name) === entry.key,
		)!;
		return existsSync(
			join(
				aliasToDir(cwd, aliases.theme),
				THEME_COMPONENTS_DIR,
				item.name + extname(item.tokens!),
			),
		);
	});
}

/** Registers the tokens of `items` in the project's theme. Returns the updated file, if any. */
export function syncTokens(
	items: RegistryItem[],
	aliases: Aliases,
	cwd: string,
): string | undefined {
	const entries = projectTokenEntries(items, aliases, cwd);
	if (!entries.length) return undefined;

	const file = join(aliasToDir(cwd, aliases.theme), COMPONENTS_FILE);
	if (!existsSync(file)) {
		throw new Error(
			`${relative(cwd, file)} is missing: add "theme" before components with tokens.`,
		);
	}

	const source = readFileSync(file, "utf8");
	const next = registerTokens(source, entries);
	if (next === source) return undefined;

	writeFileSync(file, next);
	return relative(cwd, file);
}
