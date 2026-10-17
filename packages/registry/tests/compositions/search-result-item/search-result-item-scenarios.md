# SearchResultItem

## Covered by `search-result-item.test.tsx`

- Read as title, subtitle and meta.
- The part of the title matching the query is drawn on its own, case-insensitively.
- The action names the result ("Add, Blue Monday") and keeps its own press; disabled ignores presses.
- `splitMatch` splits around the first match, trims the query, and returns `null` without a match or a query.
