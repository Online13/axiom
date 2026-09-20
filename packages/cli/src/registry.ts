import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { Registry, RegistryItem } from "./types.ts";

export const MANIFEST = "registry.json";

export function readRegistry(root: string): Registry {
	const file = join(root, MANIFEST);
	if (!existsSync(file)) {
		throw new Error(`No ${MANIFEST} in ${root}.`);
	}
	return JSON.parse(readFileSync(file, "utf8")) as Registry;
}

/** The requested items followed by everything they depend on, each listed once. */
export function resolveItems(
	registry: Registry,
	names: string[],
): RegistryItem[] {
	const byName = new Map(registry.items.map((item) => [item.name, item]));
	const resolved = new Map<string, RegistryItem>();

	const visit = (name: string, path: string[]) => {
		if (path.includes(name)) {
			throw new Error(
				`Circular dependency: ${[...path, name].join(" → ")}.`,
			);
		}
		if (resolved.has(name)) return;

		const item = byName.get(name);
		if (!item) {
			const from = path.length ? ` (required by ${path.at(-1)})` : "";
			throw new Error(`Unknown item "${name}"${from}.`);
		}

		resolved.set(name, item);
		for (const dependency of item.internalDependencies ?? []) {
			visit(dependency, [...path, name]);
		}
	};

	for (const name of names) visit(name, []);
	return [...resolved.values()];
}
