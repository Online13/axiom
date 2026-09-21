import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { aliasToDir, hasDependency } from "./project.ts";
import { confirm, log, muted, note, select, text } from "./ui.ts";
import { resolveItems } from "./registry.ts";
import {
	DEFAULT_ALIASES,
	STYLINGS,
	VARIANT_OF,
	type AliasName,
	type Aliases,
	type Registry,
	type Styling,
} from "./types.ts";

export const SCHEMA_URL = "https://axiom.dev/schema.json";

/** What `init` copies: the foundations and the core primitives. `theme` brings `tokens` in as an internal dependency. */
export const INIT_ITEMS = ["theme", "slot", "tappable", "portal", "overlay"];

/** The one dependency a styling tool needs. Installed once by `init`, not by every `add`. */
export const STYLING_DEPENDENCY: Record<Styling, string | undefined> = {
	stylesheet: undefined,
	unistyles: "react-native-unistyles",
	nativewind: "nativewind",
	uniwind: "uniwind",
};

const DESCRIPTIONS: Record<Styling, string> = {
	stylesheet: "React Native StyleSheet. Nothing to install.",
	unistyles: "Styles compiled by react-native-unistyles.",
	nativewind: "Tailwind classes through NativeWind.",
	uniwind: "Tailwind classes through Uniwind.",
};

const TSCONFIG_FILE = "tsconfig.json";

/**
 * Stylings the registry can actually set up a project with: every item `init` copies has to offer
 * their variant. Keeps `init` from asking a question it can't honour.
 */
export function availableStylings(registry: Registry): Styling[] {
	const items = resolveItems(registry, INIT_ITEMS);
	return STYLINGS.filter((styling) => {
		const variant = VARIANT_OF[styling];
		return items.every((item) => !item.variants || item.variants[variant]);
	});
}

export function parseStyling(value: string, available: Styling[]): Styling {
	if (!available.includes(value as Styling)) {
		throw new Error(`--styling must be one of ${available.join(", ")}.`);
	}
	return value as Styling;
}

export async function askStyling(available: Styling[]): Promise<Styling> {
	return select({
		message: "Which styling tool does your project use?",
		options: available.map((styling) => ({
			value: styling,
			label: styling,
			hint: DESCRIPTIONS[styling],
		})),
	});
}

/** The `paths` key an alias needs in tsconfig.json: `@/components/ui` → `@/*`. */
function pathsKey(alias: string): string {
	return `${alias.split("/")[0]}/*`;
}

/** Aliases the project's tsconfig.json doesn't resolve, in the order of `DEFAULT_ALIASES`. */
function unresolved(cwd: string, aliases: Aliases): AliasName[] {
	return (Object.keys(aliases) as AliasName[]).filter((name) => {
		try {
			aliasToDir(cwd, aliases[name]);
			return false;
		} catch {
			return true;
		}
	});
}

/** The `paths` the project's tsconfig.json declares. Nothing to pick an alias from when it is empty. */
function declaredPaths(cwd: string): string[] {
	const file = join(cwd, TSCONFIG_FILE);
	if (!existsSync(file)) return [];
	try {
		return Object.keys(
			JSON.parse(readFileSync(file, "utf8")).compilerOptions?.paths ?? {},
		);
	} catch {
		return [];
	}
}

/** The indentation of a JSON file, so rewriting it doesn't reformat the whole thing. */
function indentOf(source: string): string | number {
	const match = source.match(/\n([ \t]+)\S/);
	if (!match) return "\t";
	return match[1].startsWith("\t") ? match[1] : match[1].length;
}

/**
 * Adds the missing `paths` entries to the project's tsconfig.json, mapping each prefix to its source
 * folder. Returns false when the file can't be rewritten safely (missing, or not plain JSON).
 */
function addPaths(cwd: string, keys: string[], target: string): boolean {
	const file = join(cwd, TSCONFIG_FILE);
	if (!existsSync(file)) return false;

	const source = readFileSync(file, "utf8");
	let tsconfig: {
		compilerOptions?: { paths?: Record<string, string[]> };
	};
	try {
		tsconfig = JSON.parse(source);
	} catch {
		// A tsconfig with comments: rewriting it would drop them.
		return false;
	}

	const compilerOptions = (tsconfig.compilerOptions ??= {});
	const paths = (compilerOptions.paths ??= {});
	for (const key of keys) paths[key] = [target];

	writeFileSync(file, JSON.stringify(tsconfig, null, indentOf(source)) + "\n");
	log.success(`wrote ${relative(cwd, file)}`);
	return true;
}

/**
 * Makes every alias resolve through the project's tsconfig.json, before anything is copied: a half
 * set up project is worse than none. Offers to add the missing `paths` entries, and falls back to
 * asking for aliases the project already resolves.
 */
