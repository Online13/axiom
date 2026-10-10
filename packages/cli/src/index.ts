#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readFileSync,
	watch,
	writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";

import { copyItems, type CopyOptions, type OverwriteAnswer } from "./copy.ts";
import { askIconSource, missingIcons, parseIconSource } from "./icons.ts";
import {
	INIT_ITEMS,
	SCHEMA_URL,
	STYLING_DEPENDENCY,
	askStyling,
	assertReactNativeProject,
	availableStylings,
	confirmAliases,
	defaultAliases,
	ensureAliases,
	parseStyling,
} from "./init.ts";
import { type InstallMode, resolveMissingDependencies } from "./install.ts";
import {
	CONFIG_FILE,
	aliasToDir,
	configExists,
	detectNavigation,
	missingDependencies,
	parseNavigation,
	readConfig,
	writeConfig,
} from "./project.ts";
import { readRegistry, resolveItems } from "./registry.ts";
import { buildStandalone } from "./standalone.ts";
import {
	COMPONENTS_FILE,
	projectTokenEntries,
	syncCssTokens,
	registerTokens,
	syncTokens,
} from "./tokens.ts";
import {
	ALIAS_OF,
	DEFAULT_ALIASES,
	type ProjectConfig,
	type RegistryItem,
} from "./types.ts";
import {
	accent,
	cancel,
	intro,
	isInteractive,
	log,
	multiselect,
	muted,
	note,
	outro,
	select,
} from "./ui.ts";

const USAGE = `Usage: axiom <command> [options] --registry <path>

Commands:
  init            Set up a project for Axiom: styling, foundations, core
                  primitives and axiom.json
  add [items...]  Copy items and their internal dependencies into the project
  sync            Copy every item listed in axiom.json, and choose which
                  existing files follow the registry

Run "axiom <command> --help" for the options of a command.`;

const INIT_USAGE = `Usage: axiom init --registry <path> [--styling <tool>] [--install | --no-install] [--force] [--cwd <path>]

Sets up an existing Expo or React Native project:

  1. asks which styling tool the project uses;
  2. makes sure its tsconfig.json resolves the aliases, offering to add the
     missing "paths" entries;
  3. copies the foundations (tokens, theme) and the core primitives;
  4. asks, then installs the styling dependency and what the copied files need;
  5. writes axiom.json, with everything it copied listed in "items".

Options:
  --registry <path>  Registry folder (the one holding registry.json)
  --styling <tool>   Styling tool, instead of being asked: stylesheet,
                     unistyles, nativewind or uniwind. Only the ones the
                     registry has a variant for are accepted
  --install          Install dependencies without asking
  --no-install       Print the install command instead of running it
  --force            Start over on a project that already has an axiom.json
  --cwd <path>       Project root (default: current folder)`;

const ADD_USAGE = `Usage: axiom add [items...] --registry <path> [--standalone] [--icons <source>] [--navigation <library>] [--overwrite] [--watch] [--cwd <path>]

Copies items and their internal dependencies into the project, using the
styling and aliases of its axiom.json. Without items, copies again every item
already listed in axiom.json.

Existing files:
  - an item you name that differs from the registry asks before being overwritten;
  - a dependency already in the project is kept as it is;
  - a file the project owns once created (like the icon registry) is never overwritten.

Icons:
  The first item that needs icons asks where they come from, and saves the
  answer as "icons" in axiom.json: expo-symbols (Expo projects) or custom.

Navigation:
  The first item that depends on navigation detects the library from
  package.json and saves it as "navigation" in axiom.json: expo-router,
  react-navigation, or react-native when there is none.

Standalone:
  --standalone writes each item as one self-contained file, for an app that
  has its own design system: what it stands on is inlined, the theme is
  replaced by Axiom's light values, and it imports nothing but npm packages.
  Nothing else is copied, and axiom.json is neither needed nor written.

Options:
  --registry <path>  Registry folder (the one holding registry.json)
  --standalone       One self-contained file per item, without the theme
  --styling <tool>   With --standalone and no axiom.json: stylesheet, unistyles,
                     nativewind or uniwind
  --icons <source>   Icon source, when axiom.json has none: expo-symbols or custom
  --navigation <library>
                     Navigation library, when axiom.json has none: expo-router,
                     react-navigation or react-native. Detected otherwise
  --overwrite        Overwrite the items you name without asking. Theme files
                     are still asked about: they hold your customizations
  --install          Install missing dependencies without asking
  --no-install       Print the install command instead of asking
  --watch            Copy again whenever a registry file changes. Overwrites
                     dependencies too: use it on a project that mirrors the registry
  --cwd <path>       Project root (default: current folder)`;

