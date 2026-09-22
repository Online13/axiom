# Testing a demo on iOS with native-sim

`native-sim` builds one of the demo apps on a GitHub macOS runner and streams the iOS simulator to your browser. The [workflow](../.github/workflows/native-sim.yml) installs the monorepo with Bun and regenerates the Axiom components before building. It produces a native build, not Expo Go — which is what makes it useful for variants that ship native code, such as Unistyles.

Every demo can be streamed: pass the one you want with `--app`.

| `--app`      | App                              |
| ------------ | -------------------------------- |
| `stylesheet` | `apps/demo-stylesheet` (default) |
| `unistyles`  | `apps/demo-unistyles`            |
| `nativewind` | `apps/demo-nativewind`           |
| `uniwind`    | `apps/demo-uniwind`              |

## Before testing

From the repository root, check that `gh` is authenticated with `gh auth status`. Run `gh auth login` if needed.

Finish your changes, then commit and push them to `main`. The runner uses the commit published on GitHub, and the [repository launcher](../scripts/native-sim.mjs) refuses to start if the local commit isn't pushed yet. If you change a component that the demo copied, carry the change back into `packages/registry`: the copies under `src/theme`, `src/hooks` and `src/components` are ignored by Git and regenerated on the runner.

## Starting and opening the simulator

```bash
bun run sim:ios up --app unistyles --minutes 60
```

The command first prints the GitHub Actions run link, then a `Simulator:` line with the URL to open in your browser. That URL carries a `?k=...` key that grants access to the simulator: keep it private.

To find the URL again while the session runs:

```bash
bun run sim:ios status --app unistyles
```

Open **the URL on the `Simulator:` line**. The `in_progress:` line only points to GitHub Actions. The stream can be available before the app is: wait for the **Install and launch app** step to succeed. The **Start Expo Go** step appears in the list but is skipped in `build` mode. **Hold the stream open** stays in progress for as long as the simulator is reachable.

The first native build takes around 30 minutes. Later sessions reuse the cached build when the native inputs haven't changed, and only refresh the JavaScript bundle. The cache is keyed per app, so each demo builds once.

## Stopping the session

```bash
bun run sim:ios down --app unistyles
```

The stream stops immediately. Without this command, the workflow closes the session after the duration passed to `--minutes`.

Each command defaults to `--app stylesheet`, so the stylesheet demo needs no flag. Sessions are tracked per app: two demos can stream at the same time, and `down` only cancels the one you name.

Automated control with `agent-device` is optional. It needs a separate install and the `--agent` flag at launch; the commands above are enough to use the simulator in the browser.

See also the [native-sim guide](https://reactnativefeel.com/sim/llm.txt).
