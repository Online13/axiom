# Passcode

## Covered by `passcode.test.tsx`

### Entry

- Slots and a keypad of ten digits plus Delete.
- The slots are one element announcing "2 of 4 digits entered", never the digits.
- Delete is disabled while empty, removes the last digit, and a long press clears the code.
- The last digit runs `onComplete` with the code; extra digits are ignored.

### Verification

- `onComplete` returns `false`: error haptic, keys locked, then after 550 ms the code clears and the keys unlock.
- It returns a promise: the keypad (Delete included) is locked while it verifies; `true` keeps the code without an error.
- A promise of `false` fails like `false`.
- A `status` prop drives the state for a screen that verifies the code itself.

### Variants

- Disabled: every key is.
- Not secure, the box slots show the digits.
- A custom keyboard: a biometrics key named "Unlock with biometrics", letters turned off.
- Parts outside a Passcode throw a clear error.

## Checked on a device

- The shake on error and its Reduce Motion fallback; key press feedback.
