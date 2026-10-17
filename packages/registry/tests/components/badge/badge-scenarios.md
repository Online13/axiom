# Badge

## Covered by `badge.test.tsx`

- A label badge shows its text.
- A counter shows the count, capped at `max` (99 by default) as `99+`.
- A count of `0` renders nothing.
- A counter is read by screen readers only with an `accessibilityLabel` saying what it counts.
- A lone dot has no text.
- `Badge.Anchor` renders the element and its badge, and no badge for `null`.

## Checked on a device

- The ring around an anchored counter, and its placement on an avatar or an icon.
