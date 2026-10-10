# Registry

The source of everything Axiom copies into a project. Nothing here is published or imported directly: the CLI reads `registry.json` and copies the files.

```text
registry/
├── registry.json          # manifest: one entry per item
└── <layer>/<item>/
    ├── <item>.tsx                    # structure, states, accessibility: shared
    ├── <item>.styles.<styling>.ts(x) # what differs, once per styling
    ├── use-<item>.ts                 # shared behavior
    └── <item>-tokens.ts              # component tokens, if the item has colors
```

Layers, from the bottom up:

- **foundations** (`foundations`, `core`, `hooks`): tokens, theme, and the behavior every component builds on;
- **primitives** (`typography`, `atoms`, `molecules`, `organisms`, `templates`): the components. Atomic Design organizes them here, in the folders and the `type` of each item; a project imports them all from `@/components/ui`;
- **compositions** (`compositions`): ready-made assemblies of primitives for a common need, like a product card or a settings row. They reuse the primitives' tokens and bring none of their own;
- **blocks** (`blocks`): complete sections built from compositions and primitives, like a settings section.

## Writing code for the registry

Write each file as it will look **in the user's project**, not as it sits here:

- import other items through the default aliases (`@/theme`, `@/components/core`, `@/hooks`, `@/components/ui`, `@/components/compositions`, `@/components/blocks`);
- import files of the same item with a relative path to where they are in the registry (`../use-switch`). The CLI turns it into `./use-switch`.

### Reusable primitives

Every primitive, and every part of a compound primitive, forwards the props of the element it renders at its root. A developer should never have to copy a component to set a `testID`, an `onLayout` or a `contentContainerStyle`:

- type the props as the root's props plus the component's own: `Omit<ComponentPropsWithRef<typeof View>, "children"> & { … }`, `Omit<TappableProps, "children" | "style" | "disabled" | "onPress"> & { … }`, or a union when the root depends on a prop (see `Chip.Group` and `Tab.List`);
- collect the rest with `...props` and spread it on the root **before** the props the component controls, so its role, state and style merging stay intact;
- when the component needs a handler the caller may also pass (`onLayout`, a `ref`), call both: `composeRefs` from `@/components/core/slot` merges refs;
- hook options are destructured by name rather than collected in a rest object, so they never leak onto the element;
- controlled and uncontrolled state go through `useControllableState`. An effect may drive an animation or subscribe to something native, but it never copies a prop into state.

Compositions and blocks are fixed assemblies and don't follow this rule.

### One component, one styles file per variant

Every component is written once, with what differs between stylings in a styles file each styling has its own form of. A component no styling changes, like `settings-item`, has no styles file and no `variants`.

```text
atoms/button/
├── button.tsx                     # structure, states, accessibility: shared
├── button.styles.stylesheet.tsx
├── button.styles.unistyles.tsx
├── button.styles.nativewind.tsx
├── button.styles.uniwind.tsx
├── button-tokens.ts               # the component tokens
├── button-tokens.nativewind.css   # the same, generated for NativeWind
└── button-tokens.uniwind.css      # the same, generated for Uniwind
```

NativeWind and Uniwind each have their file: they read a color prop from a class differently (`cssInterop` and `className="text-…"` for one, `withUniwind` and `colorClassName="accent-…"` for the other). When nothing differs, the two files are the same.

The component imports `./button.styles` and calls its hook: `const styles = useButtonStyles(variant, size, fullWidth)`. Here, the generated tsconfigs resolve the import to the file of their variant through `moduleSuffixes`, so each variant is typechecked and navigable.

A project never gets the styles file. When it copies the component, the CLI writes the two as one file, the way it would be written by hand for that variant (`packages/cli/src/inline.ts`): `{...styles.label(hidden)}` becomes `className={cx("shrink", hidden && "opacity-0")}` with Tailwind and `style={[styles.label, hidden && styles.hidden]}` with Unistyles, the statements of the hook replace its call, and the rest of the styles file moves under the component. For that, a styles file keeps to a contract:

