# Overlay

The backdrop behind sheets, dialogs and menus.

## Covered by `overlay.test.tsx`

### Accessibility

- Dismissible (`onPress` set): a button labeled "Close", or the label the caller passes.
- Not dismissible: blocks touches but is hidden from screen readers.
- The screen reader escape gesture calls `onPress`.

### Lifecycle

- Nothing renders until it has been visible once.
- Hiding it plays the exit, then unmounts it and calls `onExited`.
- Presses are ignored as soon as it starts closing, so touches go back to the screen.
- Replacing `onExited` during the exit calls the new one, once, without restarting the exit.
- Driven by `progress`, it reports the exit at once and leaves unmounting to its owner.

## Checked on a device

- The fade, and that it is skipped with Reduce Motion.
