# ContextMenu

The Menu, opened by a long press on content.

## Covered by `context-menu.test.tsx`

- The trigger tells screen reader users to long press.
- A tap does nothing; a long press opens the menu with a medium haptic (`haptic={false}` silences it).
- A copy of the pressed content is lifted above the backdrop; `preview={false}` lifts nothing; a node is shown in its place.
- Picking an item closes the menu, then runs it.

## Checked on a device

- The lifted preview lines up with the original content, iOS style.
