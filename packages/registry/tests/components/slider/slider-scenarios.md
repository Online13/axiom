# Slider

## Covered by `slider.test.tsx`

### Accessibility

- Each thumb is `adjustable`, named after what it controls, with `min`, `max` and `now`; `getAccessibilityValue` gives the text ("5 kilometers").
- A screen reader swipe changes the value by one step and completes at once; it stops at `min` and `max`.
- A continuous slider (`step={0}`) moves by a hundredth of its range.
- Disabled: swipes are ignored and the thumb is announced disabled.
- A range has a "minimum" and a "maximum" thumb, and one never passes the other minus `minRange`.
- Controlled: the thumb shows `value`.

### Gestures (`useSlider`, fired with RNGH's `fireGestureHandler`)

- A tap moves the thumb there, snapped to the step, and completes.
- A drag reports each new stepped value (not each point), then completes once on release.
- It never goes past the ends of the track.
- With few steps, a haptic plays on each step; with too many to feel, only at the ends.
- Range: the low thumb stops before the high one minus `minRange`; a tap moves the nearest thumb.

## Checked on a device

- The thumb follows the finger without lag, and settles on the step on release.
