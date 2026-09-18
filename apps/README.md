# Apps

Applications in the monorepo. Each folder is a standalone Bun workspace with its own `package.json`.

| App | Purpose | Stack |
| --- | --- | --- |
| [docs](docs/) | Public Axiom documentation | Astro + Fumadocs |
| [landing](landing/) | Axiom presentation page | Astro |
| [demo-stylesheet](demo-stylesheet/) | Demo app, `stylesheet` variant | Expo + StyleSheet |
| [demo-unistyles](demo-unistyles/) | Demo app, `unistyles` variant | Expo + Unistyles |
| [demo-nativewind](demo-nativewind/) | Demo app, `tailwind` variant | Expo + NativeWind |
| [demo-uniwind](demo-uniwind/) | Demo app, `tailwind` variant | Expo + Uniwind |

## docs

The reference site for Axiom users. It covers:

- what Axiom offers: foundations, core, atoms, molecules, organisms, templates, blocks;
- a page for each component, with preview, API and usage;
- the source code to copy into your project, alongside the `npx axiom add` CLI.

Content comes from the spec in [`/docs`](../docs/README.md).

## landing

A single Astro page that presents Axiom: its positioning, its promise (*Build mobile experiences, not isolated components*) and links to the documentation.

## Demo apps

Four Expo apps, one per styling tool, with the same screens. Each is set up like a user project: it has an `axiom.json` and receives components from [`packages/registry`](../packages/registry) through the CLI. Files the CLI copies (`src/theme`, `src/hooks`, `src/components`) are ignored by git. Edit them in the registry.

```bash
bun demo:stylesheet axiom add <item>   # copy an item and its internal dependencies
bun demo:stylesheet axiom:watch        # copy again on every registry change
bun demo:stylesheet android            # build and install the development build (first time)
bun demo:stylesheet start              # start Metro, then open the app
```

Same for `demo:unistyles`, `demo:nativewind` and `demo:uniwind`. These shortcuts use `bun run --cwd apps/demo-<variant>`, which keeps Expo's interactive terminal and QR code. `bun run --filter` doesn't, so the demos don't use it.

The demos don't use Expo Go. Each one is a [development build](https://docs.expo.dev/develop/development-builds/introduction/): the app is compiled from the project with `expo-dev-client`, so it includes native code Expo Go lacks, such as Unistyles. `bun android` compiles it locally (Android Studio required, phone plugged in over USB with debugging on) and `bun ios` does the same on macOS.

Build again only after adding a library with native code, changing `app.json` or upgrading the Expo SDK. JavaScript changes reload through Metro.

Each demo has its own app id (`dev.axiom.demo.<variant>`), so all four install side by side.

## iOS simulator in the browser

The root [native-sim workflow](../.github/workflows/native-sim.yml) builds `demo-stylesheet` on a GitHub macOS runner. It installs the Bun workspace from the repo root, regenerates Axiom components, then builds the Expo app from `apps/demo-stylesheet`.

Before the first run, commit and push the workflow, its auth gate, and the launcher on the default branch. Authenticate the GitHub CLI with `gh auth login`. The launcher checks that the current commit is on GitHub, then dispatches the workflow without staging or committing local changes.

```bash
bun run sim:ios up --minutes 60       # build and print the simulator URL
bun run sim:ios up --agent            # also enable agent-device control
bun run sim:ios status                # show the current run and URL
bun run sim:ios down                  # stop the current run
```

For `--agent`, install `agent-device` locally first. The launcher prints the proxy connection command. The session URL includes an access key; keep it private. Session details are stored locally under `.git/` and are not committed.

The first build can take around 30 minutes. The native `.app` is cached by Expo fingerprint; later JavaScript-only changes reuse it. See the [native-sim guide](https://reactnativefeel.com/sim/llm.txt) for simulator controls and limitations. Use the `sim:ios` script for this monorepo: the upstream `native-sim up` command assumes the Expo app is at the Git root and automatically commits and pushes the whole working tree.

## Running an app

From the repo root, pass the script name after the app shortcut:

```bash
bun docs dev        # docs dev server → http://localhost:4322
bun landing dev     # landing dev server → http://localhost:4321
bun landing build   # landing production build
```

Ports are fixed in each app's `astro.config.mjs`, so both servers can run at the same time. Cross-links default to these local URLs; set `PUBLIC_DOCS_URL` (landing) and `PUBLIC_LANDING_URL` (docs) for other environments.

These shortcuts are defined in the root `package.json` with `bun run --filter './apps/<app>'`. The demo shortcuts use `--cwd` instead, see [Demo apps](#demo-apps).
