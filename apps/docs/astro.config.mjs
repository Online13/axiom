// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import {
	rehypeCode,
	remarkCodeTab,
	remarkHeading,
	remarkNpm,
	remarkStructure,
} from "fumadocs-core/mdx-plugins";

const remarkPlugins = [
	remarkHeading,
	remarkCodeTab,
	// ```npm blocks become npm/pnpm/yarn/bun tabs; the chosen manager is remembered across pages.
	[remarkNpm, { persist: { id: "package-manager" } }],
	[remarkStructure, { exportAs: "structuredData" }],
];
const rehypePlugins = [rehypeCode];

export default defineConfig({
	// Docs runs on 4322, landing on 4321, so both dev servers can run side by side.
	server: { port: 4322 },
	markdown: {
		processor: unified({
			syntaxHighlight: false,
			remarkPlugins,
			rehypePlugins,
		}),
	},
	integrations: [
		react(),
		mdx({
			extendMarkdownConfig: true,
			syntaxHighlight: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
