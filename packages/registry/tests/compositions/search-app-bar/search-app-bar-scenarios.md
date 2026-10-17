# SearchAppBar

## Covered by `search-app-bar.test.tsx`

- A Back button (or Close) only when `onNavigate` is set.
- Cancel works only while the field has focus; it blurs the field and calls `onCancel`.
- The search props and focus events reach the field; actions render after it.

## Checked on a device

- The Cancel button slides in as the field shrinks.
