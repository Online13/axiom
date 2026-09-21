// The typeface list the builder offers. Fonts are real Google Fonts: picking
// one injects its stylesheet, so the phones render with the actual face rather
// than a fallback. The bundled list is a curated starting set — when a Google
// Fonts API key is present the full catalogue replaces it at runtime.

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

// A spread wide enough to change the character of an app: grotesks, geometrics,
// a few serifs and a couple of display faces.
export const curatedFonts: FontEntry[] = [
	{ family: "Inter", category: "sans-serif" },
	{ family: "Manrope", category: "sans-serif" },
	{ family: "Space Grotesk", category: "sans-serif" },
	{ family: "DM Sans", category: "sans-serif" },
	{ family: "Plus Jakarta Sans", category: "sans-serif" },
	{ family: "Outfit", category: "sans-serif" },
	{ family: "Figtree", category: "sans-serif" },
	{ family: "Geist", category: "sans-serif" },
	{ family: "Work Sans", category: "sans-serif" },
	{ family: "Rubik", category: "sans-serif" },
	{ family: "Nunito", category: "sans-serif" },
	{ family: "Nunito Sans", category: "sans-serif" },
	{ family: "Poppins", category: "sans-serif" },
	{ family: "Montserrat", category: "sans-serif" },
	{ family: "Raleway", category: "sans-serif" },
	{ family: "Open Sans", category: "sans-serif" },
	{ family: "Lato", category: "sans-serif" },
	{ family: "Roboto", category: "sans-serif" },
	{ family: "Noto Sans", category: "sans-serif" },
	{ family: "Source Sans 3", category: "sans-serif" },
	{ family: "IBM Plex Sans", category: "sans-serif" },
	{ family: "Karla", category: "sans-serif" },
	{ family: "Mulish", category: "sans-serif" },
	{ family: "Urbanist", category: "sans-serif" },
	{ family: "Sora", category: "sans-serif" },
	{ family: "Lexend", category: "sans-serif" },
	{ family: "Epilogue", category: "sans-serif" },
	{ family: "Onest", category: "sans-serif" },
	{ family: "Instrument Sans", category: "sans-serif" },
	{ family: "Bricolage Grotesque", category: "display" },
	{ family: "Clash Display", category: "display" },
	{ family: "Archivo", category: "sans-serif" },
	{ family: "Barlow", category: "sans-serif" },
	{ family: "Cabin", category: "sans-serif" },
	{ family: "Quicksand", category: "sans-serif" },
	{ family: "Merriweather", category: "serif" },
	{ family: "Playfair Display", category: "serif" },
	{ family: "Lora", category: "serif" },
	{ family: "Source Serif 4", category: "serif" },
	{ family: "Fraunces", category: "serif" },
	{ family: "Instrument Serif", category: "serif" },
	{ family: "Libre Baskerville", category: "serif" },
	{ family: "Bitter", category: "serif" },
	{ family: "Crimson Pro", category: "serif" },
	{ family: "Spectral", category: "serif" },
	{ family: "JetBrains Mono", category: "monospace" },
	{ family: "IBM Plex Mono", category: "monospace" },
	{ family: "Space Mono", category: "monospace" },
	{ family: "Fira Code", category: "monospace" },
	{ family: "Caveat", category: "handwriting" },
];

export const systemEntry: FontEntry = {
	family: SYSTEM_FONT,
	category: "sans-serif",
};

export const fontStack = (family: string): string => {
	if (family === SYSTEM_FONT) return systemStack;
	const entry = curatedFonts.find((font) => font.family === family);
	return `'${family}', ${fallback[entry?.category ?? "sans-serif"]}`;
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

/* ---------- The full catalogue ---------- */

type GoogleFontsResponse = {
	items?: { family: string; category: FontEntry["category"] }[];
};

let catalogue: Promise<FontEntry[]> | null = null;

/**
 * The whole Google Fonts catalogue, sorted by popularity. Needs
 * `PUBLIC_GOOGLE_FONTS_API_KEY`; without it the curated list stands in, so the
 * picker works either way.
 */
export function allFonts(): Promise<FontEntry[]> {
	if (catalogue) return catalogue;

	const key = import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY;
	if (!key) {
		catalogue = Promise.resolve(curatedFonts);
		return catalogue;
	}

	catalogue = fetch(
		`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`,
	)
		.then((response) => (response.ok ? response.json() : null))
		.then((data: GoogleFontsResponse | null) =>
			data?.items?.length
				? data.items.map(({ family, category }) => ({ family, category }))
				: curatedFonts,
		)
		.catch(() => curatedFonts);

	return catalogue;
}
