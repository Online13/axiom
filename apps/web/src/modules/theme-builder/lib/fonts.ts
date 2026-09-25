// The typeface list the builder offers: the whole Google Fonts catalogue, most
// popular first. Picking a family injects its stylesheet, so the phones render
// with the actual face rather than a fallback. The list is a snapshot —
// fonts.google.com has no CORS — refreshed with `bun run fonts`.

import catalogue from "./google-fonts.json";

export type FontEntry = {
	family: string;
	category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
};

export const SYSTEM_FONT = "System";

const systemStack =
	"-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif";

const fallback: Record<FontEntry["category"], string> = {
	"sans-serif": "system-ui, sans-serif",
	serif: "Georgia, serif",
	display: "system-ui, sans-serif",
	handwriting: "cursive",
	monospace: "ui-monospace, monospace",
};

export const googleFonts: FontEntry[] = (
	catalogue as [string, FontEntry["category"]][]
).map(([family, category]) => ({ family, category }));

const categoryOf = new Map(
	googleFonts.map((font) => [font.family, font.category]),
);

export const systemEntry: FontEntry = {
	family: SYSTEM_FONT,
	category: "sans-serif",
};

export const fontStack = (family: string): string => {
	if (family === SYSTEM_FONT) return systemStack;
	return `'${family}', ${fallback[categoryOf.get(family) ?? "sans-serif"]}`;
};

/* ---------- Loading ---------- */

const loaded = new Set<string>([SYSTEM_FONT]);

// Weights the previews actually use — body, medium, semibold and bold.
const WEIGHTS = "wght@400;500;600;700";

/** Adds the Google stylesheet for a family once, and resolves when it is ready. */
export function loadFont(family: string): void {
	if (typeof document === "undefined" || loaded.has(family)) return;
	loaded.add(family);

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
		family,
	).replace(/%20/g, "+")}:${WEIGHTS}&display=swap`;
	link.dataset.themeBuilderFont = family;
	document.head.append(link);
}

/** Preloads a handful of families so the picker previews itself. */
export const preloadFonts = (families: string[]) => families.forEach(loadFont);
