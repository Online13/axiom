import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

import { aliasToDir } from "./project.ts";
import {
	ALIAS_OF,
	DEFAULT_ALIASES,
	VARIANT_OF,
	type ProjectConfig,
	type RegistryFile,
	type RegistryItem,
} from "./types.ts";

type PlannedFile = {
	item: RegistryItem;
	source: string;
	destination: string;
	createOnly: boolean;
};

export type OverwriteAnswer = "yes" | "no" | "all" | "none";

export type CopyOptions = {
	/** Items the user asked for. Their dependencies already in the project are kept as they are. */
	requested: Set<string>;
	/**
	 * What to do when a requested file exists and differs:
	 * - `ask`: call `confirm` for each file;
	 * - `always`: overwrite without asking (`--overwrite`);
	 * - `force`: overwrite dependencies too (watch mode, where the project is a copy of the registry).
	 * `createOnly` files are never overwritten, whatever the mode.
	 */
	overwrite: "ask" | "always" | "force";
	confirm?: (path: string) => Promise<OverwriteAnswer>;
	/** Last change to a file's content before it's compared and written. */
	transform?: (destination: string, content: string) => string;
};

export type CopyResult = {
	written: string[];
	unchanged: string[];
	/** Existing files left untouched: dependencies, `createOnly` files, and declined overwrites. */
	kept: { path: string; reason: "dependency" | "owned" | "declined" }[];
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
	const variant = VARIANT_OF[config.styling];
	const files: PlannedFile[] = [];
	const dependencies = new Set<string>();

	for (const item of items) {
		if (item.variants && !item.variants[variant]) {
			throw new Error(`"${item.name}" has no ${variant} variant yet.`);
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

		const sets = [
			item,
			item.variants?.[variant] ?? {},
			(config.icons && item.iconSources?.[config.icons]) || {},
			(config.navigation && item.navigationSources?.[config.navigation]) ||
				{},
		];
		const dir = aliasToDir(cwd, config.aliases[ALIAS_OF[item.type]]);

		for (const set of sets) {
			for (const dependency of set.dependencies ?? [])
				dependencies.add(dependency);
			for (const file of set.files ?? []) {
				files.push({ item, ...locate(file, registryRoot, cwd, dir) });
			}
		}
	}

	const seen = new Map<string, PlannedFile>();
	for (const file of files) {
		const other = seen.get(file.destination);
		if (other) {
			throw new Error(
				`${relative(cwd, file.destination)} would be written by both "${other.item.name}" and "${file.item.name}". File names must be unique within a layer.`,
			);
		}
		seen.set(file.destination, file);
	}

	return { files, dependencies: [...dependencies] };
}

function locate(
	file: RegistryFile,
	registryRoot: string,
	cwd: string,
	dir: string,
) {
	if (typeof file === "string") {
		return {
			source: join(registryRoot, file),
			destination: join(dir, basename(file)),
			createOnly: false,
		};
	}
	return {
		source: join(registryRoot, file.path),
		destination: file.target
			? resolve(cwd, file.target)
			: join(dir, basename(file.path)),
		createOnly: file.createOnly === true,
	};
}

/** Maps the registry's default aliases to the project's. */
export function projectAliases(config: ProjectConfig) {
	return (Object.keys(DEFAULT_ALIASES) as (keyof typeof DEFAULT_ALIASES)[])
		.map((name) => [DEFAULT_ALIASES[name], config.aliases[name]] as const)
		.sort(([a], [b]) => b.length - a.length);
}

/**
 * Rewrites the imports of a registry file for the project:
 * - default aliases become the project's aliases;
 * - relative imports to a file of the same item become `./<name>`, since the item is flattened.
 */
function rewriteImports(
	code: string,
	file: PlannedFile,
	itemFiles: PlannedFile[],
	config: ProjectConfig,
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
				next = "./" + stripExtension(basename(sibling.destination));
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

function stripExtension(path: string) {
	const extension = extname(path);
	return CODE_EXTENSIONS.includes(extension)
		? path.slice(0, -extension.length)
		: path;
}

export async function copyItems(
	items: RegistryItem[],
	config: ProjectConfig,
	registryRoot: string,
	cwd: string,
	options: CopyOptions,
): Promise<CopyResult> {
	const { files, dependencies } = plan(items, config, registryRoot, cwd);
	const result: CopyResult = {
		written: [],
		unchanged: [],
		kept: [],
		dependencies,
	};
	let overwrite = options.overwrite;
	let declineAll = false;

	// Every file is read, rewritten and decided on before anything is written,
	// so an error in one file leaves the project untouched.
	const writes: { file: PlannedFile; content: string; path: string }[] = [];

	for (const file of files) {
		if (!existsSync(file.source)) {
			throw new Error(
				`"${file.item.name}" lists ${file.source}, which doesn't exist.`,
			);
		}

		let content = readFileSync(file.source, "utf8");
		if (CODE_EXTENSIONS.includes(extname(file.source))) {
			const itemFiles = files.filter((other) => other.item === file.item);
			content = rewriteImports(content, file, itemFiles, config);
		}
		if (options.transform)
			content = options.transform(file.destination, content);

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
			if (overwrite !== "force" && !options.requested.has(file.item.name)) {
				result.kept.push({ path, reason: "dependency" });
				continue;
			}
			if (overwrite === "ask") {
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

	for (const { file, content, path } of writes) {
		mkdirSync(dirname(file.destination), { recursive: true });
		writeFileSync(file.destination, content);
		result.written.push(path);
	}

	return result;
}
