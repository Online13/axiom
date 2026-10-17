# Text

## Covered by `text.test.tsx`

- Renders its children and forwards the native `Text` props (`numberOfLines`, `testID`).
- A nested `Text` stays in the same run: the paragraph reads as one sentence.
- `asChild` styles its child, which keeps its own role and press handler.
- The font scale caps: `control` allows more growth than `fixed`.

## Checked on a device

- Each variant at the largest Dynamic Type / font size, and the caps on controls.
