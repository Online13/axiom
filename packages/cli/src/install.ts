import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

import { hasDependency } from "./project.ts";
import { log, muted, task } from "./ui.ts";

export const PACKAGE_MANAGERS = ["bun", "pnpm", "yarn", "npm"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const LOCKFILES: [string, PackageManager][] = [
	["bun.lock", "bun"],
	["bun.lockb", "bun"],
	["pnpm-lock.yaml", "pnpm"],
	["yarn.lock", "yarn"],
	["package-lock.json", "npm"],
];

/** The package manager of the project, from the nearest lockfile. Walks up, so an app in a monorepo finds the root one. */
export function detectPackageManager(cwd: string): PackageManager {
	for (let dir = cwd; ; dir = dirname(dir)) {
		for (const [file, manager] of LOCKFILES) {
			if (existsSync(join(dir, file))) return manager;
		}
		if (dirname(dir) === dir) return "npm";
	}
}

/**
 * The command that installs `dependencies` in the project. Expo projects go through `expo install`,
 * which picks the versions matching their SDK.
 */
export function installCommand(cwd: string, dependencies: string[]): string[] {
	const manager = detectPackageManager(cwd);
	if (hasDependency(cwd, "expo")) {
		const runner = manager === "npm" ? ["npx", "expo"] : [manager, "expo"];
		return [...runner, "install", ...dependencies];
	}
	return [manager, manager === "npm" ? "install" : "add", ...dependencies];
}

export async function installDependencies(cwd: string, dependencies: string[]) {
	const command = installCommand(cwd, dependencies);
	const list = dependencies.join(", ");
	let output = "";

	try {
		await task(
			`Installing ${list} ${muted(command.join(" "))}`,
			() => {
				const [file, ...args] = command;
				const { status, error, stderr, stdout } = spawnSync(file, args, {
					cwd,
					encoding: "utf8",
				});
				if (error || status !== 0) {
					// The last lines are the package manager's own explanation; the rest is its stack.
					output = (stderr || stdout || "")
						.trimEnd()
						.split("\n")
						.slice(-8)
						.join("\n");
					throw new Error(
						`Install failed: ${command.join(" ")}. Run it yourself, then "axiom add" again.`,
					);
				}
			},
			() => `Installed ${list}`,
		);
	} catch (failure) {
		if (output) log.message(muted(output));
		throw failure;
	}
}
