# Switch

## Covered by `switch.test.tsx`

- Each press flips it and reports the new value; it starts from `defaultValue`.
- Controlled: a press only asks the owner; it moves when `value` does.
- Disabled: presses are ignored, no haptic, announced disabled.
- A light haptic plays on each flip by default; `haptic={false}` turns it off.
- Screen readers flip it with the `activate` action, except when disabled.

## Checked on a device

- The thumb slides and the track color follows, and both jump with Reduce Motion.
