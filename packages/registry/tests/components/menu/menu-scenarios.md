# Menu

## Covered by `menu.test.tsx`

### Items

- The trigger opens a modal `menu` of `menuitem`s, with its haptic.
- An item's subtitle is read with its label.
- Picking an item closes the menu, then runs its action.
- A `keepOpen` item runs and leaves the menu open.
- A checked item reports `checked`; the others carry no checked state.
- A disabled item can't be picked.
- A submenu opens in place, with a back item named after it; reopening starts at the top level.

### Dismissing

- A touch on the backdrop closes it without running any action.
- The Android back button closes it.

### Placement (the trigger's window rect comes from `placeInWindow`)

- Below the trigger, aligned to its start.
- Above it when there's no room below.
- Aligned to its end on request, and always inside the screen margins.

### Errors

- A part outside `Menu.Root` throws a clear error.

## Checked on a device

- The menu grows from the trigger's corner; a long list scrolls inside the safe area.
