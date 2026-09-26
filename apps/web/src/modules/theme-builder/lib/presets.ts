// Ready-made themes, one per product mood. Each one is a full Theme: every role
// of both schemes set by hand as a hex, plus a Google Font pairing, corners and
// density that suit the mood. Picking a preset replaces the whole theme.

import type { ColorScheme } from "@docs/lib/tokens";
import { hexToRgb, onColor, rgbToHex } from "./color";
import type {
	ControlShape,
	FontFamily,
	RadiusScale,
	RoleOverrides,
	SpacingScale,
	Theme,
} from "./theme";

/** The handful of colors a scheme is written with; the rest is derived. */
type Scheme = {
	bg: string;
	subtle: string;
	elevated: string;
	fg: string;
	muted: string;
	/** Placeholders, hints: `content.subtle` and `border.strong`. */
	faint: string;
	border: string;
	accent: string;
	/** Defaults to the accent. */
	link?: string;
	highlight: string;
	info: string;
	success: string;
	warning: string;
	error: string;
};

/** `amount` of `to` over `from`, in sRGB. */
const mix = (from: string, to: string, amount: number) => {
	const a = hexToRgb(from);
	const b = hexToRgb(to);
	const at = (x: number, y: number) => x + (y - x) * amount;
	return rgbToHex({ r: at(a.r, b.r), g: at(a.g, b.g), b: at(a.b, b.b) });
};

function roles(s: Scheme): Record<string, string> {
	const tint = (color: string) => mix(s.bg, color, 0.16);
	return {
		"background.default": s.bg,
		"background.subtle": s.subtle,
		"background.elevated": s.elevated,
		"background.inverse": s.fg,
		"content.default": s.fg,
		"content.muted": s.muted,
		"content.subtle": s.faint,
		"content.disabled": mix(s.bg, s.faint, 0.6),
		"content.inverse": s.bg,
		"content.link": s.link ?? s.accent,
		"border.default": s.border,
		"border.subtle": mix(s.bg, s.border, 0.5),
		"border.strong": s.faint,
		"border.focus": s.link ?? s.accent,
		"primary.default": s.accent,
		"primary.pressed": mix(s.accent, s.fg, 0.25),
		"primary.subtle": tint(s.accent),
		"primary.on": onColor(s.accent),
		"highlight.default": s.highlight,
		"highlight.subtle": tint(s.highlight),
		"highlight.on": onColor(s.highlight),
		"feedback.info": s.info,
		"feedback.infoSubtle": tint(s.info),
		"feedback.success": s.success,
		"feedback.successSubtle": tint(s.success),
		"feedback.warning": s.warning,
		"feedback.warningSubtle": tint(s.warning),
		"feedback.error": s.error,
		"feedback.errorSubtle": tint(s.error),
	};
}

export type Preset = { id: string; description: string; theme: Theme };

type Look = {
	fonts: { heading: FontFamily; body: FontFamily };
	radius: RadiusScale;
	controls: ControlShape;
	spacing: SpacingScale;
};

function preset(
	name: string,
	description: string,
	schemes: Record<ColorScheme, Scheme>,
	look: Look,
): Preset {
	const light = roles(schemes.light);
	const dark = roles(schemes.dark);
	const overrides: RoleOverrides = {};
	for (const path of Object.keys(light))
		overrides[path] = {
			light: light[path].toLowerCase(),
			dark: dark[path].toLowerCase(),
		};
	return {
		id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
		description,
		theme: { name, overrides, ...look },
	};
}

