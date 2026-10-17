# SettingsItem

## Covered by `settings-item.test.tsx`

- A chevron row is a button that opens its screen, showing its value; the description is read with the title.
- A switch row is one `switch`: a press anywhere flips it and reports it; the inner switch is hidden so there is one control.
- It plays a light haptic on touch; controlled, it follows `checked`.
- `onPress` replaces the toggle, for a row that asks first; disabled can't be flipped.
