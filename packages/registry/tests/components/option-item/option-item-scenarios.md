# OptionItem

## Covered by `option-item.test.tsx`

- Named by its label, plus its description: "Storage, 12 GB free".
- Shows the current `value` on the right.
- A press calls `onPress`; disabled ignores it.
- `selected` is announced without tinting the row.
- A list of choices passes its own role and checked state (a radio row).
- Without `onPress` the row isn't a button, and a trailing Switch stays usable.

## Checked on a device

- The icon tile colors, destructive label, and a trailing chevron or switch.
