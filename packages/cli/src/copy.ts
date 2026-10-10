import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
	basename,
	dirname,
	extname,
	join,
	relative,
	resolve,
	sep,
} from "node:path";

import { format } from "./format.ts";
import { inlineStyles } from "./inline.ts";
import { aliasToDir } from "./project.ts";
import {
	ALIAS_OF,
	DEFAULT_ALIASES,
	THEME_COMPONENTS_DIR,
	isCssStyling,
	itemFolder,
	stripVariant,
	variantOf,
	type FileSet,
	type ProjectConfig,
	type RegistryFile,
	type RegistryItem,
	type Styling,
} from "./types.ts";

type PlannedFile = {
	item: RegistryItem;
	/** The registry file to copy, or `""` for a file the CLI generates (a barrel). */
	source: string;
	destination: string;
	createOnly: boolean;
	/** The item folder the file lands in, when its layer is foldered and it has no fixed `target`. */
	folder?: string;
	/** Content of a generated file, written instead of reading `source`. */
	content?: string;
	/** The styles file of the project's variant, written into this component. */
	styles?: string;
	/** How the registry addresses this file, and what that becomes in the project. */
	address?: { from: string; to: string };
};

const BARREL = "index.ts";
/**
 * `button.styles.<variant>.tsx`: what a component reads from its variant. It isn't copied: the
 * project has one variant, so the file is written into the component it belongs to.
 */
const STYLES_FILE = /\.styles\.tsx?$/;

function isStylesFile(file: RegistryFile) {
	return STYLES_FILE.test(stripVariant(pathOf(file)));
}

/** The styles file among `files` that `component` imports as `./<name>.styles`. */
export function stylesFileOf(component: string, files: RegistryFile[]) {
	const base = stripExtension(component);
	return files
		.map(pathOf)
		.find(
			(path) =>
				isStylesFile(path) &&
				stripExtension(stripVariant(path)) === `${base}.styles`,
		);
}

function pathOf(file: RegistryFile) {
	return typeof file === "string" ? file : file.path;
}

export type OverwriteAnswer = "yes" | "no" | "all" | "none";

export type CopyOptions = {
	/** Items the user asked for. Their dependencies already in the project are kept as they are. */
	requested: Set<string>;
	/**
	 * What to do when a requested file exists and differs:
	 * - `ask`: call `confirm` for each file;
	 * - `always`: overwrite without asking (`--overwrite`), except theme files, which hold the
	 *   project's customizations: those are still asked about;
	 * - `force`: overwrite dependencies too (watch mode, where the project is a copy of the registry).
	 * `createOnly` files are never overwritten, whatever the mode.
	 */
	overwrite: "ask" | "always" | "force";
	confirm?: (path: string) => Promise<OverwriteAnswer>;
	/**
	 * Decides on every differing file at once (`sync`), in place of `requested` and `overwrite`:
	 * it gets the files that exist and differ, and returns the paths to overwrite.
	 */
	select?: (differing: DifferingFile[]) => Promise<Set<string>>;
	/** Last change to a file's content before it's compared and written. */
	transform?: (destination: string, content: string) => string;
};

/** A file of the project that differs from the registry: `path` is relative to the project root. */
export type DifferingFile = { path: string; destination: string };

