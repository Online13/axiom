# Input and Field

## Covered by `input.test.tsx`

### Input

- Typing reports each change and shows the text.
- Controlled: it shows `value`; typing only asks the owner.
- Disabled: not editable, announced disabled.
- Focus and blur reach the caller.
- A tap on the prefix or the padding focuses the text field; not when disabled.
- The TextInput props (`secureTextEntry`, `placeholder`…) are forwarded.

### Field

- `Field.Label` names the input, and is hidden from screen readers so it is read once, with the field.
- `Field.Description` becomes the field's hint; `Field.Error` replaces it while rendered, and the description comes back when it goes.
- `required` is announced first in the hint, and marks the label with `*`.
- A disabled Field disables its input.
- The input's own label and `disabled` win over the Field's.

## Checked on a device

- VoiceOver reads "Email, text field, We never share it" as one stop.
