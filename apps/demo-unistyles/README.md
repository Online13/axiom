# Axiom demo: Unistyles

The Axiom demo app for the `unistyles` styling variant: one screen per component, from the foundations to the templates, then the compositions and the block, with a light / dark switch.

It is set up like a user project. `axiom.json` lists its items, and the CLI copies them from [`packages/registry`](../../packages/registry) into `src/theme`, `src/hooks` and `src/components`. Those copies are ignored by Git: edit the registry, not the demo.

## Run it

From the repository root, after `bun install`:

```bash
bun demo:unistyles axiom sync --no-install   # copy the items listed in axiom.json
bun demo:unistyles android                   # build and install the development build (first time)
bun demo:unistyles ios                       # same on iOS, from macOS with Xcode
bun demo:unistyles start                     # start Metro
```

The app is a [development build](https://docs.expo.dev/develop/development-builds/introduction/), not Expo Go. Build again only after adding a native library, changing `app.json` or upgrading Expo. Without a Mac, stream it on iOS with `bun run sim:ios up --app unistyles` (see [native-sim](../NATIVE_SIM.md)).

| Command                          | What it does                                                   |
| -------------------------------- | -------------------------------------------------------------- |
| `bun demo:unistyles axiom:watch` | Copies registry changes into the demo as you edit              |
| `bun demo:unistyles test`        | Copies the registry, then runs the component tests on the copy |

Its app id is `dev.axiom.demo.unistyles`, so it installs next to the other demos. See [apps/README.md](../README.md) for the four demos together.
