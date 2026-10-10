import { format as prettier, resolveConfig } from "prettier";

/** How the registry itself is written: what a project with no Prettier config of its own gets. */
const REGISTRY_STYLE = { useTabs: true, tabWidth: 3 };

/**
 * Formats a file the CLI wrote itself rather than copied: a component with its styles written into
 * it, a generated theme file. It follows the Prettier config that applies to `path`, so the file
 * reads like the code around it. A file Prettier can't parse is left as it is.
 */
export async function format(content: string, path: string): Promise<string> {
	try {
		const config = await resolveConfig(path, { editorconfig: true });
		return await prettier(content, {
			...(config ?? REGISTRY_STYLE),
			filepath: path,
		});
	} catch {
		return content;
	}
}
