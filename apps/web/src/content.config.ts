import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const docs = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/docs" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		icon: z.string().optional(),
		// Fumadocs full-width page: no table of contents, no max width on the content.
		full: z.boolean().optional(),
	}),
});

const meta = defineCollection({
	loader: glob({ pattern: "**/*.{json,yaml}", base: "./content/docs" }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		pages: z.array(z.string()).optional(),
		pagesIndex: z.string().optional(),
		root: z.boolean().optional(),
		defaultOpen: z.boolean().optional(),
		icon: z.string().optional(),
	}),
});

export const collections = {
	docs,
	meta,
};
