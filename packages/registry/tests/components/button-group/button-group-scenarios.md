# ButtonGroup

Rounds and clips the outer corners of the buttons inside it. It tracks no selection.

## Covered by `button-group.test.tsx`

- Each button stays independent: a press reaches only that button.
- Children keep their order; the root forwards its props (`testID`, `accessibilityLabel`).
- Pressing a button selects nothing: that is SegmentedControl's job.

## Checked on a device

- Outer corners are rounded and clipped, horizontal and vertical, with and without `bordered`.
