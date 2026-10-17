# AppBar

## Covered by `app-bar.test.tsx`

- The row keeps the order it is written in: back, title, actions; each control works.
- The title is a header, on one line in the row; a large title in `AppBar.Expanded` may wrap on two.
- The subtitle is shown under the title.
- The top safe-area inset is added, or not with `safeArea={false}`. Skipped with Unistyles, whose Jest mock fixes insets at 0.

## Checked on a device

- The hairline, and the bar under the status bar on a notched phone.
