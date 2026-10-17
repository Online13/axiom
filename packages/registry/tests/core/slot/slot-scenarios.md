# Slot

Renders its only child with the slot's props merged onto it. Powers `asChild`.

## Covered by `slot.test.tsx`

### Slot

- No wrapper is rendered: the child carries the slot's props (role, label, `testID`).
- Both `onPress` handlers run, the child's first.
- Styles are combined with the child's last, and a `Pressable` style function still receives the press.
- For any other prop, the child's value wins.
- The slot's ref and the child's ref both point at the rendered element.
- Text, or more than one child, throws.

### `mergeProps`

- Handlers are chained only when both sides have one; a single handler is passed as is.
- A prop like `one` is not mistaken for a handler: only `on` + capital letter is.
- Class names are joined, the child's last.
- The slot's style is kept when the child has none; a style function on either side is resolved with the same state.

### `composeRefs`

- Every ref receives the node, and is cleared on cleanup.
- A callback ref that returns its own cleanup gets that cleanup called, not a `null` call.
