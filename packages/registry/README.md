# Registry

The source of everything Axiom copies into a project. Nothing here is published or imported directly: the CLI reads `registry.json` and copies the files.

```text
registry/
├── registry.json          # manifest: one entry per item
└── <layer>/<item>/
    ├── use-<item>.ts      # shared behavior
    ├── <item>-tokens.ts   # component tokens, if the item has colors
    ├── stylesheet/<item>.tsx
    ├── unistyles/<item>.tsx
    └── tailwind/<item>.tsx
```

Layers: `foundations`, `core`, `hooks`, `typography`, `atoms`, `molecules`, `organisms`, `templates`, `blocks`.

## Writing code for the registry

Write each file as it will look **in the user's project**, not as it sits here:

- import other items through the default aliases (`@/theme`, `@/components/core`, `@/hooks`, `@/components/ui`, `@/components/blocks`);
- import files of the same item with a relative path to where they are in the registry (`../use-switch`). The CLI turns it into `./use-switch`.

### Component tokens

A component with colors has a `<item>-tokens.ts` exporting `<item>Tokens(colors, tokens)` (camelCase), declared in `tokens` and in `files`. It stays next to the component here, but `axiom add` copies it to the project's `theme/components/<item>.ts`: the theme is its only reader. Don't add it to `foundations/theme/components/index.ts`: that file is a template, and `axiom add` registers tokens between its markers in the project. The typecheck uses `.generated/components/`, the template with every item's tokens registered.

### Icon sources

The icon registry depends on where the project's icons come from (`icons` in axiom.json). `iconSources` lists the files and dependencies of each source; `atoms/icon/sources/<source>/icons.tsx` are the templates. Items that render an icon themselves declare its name in `requiredIcons`, and `add` lists the ones missing from the project's registry.

The aliases of the typecheck point to the first source (`expo-symbols`); the other templates are still checked.

### Navigation sources

Some items depend on the project's navigation library (`navigation` in axiom.json): `use-overlay-back-handler` closes an overlay on the back gesture through Expo Router or React Navigation. `navigationSources` lists the files and dependencies of `expo-router`, `react-navigation` and `react-native` (no library). `add` detects the library from package.json the first time an item needs it.

The aliases of the typecheck point to the first source (`expo-router`); the other versions are still checked.

### Files the project owns

A file the project fills once copied, like the icon registry `icons.tsx`, is declared with `createOnly`. The CLI writes it when missing and never overwrites it, even in watch mode:

```json
{ "path": "atoms/icon/icons.tsx", "createOnly": true }
```

## Typecheck

```bash
bun run typecheck
```

Aliases don't resolve in this folder on their own, since each file lands somewhere else once copied. `scripts/tsconfig.ts` reads `registry.json` and maps every alias import to its registry file, the same way the CLI maps it to the project:

- `tsconfig.json`: the `stylesheet` variant. It's the file your editor reads, so imports like `@/components/core/tappable` resolve while you write code here;
- `tsconfig.<variant>.json`: the other variants, once they have files;
- `tsconfig.base.json`: the shared options;
- `scripts/tsconfig.json`: the Node scripts.

The generated files cover every `.ts` and `.tsx` of their variant, but only files listed in `registry.json` get an alias: importing an unlisted file fails. Don't edit them. Run `bun run tsconfig` after changing `registry.json` (the editor picks up the new aliases), or `bun run typecheck`.

Rendering and behavior are still checked in a demo app (`apps/demo-*`).

## Manifest entry

```json
{
	"name": "switch",
	"type": "atoms",
	"tokens": "atoms/switch/switch-tokens.ts",
	"files": ["atoms/switch/switch-tokens.ts", "atoms/switch/use-switch.ts"],
	"dependencies": ["react-native-reanimated"],
	"internalDependencies": ["tappable"],
	"variants": {
		"stylesheet": { "files": ["atoms/switch/stylesheet/switch.tsx"] },
		"unistyles": { "files": ["atoms/switch/unistyles/switch.tsx"] },
		"tailwind": { "files": ["atoms/switch/tailwind/switch.tsx"] }
	}
}
```

The full rules are in [`docs/architecture/registry.md`](../../docs/architecture/registry.md).
