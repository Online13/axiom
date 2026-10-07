# How the CLI works

The CLI copies component source code from `packages/registry` into an app. Almost all of it is one pipeline. Follow `axiom add button` through it once and you know most of the code.

## The trajectory of `axiom add button`

1. **[`main()`](../src/index.ts#L476)** parses the flags and decides two modes: install (`ask`, `always`, `never`) and overwrite (`ask`, `always`, `force`). It calls `run()`. Any error thrown below lands in the `catch` at the bottom of the file, which prints it and exits.
2. **[`run()`](../src/index.ts#L179)** reads `registry.json` and the app's `axiom.json`. If `button` needs an icon source or a navigation library that `axiom.json` doesn't record yet, it fills that in from the flags, a prompt, or `package.json`.
3. **[`resolveItems()`](../src/registry.ts#L17)** turns `["button"]` into `button` plus everything it depends on (`icon`, `slot`, `tappable`, `text`, `theme`…).
4. **[`copyItems()`](../src/copy.ts#L401)** does the copying, in two passes so a failure writes nothing:
   - [`plan()`](../src/copy.ts#L73) picks each item's files for the app's styling and gives each file a destination ([`locate()`](../src/copy.ts#L220)). The destination depends on the item's layer, which maps to an alias like `@/components/ui`. [`aliasToDir()`](../src/project.ts#L68) turns that alias into a folder by reading the app's `tsconfig.json`;
   - then for each file: read it, [`rewriteImports()`](../src/copy.ts#L314) so its imports point to where the other files landed, and decide what happens if the file already exists (same content: skip; user-edited dependency: keep; requested item: ask). Writing comes last.
5. **`writeConfig()`** adds the new items to `axiom.json`.
6. **[`syncTokens()`](../src/tokens.ts#L151)** adds one line per component to the theme's `components/index.ts`, between `// axiom:…:start/end` markers, so the theme computes the button's style values.
7. **[`resolveMissingDependencies()`](../src/install.ts#L46)** installs the npm packages the copied files need, or prints the command.

## The other commands, as differences

- **`init`** ([`runInit()`](../src/index.ts#L425)) checks the folder is a React Native app, asks for the styling tool and aliases, makes sure `tsconfig.json` resolves them, writes an empty `axiom.json`, then calls `run()` with the base items (theme, slot, tappable, portal, overlay).
- **`fetch`** is `run()` on every item of `axiom.json` with `keepExisting: true`, so only missing files get written.
- **`add` with no names** is `run()` on every item of `axiom.json`, asking before replacing files that differ. With `--watch` it repeats that on every registry change and overwrites without asking.
- **`add --standalone`** ([`runStandalone()`](../src/index.ts#L308)) goes elsewhere. It builds one self-contained file per item with the TypeScript compiler. Ignore it until you work on it, then read [standalone.md](standalone.md).

## Where things live

| File | Holds |
| --- | --- |
| `types.ts` | The shapes of `registry.json` and `axiom.json`, layers, aliases, stylings. Look here when a word is unclear. |
| `index.ts` | Flags, help texts, and the command functions above. |
| `copy.ts` | Where files land and how their imports are rewritten. |
| `registry.ts`, `project.ts` | Reading `registry.json`, `axiom.json`, `tsconfig.json`, `package.json`. |
| `init.ts`, `tokens.ts`, `icons.ts`, `install.ts` | One job each, named after it. |
| `ui.ts` | Every prompt and printed line. |
| `standalone.ts` | `--standalone` only. |

## Rules the code keeps

- Check everything, then write. A failed command leaves the app untouched.
- Never prompt without a terminal (`isInteractive()`). A missing answer throws an error naming the flag to pass.
- Throw `Error`s written for the user. Never call `process.exit` in the middle of the code.
- Print through `ui.ts`.
- Compare before writing. An identical file is never rewritten, so Metro doesn't reload.

## Step through it

With the Bun extension (`oven.bun-vscode`) installed, put a breakpoint in `run()`, open the Run and Debug panel and start **CLI: add button**. It creates a throwaway app in `/tmp/axiom-sandbox`, runs `init` on it, then runs `add button` under the debugger. Step through the trajectory above and look at the real values: the resolved items, the planned destinations, an import before and after `rewriteImports`.

To check a change: `bun run --cwd packages/cli typecheck` and `bun run --cwd packages/cli test`. [test/docs](../test/docs/README.md) explains what each test checks.