const SYNC_USAGE = `Usage: axiom sync --registry <path> [--keep <levels>] [--overwrite] [--icons <source>] [--navigation <library>] [--install | --no-install] [--cwd <path>]

Brings the project in line with "items" in axiom.json, with the same steps as
add: the variant for its styling, internal dependencies, missing npm packages.

  1. Files missing from the project are written.
  2. When files differ from the registry, asks which levels you keep as they
     are: core (core primitives and hooks), theme (tokens and component
     tokens) and components. All of them are kept by default.
  3. Asks which differing files of the other levels to overwrite. All of them
     are selected by default.

Use it to set up a project with the same items as another one, to restore
deleted files, or to update what you copied. Without a terminal and without
options, every existing file is kept.

Options:
  --registry <path>  Registry folder (the one holding registry.json)
  --keep <levels>    Levels kept as they are, instead of being asked: core,
                     theme and components, separated by commas, or none
  --overwrite        Overwrite every differing file of the levels you don't
                     keep, without asking which
  --icons <source>   Icon source, when axiom.json has none: expo-symbols or custom
  --navigation <library>
                     Navigation library, when axiom.json has none. Detected otherwise
  --install          Install missing dependencies without asking
  --no-install       Print the install command instead of asking
  --cwd <path>       Project root (default: current folder)`;

async function confirmOverwrite(path: string): Promise<OverwriteAnswer> {
	return select<OverwriteAnswer>({
		message: `${path} differs from the registry.`,
		options: [
			{ value: "no", label: "Keep mine" },
			{ value: "yes", label: "Overwrite it" },
			{ value: "all", label: "Overwrite all", hint: "and the next ones" },
			{ value: "none", label: "Keep all of mine", hint: "stop asking" },
		],
	});
}

/** What `sync` lets the project keep or bring back to the registry, as a whole. */
const SYNC_LEVELS = ["core", "theme", "components"] as const;
type SyncLevel = (typeof SYNC_LEVELS)[number];

const SYNC_LEVEL_LABELS: Record<SyncLevel, string> = {
	core: "Core primitives and hooks",
	theme: "Theme: tokens and component tokens",
	components: "Components",
};

function parseKeep(flag: string): SyncLevel[] {
	if (flag === "none") return [];
	const levels = flag.split(",").map((level) => level.trim());
	const unknown = levels.find(
		(level) => !(SYNC_LEVELS as readonly string[]).includes(level),
	);
	if (unknown !== undefined) {
		throw new Error(
			`Unknown level "${unknown}": --keep takes ${SYNC_LEVELS.join(", ")}, separated by commas, or none.`,
		);
	}
	return levels as SyncLevel[];
}

type SyncOptions = {
	/** Levels kept as they are (`--keep`). Asked for when missing. */
	keep?: SyncLevel[];
	/** Overwrite every differing file of the other levels without asking which (`--overwrite`). */
	overwrite: boolean;
};

/**
 * The files `sync` overwrites among the ones that differ: the levels to keep are chosen first,
 * then the files of the other levels. Without a terminal, what no flag decides is kept.
 */
function syncSelection(
	config: ProjectConfig,
	cwd: string,
	{ keep, overwrite }: SyncOptions,
): NonNullable<CopyOptions["select"]> {
	const dirs: [SyncLevel, string][] = [
		["theme", aliasToDir(cwd, config.aliases.theme) + sep],
		["core", aliasToDir(cwd, config.aliases.core) + sep],
		["core", aliasToDir(cwd, config.aliases.hooks) + sep],
	];
	const levelOf = (destination: string) =>
		dirs.find(([, dir]) => destination.startsWith(dir))?.[0] ?? "components";

	return async (differing) => {
		const interactive = isInteractive();
		const count = (level: SyncLevel) =>
			differing.filter((file) => levelOf(file.destination) === level).length;
		const levels = SYNC_LEVELS.filter((level) => count(level));

		const kept =
			keep ??
			(interactive
				? await multiselect<SyncLevel>({
						message:
							"Some files differ from the registry. Which levels do you keep as they are?",
						options: levels.map((level) => ({
							value: level,
							label: SYNC_LEVEL_LABELS[level],
							hint: `${count(level)} differ`,
						})),
						initialValues: levels,
						required: false,
					})
				: SYNC_LEVELS);

		const paths = differing
			.filter((file) => !kept.includes(levelOf(file.destination)))
			.map((file) => file.path);
		if (!paths.length || overwrite) return new Set(paths);
		if (!interactive) {
			log.warn(
				`Kept your version of ${paths.join(", ")}. Run in a terminal to choose, or pass --overwrite.`,
			);
			return new Set();
		}
		return new Set(
			await multiselect({
				message: "Which files do you overwrite?",
				options: paths.map((path) => ({ value: path, label: path })),
				initialValues: paths,
				required: false,
			}),
		);
	};
}

