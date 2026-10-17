# StatsCardSparkline

## Covered by `stats-card-sparkline.test.tsx`

- Shows the label, the value and the change.
- Read as one sentence ("Revenue: $12,480, +12.4%…"); without a change, only the label and the value.
- Pressable: the whole card is that one button, and the inner block stops being a separate stop.
- The line is drawn once the card knows its width.

## Checked on a device

- Green or red follows `trend` and `positive`.
