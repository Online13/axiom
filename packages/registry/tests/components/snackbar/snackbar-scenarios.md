# Snackbar

`snackbar.show()` writes to a module-level store; `SnackbarHost` renders it. Each test closes the current snackbar after it, and mounts its host first so the leftovers leave.

## Covered by `snackbar.test.tsx`

- Nothing renders without a snackbar.
- The message is shown and announced, with "Undo available" when it has an action; it is a polite live region.
- The action runs, closes it, and reports `"action"`: an undone change must not be committed.
- A plain message leaves after 4 s, one with an action after 8 s, reporting `"timeout"`; `indefinite` stays until `snackbar.dismiss()`, which reports `"dismiss"`.
- The time doubles while a screen reader runs.
- A new snackbar replaces the current one, which reports `"replaced"`.

### Swipe (`useSnackbarItem`, gesture fired with RNGH's `fireGestureHandler`)

- A swipe down, or sideways past 30% of the screen, dismisses it and reports `"swipe"`; a short swipe keeps it.

## Checked on a device

- It sits above the tab bar with `bottomOffset`, and slides out the way it was swiped.
