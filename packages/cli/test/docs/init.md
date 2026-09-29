# What `init` checks and suggests

File: [`init.test.ts`](../init.test.ts). Unit tests.

## Context

Before copying anything, `axiom init` makes a few decisions: which styling tools it can offer, which folders to suggest, and whether the folder is even an app. These tests check those decisions one at a time. The full command is covered in [cli.md](cli.md).

## Which styling tools to offer

**Only the ones every base file supports.**
`init` copies the theme and a few building blocks. If any of them lacks a version for a styling tool, offering that tool would lead to a failed setup halfway through. The test uses a made-up registry where only `StyleSheet` is complete and checks that it's the only option offered.

**The real registry offers `StyleSheet` and Unistyles.**
This one reads the actual registry. If someone adds the Tailwind versions of the base files, this test fails on purpose: it's the reminder to update the test and to check that Tailwind setup really works.

**`--styling` only accepts an offered tool.** Anything else fails, and the message lists the valid choices.

## Which folders to suggest

**The default folders for an app that imports with `@/`.**
That's the usual Expo setup, and the default aliases (`@/theme`, `@/components/ui`, and so on) fit it as is.

**The app's own prefix when it uses another one.**
Some apps import with `~/` instead of `@/`. Suggesting `@/theme` there would make the user correct six paths before anything gets copied. `init` must suggest `~/theme`, `~/components/ui`, and so on.

## Whether the folder is an app

**An Expo app or a bare React Native app is accepted.**

**Anything else is refused.** A folder without `package.json` gets a message saying so. A plain React project does too, since Axiom sets up an existing mobile app and doesn't create one.