type RunOptions = {
	names: string[];
	registryRoot: string;
	cwd: string;
	overwrite: CopyOptions["overwrite"];
	icons?: string;
	navigation?: string;
	install: InstallMode;
	/** Decide on the existing files by level, whatever was requested (sync). */
	sync?: SyncOptions;
	/** Packages the command needs on top of what the copied files declare, like the styling tool. */
	extraDependencies?: string[];
};

async function run({
	names,
	registryRoot,
	cwd,
	overwrite,
	icons: iconsFlag,
	navigation: navigationFlag,
	install,
	sync,
	extraDependencies = [],
}: RunOptions) {
	const registry = readRegistry(registryRoot);
	let config = readConfig(cwd);

	const requested = names.length ? names : config.items;
	const items = resolveItems(registry, requested);
	const interactive = isInteractive();

	config = await withIconSource(config, items, iconsFlag, cwd);

	if (items.some((item) => item.navigationSources) && !config.navigation) {
		const navigation = navigationFlag
			? parseNavigation(navigationFlag)
			: detectNavigation(cwd);
		config = { ...config, navigation };
		log.info(`navigation: ${accent(navigation)}, saved in ${CONFIG_FILE}`);
	}

	const all = new Set([...config.items, ...items.map((item) => item.name)]);
	const projectItems = resolveItems(registry, [...all]);

	// The theme's components.ts is compared with its tokens registered, so copying the theme again
	// doesn't drop them, and an unchanged file isn't rewritten in watch mode.
	const componentsFile = join(
		aliasToDir(cwd, config.aliases.theme),
		COMPONENTS_FILE,
	);

	// Without a terminal, there is nobody to ask: differing files are kept.
	const result = await copyItems(items, config, registryRoot, cwd, {
		requested: new Set(requested),
		overwrite,
		confirm: interactive ? confirmOverwrite : undefined,
		select: sync && syncSelection(config, cwd, sync),
		// Read when the file is reached: tokens files copied earlier in this run are on disk by then.
		transform: (destination, content) =>
			destination === componentsFile
				? registerTokens(
						content,
						projectTokenEntries(projectItems, config.aliases, cwd),
					)
				: content,
	});

	writeConfig(cwd, { ...config, items: [...all].sort() });

	// When the theme was already in the project, register the new components in it.
	const tokensFile = syncTokens(projectItems, config.aliases, cwd);
	// Uniwind imports the CSS tokens; NativeWind's preset reads the folder itself.
	const cssTokensFile =
		config.styling === "uniwind"
			? syncCssTokens(config.aliases, cwd)
			: undefined;

	if (result.written.length) {
		log.success(
			`${result.written.length} written\n${result.written.map((path) => muted(path)).join("\n")}`,
		);
	}
	if (tokensFile) log.success(`registered component tokens in ${tokensFile}`);
	if (cssTokensFile)
		log.success(`listed the components' CSS tokens in ${cssTokensFile}`);

	const declined = result.kept.filter((file) => file.reason === "declined");
	if (declined.length) {
		const hint = interactive
			? ""
			: overwrite === "always"
				? " Theme files are only overwritten after asking: run in a terminal."
				: " Run in a terminal to be asked, or pass --overwrite.";
		log.warn(
			`Kept your version of ${declined.map((file) => file.path).join(", ")}.${hint}`,
		);
	}

	const icons = missingIcons(items, projectItems, config, cwd);
	if (icons) {
		note(
			[...icons.missing]
				.map(
					([name, users]) =>
						`${name.padEnd(16)} ${muted(`used by ${users.join(", ")}`)}`,
				)
				.join("\n"),
			`Add these icons to ${icons.file}`,
		);
	}

	await resolveMissingDependencies(
		cwd,
		missingDependencies(cwd, [...result.dependencies, ...extraDependencies]),
		install,
	);

	return result;
}

/** `config` with an icon source, asked for when one of `items` needs it and there is none. */
async function withIconSource(
	config: ProjectConfig,
	items: RegistryItem[],
	flag: string | undefined,
	cwd: string,
): Promise<ProjectConfig> {
	if (!items.some((item) => item.iconSources) || config.icons) return config;
	if (flag) return { ...config, icons: parseIconSource(flag, cwd) };
	if (isInteractive()) return { ...config, icons: await askIconSource(cwd) };
	throw new Error(
		"Choose where icons come from: pass --icons expo-symbols or --icons custom.",
	);
}

