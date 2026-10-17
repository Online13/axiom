# Button

## Covered by `button.test.tsx`

### Press

- A button named by its label; a tap calls `onPress` once.
- A number label is rendered as text; other children are rendered as given.
- It shrinks by the theme's press scale while held.
- The `haptic` it is given plays on touch.

### Disabled and loading

- Disabled: presses are ignored and it is announced disabled.
- Loading: busy, presses ignored, and the label stays in the tree so screen readers keep its name.
- The spinner replaces the leading icon when there is one; otherwise it covers the hidden label.
- Ending the load makes it pressable again and removes the spinner.
- The caller's `accessibilityState` (e.g. `expanded`) is kept next to `busy`.

### `asChild`

- The child is the button (e.g. a `link`); its `onPress` and the button's both run, and no extra `button` is rendered.

## Checked on a device

- Each variant's colors in light and dark, pressed and disabled.
- The width doesn't jump when loading starts.
