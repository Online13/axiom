# Registering component styles in the theme

File: [`tokens.test.ts`](../tokens.test.ts). Unit tests.

## Context

Most components have style values: a button's height, radius, colors per variant. Axiom calls them tokens. They live in the theme rather than in the component, so an app can restyle every button in one place.

The theme has a file listing every component's tokens, `theme/components/index.ts`. It contains two marked zones:

```ts
// axiom:imports:start
import { buttonTokens } from './button';
// axiom:imports:end
...
  // axiom:components:start
  button: buttonTokens(colors, tokens),
  // axiom:components:end
```

Each time a component with tokens is added, the CLI inserts one line in each zone. The rest of the file is the user's, and the CLI must not touch it.

## The tests

**Component names turn into the right keys.**
`icon-button` becomes `iconButton` and `iconButtonTokens`. Components without tokens are skipped, and the list is sorted so the file stays stable from one run to the next.

**Each component adds one import and one entry, lined up with the markers.**
We start from an empty theme file, register two components, and compare the result with the exact expected file, indentation included. A misaligned line would look sloppy in the user's code, and a missing one would crash the app at startup.

**A component that's already registered is left alone.**
Registering twice must not add duplicate lines. The test also covers the more realistic case: the user changed the button's line to tweak its radius. The CLI must recognize the component as already registered and keep the user's line as is.

**An old theme gets a clear message instead of a broken edit.**
Themes copied by older Axiom versions don't have the markers, or pass fewer arguments to the tokens. Rather than insert lines in the wrong place, the CLI must stop and tell the user to update their theme with `axiom add theme`.
