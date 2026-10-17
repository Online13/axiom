# ToolBar

## Covered by `tool-bar.test.tsx`

- A `toolbar` named "Actions" by default.
- Each action is a button named by its label; a press calls it.
- A selected toggle and a disabled action are announced as such.
- The separator is hidden from screen readers.
- Docked: labels are shown. Floating: labels are hidden, the accessible names stay.
- Docked: the bottom inset is added to the padding. Floating: it becomes a margin, so the capsule floats above it. Skipped with Unistyles.

## Checked on a device

- The floating capsule's shadow and blur over content.
