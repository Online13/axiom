# Spinner

## Covered by `spinner.test.tsx`

- A busy `progressbar` announced as "Loading", or the `label` given.
- `animating={false}`: hidden from screen readers, and keeps its size so the layout doesn't jump.
- With `delay`, nothing shows, and nothing is announced, until the delay is over.

## Checked on a device

- The ring turns; with Reduce Motion it pulses instead.
