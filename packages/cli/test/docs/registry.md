# Working out what to copy

File: [`registry.test.ts`](../registry.test.ts). Unit tests.

## Context

Components depend on each other. A button uses text and icons, and both use the theme. When a user types `axiom add button`, the CLI walks through these links and builds the full list of items to copy.

The registry is maintained by hand, so it can contain mistakes: a misspelled dependency, or two components that depend on each other in a loop. The CLI must handle them with a clear message, never an endless loop or a cryptic crash.

## The tests

**The requested items come first, then their dependencies, each once.**
With a button that needs icon, text and theme, and an icon and text that both need the theme, the list must contain the theme only once. Asking for `text` and `button` together must not duplicate anything either. Copying an item twice in one run would at best waste time and at worst trigger a conflict.

**An unknown item names who asked for it.**
`add nope` must say the item doesn't exist. When the mistake is inside the registry (a card that depends on a component nobody wrote), the message must also say which item required it. That tells the person maintaining the registry where to look.

**A dependency loop is refused, with its path.**
If a needs b, b needs c and c needs a, the CLI must stop and print `a → b → c → a` instead of looping forever.

**The registry is read from its folder, and a wrong folder is reported.**
Pointing `--registry` at a folder without `registry.json` must say so plainly.
