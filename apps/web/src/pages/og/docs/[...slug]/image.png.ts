import type { APIRoute } from "astro";
import { pageImage } from "../../../../modules/brand/og";
import { source } from "@docs/lib/source";

export function getStaticPaths() {
	return source.getPages().map((page) => ({
		params: {
			slug: page.slugs.length > 0 ? page.slugs.join("/") : undefined,
		},
	}));
}

export const GET: APIRoute = ({ params }) => {
	const slugs =
		params.slug?.split("/").filter((item) => item.length > 0) ?? [];
	const page = source.getPage(slugs);

	if (!page) return new Response(undefined, { status: 404 });

	return pageImage({ title: page.data.title, description: page.data.description });
};
