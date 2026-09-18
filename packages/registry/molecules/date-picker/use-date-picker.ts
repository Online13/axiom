import { useState } from 'react';

import type { CalendarSelection, DateRange } from '@/components/ui/use-calendar';

export type DatePickerMode = 'single' | 'range';
export type DatePickerValue = Date | DateRange | null;

/** `done` waits for the Done button, `instant` closes on the first press. */
export type DatePickerConfirm = 'done' | 'instant';

export type UseDatePickerOptions = {
  mode?: DatePickerMode;
  value?: DatePickerValue;
  onChange?: (value: DatePickerValue) => void;
  confirm?: DatePickerConfirm;
  format?: (value: DatePickerValue) => string;
  locale?: string;
};

const isRange = (value: DatePickerValue): value is DateRange => value !== null && !(value instanceof Date);

/** "Thu 17 Sep 2026" for a date, "17 Sep – 24 Sep" for a range, in the locale of the device. */
export function formatDateValue(value: DatePickerValue, locale?: string): string {
  if (value === null) return '';

  if (isRange(value)) {
    const short = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
    return value.to ? `${short.format(value.from)} – ${short.format(value.to)}` : short.format(value.from);
  }

  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(value);
}

const toSelection = (value: DatePickerValue): CalendarSelection => (value === null ? undefined : value);

const fromSelection = (selection: CalendarSelection): DatePickerValue => {
  if (selection === undefined) return null;
  if (Array.isArray(selection)) return selection[0] ?? null;
  return selection;
};

/**
 * Opening, draft selection and confirmation of a date field, shared by every styling variant.
 * The draft lives here so Cancel returns to the value the screen already had.
 */
export function useDatePicker({
  mode = 'single',
  value = null,
  onChange,
  confirm = 'done',
  format,
  locale,
}: UseDatePickerOptions) {
  const [open, setOpenState] = useState(false);
  const [draft, setDraft] = useState<CalendarSelection>(toSelection(value));

  // Every opening starts from the committed value: a cancelled edit leaves nothing behind.
  const setOpen = (next: boolean) => {
    if (next) setDraft(toSelection(value));
    setOpenState(next);
  };

  const select = (selection: CalendarSelection) => {
    setDraft(selection);
    // `instant` only makes sense for one date: a range isn't complete after the first press.
    if (confirm === 'instant' && mode === 'single' && selection instanceof Date) {
      onChange?.(selection);
      setOpenState(false);
    }
  };

  return {
    open,
    setOpen,
    draft,
    select,
    /** Applies the draft and closes. */
    done: () => {
      onChange?.(fromSelection(draft));
      setOpenState(false);
    },
    /** Drops the draft and closes. */
    cancel: () => {
      setDraft(toSelection(value));
      setOpenState(false);
    },
    clear: () => {
      setDraft(undefined);
      onChange?.(null);
      setOpenState(false);
    },
    isEmpty: value === null,
    text: format ? format(value) : formatDateValue(value, locale),
  };
}
