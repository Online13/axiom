# Overlay stack

`useOverlayStack`: which modal surfaces are open, in what order, and how far each one recedes.

## Covered by `overlay-stack.test.tsx`

- A closed surface reports depth 0 and is not on top.
- One open surface is on top, at depth 0.
- Each surface opened above pushes the ones below back by one.
- Depth stops at `MAX_OVERLAY_DEPTH`.
- Closing the top surface gives the top back to the one below; closing one in the middle keeps the others' order.
- A surface opened with `pushes = false` takes the top without pushing the others back.
- Unmounting an open surface removes it from the stack.

## Checked on a device

- A dialog over a sheet over a menu reads as depth: each layer below scales and dims.
