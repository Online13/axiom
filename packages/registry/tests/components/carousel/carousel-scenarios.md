# Carousel

## Covered by `carousel.test.tsx`

### Items and pagination

- Each item is rendered with its index.
- The pagination is one element read as "Page 1 of 3"; a single item has none.

### Swipe

- Settling on an item makes it active and reports it; the offset rounds to the nearest item, within the list.
- Settling back on the same item is not a change.
- The haptic plays when a swipe lands on another item, never for code.

### Imperative API and control

- `next`, `prev` and `scrollToIndex` move the active item, clamped to the list.
- Controlled: follows `index`.

### Snapping and layout

- `item`: a stop at each item, the last included. `none`: free scrolling. `page`: one stop per screenful.
- The list ends with half a viewport of padding, so the last item can be centered.

### Autoplay

- Moves on each tick and stops at the end; `loop` goes back to the first.
- Skips its ticks while the list is touched; stays off with Reduce Motion.

### Errors

- A part outside a Carousel throws a clear error.

## Checked on a device

- The snap feel, the pill-shaped active dot following the scroll, and item `progress` effects.
