// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import {
	rehypeCode,
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

/** @type {import("astro").RehypePlugins} */
const rehypePlugins = [rehypeCode];
const env = loadEnv("dev", process.cwd(), "");

export default defineConfig({
	server: { port: env.PORT ? Number(env.PORT) : 4321 },
	markdown: {
		processor: unified({
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