- it declares one `use<Item>Styles` function, whose parameters have the names of the variables it is called with;
- the function ends by returning an object, one entry per styled element. Its other statements (`const { tokens } = useTheme()`) are copied into each component that calls it, without the ones that component doesn't reach: with Unistyles, a component that reads no theme gets no hook at all;
- an entry is an expression, or an arrow function returning one: no block body. Logic that needs statements goes in a function of the file;
- an entry spread on an element is an object of its props (`{ style }`, `{ className }`). One that merges the caller's props takes them by name: `header: ({ style }) => ({ style: [styles.header, style] })`, called as `styles.header(props)`;
- an element that takes its color as a prop, like an icon or a spinner, is exported by the styles file (`ButtonIcon`): Unistyles wraps it with `withUnistyles`, the other variants export it as it is;
- with NativeWind and Uniwind, the entries are class names written whole (`bg-button-solid`, `active:bg-button-solid-pressed`), taken from tables indexed by variant, size and state. They read no component token from TypeScript. What stays a style is what no class can say: a number the device or the caller gives (a safe-area inset, a hairline, a width), a raw palette color, and the colors of the theme itself where a prop wants a value, like the stroke of an SVG path. `className` never carries a rem-based utility outside the spacing scale: a rem is 14px in NativeWind and 16px in Uniwind, so a size the tokens don't name is written `h-[24px]`;
- a state lists what it changes, and the last class setting a property wins: `cx("border-checkbox-border", checked && "border-checkbox-border-checked", disabled && "border-checkbox-border-disabled")`. `pressed` goes through `active:` on the pressable;
- a view that takes `style` only, like an animated one, gets a small component exported by the styles file, which puts the classes on a view inside it (`BottomSheetSurface`).

The CLI refuses a file that breaks the contract, with the reason. `scripts/parity.ts` compares each styles file with its `.stylesheet` sibling, and the standalone typecheck compiles the merged form of every variant.

### The Tailwind theme

`bun run theme-css` writes the theme of the NativeWind and Uniwind variants from `foundations/tokens/tokens.ts` and `foundations/theme/colors.ts`, into `foundations/theme/tailwind/`: `uniwind.css` (Tailwind 4), and `nativewind.css` with `nativewind-preset.js` (Tailwind 3, NativeWind 4). Run it after changing a token or a color, and commit the result.

| Token                         | Class                        |
| ----------------------------- | ---------------------------- |
| `colors.primary.default`      | `bg-primary`, `text-primary` |
| `colors.primary.on`           | `text-primary-on`            |
| `colors.feedback.errorSubtle` | `bg-feedback-error-subtle`   |
| `radius.md`                   | `rounded-md`                 |
| `spacing[4]`                  | `px-4`, `gap-4`              |
| `sizes.control.md`            | `min-h-control-md`           |
| `typography.callout`          | `text-callout`               |

Colors are CSS variables with a light and a dark value, so a class follows the scheme without `dark:`. A project imports the file of its tool from its `global.css`, and with NativeWind adds the preset to `tailwind.config.js`: see `apps/demo-uniwind` and `apps/demo-nativewind`.

#### Component tokens in CSS

An item written for NativeWind and Uniwind lists `cssTokens` in `registry.json`. `bun run theme-css` writes them from its `<item>-tokens.ts`, which stays the only file to edit here: `solid.pressed.background` of `button` is `--color-button-solid-pressed`, so `bg-button-solid-pressed`; a `foreground` is `text-button-solid-foreground`, and `radius` is `rounded-button`. Each one points to a theme color, so it follows light and dark.

A project gets one of the two forms: with NativeWind or Uniwind, the CLI copies the CSS to `theme/components/<item>.css` and leaves the TypeScript tokens out. Uniwind imports them through `theme/components/index.css`, which the CLI rewrites at each `add`; NativeWind's preset reads the folder.

`cx` merges with `tailwind-merge`: the last class setting a property wins, so a caller's `className` replaces a component's own.

### Component tokens

