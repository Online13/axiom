# Skeleton

## Covered by `skeleton.test.tsx`

- While loading, a placeholder replaces the content and is hidden from screen readers.
- `loading={false}` renders the content and no placeholder.
- `shimmer`, `pulse` and `none` all render the placeholder.
- `Skeleton.Text` draws one placeholder per line; the last of several is shorter (60%).
- `Skeleton.Text loading={false}` renders the text.

## Checked on a device

- Every skeleton on screen shimmers in sync, and stays still with Reduce Motion.
