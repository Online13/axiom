# Alert

## Covered by `alert.test.tsx`

- Shows its title and description.
- An error has the `alert` role and an assertive live region: it is announced when it appears.
- Other variants are quiet, unless the caller sets a live region.
- `onDismiss` adds a "Dismiss" button; the alert stays until the caller hides it. No button without it.
- `Alert.Description` and `Alert.Action` compose the body; the action is a button.

## Checked on a device

- Each variant's colors and icon in light and dark.
