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
cd apps/demo-stylesheet
bun run axiom add <item>   # copy an item and its internal dependencies
bun run axiom:watch        # copy again on every registry change
bun android                # build and install the development build (first time)
bun start                  # start Metro, then open the app
```

Run `bun start` from the app folder. Through `bun run --filter`, Expo has no interactive terminal and shows no QR code.

The demos don't use Expo Go. Each one is a [development build](https://docs.expo.dev/develop/development-builds/introduction/): the app is compiled from the project with `expo-dev-client`, so it includes native code Expo Go lacks, such as Unistyles. `bun android` compiles it locally (Android Studio required, phone plugged in over USB with debugging on) and `bun ios` does the same on macOS.

Build again only after adding a library with native code, changing `app.json` or upgrading the Expo SDK. JavaScript changes reload through Metro.

Each demo has its own app id (`dev.axiom.demo.<variant>`), so all four install side by side.

## Running an app

From the repo root, pass the script name after the app shortcut:

```bash
bun docs dev        # docs dev server → http://localhost:4322
bun landing dev     # landing dev server → http://localhost:4321
bun landing build   # landing production build
```

Ports are fixed in each app's `astro.config.mjs`, so both servers can run at the same time. Cross-links default to these local URLs; set `PUBLIC_DOCS_URL` (landing) and `PUBLIC_LANDING_URL` (docs) for other environments.

These shortcuts are defined in the root `package.json` with `bun run --filter './apps/<app>'`.
