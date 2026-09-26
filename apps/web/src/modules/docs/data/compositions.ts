// Single source for the compositions shown in the docs.
// The catalog (/docs/compositions) and the "Compositions" section of each primitive page read from here,
// so a composition is declared once and appears in both places.

export type CompositionCategory =
	| "card"
	| "item"
	| "list"
	| "form"
	| "navigation"
	| "media"
	| "feedback"
	| "content"
	| "commerce"
	| "social";

export const compositionCategories: { id: CompositionCategory; label: string }[] = [
	{ id: "card", label: "Card" },
	{ id: "item", label: "Item" },
	{ id: "list", label: "List" },
	{ id: "form", label: "Form" },
	{ id: "navigation", label: "Navigation" },
	{ id: "media", label: "Media" },
	{ id: "feedback", label: "Feedback" },
	{ id: "content", label: "Content" },
	{ id: "commerce", label: "Commerce" },
	{ id: "social", label: "Social" },
];

export interface DocLink {
	name: string;
	href: string;
}

/** Primitives a composition can be built with. Keys are registry names. */
export const primitives = {
	badge: { name: "Badge", href: "/docs/atoms/badge" },
	button: { name: "Button", href: "/docs/atoms/button" },
	card: { name: "Card", href: "/docs/atoms/card" },
	icon: { name: "Icon", href: "/docs/atoms/icon" },
	item: { name: "Item", href: "/docs/atoms/item" },
	separator: { name: "Separator", href: "/docs/atoms/separator" },
	switch: { name: "Switch", href: "/docs/atoms/switch" },
	text: { name: "Text", href: "/docs/atoms/text" },
} satisfies Record<string, DocLink>;

export type PrimitiveName = keyof typeof primitives;

/** Blocks that use compositions. Keys are registry names. */
export const blocks = {
	"settings-section": {
		name: "Settings Section",
		href: "/docs/blocks/settings-section",
	},
} satisfies Record<string, DocLink>;

export type BlockName = keyof typeof blocks;

export interface Composition {
	/** Registry name, used by `npx axiom add` and in the URL. */
	slug: string;
	/** Display name. */
	name: string;
	/** Exported React component. */
	component: string;
	description: string;
	categories: CompositionCategory[];
	/** The primitive it is derived from, listed first in "Built with". */
	base: PrimitiveName;
	builtWith: PrimitiveName[];
	usedIn: BlockName[];
}

export const compositions: Composition[] = [
	{
		slug: "product-card",
		name: "Product Card",
		component: "ProductCard",
		description: "Product image, name, price, an optional badge and an add-to-cart button.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "text", "badge", "button"],
		usedIn: [],
	},
	{
		slug: "settings-item",
		name: "Settings Item",
		component: "SettingsItem",
		description: "Settings row with an icon, a label, a value and a chevron or a switch.",
		categories: ["item", "list", "form"],
		base: "item",
		builtWith: ["item", "icon", "switch", "text"],
		usedIn: ["settings-section"],
	},
];

export const compositionHref = (slug: string) => `/docs/compositions/${slug}`;

/** Compositions that use a primitive, derived one first. */
export function compositionsBuiltWith(primitive: PrimitiveName): Composition[] {
	return compositions
		.filter((c) => c.builtWith.includes(primitive))
		.sort((a, b) => Number(b.base === primitive) - Number(a.base === primitive));
}
