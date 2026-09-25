// Refreshes the Google Fonts catalogue the theme builder offers.
// fonts.google.com sends no CORS headers, so the browser cannot read it: the
// list is snapshotted here instead. Run with `bun run fonts`.

import { writeFile } from "node:fs/promises";

const OUT = new URL(
	"../src/modules/theme-builder/lib/google-fonts.json",
	import.meta.url,
);

const categories: Record<string, string> = {
	"Sans Serif": "sans-serif",
	Serif: "serif",
	Display: "display",
	Handwriting: "handwriting",
	Monospace: "monospace",
};

type Family = {
	family: string;
	category: string;
	popularity: number;
	fonts: Record<string, unknown>;
};

const response = await fetch("https://fonts.google.com/metadata/fonts");
if (!response.ok) throw new Error(`Google Fonts answered ${response.status}`);
const { familyMetadataList } = (await response.json()) as {
	familyMetadataList: Family[];
};

// Most popular first — `popularity` is a rank, so lower is better. The CSS
// API tolerates missing weights but rejects a family without a regular 400.
const fonts = familyMetadataList
	.filter((font) => font.category in categories && "400" in font.fonts)
	.sort((a, b) => a.popularity - b.popularity)
	.map((font) => [font.family, categories[font.category]]);

await writeFile(OUT, `${JSON.stringify(fonts)}\n`);
console.log(`${fonts.length} families written to ${OUT.pathname}`);
