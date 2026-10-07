# CLI tests

These pages explain what the CLI tests check and why. You don't need to read the test code to follow them.

## What the CLI does

Axiom is a library of React Native components. We don't ship it as an npm package. The `axiom` command copies each component's source code into the user's app, and from then on the app owns that code.

It has three commands:

- `axiom init` prepares an existing app. It asks which styling tool the app uses, copies the base files (the theme, colors, spacing, and a few low-level building blocks), then writes an `axiom.json` file that records these choices.
- `axiom add button` copies a component. It also copies everything the component needs (a button needs text and icons, for instance) and adjusts the copied code so it fits the app. With `--standalone`, it writes the component as one file that needs nothing else from Axiom.
- `axiom fetch` copies every component listed in `axiom.json` that's missing from the app, and leaves the files already there alone. It restores deleted files, or sets up a second app with the same components as the first.

To learn how the code itself works, read [the contributor docs](../../docs/README.md).

Adjusting the code is the part that breaks most easily. Inside the registry, a file imports another with a path like `@/components/ui/icon`. In the user's app that file may sit somewhere else, in a folder with a different name, or behind a different alias. The CLI rewrites every one of these paths. If it gets one wrong, the user's app no longer compiles, and they only find out after the copy.

## Why test it

The CLI writes into someone else's project, so a bug costs the user more than it costs us:

- a broken import means an app that no longer starts;
- an overwritten file means a user's changes are gone;
- a half-finished copy leaves the project in a state that's hard to clean up.

The tests catch these before a release. They run on every pull request that touches the CLI or the registry. Changing a component in the registry can break the CLI too, which is why the registry is included.

## Two kinds of tests

**Unit tests** check one piece of the CLI on its own, with made-up inputs. They're fast and point straight at the broken function.

**Integration tests** run the real `axiom` command, the way a user would, on a throwaway app, with the real component registry. They're slower, but they're the only ones that prove the whole chain works.

Every test works in a temporary folder that gets deleted afterwards. None of them touch the repository or the network.

## The pages

| Page | What it covers | Kind |
| --- | --- | --- |
| [cli.md](cli.md) | The `init`, `add` and `fetch` commands, end to end | Integration |
| [copy.md](copy.md) | Where files land and how imports get rewritten | Unit |
| [tokens.md](tokens.md) | Registering component styles in the theme | Unit |
| [init.md](init.md) | The checks and suggestions `init` makes before copying | Unit |
| [project.md](project.md) | Reading `axiom.json` and the app's settings | Unit |
| [registry.md](registry.md) | Working out which components to copy | Unit |
| [install.md](install.md) | Picking the right install command | Unit |

If you have five minutes, read [cli.md](cli.md). It describes the CLI from the user's side.

## Running them

```sh
bun run --cwd packages/cli test
```

On GitHub, the "CLI" workflow runs the same command after a typecheck. A red check on a pull request means one of the tests described here failed, and the log names which one.

## Words used in these pages

- **Registry.** The folder holding the source of every component, `packages/registry`. The CLI copies from it.
- **Item.** Anything the registry can copy: a component, a hook, the theme.
- **Dependency.** An item another item needs. `add button` also copies `text` and `icon`.
- **Alias.** A shortcut in an import path, like `@/components/ui`. The app's `tsconfig.json` says which real folder it stands for.
- **Styling.** The tool the app styles with: React Native's `StyleSheet`, or Unistyles. Some components have one version per styling.
- **Tokens.** A component's style values (colors, sizes, radius), kept in the theme so the app can change them in one place.
