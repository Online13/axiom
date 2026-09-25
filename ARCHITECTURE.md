# Architecture

This document explains how Axiom is organized and where things belong. For the reasoning behind these choices, see [Design Principles](./DESIGN_PRINCIPLES.md).

Axiom is in early development. This document describes the intended structure of the system and, in [Repository structure](#repository-structure), what exists in the repository today.

## System overview

```text
Foundations → Components → Behaviors → Patterns → Blocks
```

| Layer       | Role                                                              |
| ----------- | ----------------------------------------------------------------- |
| Foundations | Theme, tokens and shared low-level primitives                     |
| Components  | Reusable UI pieces, organized with Atomic Design                  |
| Behaviors   | Reusable interaction logic, independent of a specific look        |
| Patterns    | Components and behaviors combined to solve a recurring UX problem |
| Blocks      | Compositions that make up a significant part of a real app        |

Atomic Design organizes the UI elements (components and blocks). It doesn't describe behaviors or patterns.

The mathematical vocabulary used in Axiom's name and presentation is branding. It doesn't define the technical structure.

## Foundations

Foundations hold everything global that other layers read from:

- raw tokens: palette, spacing, radius, sizes, typography scale
- the semantic theme: color roles, with `light` and `dark` themes
- typography primitives
- component-level tokens
- core primitives shared by many components, such as slots, portals, overlays and pressable surfaces

Tokens are split into three levels:

```text
raw tokens → semantic tokens → component tokens
```

Raw tokens are values with no meaning attached. Semantic tokens give them a role, such as a surface or a primary color. Component tokens map those roles to a specific component. A component reads its own tokens, so an app can restyle it without editing every file.

## Atomic Design

| Level     | Role                                                                                |
| --------- | ----------------------------------------------------------------------------------- |
| Atoms     | The smallest usable UI units, such as a button or an input                          |
| Molecules | A few atoms forming one coherent UI function, such as a search bar                  |
| Organisms | Complex components that own a full interaction, such as a passcode entry            |
| Templates | Structures that organize a screen or a large area, such as an app bar or a scaffold |
| Blocks    | Complete screens or large sections meant to be adapted, such as an onboarding flow  |

Use this classification as a guide. When an element doesn't fit cleanly, pick the level that best describes its responsibility and explain the choice in the pull request.

## Components

A component is a reusable UI piece or structure. It renders something and exposes an API to control it.

A component may include the interaction it needs to be usable, such as press feedback. Interaction logic that several unrelated components could share belongs in a behavior.

## Behaviors

A behavior is reusable interaction logic that doesn't depend on a specific appearance. It handles state, gestures, timing and edge cases, and lets components or patterns decide how things look.

Examples of the kind of logic this layer covers:

- press handling
- dragging
- keyboard interaction
- dismissing a surface

These are illustrations of the layer, not a list of what's available.

## Patterns

A pattern intentionally combines components and behaviors to solve a recurring mobile UX problem. Examples are code verification, swipe actions on a list row, or a selection mode.

A pattern is defined by the problem it solves. A pattern composes existing pieces and doesn't reimplement them. Depending on its size, a pattern can end up shipped as an organism, a template or a block.

## Blocks

Blocks are the highest level. A block is a composition that makes up a meaningful part of a real app: an authentication flow, an onboarding sequence, a profile screen.

Blocks are copied into the app and adapted. They use the layers below and add no new primitives of their own.

## Dependency direction

Dependencies point downward only.

```text
Blocks
  ↓
Patterns
  ↓
Behaviors, Components
  ↓
Foundations
```

Higher layers may depend on lower layers. A lower layer never imports from a higher one. An atom doesn't know about a pattern, and foundations don't know about any component.

## Registry

The registry is the manifest of everything Axiom can add to a project. For each item it records:

- what the item is and which layer it belongs to
- which files it's made of
- its internal dependencies on other Axiom items
- its external npm dependencies

With this graph, a project can take one item and get exactly what that item needs.

The registry lives in `packages/registry`. Its manifest, `registry.json`, lists 55 items. All 45 entries with styling variants provide both `stylesheet` and `unistyles` implementations.

## CLI

The CLI is how a project uses the registry. It copies the requested items and their dependencies into the project, then installs the npm packages they need.

The copied code belongs to the project. The CLI is a tool for adding code and never becomes a runtime dependency of the app.

The CLI lives in `packages/cli`. Its `add` command copies files, rewrites imports and installs missing npm packages. Its `init` command configures styling and aliases, copies foundations and core primitives, installs their dependencies and writes `axiom.json`. The CLI reads the registry from a local folder.

## Repository structure

The repository is a Bun workspace monorepo. The workspaces are `apps/*` and `packages/*`.

```text
axiom/
├── apps/
│   ├── web/               # landing and documentation site
│   ├── demo-stylesheet/   # demo app, one per styling variant
│   ├── demo-unistyles/
│   ├── demo-nativewind/
│   └── demo-uniwind/
├── packages/
│   ├── registry/          # source of every item, and registry.json
│   └── cli/               # the axiom CLI
├── bunfig.toml            # hoisted installs, required by the Expo apps
└── package.json           # workspaces and app shortcuts
```

- **`apps/web`.** The Astro website. It serves the landing page at `/` and the Fumadocs pages at `/docs`. Documentation content lives in `apps/web/content/docs`. See [its README](./apps/web/README.md).
- **`apps/demo-*`.** Expo apps, one per styling tool. Each one is set up like a user project: it has an `axiom.json` and gets its components through the CLI.
- **`packages/registry`.** The code copied into projects. Nothing imports it directly. See [its README](./packages/registry/README.md).
- **`packages/cli`.** The command that reads the registry and copies items into a project.

See [apps/README.md](./apps/README.md) for how the apps run.

## Dependency rules

- No circular dependencies, between layers or between items.
- Foundations don't depend on any other layer.
- Patterns and blocks compose existing pieces instead of duplicating them.
- Every external dependency needs a reason (see [Intentional dependencies](./DESIGN_PRINCIPLES.md#6-intentional-dependencies)).
- The documentation and landing apps may consume Axiom code. Axiom code never depends on them.
