# DatePicker

A trigger and a bottom sheet with a Calendar, editing a draft: the screen's value changes only on Done, Clear, or the first press with `confirm="instant"`.

## Covered by `date-picker.test.tsx`

- The trigger is a button named by its Field, its value is the formatted date or the placeholder, and its hint says it opens a calendar (after "Required" in a required Field).
- Done commits the day picked; nothing is reported before.
- Cancel drops the draft: the value stays, and the next opening shows the committed day.
- `confirm="instant"` commits on the first press.
- Clear sets the value to `null`, and is disabled while empty.
- A preset picks into the draft like a day; Done commits it.
- Picking plays a selection haptic, unless `haptic={false}`.
- Range: two days, then Done, commit `{ from, to }`, shown as "Jun 10 – Jun 13".
- A disabled trigger doesn't open.
- A part outside a DatePicker throws a clear error.
- `formatDateValue` writes a date, a range, an open range, and nothing.
