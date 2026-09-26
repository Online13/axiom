// Everything Index shows, in one place: the same people, stories and
// collections come back from screen to screen, so the previews read as one
// product and not as a set of templates.

import type { Cover } from "./Artwork";

export const authors = {
	noor: {
		name: "Noor Haddad",
		initials: "NH",
		role: "Editor at Index · Lisbon",
		bio: "Writes about interfaces, attention and the tools we live with.",
	},
	clara: {
		name: "Clara Ines",
		initials: "CI",
		role: "Architecture writer",
		bio: "Buildings, coastlines and the people who design for both.",
	},
	jonas: {
		name: "Jonas Vey",
		initials: "JV",
		role: "Photographer",
		bio: "Long walks, cold places, slow film.",
	},
	theo: {
		name: "Theo Lambert",
		initials: "TL",
		role: "Cities editor",
		bio: "How streets, trams and small shops shape a day.",
	},
} as const;

export type AuthorId = keyof typeof authors;

export type Story = {
	title: string;
	topic: string;
	author: AuthorId;
	minutes: number;
	cover: Cover;
};

export const stories = {
	quiet: {
		title: "Designing for quiet attention",
		topic: "Design",
		author: "noor",
		minutes: 7,
		cover: "plans",
	},
	tide: {
		title: "The architects who build for the tide",
		topic: "Architecture",
		author: "clara",
		minutes: 12,
		cover: "quay",
	},
	treeline: {
		title: "A winter above the tree line",
		topic: "Photography",
		author: "jonas",
		minutes: 8,
		cover: "ridge",
	},
	presses: {
		title: "Why small presses keep printing",
		topic: "Publishing",
		author: "theo",
		minutes: 6,
		cover: "books",
	},
	slowCity: {
		title: "Cities that slow down on purpose",
		topic: "Cities",
		author: "theo",
		minutes: 9,
		cover: "tram",
	},
	materials: {
		title: "A field guide to calm materials",
		topic: "Design",
		author: "noor",
		minutes: 4,
		cover: "stones",
	},
	rooms: {
		title: "Rooms that do one thing well",
		topic: "Architecture",
		author: "clara",
		minutes: 6,
		cover: "cabin",
	},
	kyoto: {
		title: "Kyoto after the crowds",
		topic: "Cities",
		author: "jonas",
		minutes: 7,
		cover: "kyoto",
	},
} as const satisfies Record<string, Story>;

export type Collection = {
	title: string;
	count: number;
	covers: readonly [Cover, Cover, Cover, Cover];
};

/** Topic collections curated by the editors. */
export const collections = {
	calm: {
		title: "Designing calm interfaces",
		count: 12,
		covers: ["stones", "plans", "cabin", "library"],
	},
	cities: {
		title: "Future cities",
		count: 18,
		covers: ["tram", "lisbon", "kyoto", "quay"],
	},
	publishing: {
		title: "Independent publishing",
		count: 9,
		covers: ["books", "library", "counter", "plans"],
	},
} as const satisfies Record<string, Collection>;

/** The reader's own collections, on Saved and Profile. */
export const saved = {
	later: {
		title: "Read later",
		count: 14,
		covers: ["quay", "ridge", "books", "tram"],
	},
	design: {
		title: "Design",
		count: 23,
		covers: ["plans", "stones", "library", "cafe"],
	},
	architecture: {
		title: "Architecture",
		count: 20,
		covers: ["cabin", "quay", "lisbon", "coast"],
	},
	ideas: {
		title: "Ideas",
		count: 7,
		covers: ["fjord", "latte", "bakery", "kyoto"],
	},
} as const satisfies Record<string, Collection>;

export const reader = {
	name: "Sam Okafor",
	initials: "SO",
	handle: "@samreads",
	email: "sam@okafor.studio",
	bio: "Architecture student in Rotterdam. Collecting good sentences and quiet buildings.",
} as const;
