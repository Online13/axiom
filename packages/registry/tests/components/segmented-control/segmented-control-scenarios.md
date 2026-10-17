# SegmentedControl

## Covered by `segmented-control.test.tsx`

### Tap

- A `tablist` with one selected `tab`, the first by default.
- Pressing a segment selects it, reports it and plays a selection haptic.
- Pressing the selected segment again: no change, no haptic.
- Object options carry their own value, icon and accessible name.
- A disabled segment, or a disabled control, can't be selected.
- Controlled: the selection follows `value`.
- `haptic={false}` selects silently.

### Drag (`useSegmentedControl`, gesture fired with RNGH's `fireGestureHandler`)

- Releasing the indicator over a segment selects it.
- It snaps to the nearest segment and never past the ends.
- A disabled segment is skipped for the nearest enabled one.
- The haptic plays when a drag changes the segment, not when it ends where it began.
- A disabled control can't be dragged.

## Checked on a device

- The indicator slides and follows the finger; the track grows with larger text.
