// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import {
	rehypeCode,
	rehypeCodeDefaultOptions,
	remarkCodeTab,
	remarkHeading,
	remarkNpm,
	remarkStructure,
} from "fumadocs-core/mdx-plugins";
import { loadEnv } from "vite";

/** @type {import("astro").RemarkPlugins} */
const remarkPlugins = [
	remarkHeading,
	remarkCodeTab,
	[remarkNpm, { persist: { id: "package-manager" } }],
	[remarkStructure, { exportAs: "structuredData" }],
];

const { parseMetaString } = rehypeCodeDefaultOptions;

// Terminal commands (```npm blocks come out as bash) and terminal output (title="Terminal")
// read as a prompt, not a file: no line numbers.
const terminalLangs = new Set(["bash", "sh", "shell", "zsh", "console", "powershell"]);

/** @param {string} meta @param {import("hast").Element} pre */
function isTerminal(meta, pre) {
	if (/\btitle=["']?Terminal\b/.test(meta)) return true;
	const code = pre.children[0];
	const classes = code?.type === "element" ? code.properties.className : undefined;
	return Array.isArray(classes) && classes.some((name) => terminalLangs.has(String(name).replace("language-", "")));
}

/** @type {import("astro").RehypePlugins} */
const rehypePlugins = [
	[
		rehypeCode,
		{
			// Same VS Code themes as the landing's code (OwnershipCard).
			themes: { light: "light-plus", dark: "dark-plus" },
			// Code blocks get line numbers, like an editor (fumadocs' `lineNumbers` meta, made the default).
			/** @type {NonNullable<typeof parseMetaString>} */
			parseMetaString: (meta, node, tree) => ({
				...parseMetaString?.(meta, node, tree),
				...(!isTerminal(meta, node) && { "data-line-numbers": true }),
			}),
		},
	],
];
const env = loadEnv("dev", process.cwd(), "");

export default defineConfig({
	// Production origin: canonical URLs, Open Graph images and the sitemap are built against it.
	site: "https://axiom.nekena-rayane.com",
	server: { port: env.PORT ? Number(env.PORT) : 4321 },
	// The compositions and blocks indexes became the gallery, opened on the matching type.
	redirects: {
		"/docs/compositions": "/docs/gallery?kind=composition",
		"/docs/blocks": "/docs/gallery?kind=block",
	},
	markdown: {
		processor: unified({
			remarkPlugins,
			rehypePlugins,
		}),
	},
	integrations: [
		react(),
		sitemap(),
		mdx({
			extendMarkdownConfig: true,
			syntaxHighlight: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			// The theme builder is a client-only island, so Vite cannot discover its
			// dependencies during the initial route scan. Pre-bundle them before the
			// browser requests ThemeBuilder.tsx to avoid an immediate stale dep hash.
			include: [
				"@legendapp/state",
				"@legendapp/state/react",
				"@legendapp/state/sync",
				"@legendapp/state/persist-plugins/local-storage",
				"lucide-react",
				// Same for the docs island (sidebar, TOC, search): a late re-bundle 504s
				// its imports and the whole layout stays static (no folder toggle, no TOC tracking).
				"fumadocs-ui/layouts/notebook",
				"fumadocs-ui/layouts/notebook/page",
				"fumadocs-ui/provider/astro",
				"fumadocs-ui/components/banner",
				"fumadocs-ui/components/dialog/search",
				"fumadocs-ui/contexts/i18n",
				"fumadocs-core/search/client",
				"fumadocs-core/search/client/orama-static",
			],
		},
	},
});
