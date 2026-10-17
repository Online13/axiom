import { act, render, renderHook, screen, userEvent } from "@testing-library/react-native";

import { Calendar, type CalendarSelection } from "@/components/ui/calendar";
import {
	daysBetween,
	dayKey,
	useCalendarState,
	type UseCalendarOptions,
} from "@/components/ui/calendar/use-calendar";

jest.useFakeTimers();

// June 2025 starts on a Sunday and has 30 days: with weeks starting on Sunday, it fills 5 rows.
const JUNE = new Date(2025, 5, 1);
const date = (day: number, month = 5) => new Date(2025, month, day);

function June(props: Partial<UseCalendarOptions> & { showOutsideDays?: boolean }) {
	const { showOutsideDays, ...options } = props;
	return (
		<Calendar.Root locale="en-US" weekStartsOn={0} defaultMonth={JUNE} {...options}>
			<Calendar.Header>
				<Calendar.Title />
				<Calendar.Nav>
					<Calendar.PrevButton />
					<Calendar.NextButton />
				</Calendar.Nav>
			</Calendar.Header>
			<Calendar.Grid>
				<Calendar.Weekdays testID="weekdays" />
				<Calendar.Days showOutsideDays={showOutsideDays} />
			</Calendar.Grid>
		</Calendar.Root>
	);
}

const day = (name: string) => screen.getByRole("button", { name });