type StandaloneOptions = {
	names: string[];
	registryRoot: string;
	cwd: string;
	styling?: string;
	icons?: string;
	overwrite: boolean;
	install: InstallMode;
};

/**
 * `add --standalone`: one self-contained file per item. The project's axiom.json is read when there
 * is one, for its styling and aliases, and never written: nothing but the files is added.
 */
async function runStandalone({
	names,
	registryRoot,
	cwd,
	styling: stylingFlag,
	icons,
	overwrite,
	install,
}: StandaloneOptions) {
	if (!names.length) throw new Error("Name the items to add standalone.");

	const registry = readRegistry(registryRoot);
	const interactive = isInteractive();
	const available = availableStylings(registry);

	// The project's config when it has one; the default aliases otherwise.
	const project = configExists(cwd) ? readConfig(cwd) : undefined;
	let styling = stylingFlag
		? parseStyling(stylingFlag, available)
		: project?.styling;
	if (!styling && interactive) styling = await askStyling(available);
	if (!styling) {
		throw new Error(
			`Without an ${CONFIG_FILE}, choose a styling tool: pass --styling ${available.join(" or --styling ")}.`,
		);
	}
	let config: ProjectConfig = {
		...(project ?? { aliases: DEFAULT_ALIASES, items: [] }),
		styling,
	};
	config = await withIconSource(
		config,
		resolveItems(registry, names),
		icons,
		cwd,
	);

	const written: string[] = [];
	const unchanged: string[] = [];
	const kept: string[] = [];
	const dependencies = new Set<string>();
	let answer: OverwriteAnswer | undefined = overwrite ? "all" : undefined;

	// Built before anything is written, so an item that can't be standalone leaves the project untouched.
	const results = names.map((name) =>
		buildStandalone(registry, registryRoot, name, config),
	);

	for (const result of results) {
		const destination = join(
			aliasToDir(cwd, config.aliases[ALIAS_OF[result.item.type]]),
			result.fileName,
		);
		const path = relative(cwd, destination);
		result.dependencies.forEach((dependency) => dependencies.add(dependency));

		if (existsSync(destination)) {
			if (readFileSync(destination, "utf8") === result.content) {
				unchanged.push(path);
				continue;
			}
			if (answer !== "all") {
				const choice: OverwriteAnswer =
					answer === "none" || !interactive
						? "no"
						: await confirmOverwrite(path);
				if (choice === "all" || choice === "none") answer = choice;
				if (choice === "no" || choice === "none") {
					kept.push(path);
					continue;
				}
			}
		}

		mkdirSync(dirname(destination), { recursive: true });
		writeFileSync(destination, result.content);
		written.push(path);

		if (result.missingIcons.length) {
			log.warn(
				`${path} draws ${result.missingIcons.map((icon) => accent(icon)).join(", ")}: add ${result.missingIcons.length > 1 ? "them" : "it"} to its icons object.`,
			);
		}
	}

	if (written.length) {
		log.success(
			`${written.length} written\n${written.map((path) => muted(path)).join("\n")}`,
		);
	}
	if (kept.length) {
		const hint = interactive
			? ""
			: " Run in a terminal to be asked, or pass --overwrite.";
		log.warn(`Kept your version of ${kept.join(", ")}.${hint}`);
	}

	// No `init` ran: the styling tool may be missing too.
	const stylingDependency = STYLING_DEPENDENCY[config.styling];
	if (stylingDependency) dependencies.add(stylingDependency);
	await resolveMissingDependencies(
		cwd,
		missingDependencies(cwd, [...dependencies]),
		install,
	);

	return { written, unchanged, kept };
}

type InitOptions = {
	registryRoot: string;
	cwd: string;
	styling?: string;
	install: InstallMode;
	force: boolean;
};

async function runInit({
	registryRoot,
	cwd,
	styling: stylingFlag,
	install,
	force,
}: InitOptions) {
	assertReactNativeProject(cwd);

	if (existsSync(join(cwd, CONFIG_FILE)) && !force) {
		throw new Error(
			`${cwd} already has an ${CONFIG_FILE}. Use "axiom add" to copy items, or --force to set it up again.`,
		);
	}

	const available = availableStylings(readRegistry(registryRoot));
	if (!available.length) {
		throw new Error(
			`The registry has no styling variant for the foundations and core primitives yet.`,
		);
	}

	const interactive = isInteractive();

	let styling;
	if (stylingFlag) styling = parseStyling(stylingFlag, available);
	else if (interactive) styling = await askStyling(available);
	else
		throw new Error(
			`Choose a styling tool: pass --styling ${available.join(" or --styling ")}.`,
		);

	const chosen = await confirmAliases(defaultAliases(cwd), interactive);
	const aliases = await ensureAliases(cwd, chosen, interactive);

	// Written before anything is copied: `run` reads the project's config back.
	writeConfig(cwd, { $schema: SCHEMA_URL, styling, aliases, items: [] });
	log.success(`wrote ${CONFIG_FILE}`);

	const dependency = STYLING_DEPENDENCY[styling];
	return run({
		names: INIT_ITEMS,
		registryRoot,
		cwd,
		// A fresh project has no files to protect; --force reuses add's prompt on the ones it finds.
		overwrite: "ask",
		install,
		extraDependencies: dependency ? [dependency] : [],
	});
}

