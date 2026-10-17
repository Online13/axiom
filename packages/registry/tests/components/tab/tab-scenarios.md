# Tab

## Covered by `tab.test.tsx`

### List and panels

- A `tablist` of `tab`s; with `Tab.Content`, only the selected panel is rendered.
- Pressing a tab shows its panel and reports it; the item's own `onPress` still runs.
- A disabled tab can't be selected.
- Controlled: the selected tab follows `value`.
- The haptic plays only on a change, and only when one is passed.
- An item's badge is shown next to its label.
- A scrollable list scrolls to keep the selected tab centered, clamped to the start and end.

### `Tab.Pager`

- Every page is rendered; the ones not selected are hidden from screen readers.
- Swiping to a page (momentum end) selects its tab.
- Pages take the pager's width.

### Errors

- `Tab.List` outside `Tab`, `Tab.Item` outside `Tab.List`, `Tab.Panel` outside `Tab.Content`/`Tab.Pager`: each throws a clear error.

## Checked on a device

- The indicator springs to the selected tab and follows the pager while swiping.