A component with colors has a `<item>-tokens.ts` exporting `<item>Tokens(colors, tokens)` (camelCase), declared in `tokens` and in `files`. It stays next to the component here, but `axiom add` copies it to the project's `theme/components/<item>.ts`: the theme is its only reader. Don't add it to `foundations/theme/components/index.ts`: that file is a template, and `axiom add` registers tokens between its markers in the project. The typecheck uses `.generated/components/`, the template with every item's tokens registered.

### Components that keep their tokens in TypeScript

`switch`, `slider`, `segmented-control` and `skeleton` list no `cssTokens`: with NativeWind and Uniwind too, they read `useTheme().components`. Their colors are interpolated by an animation, set on animated views that take `style` only, or written into a gradient: a class can't give the value.

Elsewhere, an animated view that draws a color gets a small component from the styles file, which puts the classes on a view inside it (`BottomSheetSurface`, `DialogSurface`, `TabIndicator`).

### Helpers a styling shares between items

A file other items read, and only some stylings need, is listed in the `variants` of those stylings next to the styles file: `atoms/input/input-colors.ts` (`stylesheet`, `unistyles`) resolves the input's colors for `text-area`, `input-group` and `date-picker`; `atoms/input/input-classes.<styling>.ts` gives the same items their classes. A file named after its styling lands in the project without the suffix, and is imported without it: `@/components/ui/input-classes`.

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

### Standalone form

`axiom add <item> --standalone` derives a single theme-free file from the sources here: nothing to write per item. It relies on the conventions above: the theme is read through `useTheme()` (or Unistyles' `theme`), anything else imported from `@/theme` (like `cx`) is declared in a theme file that imports only npm packages, tokens files export `<item>Tokens` with a named return type, and files of other items are imported through aliases.

An item that can't work on its own, like `portal` (it needs a host mounted by the app), declares `"standalone": false`. The CLI refuses it and every item that depends on it.

## Typecheck

```bash
bun run typecheck
```

Aliases don't resolve in this folder on their own, since each file lands somewhere else once copied. `scripts/tsconfig.ts` reads `registry.json` and maps every alias import to its registry file, the same way the CLI maps it to the project:

- `tsconfig.<styling>.json`: one per styling (`stylesheet`, `unistyles`, `nativewind`, `uniwind`), since the same alias points to a different file in each. The NativeWind and Uniwind ones each include their `foundations/theme/tailwind/tailwind-env.<styling>.d.ts`, which gives React Native's props the `className` the tool adds;
- `tsconfig.json`: the list of those four, and nothing else. It's the file your editor reads: for each file you open, it takes the first config of the list that includes it. `button.styles.uniwind.tsx` gets the aliases and the types of Uniwind, and a file every styling shares, like `button.tsx`, those of `stylesheet`;
- `tsconfig.base.json`: the shared options;
- `scripts/tsconfig.json`: the Node scripts;
- `.generated/standalone/<variant>/tsconfig.json`: the standalone form of every item, written by `scripts/standalone.ts`, each file compiled with nothing but its npm imports.

The generated files cover every `.ts` and `.tsx` of their variant, but only files listed in `registry.json` get an alias: importing an unlisted file fails. Don't edit them. Run `bun run tsconfig` after changing `registry.json` (the editor picks up the new aliases), or `bun run typecheck`.

Rendering and behavior are still checked in a demo app (`apps/demo-*`).

## Manifest entry

```json
{
	"name": "switch",
	"type": "atoms",
	"tokens": "atoms/switch/switch-tokens.ts",
	"files": [
		"atoms/switch/switch-tokens.ts",
		"atoms/switch/use-switch.ts",
		"atoms/switch/switch.tsx"
	],
	"dependencies": ["react-native-reanimated"],
	"internalDependencies": ["tappable"],
	"variants": {
		"stylesheet": { "files": ["atoms/switch/switch.styles.stylesheet.ts"] },
		"unistyles": { "files": ["atoms/switch/switch.styles.unistyles.ts"] },
		"nativewind": { "files": ["atoms/switch/switch.styles.nativewind.ts"] },
		"uniwind": { "files": ["atoms/switch/switch.styles.uniwind.ts"] }
	}
}
```

The full rules are in [`docs/architecture/registry.md`](../../docs/architecture/registry.md).
