/** Path to a docs page. `docs()` is the Get Started introduction. */
export function docs(path = "/") {
	const suffix = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
	return `/docs${suffix}`;
}

export const githubUrl = "https://github.com/Online13/axiom";
