# Card

## Covered by `card.test.tsx`

- Without `onPress`: a plain container, no button.
- `Card.Title` is a header.
- With `onPress`: the whole card is a button.
- A button inside a pressable card gets its own press, not the card's.
- A disabled pressable card ignores presses and is announced disabled.
- `Card.Media` shows its image at the given aspect ratio, with children laid over it.

## Checked on a device

- Elevated shadow on iOS and Android, pressed state, outlined and filled variants.
