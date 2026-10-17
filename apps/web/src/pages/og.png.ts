import type { APIRoute } from "astro";
import { siteImage } from "../modules/brand/og";

// The site's link preview: the docs banner at 1200×630.
export const GET: APIRoute = () => siteImage();
