import type { StaticSource } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { type CollectionEntry, getCollection } from "astro:content";
import * as path from "node:path";
import { structure, type StructuredData } from "fumadocs-core/mdx-plugins";

export const source = loader({
	source: await createMySource(),
	baseUrl: "/docs",
});

export function getStructuredData(
	entry: CollectionEntry<"docs">,
): StructuredData {
	// One search entry per table row instead of one per cell: props tables
	// otherwise flood the index with "—", "`string`" and header cells.
	const data = structure(entry.body ?? "", undefined, {
		types: ["heading", "paragraph", "blockquote", "tableRow", "mdxJsxFlowElement"],
	});
	for (const item of data.contents) {
		item.content = item.content
			.replace(/^\|\s*|\s*\|$/g, "")
			.replace(/\s+\|\s+/g, " · ");
	}
	return data;
}

async function createMySource() {
	const out: StaticSource<{
		metaData: CollectionEntry<"meta">["data"];
		pageData: CollectionEntry<"docs">["data"] & {
			_raw: CollectionEntry<"docs">;
		};
	}> = {
		files: [],
	};

	for (const page of await getCollection("docs")) {
		const virtualPath = path.relative("content/docs", page.filePath!);

		out.files.push({
			type: "page",
			path: virtualPath,
			data: {
				...page.data,
				_raw: page,
			},
		});
	}

	for (const meta of await getCollection("meta")) {
		const virtualPath = path.relative("content/docs", meta.filePath!);

		out.files.push({
			type: "meta",
			path: virtualPath,
			data: meta.data,
		});
	}

	return out;
}
