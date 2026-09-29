#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readFileSync,
	watch,
	writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
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
import { installCommand, installDependencies } from "./install.ts";
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

Run "axiom <command> --help" for the options of a command.`;

const INIT_USAGE = `Usage: axiom init --registry <path> [--styling <tool>] [--no-install] [--force] [--cwd <path>]

Sets up an existing Expo or React Native project:

  1. asks which styling tool the project uses;
  2. makes sure its tsconfig.json resolves the aliases, offering to add the
     missing "paths" entries;
  3. copies the foundations (tokens, theme) and the core primitives;
  4. installs the styling dependency and what the copied files need;
  5. writes axiom.json, with everything it copied listed in "items".

Options:
  --registry <path>  Registry folder (the one holding registry.json)
  --styling <tool>   Styling tool, instead of being asked: stylesheet,
                     unistyles, nativewind or uniwind. Only the ones the
                     registry has a variant for are accepted
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
  --styling <tool>   With --standalone and no axiom.json: stylesheet or unistyles
  --icons <source>   Icon source, when axiom.json has none: expo-symbols or custom
  --navigation <library>
                     Navigation library, when axiom.json has none: expo-router,
                     react-navigation or react-native. Detected otherwise
  --overwrite        Overwrite the items you name without asking
  --install          Install missing dependencies instead of printing the command
  --watch            Copy again whenever a registry file changes. Overwrites
                     dependencies too: use it on a project that mirrors the registry
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

type RunOptions = {
	names: string[];
	registryRoot: string;
	cwd: string;
	overwrite: CopyOptions["overwrite"];
	icons?: string;
	navigation?: string;
	/** Run the install command instead of printing it. */
	install: boolean;
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

	if (result.written.length) {
		log.success(
			`${result.written.length} written\n${result.written.map((path) => muted(path)).join("\n")}`,
		);
	}
	if (tokensFile) log.success(`registered component tokens in ${tokensFile}`);

	const declined = result.kept.filter((file) => file.reason === "declined");
	if (declined.length) {
		const hint = interactive
			? ""
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

	const missing = missingDependencies(cwd, [
		...result.dependencies,
		...extraDependencies,
	]);
	if (missing.length) {
		if (install) await installDependencies(cwd, missing);
		else
			log.warn(
				`Missing dependencies. Install them with:\n${accent(installCommand(cwd, missing).join(" "))}`,
			);
	}

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
	install: boolean;
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
	let styling = stylingFlag ? parseStyling(stylingFlag, available) : project?.styling;
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
	config = await withIconSource(config, resolveItems(registry, names), icons, cwd);

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
		const hint = interactive ? "" : " Run in a terminal to be asked, or pass --overwrite.";
		log.warn(`Kept your version of ${kept.join(", ")}.${hint}`);
	}

	// No `init` ran: the styling tool may be missing too.
	const stylingDependency = STYLING_DEPENDENCY[config.styling];
	if (stylingDependency) dependencies.add(stylingDependency);
	const missing = missingDependencies(cwd, [...dependencies]);
	if (missing.length) {
		if (install) await installDependencies(cwd, missing);
		else
			log.warn(
				`Missing dependencies. Install them with:\n${accent(installCommand(cwd, missing).join(" "))}`,
			);
	}

	return { written, unchanged, kept };
}

type InitOptions = {
	registryRoot: string;
	cwd: string;
	styling?: string;
	install: boolean;
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
		command === "init" ? INIT_USAGE : command === "add" ? ADD_USAGE : USAGE;

	if (values.help || (command !== "add" && command !== "init")) {
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

	if (command === "init") {
		const result = await runInit({
			registryRoot,
			cwd,
			styling: values.styling,
			install: !values["no-install"],
			force: values.force,
		});
		outro(
			`${result.written.length} written, ${result.unchanged.length} unchanged. Add a component with ${accent("axiom add button")}.`,
		);
		return;
	}

	if (values.standalone) {
		if (values.watch) throw new Error("--standalone and --watch don't go together.");
		const result = await runStandalone({
			names,
			registryRoot,
			cwd,
			styling: values.styling,
			icons: values.icons,
			overwrite: values.overwrite,
			install: values.install,
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
		install: values.install,
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
				install: values.install,
			}).catch((error: Error) => log.error(error.message));
		}, 100);
	});
}

main().catch((error: Error) => {
	cancel(error.message);
	process.exit(1);
});
