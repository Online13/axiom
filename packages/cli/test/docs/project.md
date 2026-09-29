# Reading the app's settings

File: [`project.test.ts`](../project.test.ts). Unit tests.

## Context

The CLI reads three things from the user's app:

- `axiom.json`, which `init` writes and every `add` reads;
- `tsconfig.json`, to find which folder an alias like `@/components/ui` stands for;
- `package.json`, to see which libraries are installed.

These files are written and edited by hand, so they can hold anything. The CLI has to read them correctly and reject what it doesn't understand, with a message that names the problem.

## `axiom.json`

**Missing settings get their default values.**
A user who only changed the theme folder writes just that one alias. The CLI must fill in the other aliases and an empty list of items.

**Unknown values are rejected by name.**
A missing or unknown styling (`"css"`), icon source (`"lucide"`) or navigation library (`"router"`) must fail with a message naming the field and its valid values. Otherwise the error would come much later, somewhere unrelated.

**A missing file is reported.** Running `add` before `init` gets a clear message.

**It's always written in the same order, and reads back the same.**
The CLI rewrites `axiom.json` after every `add`. If the keys moved around each time, every run would show up as a change in git. The test also checks that what's written reads back unchanged.

## Aliases

**An alias maps to the right folder, using the most specific rule.**
An app can have a general rule (`@/*` goes to `src/`) and a more specific one (`@/ui/*` goes to `packages/ui/`). The specific one must win, or files would land in the wrong folder.

**An alias no rule covers is reported.** This is what lets `init` stop before copying code that wouldn't compile.

## Libraries installed

**The navigation library is detected, with Expo Router first.**
Some components behave differently depending on how the app navigates. Expo Router is built on React Navigation, so an app using it lists both. The test checks that Expo Router wins, and that an app with neither falls back to plain React Native.

**`--navigation` only accepts known values.**

**Missing packages are found in both dependency lists.** A package listed under `devDependencies` counts as installed. Otherwise the CLI would ask the user to install something they already have.
