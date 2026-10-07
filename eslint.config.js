// One ESLint config for the monorepo: the Expo rules, which cover React, React Native and TypeScript.
// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default defineConfig([
	expoConfig,
	{
		files: ["**/*.{ts,tsx}"],
		rules: {
			// Each package resolves `@/…` through its own tsconfig, and the registry through one per
			// variant. tsc already fails on an import it can't resolve, or on two `export *` that clash.
			"import/no-unresolved": "off",
			"import/export": "off",
		},
	},
	{
		// Node code: a function named `use` there is not a React hook.
		files: ["packages/cli/**", "packages/registry/scripts/**"],
		rules: { "react-hooks/rules-of-hooks": "off" },
	},
	{
		ignores: [
			"**/node_modules/",
			"**/dist/",
			"**/.expo/",
			"**/.generated/",
			// The Astro site has its own toolchain.
			"apps/web/",
			"sandbox/",
			"temp/",
		],
	},
]);
