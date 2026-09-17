# Axiom

An open source system for building mobile experiences with React Native and Expo.

![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

**Axiom is being built in the open, and is not usable yet.** No component code has been written: the documentation describes what is being built, not what you can install today. See [Current state](#current-state) for what the repository holds.

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

| Part | Location | Status |
| --- | --- | --- |
| Specification | [`docs`](./docs) | Written (in French), including the [roadmap](./docs/roadmap) |
| Documentation site | [`apps/docs`](./apps/docs) | Runs locally, not hosted yet |
| Landing page | [`apps/landing`](./apps/landing) | Runs locally, not hosted yet |
| Demo apps, one per styling tool | [`apps/demo-*`](./apps) | Empty shells, run locally |
| Registry | [`packages/registry`](./packages/registry) | Set up, no items yet |
| CLI | [`packages/cli`](./packages/cli) | `add` works from a local registry |
| Components, behaviors, patterns | [`packages/registry`](./packages/registry) | Not started |

The next step is [Phase 1](./docs/roadmap/phase-1.md): foundations, core primitives and the first atoms.

## Running locally

```bash
bun install
bun docs dev      # documentation → http://localhost:4322
bun landing dev   # landing page  → http://localhost:4321

bun demo:stylesheet android   # build and install the demo app, see apps/README.md
bun demo:stylesheet start     # start Metro
```

More details in [`apps/README.md`](./apps/README.md).

## Learn more

- [Design Principles](./DESIGN_PRINCIPLES.md): how Axiom makes decisions
- [Architecture](./ARCHITECTURE.md): how the system and the repository are organized
- [Contributing](./CONTRIBUTING.md): how to set up the project and open a pull request

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
