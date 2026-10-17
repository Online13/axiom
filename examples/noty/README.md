# Noty

Notes and simple todos built with Axiom: write fast, tick things off, swipe away what's done. It shows how a real app looks once Axiom's components are copied in and owned by the project.

Noty uses the `unistyles` variant. Unlike the demo apps, its copied components are committed: `src/theme`, `src/hooks` and `src/components` are the app's own code, refreshed from the registry when needed. The items it uses are listed in `axiom.json`.

## Run it

From the repository root, after `bun install`:

```bash
bun example:noty android   # build and install the development build (first time)
bun example:noty ios       # same on iOS, from macOS with Xcode
bun example:noty start     # start Metro
```

The app is a [development build](https://docs.expo.dev/develop/development-builds/introduction/), not Expo Go: Unistyles ships native code.

To refresh a component from the registry:

```bash
bun example:noty axiom add <item> --overwrite
```

See the [Noty page](https://axiom.nekena-rayane.com/docs/showcase/noty/) in the showcase.
