# useControllableState

The `value` / `defaultValue` / `onChange` pattern behind every input.

## Covered by `use-controllable-state.test.ts`

### Uncontrolled

- Starts from `defaultValue`, keeps what is set, and reports it through `onChange`.
- Setting the current value again doesn't call `onChange` (compared with `Object.is`, so `NaN` counts as equal).
- A later `defaultValue` is ignored.

### Controlled

- Shows `value`; setting only asks the owner through `onChange` and changes nothing on its own.
- Follows the owner's next `value`.
- `null` is a controlled value; only `undefined` means uncontrolled.
- Becoming uncontrolled goes on from the internal state, not from the last controlled value.
