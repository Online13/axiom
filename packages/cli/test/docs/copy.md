# Copying files into the app

File: [`copy.test.ts`](../copy.test.ts). Unit tests.

## Context

This is the core of the CLI and its most delicate code. For every file of every item, it decides:

- **where the file goes in the app.** Components with several files get their own folder. A component with a single file stays a single file. Style values go to the theme folder. Some files carry a fixed destination.
- **how to rewrite its imports**, so they point to where the other files actually landed.
- **what to do if a file is already there**: overwrite it, keep it, or ask.

We don't test this against the real registry. The tests use a tiny made-up registry of five items, each chosen to exercise one rule:

- `theme`: base files, one of them placed in a subfolder;
- `text`: a component made of a single file;
- `icon`: a component made of several files, with one file the app owns once it's created (the list of icons);
- `button`: a component whose style values go to the theme, and which uses `icon` and `text`;
- `fancy`: a component that only exists for Unistyles.

A small registry keeps each test easy to read, and when one fails it's obvious which rule broke.

## Where files land and what they contain

**Each file goes where its rule says, and npm packages are listed.**
Copying `button` must produce exactly the expected list of files, no more and no less. The npm packages the items need must be collected, so the CLI can tell the user what to install.

**Imports point to where files ended up.**
We give the app unusual aliases (`@/ui` instead of `@/components/ui`, `@/design` instead of `@/theme`), then check the copied code line by line:

- an import of another component follows it to its new folder;
- an import of the button's style values now points into the theme;
- a lazy import (`import("...")`) gets rewritten too;
- imports between two files of the same component still work after the move.

If any of these is wrong, the user's app doesn't compile.

**A component with a folder gets an index file.**
When `icon` becomes a folder, the CLI writes an `index.ts` in it, so `@/components/ui/icon` still works. The test checks its content, and that the component's main file comes first.

**Copying twice changes nothing.**
The second copy must write zero files and report them all as unchanged.

## When a file already exists and differs

**A file the app owns is never overwritten.**
The icon list starts empty and then belongs to the user, who fills it with their icons. Even in the most aggressive mode, the CLI must leave it alone. Overwriting it would wipe the app's icons.

**Dependencies are kept, unless we force it.**
The user asked for `button`, not `text`. If they edited `text`, a plain `add button` must not touch it, even with `--overwrite`. Only watch mode, which we use while developing Axiom itself, may overwrite dependencies.

**The CLI asks for each file, and "keep all" stops the questions.**
With two edited files, answering "keep all of mine" must stop after the first question and keep both. Answering "overwrite all" writes both.

**Without anyone to ask, the user's version wins.**
When there's no terminal, an edited file is kept and reported as such.

## Refusals

**A component without a version for the app's styling.**
`fancy` only exists for Unistyles. On a `StyleSheet` app, the CLI must refuse with a clear message. On a Unistyles app, it copies fine.

**A component that draws icons, without an icon source.**
With no icon source set, or with one this component doesn't support, the CLI must refuse and explain.

**An import that reaches into another component through a relative path.**
In the registry, components must reach each other through aliases, since they'll be moved apart in the app. A relative path to another component's file would break after the copy, so the CLI refuses it. This protects us from registry mistakes.

**One bad file means no files at all.**
If a single file of the batch fails, nothing may be written. The CLI prepares every file first and writes only if all of them are fine. The test breaks one file and checks that the app is still empty afterwards.
