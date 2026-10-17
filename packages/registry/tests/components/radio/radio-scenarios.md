# Radio

## Covered by `radio.test.tsx`

- The group has the `radiogroup` role and its question as label, and each radio stays reachable on its own.
- Exactly one radio is checked: the last one pressed. Each pick is reported through `onValueChange`.
- Nothing is checked at first, unless `defaultValue` says so.
- Pressing the checked radio again is not a change: no callback, no haptic.
- The group's haptic plays when the user picks another radio.
- Controlled: the checked radio follows `value` only.
- A disabled radio can't be picked; a disabled group disables every radio.
- A render function builds a custom row from `{ checked, pressed }`.
- A `Radio` outside a `RadioGroup` throws a clear error.

## Checked on a device

- VoiceOver announces "1 of 3" in the group.