export const presets: Preset[] = [
		preset(
		"Media",
		"Near-black surfaces, a vivid accent on pill buttons and a steady rhythm for content-heavy interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f6f6f6",
				elevated: "#ffffff",
				fg: "#121212",
				muted: "#6a6a6a",
				faint: "#a7a7a7",
				border: "#dedede",
				accent: "#1ed760",
				link: "#117a37",
				highlight: "#ffa42b",
				info: "#0d72ea",
				success: "#117a37",
				warning: "#9d5d00",
				error: "#e91429",
			},
			dark: {
				bg: "#121212",
				subtle: "#000000",
				elevated: "#1f1f1f",
				fg: "#ffffff",
				muted: "#b3b3b3",
				faint: "#7c7c7c",
				border: "#2a2a2a",
				accent: "#1ed760",
				highlight: "#ffa42b",
				info: "#509bf5",
				success: "#1ed760",
				warning: "#ffa42b",
				error: "#f3727f",
			},
		},
		{
			fonts: { heading: "Figtree", body: "Figtree" },
			radius: "default",
			controls: "pill",
			spacing: "default",
		},
	),
		preset(
		"Warm",
		"Generous white space, soft large cards and one warm accent kept for the action that matters.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f7f7f7",
				elevated: "#ffffff",
				fg: "#222222",
				muted: "#6a6a6a",
				faint: "#b0b0b0",
				border: "#dddddd",
				accent: "#ff385c",
				link: "#222222",
				highlight: "#460479",
				info: "#428bff",
				success: "#008a05",
				warning: "#c45500",
				error: "#c13515",
			},
			dark: {
				bg: "#121212",
				subtle: "#1c1c1c",
				elevated: "#242424",
				fg: "#ffffff",
				muted: "#b0b0b0",
				faint: "#6a6a6a",
				border: "#3a3a3a",
				accent: "#ff385c",
				link: "#ffffff",
				highlight: "#b98cff",
				info: "#6ea4ff",
				success: "#3fc04a",
				warning: "#f5a142",
				error: "#ff6b5b",
			},
		},
		{
			fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans" },
			radius: "round",
			controls: "rounded",
			spacing: "comfortable",
		},
	),
		preset(
		"Precision",
		"Compact spacing, neutral typography and a restrained radius, designed for dense product interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f7f8f8",
				elevated: "#ffffff",
				fg: "#1b1c1f",
				muted: "#6b6f76",
				faint: "#a0a3a9",
				border: "#e4e5e7",
				accent: "#5e6ad2",
				highlight: "#d58f2e",
				info: "#2f80ed",
				success: "#26a269",
				warning: "#d97706",
				error: "#e5484d",
			},
			dark: {
				bg: "#08090a",
				subtle: "#0f1011",
				elevated: "#161718",
				fg: "#f7f8f8",
				muted: "#8a8f98",
				faint: "#62666d",
				border: "#23252a",
				accent: "#5e6ad2",
				link: "#828fff",
				highlight: "#f2c94c",
				info: "#4ea7fc",
				success: "#4cb782",
				warning: "#f2994a",
				error: "#eb5757",
			},
		},
		{
			fonts: { heading: "Inter", body: "Inter" },
			radius: "default",
			controls: "rounded",
			spacing: "compact",
		},
	),
		preset(
		"Editorial",
		"Warm grays, square controls and text first, with color only where the content asks for it.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f7f7f5",
				elevated: "#ffffff",
				fg: "#37352f",
				muted: "#787774",
				faint: "#a5a29a",
				border: "#e9e9e7",
				accent: "#2383e2",
				highlight: "#cb912f",
				info: "#337ea9",
				success: "#448361",
				warning: "#d9730d",
				error: "#d44c47",
			},
			dark: {
				bg: "#191919",
				subtle: "#202020",
				elevated: "#252525",
				fg: "#d4d4d4",
				muted: "#9b9b9b",
				faint: "#6f6f6f",
				border: "#2f2f2f",
				accent: "#2383e2",
				link: "#529cca",
				highlight: "#ca9849",
				info: "#529cca",
				success: "#4dab9a",
				warning: "#d9730d",
				error: "#df5452",
			},
		},
		{
			fonts: { heading: "Inter", body: "Inter" },
			radius: "subtle",
			controls: "square",
			spacing: "default",
		},
	),
		preset(
		"Playful",
		"Bright colors, rounded shapes and friendly typography for encouraging, lively interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f7f7f7",
				elevated: "#ffffff",
				fg: "#4b4b4b",
				muted: "#777777",
				faint: "#afafaf",
				border: "#e5e5e5",
				accent: "#58cc02",
				link: "#1899d6",
				highlight: "#ffc800",
				info: "#1cb0f6",
				success: "#58a700",
				warning: "#ff9600",
				error: "#ea2b2b",
			},
			dark: {
				bg: "#131f24",
				subtle: "#0f181c",
				elevated: "#202f36",
				fg: "#f1f7fb",
				muted: "#a3b5bf",
				faint: "#52656d",
				border: "#37464f",
				accent: "#93d333",
				link: "#49c0f8",
				highlight: "#ffc800",
				info: "#49c0f8",
				success: "#93d333",
				warning: "#ff9600",
				error: "#ff4b4b",
			},
		},
		{
			fonts: { heading: "Nunito", body: "Nunito" },
			radius: "round",
			controls: "rounded",
			spacing: "comfortable",
		},
	),
		preset(
		"Modern",
		"Gray canvas, white cards, one confident blue and pill controls with a tight display face.",
		{
			light: {
				bg: "#f7f7f7",
				subtle: "#ededf0",
				elevated: "#ffffff",
				fg: "#191c1f",
				muted: "#717173",
				faint: "#a3aab0",
				border: "#e2e2e7",
				accent: "#0075eb",
				highlight: "#7f84f6",
				info: "#0075eb",
				success: "#00a87e",
				warning: "#ec7e00",
				error: "#e23b4a",
			},
			dark: {
				bg: "#000000",
				subtle: "#0b0b0c",
				elevated: "#1c1c1e",
				fg: "#ffffff",
				muted: "#8b959e",
				faint: "#5c6770",
				border: "#2a2d31",
				accent: "#2e89ff",
				highlight: "#9ea2ff",
				info: "#2e89ff",
				success: "#00be90",
				warning: "#ff9d2e",
				error: "#ff5a5f",
			},
		},
		{
			fonts: { heading: "Inter Tight", body: "Inter" },
			radius: "round",
			controls: "pill",
			spacing: "default",
		},
	),
		preset(
		"Calm",
		"Generous spacing, soft radius and relaxed typography for quieter interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f9f4f2",
				elevated: "#ffffff",
				fg: "#2d2c2b",
				muted: "#63605c",
				faint: "#a09d99",
				border: "#ebe5e0",
				accent: "#0061ef",
				highlight: "#ff7e1d",
				info: "#0061ef",
				success: "#008a5e",
				warning: "#c77700",
				error: "#e54530",
			},
			dark: {
				bg: "#131629",
				subtle: "#0d0f1f",
				elevated: "#1f2340",
				fg: "#f4f3f8",
				muted: "#b4b6cc",
				faint: "#6d7090",
				border: "#2c3052",
				accent: "#4b8bff",
				highlight: "#ff9b54",
				info: "#4b8bff",
				success: "#3ecf8e",
				warning: "#ffce00",
				error: "#ff6b5b",
			},
		},
		{
			fonts: { heading: "DM Sans", body: "DM Sans" },
			radius: "round",
			controls: "pill",
			spacing: "spacious",
		},
	),
		preset(
		"Dense",
		"Charcoal surfaces, small corners and compact spacing for busy, information-rich screens.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f2f3f5",
				elevated: "#ffffff",
				fg: "#313338",
				muted: "#4e5058",
				faint: "#80848e",
				border: "#e1e2e4",
				accent: "#5865f2",
				link: "#006ce7",
				highlight: "#eb459e",
				info: "#006ce7",
				success: "#248046",
				warning: "#a36a00",
				error: "#da373c",
			},
			dark: {
				bg: "#313338",
				subtle: "#2b2d31",
				elevated: "#383a40",
				fg: "#f2f3f5",
				muted: "#b5bac1",
				faint: "#80848e",
				border: "#3f4147",
				accent: "#5865f2",
				link: "#00a8fc",
				highlight: "#eb459e",
				info: "#00a8fc",
				success: "#23a55a",
				warning: "#f0b232",
				error: "#f23f43",
			},
		},
		{
			fonts: { heading: "Rubik", body: "Noto Sans" },
			radius: "default",
			controls: "rounded",
			spacing: "compact",
		},
	),
		preset(
		"Utility",
		"Black and white with color kept for status, for direct, task-focused interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f3f3f3",
				elevated: "#ffffff",
				fg: "#000000",
				muted: "#5e5e5e",
				faint: "#a6a6a6",
				border: "#e8e8e8",
				accent: "#000000",
				link: "#276ef1",
				highlight: "#ffc043",
				info: "#276ef1",
				success: "#05944f",
				warning: "#bc8b2c",
				error: "#e11900",
			},
			dark: {
				bg: "#000000",
				subtle: "#141414",
				elevated: "#1f1f1f",
				fg: "#ffffff",
				muted: "#afafaf",
				faint: "#6b6b6b",
				border: "#333333",
				accent: "#ffffff",
				link: "#5b91f5",
				highlight: "#ffc043",
				info: "#5b91f5",
				success: "#06c167",
				warning: "#ffc043",
				error: "#e85c4a",
			},
		},
		{
			fonts: { heading: "Manrope", body: "Inter" },
			radius: "default",
			controls: "rounded",
			spacing: "default",
		},
	),
		preset(
		"Sport",
		"Condensed typography, compact rhythm and strong hierarchy for energetic interfaces.",
		{
			light: {
				bg: "#ffffff",
				subtle: "#f7f7fa",
				elevated: "#ffffff",
				fg: "#242428",
				muted: "#6d6d78",
				faint: "#a3a3ad",
				border: "#dfdfe8",
				accent: "#fc5200",
				link: "#0073c7",
				highlight: "#ffc72c",
				info: "#0073c7",
				success: "#1e8a44",
				warning: "#b77b00",
				error: "#d71c1c",
			},
			dark: {
				bg: "#121214",
				subtle: "#0b0b0d",
				elevated: "#1f1f23",
				fg: "#f2f2f5",
				muted: "#a9a9b3",
				faint: "#6d6d78",
				border: "#2e2e33",
				accent: "#fc5200",
				link: "#4ea8ff",
				highlight: "#ffc72c",
				info: "#4ea8ff",
				success: "#3dcc6e",
				warning: "#ffb300",
				error: "#ff5c5c",
			},
		},
		{
			fonts: { heading: "Barlow Semi Condensed", body: "Barlow" },
			radius: "subtle",
			controls: "rounded",
			spacing: "compact",
		},
	),
];
