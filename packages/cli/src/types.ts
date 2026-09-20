export const STYLINGS = [
	"stylesheet",
	"unistyles",
	"nativewind",
	"uniwind",
] as const;
export type Styling = (typeof STYLINGS)[number];

export type Variant = "stylesheet" | "unistyles" | "tailwind";

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

export const VARIANT_OF: Record<Styling, Variant> = {
	stylesheet: "stylesheet",
	unistyles: "unistyles",
	nativewind: "tailwind",
	uniwind: "tailwind",
};

export type Layer =
	| "foundations"
	| "core"
	| "hooks"
	| "typography"
	| "atoms"
	| "molecules"
	| "organisms"
	| "templates"
	| "blocks";

export type AliasName = "theme" | "core" | "hooks" | "components" | "blocks";

export type Aliases = Record<AliasName, string>;

export const DEFAULT_ALIASES: Aliases = {
	theme: "@/theme",
	core: "@/components/core",
	hooks: "@/hooks",
	components: "@/components/ui",
	blocks: "@/components/blocks",
};

export const ALIAS_OF: Record<Layer, AliasName> = {
	foundations: "theme",
	core: "core",
	hooks: "hooks",
	typography: "components",
	atoms: "components",
	molecules: "components",
	organisms: "components",
	templates: "components",
	blocks: "blocks",
};

/**
 * A path relative to the registry root, or an object:
 * - `target`: fixed destination relative to the project root, ignoring aliases;
 * - `createOnly`: the file belongs to the project once created (an icon registry, for instance). It is written
 *   when missing and never overwritten.
 */
export type RegistryFile =
	string | { path: string; target?: string; createOnly?: boolean };

export type FileSet = {
	files?: RegistryFile[];
	dependencies?: string[];
};

export type RegistryItem = FileSet & {
	name: string;
	type: Layer;
	/**
	 * Component tokens file, also listed in `files`. It exports `<name>Tokens(colors)`, and the CLI registers it
	 * in the theme's `components.ts` under `<name>` (camelCase).
	 */
	tokens?: string;
	internalDependencies?: string[];
	variants?: Partial<Record<Variant, FileSet>>;
	/** Files and dependencies per icon source (`icons` in axiom.json). Asking for the source when missing. */
	iconSources?: Partial<Record<IconSource, FileSet>>;
	/** Files and dependencies per navigation library (`navigation` in axiom.json). Detected when missing. */
	navigationSources?: Partial<Record<Navigation, FileSet>>;
	/** Icon names the item renders itself. They must exist in the project's icon registry. */
	requiredIcons?: string[];
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
