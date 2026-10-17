# IconButton

## Covered by `icon-button.test.tsx`

- A button named by its required `accessibilityLabel`; a tap calls `onPress`.
- The icon is decorative: only the button is announced.
- Disabled: presses are ignored and it is announced disabled.
- `selected` reports a toggle button as on.

### Badge

- A counter is shown on the icon and appended to the label: "Notifications, 3".
- A counter above 99 shows `99+`; the label keeps the real number.
- `0` and `false` show nothing and leave the label alone.
- A dot adds nothing to the label.

## Checked on a device

- The badge stays pinned to the glyph at every size.
