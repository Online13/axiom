# Contributing to Axiom

Thanks for your interest in Axiom. This guide covers setting up the repository, finding something to work on, and opening a pull request.

Axiom is in early development. The repository contains the documentation site, the landing page, four demo apps, an empty registry and a first version of the CLI. No component is written yet, so most contributions for now are on documentation and tooling.

## Before contributing

Read these first:

- [Design Principles](./DESIGN_PRINCIPLES.md), to know how decisions are made
- [Architecture](./ARCHITECTURE.md), to know where things belong

For anything beyond a small fix, such as a new component, a new pattern, an API change or a new dependency, open an issue first. Agreeing on the direction before writing code saves both sides time.

## Prerequisites

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/), the package manager for the monorepo (`bun.lock` is committed)
- [Node.js](https://nodejs.org/) `>=22.12.0`, required by the Astro apps (see `apps/landing/package.json`)

The demo apps run as [development builds](https://docs.expo.dev/develop/development-builds/introduction/), compiled on your machine. For Android you need Android Studio (Android SDK and JDK), and for iOS you need Xcode on macOS.

## Local setup

```bash
git clone git@github.com:Online13/axiom.git
cd axiom
bun install
```

Run the apps from the repository root:

```bash
bun docs dev        # documentation, http://localhost:4322
bun landing dev     # landing page, http://localhost:4321
```

Build them to check your changes compile:

```bash
bun docs build
bun landing build
```

Both dev servers can run at the same time. See [apps/README.md](./apps/README.md) for details.

Start a demo app from its own folder, so Expo can show the QR code:

```bash
cd apps/demo-stylesheet
bun start
```

Components are written in `packages/registry` and copied into the demos by the CLI. See [repository.md](./docs/architecture/repository.md#les-démos-passent-par-le-cli).

The repo installs dependencies hoisted (`bunfig.toml`), so every app must use the same React version as Expo.

There are no tests yet. The minimum check is a successful build of the app you changed. For a demo app, run `bunx tsc --noEmit` and `bunx expo-doctor` in its folder.

## Finding something to work on

Look through the open issues on GitHub. These labels are planned to organize them:

- `good first issue`: small, well-scoped tasks for a first contribution
- `help wanted`: tasks where outside help is especially useful
- `bug`: something doesn't work as documented
- `enhancement`: a new feature or an improvement
- `documentation`: changes to the docs

Not every label may be in use yet. If nothing fits, open an issue describing what you'd like to work on.

## What you can contribute

- Components
- Behaviors
- Patterns
- Foundations
- Documentation
- Tooling
- Tests
- Examples

Component, behavior and pattern contributions depend on the source code landing in the repository. Until then, discuss them in an issue.

## Adding a component

A component contribution should consider:

- **API.** Props are small, predictable and consistent with existing components.
- **Composition.** It can be combined with other pieces instead of growing more props.
- **Theming.** It reads from tokens and doesn't hardcode colors or sizes.
- **Accessibility.** It has roles, labels, states and adequate touch targets.
- **Touch states.** Pressed, disabled and focused states are handled.
- **Platforms.** It has been checked on iOS and on Android.
- **Tests and documentation.** Both are updated (see below).

## Adding a behavior

A behavior contribution should check:

- the interaction itself and the gestures involved
- interruption: what happens when the user changes their mind mid-gesture
- state, and how it stays consistent
- edge cases such as fast repeated input, empty data or unmounting mid-animation
- keyboard handling, when relevant
- performance, especially for gestures and animations
- accessibility, including an alternative for gesture-only actions

## Adding a pattern

A pattern has to solve an identifiable mobile UX problem. State the problem in the issue or pull request.

An arbitrary arrangement of components is not a pattern. Build on existing components and behaviors wherever possible. If the pattern needs a missing piece, propose that piece separately.

## Tests

The repository has no test infrastructure yet. When it exists, significant changes must include appropriate tests. Until then, describe in the pull request how you checked your change.

## Documentation

Any change to a public API must update the matching page in `apps/docs/content/docs`. New components, behaviors and patterns need a page.

## Pull requests

A good pull request:

- stays focused on one change
- explains why the change is needed, not only what it does
- avoids unrelated refactors and formatting changes
- builds successfully, and passes automated checks once they exist
- includes screenshots or videos for visual or interaction changes, on iOS and Android when relevant
- links the related issue

## Commit messages

The history uses [Conventional Commits](https://www.conventionalcommits.org/), with the app as scope when it applies:

```text
feat(docs): add docs components
feat(landing): add landing app
docs: add atoms content
chore: set up bun monorepo
```

Follow the same style.

## Review

Reviews may ask for changes about:

- consistency with the [design principles](./DESIGN_PRINCIPLES.md)
- API design
- architecture and layer placement
- accessibility
- performance
- behavior on a real device
- scope

A pull request can be technically correct and still not fit Axiom's direction. When that happens, the review explains why. Opening an issue first is the best way to avoid it.
