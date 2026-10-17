# InputOTP

One hidden TextInput under drawn cells: it gets the keyboard, paste, deletion and SMS autofill.

## Covered by `input-otp.test.tsx`

### Field

- One field named "Verification code", set up for one-time-code autofill, a number pad, `maxLength` = length, focused on mount.
- Each character typed fills the next cell.
- `numeric` drops non-digits; a paste is cut to the length. `alphanumeric` keeps letters, drops symbols, and uses the default keyboard.
- A change that filters to the same code is ignored.

### Completion

- `onComplete` runs once, with the code, when every cell is filled, whether typed or autofilled in one go.

### Accessibility and state

- Screen readers hear the code; with `secure`, only "3 of 6". Secure cells draw dots.
- An error plays the error haptic once, when it turns on; `haptic={false}` keeps it silent.
- Disabled: not editable, never focused on mount.
- Controlled: the cells draw `value`.

## Checked on a device

- SMS autofill on iOS and Android, the blinking caret, and the shake on error.
