import type { APIRoute } from "astro";

// Built from `site` (astro.config.mjs), so the sitemap URL follows the domain.
export const GET: APIRoute = ({ site }) =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site)}\n`);
