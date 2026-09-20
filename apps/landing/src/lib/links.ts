// The env value may or may not end with a slash, so normalise it once here.
const base = (
	import.meta.env.PUBLIC_DOCS_URL ?? "http://localhost:4322"
).replace(/\/+$/, "");

/** Absolute URL to a docs page. `docs()` is the Get Started introduction. */
export function docs(path = "/") {
	return `${base}${path === "/" ? "" : path}` || "/";
}

export const githubUrl = "https://github.com/Online13/axiom";
