import type { APIRoute } from "astro";
import { createFromSource } from "fumadocs-core/search/server";
import { getStructuredData, source } from "@docs/lib/source";

const server = createFromSource(source, {
	// Results are ranked by score, never sorted by field: the sort index only bloats the export.
	sort: { enabled: false },
	buildIndex(page) {
		return {
			id: page.data._raw.id,
			title: page.data.title,
			description: page.data.description,
			structuredData: getStructuredData(page.data._raw),
			url: page.url,
		};
	},
});

export const GET: APIRoute = () => {
	return server.staticGET();
};
