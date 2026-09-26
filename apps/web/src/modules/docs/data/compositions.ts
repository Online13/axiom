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
	"app-bar": { name: "AppBar", href: "/docs/templates/app-bar" },
	avatar: { name: "Avatar", href: "/docs/atoms/avatar" },
	badge: { name: "Badge", href: "/docs/atoms/badge" },
	button: { name: "Button", href: "/docs/atoms/button" },
	card: { name: "Card", href: "/docs/atoms/card" },
	carousel: { name: "Carousel", href: "/docs/atoms/carousel" },
	chip: { name: "Chip", href: "/docs/atoms/chip" },
	empty: { name: "Empty", href: "/docs/atoms/empty" },
	icon: { name: "Icon", href: "/docs/atoms/icon" },
	"icon-button": { name: "IconButton", href: "/docs/atoms/icon-button" },
	input: { name: "Input", href: "/docs/atoms/input" },
	item: { name: "Item", href: "/docs/atoms/item" },
	"option-item": { name: "OptionItem", href: "/docs/atoms/option-item" },
	"search-bar": { name: "SearchBar", href: "/docs/molecules/search-bar" },
	separator: { name: "Separator", href: "/docs/atoms/separator" },
	switch: { name: "Switch", href: "/docs/atoms/switch" },
	tappable: { name: "Tappable", href: "/docs/core/tappable" },
	text: { name: "Text", href: "/docs/atoms/text" },
	title: { name: "Title", href: "/docs/atoms/title" },
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
		slug: "listing-card",
		name: "Listing Card",
		component: "ListingCard",
		description: "A home or a stay: photos, price, address and specs, stacked or over the photo.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "carousel", "badge", "separator", "icon", "text", "title", "avatar", "button"],
		usedIn: [],
	},
	{
		slug: "recipe-card",
		name: "Recipe Card",
		component: "RecipeCard",
		description: "Recipe photo, name, time, servings and difficulty, ingredient chips and a cook button.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "chip", "badge", "separator", "icon", "text", "button"],
		usedIn: [],
	},
	{
		slug: "profile-card",
		name: "Profile Card",
		component: "ProfileCard",
		description: "Avatar, name, short bio, stats and follow and message buttons.",
		categories: ["card", "social"],
		base: "card",
		builtWith: ["card", "avatar", "title", "text", "separator", "button"],
		usedIn: [],
	},
	{
		slug: "article-card",
		name: "Article Card",
		component: "ArticleCard",
		description: "Cover image, category, headline, excerpt, author and reading time.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "title", "text", "avatar"],
		usedIn: [],
	},
	{
		slug: "event-card",
		name: "Event Card",
		component: "EventCard",
		description: "Event photo with a date tile, time and place, who's going and a ticket button.",
		categories: ["card", "social"],
		base: "card",
		builtWith: ["card", "title", "text", "icon", "avatar", "button"],
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
	{
		slug: "track-item",
		name: "Track Item",
		component: "TrackItem",
		description: "Artwork, title, artist, duration and a more button, with a now-playing state.",
		categories: ["item", "list", "media"],
		base: "item",
		builtWith: ["item", "text", "badge", "icon-button"],
		usedIn: [],
	},
	{
		slug: "conversation-item",
		name: "Conversation Item",
		component: "ConversationItem",
		description: "Avatar, name, last message, time and an unread counter.",
		categories: ["item", "list", "social"],
		base: "item",
		builtWith: ["item", "avatar", "text", "badge"],
		usedIn: [],
	},
	{
		slug: "notification-item",
		name: "Notification Item",
		component: "NotificationItem",
		description: "Avatar or icon, a message after the actor's name, time, unread dot and an optional button.",
		categories: ["item", "list", "feedback"],
		base: "item",
		builtWith: ["item", "avatar", "icon", "text", "badge", "button"],
		usedIn: [],
	},
	{
		slug: "search-result-item",
		name: "Search Result Item",
		component: "SearchResultItem",
		description: "Image or icon, title with the match in bold, subtitle, metadata and an action.",
		categories: ["item", "list"],
		base: "item",
		builtWith: ["item", "icon", "icon-button", "text"],
		usedIn: [],
	},
	{
		slug: "offer-card",
		name: "Offer Card",
		component: "OfferCard",
		description: "Card art, a badge, the main benefit, short highlights, the fee and an apply button.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "badge", "title", "text", "icon", "button"],
		usedIn: [],
	},
	{
		slug: "pricing-card",
		name: "Pricing Card",
		component: "PricingCard",
		description: "Plan name, price and period, features, and a button, with featured and current states.",
		categories: ["card", "commerce"],
		base: "card",
		builtWith: ["card", "badge", "title", "text", "icon", "button"],
		usedIn: [],
	},
	{
		slug: "stats-card",
		name: "Stats Card",
		component: "StatsCard",
		description: "A metric, its label and icon, and its change against the last period.",
		categories: ["card", "content"],
		base: "card",
		builtWith: ["card", "title", "text", "badge", "icon"],
		usedIn: [],
	},
	{
		slug: "search-app-bar",
		name: "Search App Bar",
		component: "SearchAppBar",
		description: "Back or close, a search field in the bar and up to two actions.",
		categories: ["navigation", "form"],
		base: "app-bar",
		builtWith: ["app-bar", "search-bar", "icon-button", "badge"],
		usedIn: [],
	},
	{
		slug: "profile-app-bar",
		name: "Profile App Bar",
		component: "ProfileAppBar",
		description: "Avatar, greeting and name, with notification and menu buttons.",
		categories: ["navigation", "social"],
		base: "app-bar",
		builtWith: ["app-bar", "avatar", "title", "text", "icon-button", "badge", "tappable"],
		usedIn: [],
	},
];

export const compositionHref = (slug: string) => `/docs/compositions/${slug}`;

/** Compositions that use a primitive, derived one first. */
export function compositionsBuiltWith(primitive: PrimitiveName): Composition[] {
	return compositions
		.filter((c) => c.builtWith.includes(primitive))
		.sort((a, b) => Number(b.base === primitive) - Number(a.base === primitive));
}
