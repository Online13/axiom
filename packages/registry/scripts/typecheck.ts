// Typechecks the registry: one `tsc` run per generated tsconfig.
//
// Each variant is its own program — the same alias (`@/theme`, `@/components/ui/button`) points to a
// different file in each one, so they can't be merged into a single config. Run `scripts/tsconfig.ts`
// and `scripts/standalone.ts` first: this script only checks the configs they wrote.
//
//   bun scripts/typecheck.ts
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { STYLINGS } from "../../cli/src/types.ts";

const root = join(import.meta.dirname, "..");

// tsconfig.json only references the others, for editors: each one is checked on its own.
const configs = [
	...STYLINGS.map((styling) => `tsconfig.${styling}.json`),
	"scripts/tsconfig.json",
	// Written by scripts/standalone.ts: every item's standalone file, compiled on its own.
	...STYLINGS.map(
		(styling) => `.generated/standalone/${styling}/tsconfig.json`,
	),
].filter((file) => existsSync(join(root, file)));

let failed = false;
for (const config of configs) {
	console.log(`tsc -p ${config}`);
	const { status } = spawnSync("tsc", ["-p", config], {
		cwd: root,
		stdio: "inherit",
		shell: true,
	});
	if (status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