describe("Calendar", () => {
	test("each day is a button named in full", async () => {
		await render(<June />);

		expect(day("Sunday, June 1")).toBeOnTheScreen();
		expect(day("Monday, June 30")).toBeOnTheScreen();
		expect(screen.getByText("June 2025")).toBeOnTheScreen();
	});

	test("the weekday row is hidden from screen readers: each day says its weekday", async () => {
		await render(<June />);

		expect(screen.queryByTestId("weekdays")).toBeNull();
	});

	test("pads the last week with the next month's days, unless told not to", async () => {
		const view = await render(<June />);
		expect(day("Saturday, July 5")).toBeOnTheScreen();

		await view.rerender(<June showOutsideDays={false} />);
		expect(screen.queryByRole("button", { name: "Saturday, July 5" })).toBeNull();
	});

	describe("single", () => {
		test("a press selects the day, says so, and reports it", async () => {
			const user = userEvent.setup();
			const onSelect = jest.fn();
			await render(<June onSelect={onSelect} />);

			await user.press(day("Wednesday, June 11"));

			expect(onSelect).toHaveBeenCalledWith(date(11));
			expect(day("Wednesday, June 11, selected")).toBeSelected();
		});

		test("selecting another day moves the selection", async () => {
			const user = userEvent.setup();
			await render(<June defaultSelected={date(11)} />);

			await user.press(day("Friday, June 13"));

			expect(day("Wednesday, June 11")).not.toBeSelected();
			expect(day("Friday, June 13, selected")).toBeSelected();
		});

		test("pressing a day of the next month selects it and shows that month", async () => {
			const user = userEvent.setup();
			const onMonthChange = jest.fn();
			await render(<June onMonthChange={onMonthChange} />);

			await user.press(day("Wednesday, July 2"));

			expect(onMonthChange).toHaveBeenCalledWith(date(1, 6));
			expect(screen.getByText("July 2025")).toBeOnTheScreen();
		});
	});

	describe("navigation", () => {
		test("the arrows move by a month", async () => {
			const user = userEvent.setup();
			await render(<June />);

			await user.press(screen.getByRole("button", { name: "Next month" }));
			expect(screen.getByText("July 2025")).toBeOnTheScreen();

			await user.press(screen.getByRole("button", { name: "Previous month" }));
			await user.press(screen.getByRole("button", { name: "Previous month" }));
			expect(screen.getByText("May 2025")).toBeOnTheScreen();
		});

		test("stops at minDate and maxDate, and disables the days past them", async () => {
			await render(<June minDate={date(10)} maxDate={date(20)} />);

			expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
			expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
			expect(day("Monday, June 9")).toBeDisabled();
			expect(day("Tuesday, June 10")).toBeEnabled();
			expect(day("Friday, June 20")).toBeEnabled();
			expect(day("Saturday, June 21")).toBeDisabled();
		});

		test("controlled month: follows month only", async () => {
			const user = userEvent.setup();
			const onMonthChange = jest.fn();
			const view = await render(<June month={JUNE} onMonthChange={onMonthChange} />);

			await user.press(screen.getByRole("button", { name: "Next month" }));
			expect(onMonthChange).toHaveBeenCalledWith(date(1, 6));
			expect(screen.getByText("June 2025")).toBeOnTheScreen();

			await view.rerender(<June month={date(1, 6)} />);
			expect(screen.getByText("July 2025")).toBeOnTheScreen();
		});
	});

	test("a disabled day can't be selected", async () => {
		const user = userEvent.setup();
		const onSelect = jest.fn();
		const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
		await render(<June isDateDisabled={weekend} onSelect={onSelect} />);

		await user.press(day("Saturday, June 14"));

		expect(day("Saturday, June 14")).toBeDisabled();
		expect(onSelect).not.toHaveBeenCalled();
	});

	describe("range", () => {
		test("the first press starts the range, the second ends it", async () => {
			const user = userEvent.setup();
			const onSelect = jest.fn();
			await render(<June mode="range" onSelect={onSelect} />);

			await user.press(day("Tuesday, June 10"));
			await user.press(day("Friday, June 13"));

			expect(onSelect).toHaveBeenLastCalledWith({ from: date(10), to: date(13) });
			expect(day("Tuesday, June 10, selected")).toBeSelected();
			expect(day("Friday, June 13, selected")).toBeSelected();
			// The days between are in the band, not selected one by one.
			expect(day("Wednesday, June 11")).not.toBeSelected();
		});

		test("a day before the start begins a new range; so does a press after a full range", async () => {
			const user = userEvent.setup();
			const onSelect = jest.fn();
			await render(<June mode="range" onSelect={onSelect} />);

			await user.press(day("Tuesday, June 10"));
			await user.press(day("Thursday, June 5"));
			expect(onSelect).toHaveBeenLastCalledWith({ from: date(5) });

			await user.press(day("Saturday, June 7"));
			await user.press(day("Monday, June 23"));
			expect(onSelect).toHaveBeenLastCalledWith({ from: date(23) });
		});

		test("minRange and maxRange disable the end days that would break them", async () => {
			const user = userEvent.setup();
			await render(<June mode="range" minRange={2} maxRange={5} />);

			await user.press(day("Tuesday, June 10"));

			expect(day("Wednesday, June 11")).toBeDisabled();
			expect(day("Thursday, June 12")).toBeEnabled();
			expect(day("Sunday, June 15")).toBeEnabled();
			expect(day("Monday, June 16")).toBeDisabled();
			// Earlier days stay enabled: they start a new range.
			expect(day("Monday, June 9")).toBeEnabled();
		});
	});

	test("multiple: each press toggles a day", async () => {
		const user = userEvent.setup();
		const onSelect = jest.fn();
		await render(<June mode="multiple" onSelect={onSelect} />);

		await user.press(day("Monday, June 2"));
		await user.press(day("Tuesday, June 3"));
		await user.press(day("Monday, June 2, selected"));

		expect(onSelect).toHaveBeenLastCalledWith([date(3)]);
		expect(day("Tuesday, June 3, selected")).toBeSelected();
		expect(day("Monday, June 2")).not.toBeSelected();
	});

	test("controlled selection: shows selected only", async () => {
		const user = userEvent.setup();
		const view = await render(<June selected={date(4)} />);

		await user.press(day("Thursday, June 5"));
		expect(day("Wednesday, June 4, selected")).toBeSelected();

		await view.rerender(<June selected={date(5)} />);
		expect(day("Thursday, June 5, selected")).toBeSelected();
	});

	test("a selection re-renders only the days that change", async () => {
		const user = userEvent.setup();
		await render(
			<Calendar.Root locale="en-US" weekStartsOn={0} defaultMonth={JUNE} defaultSelected={date(4)}>
				<Calendar.Days />
			</Calendar.Root>,
		);
		// Every day button formats its label when it renders. `format` is a getter: count its reads.
		const original = Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, "format")!.get!;
		const format = jest
			.spyOn(Intl.DateTimeFormat.prototype as unknown as { format: unknown }, "format", "get")
			.mockImplementation(function (this: Intl.DateTimeFormat) {
				return original.call(this);
			});

		await user.press(day("Tuesday, June 10"));

		// The day that loses the selection and the one that gets it: not the 35 cells.
		expect(format).toHaveBeenCalledTimes(2);
		format.mockRestore();
	});

	test("parts outside Calendar.Root throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Calendar.Days />)).rejects.toThrow(
			"useCalendar and Calendar parts must be used inside Calendar.Root.",
		);
	});
});

