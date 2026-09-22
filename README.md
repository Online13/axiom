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

- **Components.** Reusable UI pieces, organized with Atomic Design.
- **Behaviors.** Interaction logic such as scroll, gestures and loading states.
- **Patterns.** Components and behaviors combined to solve a recurring mobile UX problem.
- **Blocks.** Larger compositions that make up a real part of an app.

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

| Part               | Location                                   | Status                                        |
| ------------------ | ------------------------------------------ | --------------------------------------------- |
| Website            | [`apps/web`](./apps/web)                   | Astro landing and Fumadocs documentation      |
| Demo apps          | [`apps`](./apps)                           | Four Expo apps, one per styling tool          |
| Registry           | [`packages/registry`](./packages/registry) | Source for foundations, components, and hooks |
| CLI                | [`packages/cli`](./packages/cli)           | Copies selected registry items into an app    |

The registry currently lists 53 items. The StyleSheet demo exercises them in an Expo app; the other demos cover Unistyles, NativeWind, and Uniwind. See [apps/README.md](./apps/README.md) for the workspace layout.

## Running locally

```bash
bun install
bun web dev       # landing and documentation → http://localhost:4321

bun demo:stylesheet android   # build and install the demo app, see apps/README.md
bun demo:stylesheet start     # start Metro
```

More details in [`apps/README.md`](./apps/README.md).

## Test a demo on iOS

The `native-sim` workflow builds one of the demo apps on a GitHub macOS runner and streams an iOS Simulator to your browser. Authenticate `gh`, then commit and push your changes to `main` before starting a session:

```bash
gh auth login                                    # once, if gh is not connected
bun run sim:ios up --app unistyles --minutes 60  # start the build and simulator
bun run sim:ios status --app unistyles           # retrieve the Simulator URL
bun run sim:ios down --app unistyles             # stop the session
```

`--app` takes `stylesheet` (the default), `unistyles`, `nativewind` or `uniwind`. Open the URL on the `Simulator:` line. The GitHub Actions URL tracks the build; the app is ready when **Install and launch app** succeeds. Keep the Simulator URL private because it contains the session access key. The full procedure is in [apps/NATIVE_SIM.md](./apps/NATIVE_SIM.md).

## Learn more

- [Design Principles](./DESIGN_PRINCIPLES.md): how Axiom makes decisions
- [Architecture](./ARCHITECTURE.md): how the system and the repository are organized
- [Contributing](./CONTRIBUTING.md): how to set up the project and open a pull request

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
