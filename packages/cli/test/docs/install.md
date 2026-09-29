# Picking the install command

File: [`install.test.ts`](../install.test.ts). Unit tests.

## Context

Copied components often need npm packages, such as the system icons package or the animation library. The CLI either runs the install command or prints it for the user to run.

That command depends on the app. There are four package managers (bun, pnpm, yarn, npm), each with its own syntax. On top of that, Expo apps should install through `expo install`, which picks the versions that match their Expo release. The wrong command installs mismatched versions or fails outright.

## Which package manager

**The lockfile tells.** `bun.lock` means bun, `pnpm-lock.yaml` means pnpm, and so on for each supported lockfile.

**In a monorepo, the CLI looks up to the root.**
An app in `apps/mobile` usually has no lockfile of its own. It sits at the repository root. The CLI must walk up the folders to find it. Without any lockfile, it falls back to npm, which every Node install has.

## Which command

**Expo apps go through `expo install`.**
With bun that's `bun expo install ...`, with npm it's `npx expo install ...`.

**Other apps use the package manager's own syntax.**
`pnpm add ...` for pnpm, `npm install ...` for npm. These are the commands users see printed, so getting them wrong would send them down the wrong path.
