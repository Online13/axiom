// Single source for the compositions and blocks shown in the docs.
// The gallery (/docs/gallery), the compositions and blocks indexes, and the "Compositions" section of each
// primitive page read from here, so an item is declared once and appears everywhere.

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
	"app-bar": { name: "AppBar", href: "/docs/components/app-bar" },
	avatar: { name: "Avatar", href: "/docs/components/avatar" },
	badge: { name: "Badge", href: "/docs/components/badge" },
	button: { name: "Button", href: "/docs/components/button" },
	card: { name: "Card", href: "/docs/components/card" },
	carousel: { name: "Carousel", href: "/docs/components/carousel" },
	chip: { name: "Chip", href: "/docs/components/chip" },
	empty: { name: "Empty", href: "/docs/components/empty" },
	icon: { name: "Icon", href: "/docs/components/icon" },
	"icon-button": { name: "IconButton", href: "/docs/components/icon-button" },
	input: { name: "Input", href: "/docs/components/input" },
	item: { name: "Item", href: "/docs/components/item" },
	"option-item": { name: "OptionItem", href: "/docs/components/option-item" },
	"search-bar": { name: "SearchBar", href: "/docs/components/search-bar" },
	separator: { name: "Separator", href: "/docs/components/separator" },
	switch: { name: "Switch", href: "/docs/components/switch" },
	tappable: { name: "Tappable", href: "/docs/core/tappable" },
	text: { name: "Text", href: "/docs/components/text" },
	title: { name: "Title", href: "/docs/components/title" },
} satisfies Record<string, DocLink>;

export type PrimitiveName = keyof typeof primitives;

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
	},
	{
		slug: "listing-card",
		name: "Listing Card",
		component: "ListingCard",
		description: "A home or a stay: photo, price, address and specs, stacked or over the photo.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "badge", "separator", "icon", "text", "title", "avatar", "button"],
	},
	{
		slug: "recipe-card",
		name: "Recipe Card",
		component: "RecipeCard",
		description: "Recipe photo, name, time, servings and difficulty, ingredient chips and a cook button.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "chip", "badge", "separator", "icon", "text", "button"],
	},
	{
		slug: "profile-card",
		name: "Profile Card",
		component: "ProfileCard",
		description: "Avatar, name, short bio, stats and follow and message buttons.",
		categories: ["card", "social"],
		base: "card",
		builtWith: ["card", "avatar", "title", "text", "separator", "button"],
	},
	{
		slug: "article-card",
		name: "Article Card",
		component: "ArticleCard",
		description: "Cover image, category, headline, excerpt, author and reading time.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "title", "text", "avatar"],
	},
	{
		slug: "event-card",
		name: "Event Card",
		component: "EventCard",
		description: "Event photo with a date tile, time and place, who's going and a ticket button.",
		categories: ["card", "social"],
		base: "card",
		builtWith: ["card", "title", "text", "icon", "avatar", "button"],
	},
	{
		slug: "settings-item",
		name: "Settings Item",
		component: "SettingsItem",
		description: "Settings row with an icon, a label, a value and a chevron or a switch.",
		categories: ["item", "list", "form"],
		base: "item",
		builtWith: ["item", "icon", "switch", "text"],
	},
	{
		slug: "track-item",
		name: "Track Item",
		component: "TrackItem",
		description: "Artwork, title, artist, duration and a more button, with a now-playing state.",
		categories: ["item", "list", "media"],
		base: "item",
		builtWith: ["item", "text", "badge", "icon-button"],
	},
	{
		slug: "conversation-item",
		name: "Conversation Item",
		component: "ConversationItem",
		description: "Avatar, name, last message, time and an unread counter.",
		categories: ["item", "list", "social"],
		base: "item",
		builtWith: ["item", "avatar", "text", "badge"],
	},
	{
		slug: "notification-item",
		name: "Notification Item",
		component: "NotificationItem",
		description: "Avatar or icon, a message after the actor's name, time, unread dot and an optional button.",
		categories: ["item", "list", "feedback"],
		base: "item",
		builtWith: ["item", "avatar", "icon", "text", "badge", "button"],
	},
	{
		slug: "search-result-item",
		name: "Search Result Item",
		component: "SearchResultItem",
		description: "Image or icon, title with the match in bold, subtitle, metadata and an action.",
		categories: ["item", "list"],
		base: "item",
		builtWith: ["item", "icon", "icon-button", "text"],
	},
	{
		slug: "offer-card",
		name: "Offer Card",
		component: "OfferCard",
		description: "Card art, a badge, the main benefit, short highlights, the fee and an apply button.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "badge", "title", "text", "icon", "button"],
	},
	{
		slug: "pricing-card",
		name: "Pricing Card",
		component: "PricingCard",
		description: "Plan name, price and period, features, and a button, with featured and current states.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "badge", "title", "text", "icon", "button"],
	},
	{
		slug: "stats-card",
		name: "Stats Card",
		component: "StatsCard",
		description: "A metric, its label and icon, and its change against the last period.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "title", "text", "badge", "icon"],
	},
	{
		slug: "search-app-bar",
		name: "Search App Bar",
		component: "SearchAppBar",
		description: "Back or close, a search field in the bar and up to two actions.",
		categories: ["navigation", "form"],
		base: "app-bar",
		builtWith: ["app-bar", "search-bar", "icon-button", "badge"],
	},
	{
		slug: "profile-app-bar",
		name: "Profile App Bar",
		component: "ProfileAppBar",
		description: "Avatar, greeting and name, with notification and menu buttons.",
		categories: ["navigation", "social"],
		base: "app-bar",
		builtWith: ["app-bar", "avatar", "title", "text", "icon-button", "badge", "tappable"],
	},
];

