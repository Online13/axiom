export const STYLINGS = [
	"stylesheet",
	"unistyles",
	"nativewind",
	"uniwind",
] as const;
export type Styling = (typeof STYLINGS)[number];

/**
 * The names a variant goes by: one per styling, and `tailwind` for what NativeWind and Uniwind
 * share, like the folder of their theme (`foundations/theme/tailwind`). Every item of the registry
 * lists `nativewind` and `uniwind` apart.
 */
export const VARIANTS = [
	"stylesheet",
	"unistyles",
	"nativewind",
	"uniwind",
	"tailwind",
] as const;
export type Variant = (typeof VARIANTS)[number];

/** Where a styling takes its files from, its own variant first. */
export const VARIANTS_OF: Record<Styling, readonly Variant[]> = {
	stylesheet: ["stylesheet"],
	unistyles: ["unistyles"],
	nativewind: ["nativewind", "tailwind"],
	uniwind: ["uniwind", "tailwind"],
};

/** Stylings whose components are written with class names, and whose tokens are CSS. */
export const CSS_STYLINGS = ["nativewind", "uniwind"] as const;
export type CssStyling = (typeof CSS_STYLINGS)[number];

export function isCssStyling(styling: Styling): styling is CssStyling {
	return (CSS_STYLINGS as readonly Styling[]).includes(styling);
}

/** The variant of `item` a styling uses, if the item has one for it. */
export function variantOf(
	item: Pick<RegistryItem, "variants">,
	styling: Styling,
): Variant | undefined {
	return VARIANTS_OF[styling].find((variant) => item.variants?.[variant]);
}

const VARIANT_SUFFIX = new RegExp(`\\.(${VARIANTS.join("|")})(?=\\.[^./]+$|$)`);

/**
 * A file every variant writes its own way sits beside the files they share, named after its variant:
 * `button.styles.unistyles.tsx` is the Unistyles form of `button.styles`. The registry's tsconfigs
 * resolve `./button.styles` to it through `moduleSuffixes`.
 */
export function stripVariant(path: string) {
	return path.replace(VARIANT_SUFFIX, "");
}

/** Where the icons of the project come from. Decides which icon registry `add icon` creates. */
export const ICON_SOURCES = ["expo-symbols", "custom"] as const;
export type IconSource = (typeof ICON_SOURCES)[number];

/**
 * The navigation library of the project. Decides which version of navigation-aware items (like
 * `use-overlay-back-handler`) `add` copies. Detected from package.json the first time an item needs it.
 */
export const NAVIGATIONS = [
	"expo-router",
	"react-navigation",
	"react-native",
] as const;
export type Navigation = (typeof NAVIGATIONS)[number];

export type Layer =
	| "foundations"
	| "core"
	| "hooks"
	| "typography"
	| "atoms"
	| "molecules"
	| "organisms"
	| "templates"
	| "compositions"
	| "blocks";

/**
 * `components` holds the primitives (typography and the atoms → templates layers, organized with
 * Atomic Design). `compositions` are ready-made assemblies of primitives; `blocks` are complete sections.
 */
export type AliasName =
	"theme" | "core" | "hooks" | "components" | "compositions" | "blocks";

export type Aliases = Record<AliasName, string>;

export const DEFAULT_ALIASES: Aliases = {
	theme: "@/theme",
	core: "@/components/core",
	hooks: "@/hooks",
	components: "@/components/ui",
	compositions: "@/components/compositions",
	blocks: "@/components/blocks",
};

/**
 * Folder of `aliases.theme` holding the component token files, one per component. A token file is
 * read by the theme and by nothing else, not even its own component, so it lives with the theme:
 * the foundations never import from a layer above them.
 */
export const THEME_COMPONENTS_DIR = "components";

/**
 * Layers whose items are copied as a folder (`components/ui/bottom-sheet/`) with a generated
 * `index.ts`, so `@/components/ui/bottom-sheet` keeps resolving. An item of these layers that
 * copies a single file stays a single file. The other layers always hold one file per item.
 */
export const FOLDERED_LAYERS: ReadonlySet<Layer> = new Set<Layer>([
	"typography",
	"atoms",
	"molecules",
	"organisms",
	"templates",
	"compositions",
	"blocks",
]);

/**
 * The folder an item's files land in, inside its alias directory. A single file needs no folder,
 * and a flat layer never gets one.
 */
export function itemFolder(
	item: Pick<RegistryItem, "name" | "type">,
	fileCount: number,
) {
	return FOLDERED_LAYERS.has(item.type) && fileCount > 1
		? item.name
		: undefined;
}

export const ALIAS_OF: Record<Layer, AliasName> = {
	foundations: "theme",
	core: "core",
	hooks: "hooks",
	typography: "components",
	atoms: "components",
	molecules: "components",
	organisms: "components",
	templates: "components",
	compositions: "compositions",
	blocks: "blocks",
};

/**
 * A path relative to the registry root, or an object:
 * - `as`: destination relative to the item's alias folder, instead of the file name. It is how a
 *   file keeps a subfolder in the project (`components/index.ts` under `aliases.theme`);
 * - `target`: fixed destination relative to the project root, ignoring aliases;
 * - `createOnly`: the file belongs to the project once created (an icon registry, for instance). It is written
 *   when missing and never overwritten.
 */
export type RegistryFile =
	| string
	| { path: string; as?: string; target?: string; createOnly?: boolean };

export type FileSet = {
	files?: RegistryFile[];
	dependencies?: string[];
};

export type RegistryItem = FileSet & {
	name: string;
	type: Layer;
	/**
	 * Component tokens file, also listed in `files`. It exports `<name>Tokens(colors, tokens)`. The CLI copies it to
	 * the theme's `components/` folder as `<name>.ts` and registers it in that folder's `index.ts` under
	 * `<name>` (camelCase).
	 */
	tokens?: string;
	/**
	 * The same tokens as CSS, generated from `tokens` by the registry, per styling that reads its
	 * tokens from CSS. With one of them, the CLI copies it to the theme's `components/` folder as
	 * `<name>.css`, and leaves the `tokens` file out.
	 */
	cssTokens?: Partial<Record<CssStyling, string>>;
	internalDependencies?: string[];
	variants?: Partial<Record<Variant, FileSet>>;
	/** Files and dependencies per icon source (`icons` in axiom.json). Asking for the source when missing. */
	iconSources?: Partial<Record<IconSource, FileSet>>;
	/** Files and dependencies per navigation library (`navigation` in axiom.json). Detected when missing. */
	navigationSources?: Partial<Record<Navigation, FileSet>>;
	/** Icon names the item renders itself. They must exist in the project's icon registry. */
	requiredIcons?: string[];
	/**
	 * `false` when the item has no theme-free form: `add --standalone` refuses it and every item
	 * depending on it. A portal, for instance, needs a host mounted by the app.
	 */
	standalone?: false;
};

export type Registry = {
	items: RegistryItem[];
};

export type ProjectConfig = {
	$schema?: string;
	styling: Styling;
	icons?: IconSource;
	navigation?: Navigation;
	aliases: Aliases;
	items: string[];
};