export async function ensureAliases(
	cwd: string,
	aliases: Aliases,
	interactive: boolean,
): Promise<Aliases> {
	let missing = unresolved(cwd, aliases);
	if (!missing.length) return aliases;

	const keys = [...new Set(missing.map((name) => pathsKey(aliases[name])))];
	// Expo's own template puts the app in src/ when it is there.
	const target = existsSync(join(cwd, "src")) ? "./src/*" : "./*";
	const entry = keys.map((key) => `"${key}": ["${target}"]`).join(", ");

	log.warn(
		`${TSCONFIG_FILE} doesn't resolve ${missing.map((name) => aliases[name]).join(", ")}.`,
	);

	if (!interactive) {
		throw new Error(
			`Add ${entry} to "compilerOptions.paths" in ${TSCONFIG_FILE}, then run init again.`,
		);
	}

	if (
		await confirm({ message: `Add ${entry} to its "compilerOptions.paths"?` })
	) {
		if (addPaths(cwd, keys, target)) {
			missing = unresolved(cwd, aliases);
			if (!missing.length) return aliases;
		} else {
			log.warn(
				`Couldn't rewrite ${TSCONFIG_FILE}. Pick aliases it already resolves instead.`,
			);
		}
	}

	// Asking for another alias only helps if the project resolves one at all.
	const declared = declaredPaths(cwd);
	if (!declared.length) {
		throw new Error(
			`Add ${entry} to "compilerOptions.paths" in ${TSCONFIG_FILE}, then run init again.`,
		);
	}

	const next = { ...aliases };
	for (const name of missing) {
		next[name] = await text({
			message: `Alias for "${name}" ${muted(`(${TSCONFIG_FILE} resolves ${declared.join(", ")})`)}`,
			initialValue: next[name],
			validate: (value) => {
				try {
					aliasToDir(cwd, value ?? "");
					return undefined;
				} catch (error) {
					return (error as Error).message;
				}
			},
		});
	}
	return next;
}

/** `init` runs at the root of an app, not next to one. */
export function assertReactNativeProject(cwd: string) {
	if (!existsSync(join(cwd, "package.json"))) {
		throw new Error(
			`No package.json in ${cwd}. Run init at the root of your app.`,
		);
	}
	if (!hasDependency(cwd, "react-native") && !hasDependency(cwd, "expo")) {
		throw new Error(
			`${cwd} doesn't depend on react-native or expo. Axiom sets up an existing app, it doesn't create one.`,
		);
	}
}

/** The prefix every entry of `DEFAULT_ALIASES` is written with. */
const DEFAULT_PREFIX = "@/";

/**
 * The import prefix the project already writes its own imports with (`~/`, from `"~/*"`), when it
 * isn't the one the defaults assume. Only a single segment prefix can stand in for `@/`: a deeper
 * `paths` entry maps one folder, not the whole source tree.
 */
function declaredPrefix(cwd: string): string | undefined {
	const keys = declaredPaths(cwd).filter((key) => /^[^/]+\/\*$/.test(key));
	if (!keys.length || keys.includes(`${DEFAULT_PREFIX}*`)) return undefined;
	return keys[0].slice(0, -1);
}

/**
 * The aliases `init` suggests. Built from the project rather than fixed: suggesting `@/theme` to a
 * project that imports through `~/` is five corrections to make before anything can be copied.
 */
export function defaultAliases(cwd: string): Aliases {
	const prefix = declaredPrefix(cwd);
	if (!prefix) return { ...DEFAULT_ALIASES };

	const aliases = { ...DEFAULT_ALIASES };
	for (const name of Object.keys(aliases) as AliasName[]) {
		aliases[name] = prefix + aliases[name].slice(DEFAULT_PREFIX.length);
	}
	return aliases;
}

/**
 * Shows where the files are about to land, and asks once. Answering yes is the whole prompt for a
 * project the defaults already fit; only a no unfolds into one question per alias, each prefilled
 * with the suggestion so it is edited rather than typed.
 */
export async function confirmAliases(
	aliases: Aliases,
	interactive: boolean,
): Promise<Aliases> {
	if (!interactive) return aliases;

	const names = Object.keys(aliases) as AliasName[];
	note(
		names
			.map((name) => `${muted(name.padEnd(12))}${aliases[name]}`)
			.join("\n"),
		"Where the files will go",
	);

	if (await confirm({ message: "Use these paths?" })) return aliases;

	const next = { ...aliases };
	for (const name of names) {
		next[name] = await text({
			message: `Path for "${name}"`,
			initialValue: next[name],
			validate: (value) => (value?.trim() ? undefined : "Enter a path."),
		});
	}
	return next;
}
