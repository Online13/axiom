# Tappable

Headless press primitive under every pressable component: press, disabled state, accessibility role, haptic, press scale and minimum touch target.

## Covered by `tappable.test.tsx`

### Press

- A tap calls `onPress` once; the target is a `button` unless the caller sets another role.
- A short tap never fires `onLongPress`; holding past `delayLongPress` does.
- While held, `children({ pressed })` and `style({ pressed })` get `pressed: true`, then `false` on release.

### Disabled

- `onPress` and `onLongPress` are ignored, and screen readers hear it as disabled.
- It never reports `pressed`, so a disabled target never shrinks or darkens.
- The caller's `accessibilityState` (e.g. `checked`) is kept, with `disabled` merged in.

### Feedback

- `pressScale` shrinks the target only while it is held.
- A `transform` in the caller's `style` replaces the press scale instead of fighting it.
- `haptic` plays on touch (`onPressIn`), not on release. Without it, nothing plays.

### Minimum touch target

- A target smaller than 44pt gets a `hitSlop` that makes up the difference, split evenly on each side.
- A target already large enough gets none, even after having been small.
- An explicit `hitSlop` wins; `minTouchTarget={false}` turns the computation off.
- The caller's `onLayout` still runs.
- `touchTargetSlop` never returns a negative inset and accepts another target size.

## Checked on a device

- The press scale and its timing feel right.
- The haptic is felt on touch-down on iOS and Android.
