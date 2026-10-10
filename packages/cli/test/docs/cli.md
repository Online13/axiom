# The commands, end to end

File: [`cli.test.ts`](../cli.test.ts). Integration tests.

## Context

This is the closest we get to a real user without a real user. Each test creates a small, empty Expo app in a temporary folder and runs the actual `axiom` command against the actual component registry. Then it looks at what ended up on disk and at what the command printed.

There's no terminal attached, so the CLI can't ask questions. Every answer has to come from a command-line option (`--styling`, `--icons`, and so on). CI runs the same way. It also covers a useful case of its own: when the CLI can't decide something and can't ask, it has to stop with a clear message rather than guess.

On top of that, the tests often run one more check, which we call "every import resolves". It opens each copied file, reads its imports, and makes sure each one points to a file that exists. That's the cheapest way to know the app would compile without actually building it.

## `axiom init`

**It sets up the base files and `axiom.json`.**
On a fresh app, `init` must copy the theme and the core building blocks, write `axiom.json` with the chosen styling and the list of copied items, and print the command to install missing packages (we pass `--no-install`, so it doesn't run it). Every import must resolve. This is the first thing any user runs, so it has to work.

**It refuses to run twice unless `--force` is given.**
Running `init` again on a set-up app could overwrite the user's theme. The command stops and explains. With `--force` it starts over, and the new styling replaces the old one in `axiom.json`.

**It stops when it needs an answer it can't ask for.**
Without a terminal and without `--styling`, `init` can't know which styling to use. It must fail and list the valid options (`--styling stylesheet or --styling unistyles`) rather than pick one silently.

**It copies nothing into an app whose aliases don't work.**
The copied files import each other through `@/...`. If the app's `tsconfig.json` doesn't define that alias, the copied code wouldn't compile. `init` must stop before writing anything, not even `axiom.json`, and tell the user the exact line to add. A half set-up project is worse than none.

**It refuses a folder that isn't a React Native app.**
Running `init` in the wrong folder, say a plain React website, must fail with a message instead of filling it with mobile components.

## `axiom add`

**It copies a component, its dependencies, and registers its styles.**
`add button` must copy the button along with the text and icon it uses, remember the chosen icon source in `axiom.json`, register the button's style values in the theme (see [tokens.md](tokens.md)), and mention the icon package to install. Every import must resolve.

**Running it again with no names changes nothing.**
`axiom add` on its own recopies every item listed in `axiom.json`, which is how a user pulls in registry updates. On a project that's already up to date, it must report "0 written". If it rewrote identical files, the app's dev server would reload for nothing on every run.

**It keeps a file the user edited, unless told otherwise.**
Users are expected to edit copied components. We edit a copied file, then run `add` again. Without a terminal, the CLI can't ask whether to overwrite, so it must keep the user's version and say so. With `--overwrite`, it replaces it. Losing someone's changes without warning is the worst thing this tool could do.

**It asks for the icon source when an item draws icons.**
Icons can come from Apple and Google's system symbols or from the user's own set. The CLI can't guess, so without `--icons` it must stop and list the options.

**It fails clearly on an unknown item, or without `axiom.json`.**
A typo like `add buton`, or running `add` before `init`, must end with a message that says what's wrong.

**Every component in the registry, copied together, for each styling.**
This is the widest test we have. It adds every item of the registry in one go, once per styling tool, and checks that every import resolves. When someone adds a new component to the registry with a wrong import, or an import to a file that isn't declared, this test catches it, whichever component it is. When a new component arrives, this test covers it without anyone writing a new test.

## `axiom sync`

`sync` copies what `axiom.json` lists. It writes the files that are missing, and updates existing ones only where it's told to. No terminal is attached in these tests, so the options stand in for its two questions.

**It restores deleted files and keeps edited ones.**
We delete one copied file and edit another, then run `sync`. The deleted file must come back, the edited one must keep the user's version, and `axiom.json` must not change. With no option and nobody to ask, `sync` overwrites nothing.

**It sets up an app with the same components as another one.**
We copy one app's `axiom.json` into a second, empty app and run `sync`. The second app must end up with exactly the same files as the first, and every import must resolve. That's how a team shares a setup.

**`--keep` and `--overwrite` update the levels that aren't kept.**
We edit a component, a core primitive and a component's tokens, then run `sync --keep core,theme --overwrite`. Only the component must go back to the registry's version.

**`--keep none` overwrites every level.**
Same three edits, with `--keep none --overwrite`. All three files must go back to the registry's version, and every import must still resolve.

**`--keep` alone keeps the files nobody can be asked about.**
Without `--overwrite` and without a terminal, the component stays edited and the output points to `--overwrite`.

**`--keep` refuses an unknown level.**
`--keep tokens` must fail and name the level it doesn't know.

**It fails clearly without `axiom.json`.**
There's nothing to sync, so the command must say so.

**`--help` prints its own usage.**

## `axiom add --standalone`

Some apps already have their own design system and just want one Axiom component, without our theme. `--standalone` writes each component as a single file that depends on nothing else from Axiom.

**It writes one self-contained file and nothing else.**
After `add button --standalone`, the app must contain exactly one new file. That file must import only npm packages, never another Axiom file, and there must be no `axiom.json`. If a local import slipped in, the component would reference a file the user doesn't have.

**NativeWind and Uniwind each get a self-contained file.**
Their components read the theme through `useTheme()`, like the `StyleSheet` ones, and import `cx` from the theme to join class names. For `badge` (which uses `cx`) and `switch`, each file must import only npm packages, have no `useTheme` left, and declare `cx` itself when it calls it. The two files differ where the tools do, like the color of an icon.

**It refuses components that can't stand alone.**
Some items only work inside Axiom. The portal, for example, needs a host set up by the app. Asking for one standalone must fail with a message, not produce a broken file.

## Help and mistakes

**`--help` prints the usage and succeeds.** A user reading the help shouldn't get an error code.

**An unknown command prints the usage and fails.** `axiom remove` doesn't exist. The CLI shows what does, and returns an error so scripts notice.
