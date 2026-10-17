# InputGroup

## Covered by `input-group.test.tsx`

- An input without a label is named by its placeholder; typing works.
- A pressable addon is a button; the group's button works on its own.
- A static addon is plain text, not a button.
- A disabled group disables every part: addon, input and button.
- One input can be disabled on its own.
- The separator is hidden from screen readers.
- A part outside an InputGroup throws a clear error.

## Checked on a device

- The focus border goes around the whole group.
