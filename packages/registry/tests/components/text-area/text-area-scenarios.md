# TextArea

## Covered by `text-area.test.tsx`

- Always multiline; reports what is typed.
- Inside a Field, takes its label and its error as hint.
- Disabled: not editable. A tap on the padding focuses it.
- Without `autoGrow`, the height is `minRows` lines; with it, between `minRows` and `maxRows`.
- Line heights follow the system font scale, capped at the controls' cap (Jest reports a scale of 2; Unistyles' mock reports 1).
- `plain` has no fixed height: it fills its parent.

## Checked on a device

- It grows while typing, then scrolls past `maxRows`.