export const compositionHref = (slug: string) => `/docs/compositions/${slug}`;

export interface Block {
	/** Registry name, used by `npx axiom add` and in the URL. */
	slug: string;
	name: string;
	description: string;
	categories: CompositionCategory[];
	/** Composition slugs it uses, listed first in "Built with". */
	compositions: string[];
	builtWith: PrimitiveName[];
}

/** Available blocks. Planned ones are listed on /docs/blocks only. */
export const blocks: Block[] = [
	{
		slug: "settings-section",
		name: "Settings Section",
		description: "A titled group of Settings Items with a footer note.",
		categories: ["list", "form"],
		compositions: ["settings-item"],
		builtWith: ["text"],
	},
];

export const blockHref = (slug: string) => `/docs/blocks/${slug}`;

export type GalleryKind = "composition" | "block";

/** What a gallery card shows, for a composition or a block. */
export interface GalleryItem {
	kind: GalleryKind;
	slug: string;
	name: string;
	description: string;
	href: string;
	categories: CompositionCategory[];
	/** Names shown under "Built with". */
	builtWith: string[];
}

export const compositionItem = (c: Composition): GalleryItem => ({
	kind: "composition",
	slug: c.slug,
	name: c.name,
	description: c.description,
	href: compositionHref(c.slug),
	categories: c.categories,
	builtWith: c.builtWith.map((name) => primitives[name].name),
});

export const blockItem = (b: Block): GalleryItem => ({
	kind: "block",
	slug: b.slug,
	name: b.name,
	description: b.description,
	href: blockHref(b.slug),
	categories: b.categories,
	builtWith: [
		...b.compositions.map((slug) => compositions.find((c) => c.slug === slug)?.name ?? slug),
		...b.builtWith.map((name) => primitives[name].name),
	],
});

export const galleryItems: GalleryItem[] = [...compositions.map(compositionItem), ...blocks.map(blockItem)];

/** Compositions that use a primitive, derived one first. */
export function compositionsBuiltWith(primitive: PrimitiveName): Composition[] {
	return compositions
		.filter((c) => c.builtWith.includes(primitive))
		.sort((a, b) => Number(b.base === primitive) - Number(a.base === primitive));
}
