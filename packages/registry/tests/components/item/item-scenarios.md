# Item

## Covered by `item.test.tsx`

- Without `onPress` or `onLongPress`: not pressable.
- With `onPress`: the row is a button; `onLongPress` alone also makes it pressable.
- Disabled: presses are ignored and it is announced disabled.
- `selected` is announced; an explicit `accessibilityState.selected` wins.
- A role given by the caller is kept, with its state (a radio row reports `checked`).
- The haptic plays only when one is passed.
- `asChild` merges the row into its child (a link) and passes `disabled` to screen readers.

## Checked on a device

- The inset divider starts after the leading area; pressed and selected backgrounds.