async function main() {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			registry: { type: "string" },
			styling: { type: "string" },
			keep: { type: "string" },
			icons: { type: "string" },
			navigation: { type: "string" },
			overwrite: { type: "boolean", default: false },
			install: { type: "boolean", default: false },
			"no-install": { type: "boolean", default: false },
			force: { type: "boolean", default: false },
			watch: { type: "boolean", default: false },
			standalone: { type: "boolean", default: false },
			cwd: { type: "string" },
			help: { type: "boolean", short: "h", default: false },
		},
	});

	const [command, ...names] = positionals;
	const usage =
		command === "init"
			? INIT_USAGE
			: command === "add"
				? ADD_USAGE
				: command === "sync"
					? SYNC_USAGE
					: USAGE;

	if (values.help || !["add", "init", "sync"].includes(command ?? "")) {
		console.log(usage);
		process.exit(values.help ? 0 : 1);
	}

	// No hosted registry yet: the path is required.
	if (!values.registry) {
		console.error("--registry is required for now.\n\n" + usage);
		process.exit(1);
	}

	const registryRoot = resolve(values.registry);
	const cwd = resolve(values.cwd ?? process.cwd());

	intro(`axiom ${command}`);

	// --install and --no-install decide up front; otherwise a terminal is asked first, and without
	// one, init installs (its job is to set the project up) while add prints the command.
	const install: InstallMode = values.install
		? "always"
		: values["no-install"]
			? "never"
			: isInteractive()
				? "ask"
				: command === "init"
					? "always"
					: "never";

	if (command === "init") {
		const result = await runInit({
			registryRoot,
			cwd,
			styling: values.styling,
			install,
			force: values.force,
		});
		outro(
			`${result.written.length} written, ${result.unchanged.length} unchanged. Add a component with ${accent("axiom add button")}.`,
		);
		return;
	}

	if (command === "sync") {
		const keep = values.keep === undefined ? undefined : parseKeep(values.keep);
		const result = await run({
			names: [],
			registryRoot,
			cwd,
			overwrite: "ask",
			icons: values.icons,
			navigation: values.navigation,
			install,
			sync: { keep, overwrite: values.overwrite },
		});
		outro(
			`${result.written.length} written, ${result.unchanged.length} unchanged, ${result.kept.length} kept.`,
		);
		return;
	}

	if (values.standalone) {
		if (values.watch)
			throw new Error("--standalone and --watch don't go together.");
		const result = await runStandalone({
			names,
			registryRoot,
			cwd,
			styling: values.styling,
			icons: values.icons,
			overwrite: values.overwrite,
			install,
		});
		outro(
			`${result.written.length} written, ${result.unchanged.length} unchanged, ${result.kept.length} kept.`,
		);
		return;
	}

	const overwrite = values.watch
		? "force"
		: values.overwrite
			? "always"
			: "ask";

	const result = await run({
		names,
		registryRoot,
		cwd,
		overwrite,
		icons: values.icons,
		navigation: values.navigation,
		install,
	});
	const summary = `${result.written.length} written, ${result.unchanged.length} unchanged, ${result.kept.length} kept.`;

	if (!values.watch) {
		outro(summary);
		return;
	}

	// No outro: the command keeps running, so the session stays open under the watcher's logs.
	log.info(summary);
	log.step(`Watching ${muted(registryRoot)}…`);
	let timer: ReturnType<typeof setTimeout> | undefined;
	watch(registryRoot, { recursive: true }, () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			// Re-read axiom.json each time so items added meanwhile are kept in sync.
			run({
				names: [],
				registryRoot,
				cwd,
				overwrite: "force",
				// No prompt under the watcher: it would interrupt every change.
				install: values.install ? "always" : "never",
			}).catch((error: Error) => log.error(error.message));
		}, 100);
	});
}

main().catch((error: Error) => {
	cancel(error.message);
	process.exit(1);
});
