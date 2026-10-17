# Checkbox

## Covered by `checkbox.test.tsx`

- Each press toggles it and reports the new value; it starts from `defaultChecked`.
- With a label, the whole row is pressable, description included, and the label names the checkbox.
- `accessibilityLabel` names a checkbox without a text label.
- Indeterminate is announced as mixed; a press calls `onCheckedChange(true)`.
- Controlled: a press only asks the owner; the box doesn't change until `checked` does.
- Disabled: presses are ignored and it is announced disabled.
- A haptic plays only when one is passed.

## Checked on a device

- The check and indeterminate marks, and the error border.
