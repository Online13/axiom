# Axiom demo: Uniwind

The Axiom demo app for the `uniwind` styling variant: one screen per component, from the foundations to the templates, then the compositions and the block, with a light / dark switch.

It is set up like a user project. `axiom.json` lists its items, and the CLI copies them from [`packages/registry`](../../packages/registry) into `src/theme`, `src/hooks` and `src/components`. Those copies are ignored by Git: edit the registry, not the demo.

## Run it

From the repository root, after `bun install`:

```bash
bun demo:uniwind axiom sync --no-install   # copy the items listed in axiom.json
bun demo:uniwind android                   # build and install the development build (first time)
bun demo:uniwind ios                       # same on iOS, from macOS with Xcode
bun demo:uniwind start                     # start Metro
```

The app is a [development build](https://docs.expo.dev/develop/development-builds/introduction/), not Expo Go. Build again only after adding a native library, changing `app.json` or upgrading Expo. Without a Mac, stream it on iOS with `bun run sim:ios up --app uniwind` (see [native-sim](../NATIVE_SIM.md)).

| Command                        | What it does                                                   |
| ------------------------------ | -------------------------------------------------------------- |
| `bun demo:uniwind axiom:watch` | Copies registry changes into the demo as you edit              |
| `bun demo:uniwind test`        | Copies the registry, then runs the component tests on the copy |

Its app id is `dev.axiom.demo.uniwind`, so it installs next to the other demos. See [apps/README.md](../README.md) for the four demos together.