describe("useCalendarState", () => {
	const setup = (options: UseCalendarOptions = {}) =>
		renderHook(() => useCalendarState({ locale: "en-US", weekStartsOn: 0, defaultMonth: JUNE, ...options }));

	test("weeks: the rows the month needs, 6 when fixed, or a given count", async () => {
		const { result } = await setup();

		expect(result.current.weeks("fit")).toHaveLength(5);
		expect(result.current.weeks("fixed")).toHaveLength(6);
		expect(result.current.weeks(2)).toHaveLength(2);
		expect(result.current.weeks("fit").every((week) => week.length === 7)).toBe(true);
	});

	test("the week starts on the given day", async () => {
		const sunday = await setup({ weekStartsOn: 0 });
		const monday = await setup({ weekStartsOn: 1 });

		expect(sunday.result.current.weeks("fit")[0][0].key).toBe("2025-06-01");
		// June 1 is a Sunday: a Monday week starts in May.
		expect(monday.result.current.weeks("fit")[0][0].key).toBe("2025-05-26");
		expect(monday.result.current.weekdays("short")[0]).toBe("Mon");
	});

	test("opens on the month of the selection when no month is given", async () => {
		const { result } = await renderHook(() =>
			useCalendarState({ defaultSelected: { from: new Date(2024, 1, 10) } as CalendarSelection }),
		);

		expect(result.current.month).toEqual(new Date(2024, 1, 1));
	});

	test("goToToday shows the current month", async () => {
		jest.setSystemTime(new Date(2026, 9, 17));
		const { result } = await setup();

		await act(() => result.current.goToToday());

		expect(result.current.month).toEqual(new Date(2026, 9, 1));
		const today = result.current.weeks("fit").flat().find((d) => d.isToday);
		expect(today?.key).toBe("2026-10-17");
	});

	test("marks the start, the end and the days in a range", async () => {
		const { result } = await setup({ mode: "range", defaultSelected: { from: date(10), to: date(13) } });

		const days = Object.fromEntries(result.current.weeks("fit").flat().map((d) => [d.key, d]));
		expect(days["2025-06-10"]).toMatchObject({ isRangeStart: true, isSelected: true, isInRange: false });
		expect(days["2025-06-11"]).toMatchObject({ isInRange: true, isSelected: false });
		expect(days["2025-06-13"]).toMatchObject({ isRangeEnd: true, isSelected: true });
		expect(days["2025-06-14"]).toMatchObject({ isInRange: false });
	});
});

describe("date helpers", () => {
	test("dayKey pads months and days", () => {
		expect(dayKey(new Date(2025, 0, 5))).toBe("2025-01-05");
	});

	test("daysBetween counts whole days, across months and a daylight saving change", () => {
		expect(daysBetween(date(28, 1), date(3, 2))).toBe(3);
		expect(daysBetween(new Date(2025, 2, 29, 23), new Date(2025, 2, 31, 1))).toBe(2);
		expect(daysBetween(date(10), date(5))).toBe(-5);
	});
});
