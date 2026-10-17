# Scaffold

## Covered by `scaffold.test.tsx`

- The root applies the top and bottom insets once; `Scaffold.AppBar` and `Scaffold.Footer` don't add them again.
- A screen that leaves the bottom edge to its footer (`safeAreaEdges={["top"]}`, `Footer safeArea`) gets the inset there.
- `Scaffold.Content` is a ScrollView that keeps taps on fields while the keyboard is up.
- `scrollable={false}` leaves scrolling to the child: no ScrollView.

Inset tests are skipped with Unistyles, whose Jest mock fixes insets at 0.

## Checked on a device

- `Scaffold.KeyboardAvoiding`: the footer rises above the keyboard. The status bar style follows the scheme.
