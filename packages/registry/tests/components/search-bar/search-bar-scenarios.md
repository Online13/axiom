# SearchBar

## Covered by `search-bar.test.tsx`

- A `search` field named by its placeholder, with the search return key.
- Typing shows a "Clear search" button; it empties the field, reports `""`, refocuses it, and goes away.
- `clearable={false}` never shows it.
- The search key submits the query through `onSubmit`.
- The trailing content (a microphone) shows only while the field is empty.
- `loading` replaces the icon with a "Searching" progressbar.
- Disabled: not editable, and the clear button doesn't clear.
- Controlled: the field shows `value`.
