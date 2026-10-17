# Icon

## Covered by `icon.test.tsx`

- Decorative by default: hidden from screen readers.
- With `accessibilityLabel`, an `image` screen readers announce.
- A size in points is applied. Token sizes (`sm`, `md`, `lg`) are classes with NativeWind and Uniwind, so they are checked on a device.
- `iconColor` resolves content and feedback roles from the theme and passes a raw color through.

## Checked on a device

- Each icon source (SF Symbols, Material, SVG) draws at the size and color asked.
