# useRefreshControl

Pull-to-refresh for any list: `idle → pulling → armed → refreshing → settling → idle`.

## Covered by `use-refresh-control.test.tsx`

The pull is driven through `scrollProps.onScroll`, the way Reanimated delivers an iOS list's overscroll.

### `refresh()`

- Runs `onRefresh` and stays `refreshing` at least `minDuration`, then settles back to `idle` with `distance` at 0.
- A slow request stays `refreshing` until it settles, with no extra wait.
- A second call while one runs does nothing.
- A failing `onRefresh` makes `refresh()` reject, and the status still goes back to `idle`.
- The latest `onRefresh` is called.

### Pull (iOS)

- A short pull is `pulling`; `distance` follows the rubber band (`drag * max / (drag + max)`) and `progress` goes from 0 to 1.
- Past `threshold` it is `armed`, once per pull: one haptic, one `onArmed`, however long it stays past the threshold.
- `haptic={false}` arms without a haptic.
- Released while armed: refreshes, and the content inset holds the list open by `threshold`.
- Released before the threshold: no refresh, and the bounce brings it back to `idle`.
- Going back to the top lets the next pull arm again.
- Scrolling down the list is not a pull.
- While refreshing, the bounce-back doesn't start a new pull.

### `enabled`

- Disabled: a pull doesn't move the list or arm anything.
- Turned off mid-pull: the pull is dropped.
- Turned off during a refresh: the refresh finishes.

### Reduce Motion

- The list jumps back to its place without the settle animation.

## Checked on a device

- The Android path (a Pan gesture alongside the list's scroll), which Jest doesn't simulate.
- The feel of the rubber band and the indicator following the finger.
