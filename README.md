# Axiom

An open source system for building mobile experiences with React Native and Expo.

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

## Status

Axiom is in early development and is not ready for use yet.

The repository currently holds the documentation site and the landing page. The component source, the registry and the CLI are not published. Commands shown in the documentation are drafts and may change.

## Preview

<!-- TODO: add a short video or GIF of a complete mobile flow (not a single button). -->

_A preview of a real mobile flow built with Axiom will be added here._

## Documentation

The documentation lives in [`apps/docs`](./apps/docs). It isn't hosted yet. To run it locally:

```bash
bun install
bun docs dev   # http://localhost:4322
```

## Learn more

- [Design Principles](./DESIGN_PRINCIPLES.md): how Axiom makes decisions
- [Architecture](./ARCHITECTURE.md): how the system and the repository are organized
- [Contributing](./CONTRIBUTING.md): how to set up the project and open a pull request

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

<!-- TODO: add a LICENSE file and name the license here. -->

A license has not been chosen yet. Until a [LICENSE](./LICENSE) file is added, no usage rights are granted.
