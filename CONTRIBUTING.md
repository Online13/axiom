# Contributing to Axiom

Thanks for your interest in Axiom. This guide covers setting up the repository, finding something to work on, and opening a pull request. The [contributing guide](https://axiom.nekena-rayane.com/docs/contributing/) in the documentation goes further: how the registry reaches an app, adding a component, testing and writing docs.

Axiom is in early development. The repository contains the documentation site, the landing page, four demo apps, an 88-entry registry and a CLI with `add`, `init` and `sync`. The 75 entries with styling variants are written for `stylesheet`, `unistyles`, `nativewind` and `uniwind`.

## Before contributing

Read these first:

- [Design Principles](./DESIGN_PRINCIPLES.md), to know how decisions are made
- [Architecture](./ARCHITECTURE.md), to know where things belong

For anything beyond a small fix, such as a new component, a new pattern, an API change or a new dependency, open an issue first. Agreeing on the direction before writing code saves both sides time.

## Prerequisites

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/), the package manager for the monorepo (`bun.lock` is committed)
- [Node.js](https://nodejs.org/) `>=22.12.0`, required by the Astro app (see `apps/web/package.json`)

The demo apps run as [development builds](https://docs.expo.dev/develop/development-builds/introduction/), compiled on your machine. For Android you need Android Studio (Android SDK and JDK), and for iOS you need Xcode on macOS. Without a Mac, test on iOS with [native-sim](./apps/NATIVE_SIM.md), which builds a demo on a GitHub macOS runner and streams the simulator to your browser.

## Local setup

```bash
git clone git@github.com:Online13/axiom.git
cd axiom
bun install
```

Run the documentation from the repository root:

```bash
bun web dev     # landing and documentation, http://localhost:4321
bun web build   # check that every page compiles
```

Components are written in `packages/registry` and copied into the demos by the CLI, so a demo's `src/theme`, `src/hooks` and `src/components` are ignored by Git. Copy them, then build and start a demo:

```bash
bun demo:stylesheet axiom sync --no-install   # copy the items listed in axiom.json
bun demo:stylesheet android                   # or ios, from macOS (first time)
bun demo:stylesheet start                     # Metro
bun demo:stylesheet axiom:watch               # copy registry changes as you edit
```

The same goes for `demo:unistyles`, `demo:nativewind` and `demo:uniwind`. Edit the registry, never the copies in a demo. See [apps/README.md](./apps/README.md) and [From the registry to an app](https://axiom.nekena-rayane.com/docs/contributing/registry-to-app/).

The repo installs dependencies hoisted (`bunfig.toml`), so every app must use the same React version as Expo.

The CLI has tests (`bun run --cwd packages/cli test`), and the registry is typechecked for every variant (`bun run --cwd packages/registry typecheck`). For an app, the minimum check is a successful build. For a demo app, run `bunx tsc --noEmit` and `bunx expo-doctor` in its folder. The [setup page](https://axiom.nekena-rayane.com/docs/contributing/setup/#run-the-checks) lists the check for each part of the repository.

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

Discuss component, behavior and pattern contributions in an issue before starting work.

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

Component tests run with Jest and React Native Testing Library in every demo, against the code the CLI copied there (`bun demo:stylesheet test`, `bun demo:uniwind test`, …). The tests live once in `packages/registry/tests`, and each demo's `test` script copies the registry before running them. A change to an item comes with a test for what it changes, and its `<item>-scenarios.md` updated. Describe in the pull request what you checked on a device. The [Testing](./apps/web/content/docs/contributing/testing.mdx) page of the docs explains every check.

## Documentation

Any change to a public API must update the matching page in `apps/web/content/docs`. New components, behaviors and patterns need a page.

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
