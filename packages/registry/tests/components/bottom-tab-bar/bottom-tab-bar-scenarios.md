# BottomTabBar

## Covered by `bottom-tab-bar.test.tsx`

- A `tablist` of `tab`s; the active one is selected.
- Pressing another tab selects it and reports its value; pressing the active one does nothing (no callback, no haptic).
- Switching tabs dismisses the keyboard and plays the haptic.
- A disabled tab can't be selected.
- Controlled: the selected tab follows `value` (the current route).
- A badge counter is shown on the icon, capped at `99+`.
- An Item outside a BottomTabBar throws a clear error.

## Checked on a device

- The floating variant above the home indicator; the active icon swap.
