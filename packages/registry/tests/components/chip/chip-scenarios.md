# Chip

## Covered by `chip.test.tsx`

- Without `onPress`: a plain tag, named by its label, not a button.
- With `onPress`: a button; with `selected` set, a togglebutton reporting its checked state.
- Disabled: presses are ignored.
- `onRemove` adds a "Remove Paris" button (just "Remove" without a text label).
- Removing doesn't press the chip; a disabled chip can't be removed.
- The haptic plays on touch when the chip is pressable.
- `Chip.Group` renders its chips in order.

## Checked on a device

- The remove button's own touch area, and wrapping in a group.
