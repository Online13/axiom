# Dialog

## Covered by `dialog.test.tsx`

### Lifecycle

- Nothing renders until the trigger opens it; `onOpenChange(true)` is reported.
- It is an `alert`, and `accessibilityViewIsModal`: screen readers stay inside it.
- An action runs its `onPress`, closes the dialog, and it unmounts after the exit; `onDismiss` runs then.
- `closeOnPress={false}` keeps it open, for an action that keeps running.
- Cancel closes it.
- Controlled: it opens and closes with `open`.
- `Trigger asChild` opens from its child, whose own `onPress` still runs.

### Dismissing

- A touch on the backdrop closes it. The backdrop sits outside the modal surface, so screen readers can't reach it: they use the escape gesture.
- The Android back button closes it instead of leaving the screen.
- `dismissible={false}`: no backdrop button, and back is consumed without closing.

### Stacking

- A dialog opened over another becomes the modal one and takes the back button; the one below is hidden from screen readers until the top one closes.

### Errors

- A part outside `Dialog.Root` throws a clear error.

## Checked on a device

- The scale and fade, and the one below receding.
