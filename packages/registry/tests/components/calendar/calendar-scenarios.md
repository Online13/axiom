# Calendar

## Covered by `calendar.test.tsx`

### Grid and accessibility

- Each day is a button named in full ("Wednesday, June 11"), with ", selected" when it is.
- The weekday row is hidden from screen readers: each day says its weekday.
- The last week is padded with the next month's days, unless `showOutsideDays={false}`.

### Selection

- Single: a press selects the day and reports it; another press moves the selection.
- A day of the next month selects it and shows that month.
- A disabled day (`isDateDisabled`) can't be selected.
- Range: the first press starts it, the second ends it; the days between are in the band, not selected; a day before the start, or a press after a full range, starts a new one.
- `minRange` / `maxRange` disable the end days that would break them, never the earlier days.
- Multiple: each press toggles a day.
- Controlled selection and controlled month follow their props only.

### Navigation

- The arrows move by a month; they stop at `minDate` / `maxDate`, and the days past them are disabled.

### Performance

- A selection re-renders only the two days that change, not the whole grid (regression test for the memoized day button).

### `useCalendarState` and helpers

- `weeks("fit" | "fixed" | n)` gives 5, 6 or n rows of 7 days; the week starts on `weekStartsOn`.
- With no month, it opens on the selection's month; `goToToday` shows the current month and marks today.
- Range start, end and the days in between are flagged.
- `dayKey` pads; `daysBetween` counts whole days across months and a daylight saving change.

## Checked on a device

- The range band joins the days; the title is announced when the month changes.
