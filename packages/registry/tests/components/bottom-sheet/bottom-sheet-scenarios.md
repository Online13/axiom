# BottomSheet

## Covered by `bottom-sheet.test.tsx`

### Lifecycle

- Nothing renders until the trigger opens it; it reports `onOpenChange(true)` and is the modal view.
- The header's close button closes it; it unmounts after the exit, then `onDismiss` runs.
- The Android back button closes it instead of leaving the screen.
- `dismissible={false}`: back is consumed without closing, and the backdrop is no longer a button.
- Controlled: it opens and closes with `open`.
- The footer is rendered with the content.

### Height

- `content` (the default) fits the measured content.
- The sheet is as tall as its highest snap point; a percentage is a share of the screen.
- It never grows past the screen.

### Handle

- An `adjustable` "Resize sheet" element: screen readers move it between snap points, within bounds.

### Stacking

- A sheet opened over another becomes the modal view and takes the back button; the one below is hidden from screen readers until it closes.

### Dragging (`useBottomSheetContent`, gesture fired with RNGH's `fireGestureHandler`)

- Dragging up lands on the higher snap point; a short drag springs back.
- Dragging down past the middle of the last gap closes it; a fling closes it even after a short drag.
- Not dismissible: it stops at the lowest snap point and stays open.
- The haptic plays when a drag lands on another snap point, not when it springs back.

### Errors

- A part outside `BottomSheet.Root`, or a Handle outside `BottomSheet.Content`, throws a clear error.

## Checked on a device

- The sheet follows the finger and the keyboard; a scroll view inside hands the gesture back at the top.
- The covered sheet scales down; Reduce Motion.
