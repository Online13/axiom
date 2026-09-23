import { StyleSheet } from "react-native";

// Raw values of the design system. They carry no meaning on their own and are the same in light and dark.

export const paletteSteps = [
	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type PaletteStep = (typeof paletteSteps)[number];

export type Hue =
	| "gray"
	| "red"
	| "orange"
	| "yellow"
	| "green"
	| "mint"
	| "teal"
	| "cyan"
	| "blue"
	| "indigo"
	| "purple"
	| "pink"
	| "brown";

export type Palette = Record<Hue, Record<PaletteStep, string>>;

export type Spacing = Record<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12, number>;

export type Radius = Record<
	"none" | "sm" | "md" | "lg" | "xl" | "full",
	number
>;

export type TypographyVariant =
	| "largeTitle"
	| "title1"
	| "title2"
	| "title3"
	| "headline"
	| "body"
	| "callout"
	| "subheadline"
	| "footnote"
	| "caption";

export type TypographyStyle = {
	fontSize: number;
	lineHeight: number;
	fontWeight: "400" | "500" | "600" | "700" | "800";
	/** Negative on display sizes, so large headings stay tight. */
	letterSpacing?: number;
	fontFamily?: string;
};

export type Typography = Record<TypographyVariant, TypographyStyle>;

type Scale = Record<"sm" | "md" | "lg", number>;

export type Sizes = {
	icon: Scale;
	avatar: Scale;
	control: Scale;
};

export type Metrics = {
	touchTarget: number;
	/** How far a button-like target shrinks while held. */
	pressScale: number;
	/** How far a modal surface shrinks when another one opens over it, per level of depth. */
	stackScale: number;
	screenMargin: number;
	hairline: number;
};

export type Tokens = {
	palette: Palette;
	spacing: Spacing;
	radius: Radius;
	typography: Typography;
	sizes: Sizes;
	metrics: Metrics;
};

// Colors are `hsla()` strings, rounded to whole numbers: edit the lightness to get a lighter or darker step,
// the alpha for transparency.
// Step 500 is the iOS system color; the other steps are derived from it in OKLCH.
export const palette = {
	gray: {
		50: "hsla(0, 0%, 96%, 1)",
		100: "hsla(240, 2%, 91%, 1)",
		200: "hsla(240, 2%, 82%, 1)",
		300: "hsla(240, 3%, 73%, 1)",
		400: "hsla(240, 2%, 65%, 1)",
		500: "hsla(240, 2%, 57%, 1)",
		600: "hsla(240, 2%, 48%, 1)",
		700: "hsla(240, 2%, 39%, 1)",
		800: "hsla(240, 2%, 30%, 1)",
		900: "hsla(240, 3%, 20%, 1)",
		950: "hsla(240, 4%, 14%, 1)",
	},
	red: {
		50: "hsla(7, 100%, 97%, 1)",
		100: "hsla(8, 100%, 93%, 1)",
		200: "hsla(8, 100%, 86%, 1)",
		300: "hsla(7, 98%, 77%, 1)",
		400: "hsla(6, 99%, 69%, 1)",
		500: "hsla(3, 100%, 59%, 1)",
		600: "hsla(2, 74%, 50%, 1)",
		700: "hsla(0, 86%, 39%, 1)",
		800: "hsla(359, 96%, 29%, 1)",
		900: "hsla(359, 100%, 20%, 1)",
		950: "hsla(359, 100%, 14%, 1)",
	},
	orange: {
		50: "hsla(25, 100%, 96%, 1)",
		100: "hsla(27, 100%, 93%, 1)",
		200: "hsla(28, 100%, 85%, 1)",
		300: "hsla(28, 100%, 77%, 1)",
		400: "hsla(29, 99%, 68%, 1)",
		500: "hsla(35, 100%, 50%, 1)",
		600: "hsla(34, 95%, 43%, 1)",
		700: "hsla(33, 89%, 35%, 1)",
		800: "hsla(34, 95%, 26%, 1)",
		900: "hsla(33, 98%, 17%, 1)",
		950: "hsla(31, 100%, 12%, 1)",
	},
	yellow: {
		50: "hsla(46, 91%, 95%, 1)",
		100: "hsla(44, 100%, 92%, 1)",
		200: "hsla(44, 97%, 85%, 1)",
		300: "hsla(44, 98%, 78%, 1)",
		400: "hsla(45, 99%, 69%, 1)",
		500: "hsla(48, 100%, 50%, 1)",
		600: "hsla(48, 98%, 42%, 1)",
		700: "hsla(47, 93%, 34%, 1)",
		800: "hsla(47, 91%, 26%, 1)",
		900: "hsla(46, 93%, 17%, 1)",
		950: "hsla(45, 96%, 11%, 1)",
	},
	green: {
		50: "hsla(124, 58%, 95%, 1)",
		100: "hsla(126, 63%, 90%, 1)",
		200: "hsla(125, 60%, 82%, 1)",
		300: "hsla(127, 57%, 72%, 1)",
		400: "hsla(130, 56%, 62%, 1)",
		500: "hsla(135, 59%, 49%, 1)",
		600: "hsla(137, 72%, 39%, 1)",
		700: "hsla(141, 96%, 27%, 1)",
		800: "hsla(141, 100%, 20%, 1)",
		900: "hsla(139, 100%, 14%, 1)",
		950: "hsla(135, 100%, 9%, 1)",
	},
	mint: {
		50: "hsla(172, 60%, 95%, 1)",
		100: "hsla(174, 61%, 90%, 1)",
		200: "hsla(174, 60%, 81%, 1)",
		300: "hsla(175, 58%, 70%, 1)",
		400: "hsla(176, 58%, 59%, 1)",
		500: "hsla(177, 100%, 39%, 1)",
		600: "hsla(177, 91%, 35%, 1)",
		700: "hsla(177, 82%, 29%, 1)",
		800: "hsla(177, 89%, 21%, 1)",
		900: "hsla(177, 94%, 14%, 1)",
		950: "hsla(177, 96%, 9%, 1)",
	},
	teal: {
		50: "hsla(189, 58%, 95%, 1)",
		100: "hsla(191, 64%, 90%, 1)",
		200: "hsla(190, 59%, 81%, 1)",
		300: "hsla(190, 57%, 71%, 1)",
		400: "hsla(190, 56%, 61%, 1)",
		500: "hsla(189, 61%, 48%, 1)",
		600: "hsla(189, 73%, 38%, 1)",
		700: "hsla(188, 94%, 28%, 1)",
		800: "hsla(188, 96%, 21%, 1)",
		900: "hsla(189, 95%, 14%, 1)",
		950: "hsla(189, 100%, 10%, 1)",
	},
	cyan: {
		50: "hsla(202, 90%, 96%, 1)",
		100: "hsla(202, 95%, 92%, 1)",
		200: "hsla(202, 90%, 84%, 1)",
		300: "hsla(202, 84%, 75%, 1)",
		400: "hsla(201, 80%, 66%, 1)",
		500: "hsla(199, 78%, 55%, 1)",
		600: "hsla(198, 74%, 45%, 1)",
		700: "hsla(197, 91%, 33%, 1)",
		800: "hsla(198, 94%, 25%, 1)",
		900: "hsla(198, 93%, 17%, 1)",
		950: "hsla(199, 100%, 12%, 1)",
	},
	blue: {
		50: "hsla(218, 100%, 96%, 1)",
		100: "hsla(216, 100%, 92%, 1)",
		200: "hsla(215, 98%, 84%, 1)",
		300: "hsla(215, 98%, 74%, 1)",
		400: "hsla(215, 98%, 65%, 1)",
		500: "hsla(211, 100%, 50%, 1)",
		600: "hsla(212, 94%, 44%, 1)",
		700: "hsla(212, 95%, 36%, 1)",
		800: "hsla(213, 99%, 28%, 1)",
		900: "hsla(214, 98%, 20%, 1)",
		950: "hsla(215, 100%, 15%, 1)",
	},
	indigo: {
		50: "hsla(233, 100%, 97%, 1)",
		100: "hsla(232, 95%, 92%, 1)",
		200: "hsla(233, 90%, 85%, 1)",
		300: "hsla(234, 77%, 76%, 1)",
		400: "hsla(237, 68%, 67%, 1)",
		500: "hsla(241, 61%, 59%, 1)",
		600: "hsla(242, 46%, 51%, 1)",
		700: "hsla(242, 47%, 43%, 1)",
		800: "hsla(243, 52%, 34%, 1)",
		900: "hsla(245, 60%, 25%, 1)",
		950: "hsla(248, 71%, 19%, 1)",
	},
	purple: {
		50: "hsla(278, 100%, 97%, 1)",
		100: "hsla(277, 94%, 93%, 1)",
		200: "hsla(277, 92%, 86%, 1)",
		300: "hsla(278, 79%, 77%, 1)",
		400: "hsla(279, 72%, 69%, 1)",
		500: "hsla(280, 68%, 60%, 1)",
		600: "hsla(280, 51%, 51%, 1)",
		700: "hsla(280, 54%, 41%, 1)",
		800: "hsla(281, 63%, 32%, 1)",
		900: "hsla(283, 85%, 21%, 1)",
		950: "hsla(283, 97%, 15%, 1)",
	},
	pink: {
		50: "hsla(0, 100%, 97%, 1)",
		100: "hsla(0, 100%, 94%, 1)",
		200: "hsla(359, 97%, 87%, 1)",
		300: "hsla(358, 100%, 80%, 1)",
		400: "hsla(355, 100%, 72%, 1)",
		500: "hsla(349, 100%, 59%, 1)",
		600: "hsla(346, 80%, 48%, 1)",
		700: "hsla(344, 96%, 36%, 1)",
		800: "hsla(345, 93%, 29%, 1)",
		900: "hsla(346, 98%, 20%, 1)",
		950: "hsla(348, 100%, 14%, 1)",
	},
	brown: {
		50: "hsla(33, 36%, 95%, 1)",
		100: "hsla(33, 33%, 89%, 1)",
		200: "hsla(35, 31%, 79%, 1)",
		300: "hsla(33, 29%, 69%, 1)",
		400: "hsla(33, 28%, 60%, 1)",
		500: "hsla(34, 27%, 50%, 1)",
		600: "hsla(34, 29%, 42%, 1)",
		700: "hsla(33, 31%, 34%, 1)",
		800: "hsla(34, 37%, 25%, 1)",
		900: "hsla(34, 47%, 17%, 1)",
		950: "hsla(34, 61%, 11%, 1)",
	},
} satisfies Palette;

export const spacing = {
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	8: 32,
	10: 40,
	12: 48,
} satisfies Spacing;

// Radii are generous: cards and sheets read as rounded surfaces, and `full` makes a pill.
export const radius = {
	none: 0,
	sm: 8,
	md: 12,
	lg: 18,
	xl: 26,
	full: 9999,
} satisfies Radius;

export const typography = {
	largeTitle: {
		fontSize: 34,
		lineHeight: 40,
		fontWeight: "800",
		letterSpacing: -0.8,
	},
	title1: {
		fontSize: 28,
		lineHeight: 33,
		fontWeight: "800",
		letterSpacing: -0.6,
	},
	title2: {
		fontSize: 22,
		lineHeight: 27,
		fontWeight: "700",
		letterSpacing: -0.4,
	},
	title3: {
		fontSize: 20,
		lineHeight: 25,
		fontWeight: "700",
		letterSpacing: -0.3,
	},
	headline: {
		fontSize: 17,
		lineHeight: 22,
		fontWeight: "600",
		letterSpacing: -0.2,
	},
	body: { fontSize: 17, lineHeight: 23, fontWeight: "400" },
	callout: { fontSize: 16, lineHeight: 21, fontWeight: "400" },
	subheadline: { fontSize: 15, lineHeight: 20, fontWeight: "400" },
	footnote: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
	caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
} satisfies Typography;

export const sizes = {
	icon: { sm: 16, md: 20, lg: 24 },
	avatar: { sm: 32, md: 40, lg: 56 },
	control: { sm: 32, md: 44, lg: 52 },
} satisfies Sizes;

export const metrics = {
	touchTarget: 44,
	pressScale: 0.97,
	stackScale: 0.915,
	screenMargin: 16,
	hairline: StyleSheet.hairlineWidth,
} satisfies Metrics;

export const tokens = {
	palette,
	spacing,
	radius,
	typography,
	sizes,
	metrics,
} satisfies Tokens;
