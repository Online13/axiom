import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { aliasToDir, hasDependency } from "./project.ts";
import { select } from "./ui.ts";
import { folderOf } from "./copy.ts";
import {
	ALIAS_OF,
	ICON_SOURCES,
	type IconSource,
	type ProjectConfig,
	type RegistryItem,
} from "./types.ts";

export const ICONS_FILE = "icons.tsx";

const DESCRIPTIONS: Record<IconSource, string> = {
	"expo-symbols":
		"SF Symbols on iOS, Material Symbols on Android. Ready to use.",
	custom: "An empty registry you fill with your own icons or any icon set.",
};

/** Sources the project can use: `expo-symbols` needs Expo. */
export function availableIconSources(cwd: string): IconSource[] {
	return ICON_SOURCES.filter(
		(source) => source !== "expo-symbols" || hasDependency(cwd, "expo"),
	);
}

export function parseIconSource(value: string, cwd: string): IconSource {
	const available = availableIconSources(cwd);
	if (!available.includes(value as IconSource)) {
		throw new Error(`--icons must be one of ${available.join(", ")}.`);
	}
	return value as IconSource;
}

export async function askIconSource(cwd: string): Promise<IconSource> {
	return select({
		message: "Where do the icons of your app come from?",
		options: availableIconSources(cwd).map((source) => ({
			value: source,
			label: source,
			hint: DESCRIPTIONS[source],
		})),
	});
}

/** Required icons of `items` missing from the project's registry, with the items that need them. */
export function missingIcons(
	items: RegistryItem[],
	allItems: RegistryItem[],
	config: ProjectConfig,
	cwd: string,
) {
	const iconItem = allItems.find((item) => item.iconSources);
	if (!iconItem) return undefined;

	const file = join(
		aliasToDir(cwd, config.aliases[ALIAS_OF[iconItem.type]]),
		folderOf(iconItem, config) ?? "",
		ICONS_FILE,
	);
	if (!existsSync(file)) return undefined;

	const source = readFileSync(file, "utf8");
	const missing = new Map<string, string[]>();

	for (const item of items) {
		for (const name of item.requiredIcons ?? []) {
			// An entry of the registry object: `close:` or `'chevron-right':`.
			const key = /^[A-Za-z_$][\w$]*$/.test(name)
				? `(?:${name}|['"]${name}['"])`
				: `['"]${name}['"]`;
			if (!new RegExp(`^\\s*${key}\\s*:`, "m").test(source)) {
				missing.set(name, [...(missing.get(name) ?? []), item.name]);
			}
		}
	}

	return missing.size ? { file: relative(cwd, file), missing } : undefined;
}
