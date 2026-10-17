# Toast

`toast()` writes to a module-level store; `Toaster` renders it. Each test closes every toast after it, and mounts its host first so the leftovers leave.

## Covered by `toast.test.tsx`

### Showing

- Nothing renders without a toast.
- A toast is named by its title and description, and announced to screen readers; an error toast is an `alert`.

### Timing

- It leaves after 4 s, then calls `onDismiss`; its own `duration` is honored and `Infinity` keeps it.
- A loading toast never times out.
- Holding it stops its timer, which restarts in full on release.

### Updating

- Showing an existing id updates that toast in place.
- `toast.promise` goes from the loading message to the success message (a function of the value), or to the error message, and still rejects.

### Dismissing and stacking

- `toast.dismiss(id)` closes one; `toast.dismiss()` closes all.
- The 3 newest are shown; older ones wait hidden from screen readers and come forward when one leaves.
- A press on a stack expands it and pauses the timers; a press on an expanded toast, or on a single one, runs its `onPress`.

### Swipe (`useToastItem`, gesture fired with RNGH's `fireGestureHandler`)

- A swipe up, or a quick flick up, dismisses it; a short or downward swipe keeps it.

## Checked on a device

- The stack's depth and the expand animation; the toast under the status bar.