export type CopyResult = {
	written: string[];
	unchanged: string[];
	/**
	 * Existing files left untouched: dependencies, `createOnly` files, declined overwrites, and the
	 * ones `select` left out.
	 */
	kept: {
		path: string;
		reason: "dependency" | "owned" | "declined" | "unselected";
	}[];
	dependencies: string[];
};

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const IMPORT =
	/(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(['"])([^'"]+)\2/g;

/** Where every file of `items` lands in the project, for the configured styling. */
function plan(
	items: RegistryItem[],
	config: ProjectConfig,
	registryRoot: string,
	cwd: string,
) {
	const files: PlannedFile[] = [];
	const dependencies = new Set<string>();

	for (const item of items) {
		if (item.variants && !variantOf(item, config.styling)) {
			throw new Error(
				`"${item.name}" has no ${config.styling} variant yet.`,
			);
		}

		if (item.iconSources && !config.icons) {
			throw new Error(
				`"${item.name}" needs an icon source: set "icons" in axiom.json.`,
			);
		}
		if (item.iconSources && config.icons && !item.iconSources[config.icons]) {
			throw new Error(
				`"${item.name}" doesn't support the "${config.icons}" icon source.`,
			);
		}

		if (item.navigationSources && !config.navigation) {
			throw new Error(
				`"${item.name}" needs a navigation library: set "navigation" in axiom.json.`,
			);
		}
		if (
			item.navigationSources &&
			config.navigation &&
			!item.navigationSources[config.navigation]
		) {
			throw new Error(
				`"${item.name}" doesn't support "${config.navigation}" navigation.`,
			);
		}

		const own = sets(item, config);
		for (const set of own) {
			for (const dependency of set.dependencies ?? [])
				dependencies.add(dependency);
		}

		const folder = folderOf(item, config);

		const all = own.flatMap((set) => set.files ?? []);
		const cssTokens = cssTokensOf(item, config.styling);
		if (cssTokens) {
			files.push({
				item,
				source: join(registryRoot, cssTokens),
				destination: join(
					aliasToDir(cwd, config.aliases.theme),
					THEME_COMPONENTS_DIR,
					`${item.name}.css`,
				),
				createOnly: false,
			});
		}
		for (const file of all) {
			if (isStylesFile(file)) continue;
			// The component reads its tokens from the CSS: the TypeScript ones stay out.
			if (cssTokens && item.tokens === pathOf(file)) continue;
			const styles = stylesFileOf(pathOf(file), all);
			files.push({
				item,
				...locate(file, item, config, registryRoot, cwd, folder),
				...(styles && { styles: join(registryRoot, styles) }),
			});
		}
	}

	const seen = new Map<string, PlannedFile>();
	for (const file of files) {
		const other = seen.get(file.destination);
		if (other) {
			throw new Error(
				`${relative(cwd, file.destination)} would be written by both "${other.item.name}" and "${file.item.name}". File names must be unique within an item's folder.`,
			);
		}
		seen.set(file.destination, file);
	}

	files.push(...barrels(files, config));

	return {
		files,
		dependencies: [...dependencies],
		addresses: addresses(files),
	};
}

/**
 * One `index.ts` per foldered item, re-exporting its files. It is what makes
 * `@/components/ui/button` resolve once the item is a folder; the item's own files always import
 * each other directly, so the barrel is never part of a cycle.
 */
function barrels(files: PlannedFile[], config: ProjectConfig): PlannedFile[] {
	const byFolder = new Map<string, PlannedFile[]>();
	for (const file of files) {
		if (!file.folder) continue;
		if (!CODE_EXTENSIONS.includes(extname(file.destination))) continue;
		const dir = dirname(file.destination);
		byFolder.set(dir, [...(byFolder.get(dir) ?? []), file]);
	}

	return [...byFolder].map(([dir, group]) => {
		const item = group[0].item;
		const names = group
			.map((file) => stripExtension(basename(file.destination)))
			.sort((a, b) =>
				// The file named after the item comes first: it is what the barrel is for.
				a === item.name ? -1 : b === item.name ? 1 : a.localeCompare(b),
			);

		return {
			item,
			source: "",
			destination: join(dir, BARREL),
			createOnly: false,
			content:
				`// Generated by axiom, so "${config.aliases[ALIAS_OF[item.type]]}/${item.name}" resolves to this folder.\n` +
				names.map((name) => `export * from "./${name}";`).join("\n") +
				"\n",
		};
	});
}

/** The file sets of `item` that apply to the project: its own, plus the ones its config selects. */
export function sets(
	item: RegistryItem,
	config: Pick<ProjectConfig, "styling" | "icons" | "navigation">,
): FileSet[] {
	return [
		item,
		variantSet(item, config.styling),
		(config.icons && item.iconSources?.[config.icons]) || {},
		(config.navigation && item.navigationSources?.[config.navigation]) || {},
	];
}

/** The files and dependencies of the variant a styling uses. */
export function variantSet(item: RegistryItem, styling: Styling): FileSet {
	const variant = variantOf(item, styling);
	return (variant && item.variants?.[variant]) || {};
}

/** The CSS tokens of `item` for the project's styling, when it reads its tokens from CSS. */
export function cssTokensOf(item: RegistryItem, styling: Styling) {
	return isCssStyling(styling) ? item.cssTokens?.[styling] : undefined;
}

/**
 * The folder `item` gets inside its alias directory, or `undefined` when its files stay flat.
 * Only the files landing in that folder count: the tokens file goes to the theme, and `as` and
 * `target` files place themselves.
 */
export function folderOf(item: RegistryItem, config: ProjectConfig) {
	const own = sets(item, config)
		.flatMap((set) => set.files ?? [])
		.filter(
			(file) => placement(file, item) === "alias" && !isStylesFile(file),
		);
	return itemFolder(item, own.length);
}

/** Which rule decides a file's destination. */
function placement(file: RegistryFile, item: RegistryItem) {
	const path = typeof file === "string" ? file : file.path;
	if (typeof file !== "string" && file.target) return "target" as const;
	if (typeof file !== "string" && file.as) return "as" as const;
	if (item.tokens === path) return "tokens" as const;
	return "alias" as const;
}

function locate(
	file: RegistryFile,
	item: RegistryItem,
	config: ProjectConfig,
	registryRoot: string,
	cwd: string,
	folder: string | undefined,
) {
	const path = typeof file === "string" ? file : file.path;
	const source = join(registryRoot, path);
	const createOnly = typeof file !== "string" && file.createOnly === true;
	const alias = ALIAS_OF[item.type];
	const aliasDir = () => aliasToDir(cwd, config.aliases[alias]);
	const from = registryAddress(file, item);

	switch (placement(file, item)) {
		case "target":
			// A fixed destination, relative to the project root, ignoring aliases.
			return {
				source,
				destination: resolve(cwd, (file as { target: string }).target),
				createOnly,
			};

		case "as": {
			// The file places itself inside its alias folder, subfolder included.
			const as = (file as { as: string }).as;
			return {
				source,
				destination: join(aliasDir(), as),
				createOnly,
				address: {
					from,
					to: join(config.aliases[alias], stripIndex(stripExtension(as))),
				},
			};
		}

		case "tokens":
			// The theme is the only reader of a tokens file, so it is where it lives.
			return {
				source,
				destination: join(
					aliasToDir(cwd, config.aliases.theme),
					THEME_COMPONENTS_DIR,
					item.name + extname(path),
				),
				createOnly,
				address: {
					from,
					to: `${config.aliases.theme}/${THEME_COMPONENTS_DIR}/${item.name}`,
				},
			};

		default: {
			// A file named after its variant (`input-classes.uniwind.ts`) is the only one of its
			// name in a project: it lands without the suffix.
			const name = stripVariant(basename(path));
			return {
				source,
				destination: join(aliasDir(), folder ?? "", name),
				createOnly,
				folder,
				address: {
					from,
					to: `${config.aliases[alias]}${folder ? `/${folder}` : ""}/${stripExtension(name)}`,
				},
			};
		}
	}
}

/**
 * How registry sources import a file: one flat namespace per alias, keyed by file name
 * (`@/components/ui/icons`), or the `as` path (`@/theme/components`).
 */
export function registryAddress(file: RegistryFile, item: RegistryItem) {
	const path = typeof file === "string" ? file : file.path;
	const alias = DEFAULT_ALIASES[ALIAS_OF[item.type]];
	if (typeof file !== "string" && file.as) {
		return join(alias, stripIndex(stripExtension(file.as)));
	}
	return `${alias}/${stripExtension(stripVariant(basename(path)))}`;
}

/** Maps the registry's default aliases to the project's. */
export function projectAliases(config: ProjectConfig) {
	return (Object.keys(DEFAULT_ALIASES) as (keyof typeof DEFAULT_ALIASES)[])
		.map((name) => [DEFAULT_ALIASES[name], config.aliases[name]] as const)
		.sort(([a], [b]) => b.length - a.length);
}

/**
 * Rewrites the imports of a registry file for the project:
 * - an alias import of a registry file becomes where that file now lives;
 * - any other default alias becomes the project's alias;
 * - a relative import to a file of the same item is recomputed from its new folder.
 */
function rewriteImports(
	code: string,
	file: PlannedFile,
	itemFiles: PlannedFile[],
	config: ProjectConfig,
	addresses: Map<string, string | null>,
) {
	const aliases = projectAliases(config);

	return code.replace(
		IMPORT,
		(match, keyword: string, quote: string, specifier: string) => {
			let next = specifier;

			if (specifier.startsWith("./") || specifier.startsWith("../")) {
				const target = resolve(dirname(file.source), specifier);
				const sibling = itemFiles.find(
					(other) =>
						stripExtension(other.source) === stripExtension(target),
				);
				if (!sibling) {
					throw new Error(
						`${file.source}: "${specifier}" isn't a file of "${file.item.name}". Import other items through an alias.`,
					);
				}
				// Both files may have moved apart, so the path is recomputed, not just renamed.
				const path = relative(
					dirname(file.destination),
					stripExtension(sibling.destination),
				)
					.split(sep)
					.join("/");
				next = path.startsWith(".") ? path : `./${path}`;
			} else if (addresses.has(specifier)) {
				const address = addresses.get(specifier) ?? null;
				if (address === null) {
					throw new Error(
						`${file.source}: "${specifier}" is claimed by more than one item. Import the file through its item folder.`,
					);
				}
				next = address;
			} else {
				for (const [from, to] of aliases) {
					if (specifier === from || specifier.startsWith(from + "/")) {
						next = to + specifier.slice(from.length);
						break;
					}
				}
			}

			return `${keyword}${quote}${next}${quote}`;
		},
	);
}

/**
 * Where each registry file is addressed from, mapped to where it now lives in the project.
 *
 * Registry sources address every file in one flat namespace (`@/components/ui/icons`), which is
 * also what the registry's own tsconfig paths declare. Folders exist only in the project, so the
 * CLI is what turns an address into a path. An address claimed by two items is left out: importing
 * it then fails with a clear message instead of resolving to the wrong file.
 */
function addresses(files: PlannedFile[]) {
	const found = new Map<string, string | null>();

	for (const { address } of files) {
		if (!address) continue;
		const { from, to } = address;
		found.set(from, found.has(from) && found.get(from) !== to ? null : to);
	}

	return found;
}

/** `theme/components/index` addresses the folder itself, `theme/components`. */
function stripIndex(path: string) {
	return path.endsWith("/index") ? path.slice(0, -"/index".length) : path;
}

function stripExtension(path: string) {
	const extension = extname(path);
	return CODE_EXTENSIONS.includes(extension)
		? path.slice(0, -extension.length)
		: path;
}

/** `component` with the styles file of its variant written into it. */
export function inlineComponent(
	content: string,
	component: string,
	styles: string,
) {
	return inlineStyles(content, readFileSync(styles, "utf8"), {
		stylesModule: `./${stripExtension(stripVariant(basename(styles)))}`,
		componentModule: `./${stripExtension(basename(component))}`,
		stylesFile: styles,
	});
}

export async function copyItems(
	items: RegistryItem[],
	config: ProjectConfig,
	registryRoot: string,
	cwd: string,
	options: CopyOptions,
): Promise<CopyResult> {
	const { files, dependencies, addresses } = plan(
		items,
		config,
		registryRoot,
		cwd,
	);
	const result: CopyResult = {
		written: [],
		unchanged: [],
		kept: [],
		dependencies,
	};
	let overwrite = options.overwrite;
	let declineAll = false;
	const themeDir = aliasToDir(cwd, config.aliases.theme) + sep;

	// Every file is read, rewritten and decided on before anything is written,
	// so an error in one file leaves the project untouched.
	const writes: { file: PlannedFile; content: string; path: string }[] = [];
	const differing: typeof writes = [];

	for (const file of files) {
		if (file.source && !existsSync(file.source)) {
			throw new Error(
				`"${file.item.name}" lists ${file.source}, which doesn't exist.`,
			);
		}

		let content = file.content ?? readFileSync(file.source, "utf8");
		if (file.styles)
			content = inlineComponent(content, file.source, file.styles);
		if (file.source && CODE_EXTENSIONS.includes(extname(file.source))) {
			const itemFiles = files.filter((other) => other.item === file.item);
			content = rewriteImports(content, file, itemFiles, config, addresses);
		}
		if (options.transform)
			content = options.transform(file.destination, content);
		// A merged component is written by the CLI, not copied: it is formatted like the project.
		if (file.styles) content = await format(content, file.destination);

		const path = relative(cwd, file.destination);

		if (existsSync(file.destination)) {
			// Skip identical files so Metro doesn't reload for nothing in watch mode.
			if (readFileSync(file.destination, "utf8") === content) {
				result.unchanged.push(path);
				continue;
			}
			if (file.createOnly) {
				result.kept.push({ path, reason: "owned" });
				continue;
			}
			if (options.select) {
				differing.push({ file, content, path });
				continue;
			}
			if (overwrite !== "force" && !options.requested.has(file.item.name)) {
				result.kept.push({ path, reason: "dependency" });
				continue;
			}
			const isTheme = file.destination.startsWith(themeDir);
			if (
				overwrite === "ask" ||
				(isTheme && options.overwrite === "always")
			) {
				const answer =
					declineAll || !options.confirm
						? "no"
						: await options.confirm(path);
				if (answer === "all") overwrite = "always";
				if (answer === "none") declineAll = true;
				if (answer === "no" || answer === "none") {
					result.kept.push({ path, reason: "declined" });
					continue;
				}
			}
		}

		writes.push({ file, content, path });
	}

	if (options.select && differing.length) {
		const selected = await options.select(
			differing.map(({ file, path }) => ({
				path,
				destination: file.destination,
			})),
		);
		for (const write of differing) {
			if (selected.has(write.path)) writes.push(write);
			else result.kept.push({ path: write.path, reason: "unselected" });
		}
	}

	for (const { file, content, path } of writes) {
		mkdirSync(dirname(file.destination), { recursive: true });
		writeFileSync(file.destination, content);
		result.written.push(path);
	}

	return result;
}
