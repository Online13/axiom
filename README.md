# Axiom

An open source system for building mobile experiences with React Native and Expo.

![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

**Axiom is in pre-alpha.** The registry, CLI, documentation site, and demo apps are under active development. APIs and component behavior may change. See [Current state](#current-state) for what the repository contains today.

> **Components are only the beginning.**

A mobile screen is more than the components on it. A bottom sheet has to follow the finger, snap and dismiss. A list has to refresh, paginate and show something useful while it's empty. The press feedback, the safe areas and the keyboard all shape how the screen feels.

Axiom covers each level of that work:

```text
Component → Behavior → Pattern → Experience
```

- **Components.** Primitives (generic building blocks, organized with Atomic Design) and compositions (ready-made interfaces assembled from them).
- **Behaviors.** Interaction logic such as scroll, gestures and loading states.
- **Patterns.** Components and behaviors combined to solve a recurring mobile UX problem.
- **Blocks.** Complete sections of an app, built from primitives and compositions.

## Why Axiom

Most mobile apps rebuild the same interactions from scratch. Component libraries usually stop at the visual layer and leave the hard parts to you: gestures, transitions, keyboard handling, empty and error states. Getting those right on both iOS and Android takes time, and complete, composable patterns are rare.

Packaged libraries also mean you don't own the code in your app. When a component doesn't fit, you work around it instead of changing it.

## Core ideas

- Mobile first, built for touch and gestures
- Components, behaviors and patterns, not only components
- Code is copied into your project, and you own it
- Composable pieces you can adopt one at a time
- A registry and a CLI to add only what you need
- React Native and Expo, on iOS and Android

The reasoning behind these ideas is in [Design Principles](./DESIGN_PRINCIPLES.md).

## Preview

<!-- TODO: add a short video or GIF of a complete mobile flow (not a single button). -->

_A preview of a real mobile flow built with Axiom will be added here._

## Current state

| Part      | Location                                   | Status                                                      |
| --------- | ------------------------------------------ | ----------------------------------------------------------- |
| Website   | [`apps/web`](./apps/web)                   | Astro landing and Fumadocs documentation                    |
| Demo apps | [`apps`](./apps)                           | Four Expo apps, one per styling tool                        |
| Registry  | [`packages/registry`](./packages/registry) | Source of the foundations, components, hooks and tests      |
| CLI       | [`packages/cli`](./packages/cli)           | `init`, `add` and `sync`: copies registry items into an app |
| Examples  | [`examples`](./examples)                   | Complete apps built with Axiom                              |

The registry lists 88 items. The 75 with styling variants are written for StyleSheet, Unistyles, NativeWind and Uniwind, and each demo app shows them with one of these tools. The documentation is online at [axiom.nekena-rayane.com/docs](https://axiom.nekena-rayane.com/docs/).

## Running locally

You need [Bun](https://bun.sh/) and [Node.js](https://nodejs.org/) `>=22.12.0`.

```bash
git clone git@github.com:Online13/axiom.git
cd axiom
bun install
bun web dev   # landing and documentation → http://localhost:4321
```

The demo apps are [development builds](https://docs.expo.dev/develop/development-builds/introduction/), not Expo Go, so they compile on your machine: Android Studio for Android, Xcode on macOS for iOS. Their components are copied from the registry by the CLI and ignored by Git, so copy them first:

```bash
bun demo:stylesheet axiom sync --no-install   # copy the items listed in axiom.json
bun demo:stylesheet android                   # build and install on Android (first time)
bun demo:stylesheet ios                       # or on iOS, from macOS
bun demo:stylesheet start                     # start Metro
```

The same commands work with `demo:unistyles`, `demo:nativewind` and `demo:uniwind`. Build again only after adding a native library, changing `app.json` or upgrading Expo; JavaScript changes reload through Metro.

While you edit `packages/registry`, `bun demo:stylesheet axiom:watch` copies each change into the demo. Before opening a pull request:

```bash
bun demo:stylesheet test   # component tests, on the demo's copy of the registry
bun run lint
bun web build
```

More details in [`apps/README.md`](./apps/README.md) and in the [setup guide](https://axiom.nekena-rayane.com/docs/contributing/setup/).

## Test on iOS without a Mac

Building for iOS needs Xcode, so it only works on macOS. Without a Mac, use the `native-sim` workflow: it builds a demo app on a GitHub macOS runner and streams an iOS Simulator to your browser. Authenticate `gh`, then commit and push your changes to `main`, since the runner builds the published commit:

```bash
gh auth login                                    # once, if gh is not connected
bun run sim:ios up --app unistyles --minutes 60  # start the build and simulator
bun run sim:ios status --app unistyles           # retrieve the Simulator URL
bun run sim:ios down --app unistyles             # stop the session
```

`--app` takes `stylesheet` (the default), `unistyles`, `nativewind` or `uniwind`. Open the URL on the `Simulator:` line. The GitHub Actions URL tracks the build; the app is ready when **Install and launch app** succeeds. Keep the Simulator URL private because it contains the session access key. The full procedure is in [apps/NATIVE_SIM.md](./apps/NATIVE_SIM.md).

## Learn more

- [Documentation](https://axiom.nekena-rayane.com/docs/)
- [Design Principles](./DESIGN_PRINCIPLES.md): how Axiom makes decisions
- [Architecture](./ARCHITECTURE.md): how the system and the repository are organized

## Contributing

Contributions are welcome. Start with the [contributing guide](https://axiom.nekena-rayane.com/docs/contributing/): setup, how the registry reaches an app, adding a component, testing and pull requests. [CONTRIBUTING.md](./CONTRIBUTING.md) has the short version.

## License

[MIT](./LICENSE)
