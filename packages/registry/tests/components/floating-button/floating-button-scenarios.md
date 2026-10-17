# FloatingButton

## Covered by `floating-button.test.tsx`

- Extended: named by its visible label. Icon only: named by its `accessibilityLabel`.
- Hidden (`visible={false}`): not pressable and not reachable by screen readers; shown again, it works.
- Disabled: presses are ignored.
- Sits above the bottom inset, the screen margin and `offset`, at the end edge by default.
- `bottom-start` follows the left inset; `bottom-center` centers it.

## Checked on a device

- The scale and fade when it hides while scrolling, and its shadow.
