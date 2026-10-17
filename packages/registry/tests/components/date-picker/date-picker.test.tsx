import { useState } from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker, formatDateValue, type DatePickerValue } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/input";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const date = (day: number, month = 5) => new Date(2025, month, day);

type Props = Partial<React.ComponentProps<typeof DatePicker>> & { initial?: DatePickerValue; disabled?: boolean };

/** A screen that keeps the committed value, as an app does. */
function Booking({ initial = null, onChange, disabled, ...picker }: Props) {
	const [value, setValue] = useState<DatePickerValue>(initial);
	return (
		<Field>
			<Field.Label>Check-in</Field.Label>
			<DatePicker
				{...picker}
				value={value}
				onChange={(next) => {
					onChange?.(next);
					setValue(next);
				}}
			>
				<DatePicker.Trigger disabled={disabled} format={(v) => formatDateValue(v, "en-US")} />
				<BottomSheet.Content>
					<DatePicker.Preset value={date(20)}>Friday</DatePicker.Preset>
					<DatePicker.Calendar locale="en-US" weekStartsOn={0} defaultMonth={date(1)}>
						<Calendar.Days />
					</DatePicker.Calendar>
					<DatePicker.Cancel />
					<DatePicker.Clear />
					<DatePicker.Done />
				</BottomSheet.Content>
			</DatePicker>
		</Field>
	);
}

const trigger = () => screen.getByRole("button", { name: "Check-in" });
const button = (name: string) => screen.getByRole("button", { name });

async function open(props: Props = {}) {
	const user = userEvent.setup();
	await render(<Booking {...props} />);
	await user.press(trigger());
	return user;
}

describe("DatePicker", () => {
	test("the trigger is a button named by the Field, showing the placeholder, hinting at the calendar", async () => {
		await render(<Booking />);

		expect(trigger()).toHaveAccessibilityValue({ text: "Select a date" });
		expect(trigger()).toHaveProp("accessibilityHint", "Opens a calendar");
	});

	test("Done commits the day picked", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange });

		await user.press(button("Wednesday, June 11"));
		expect(onChange).not.toHaveBeenCalled();
		await user.press(button("Done"));

		expect(onChange).toHaveBeenCalledWith(date(11));
		expect(trigger()).toHaveAccessibilityValue({ text: "Wed, Jun 11, 2025" });
	});

	test("Cancel drops the draft: the value and the next opening are as before", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange, initial: date(4) });

		await user.press(button("Wednesday, June 11"));
		await user.press(button("Cancel"));
		expect(onChange).not.toHaveBeenCalled();

		await user.press(trigger());
		expect(button("Wednesday, June 4, selected")).toBeSelected();
		expect(button("Wednesday, June 11")).not.toBeSelected();
	});

	test("confirm='instant' commits on the first press", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange, confirm: "instant" });

		await user.press(button("Friday, June 13"));

		expect(onChange).toHaveBeenCalledWith(date(13));
	});

	test("Clear sets the value to null; it is disabled while empty", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange, initial: date(4) });

		await user.press(button("Clear"));

		expect(onChange).toHaveBeenCalledWith(null);
		expect(trigger()).toHaveAccessibilityValue({ text: "Select a date" });
		await user.press(trigger());
		expect(button("Clear")).toBeDisabled();
	});

	test("a preset picks into the draft, like a day", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange });

		await user.press(button("Friday"));
		expect(button("Friday, June 20, selected")).toBeSelected();
		await user.press(button("Done"));

		expect(onChange).toHaveBeenCalledWith(date(20));
	});

	test("picking plays a selection haptic, unless turned off", async () => {
		const user = await open();
		await user.press(button("Monday, June 2"));
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);

		jest.clearAllMocks();
		await render(<Booking haptic={false} />);
		await user.press(screen.getAllByRole("button", { name: "Check-in" }).at(-1)!);
		await user.press(screen.getAllByRole("button", { name: "Tuesday, June 3" }).at(-1)!);
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});

	test("range: two days, then Done, commit a range", async () => {
		const onChange = jest.fn();
		const user = await open({ onChange, mode: "range" });

		await user.press(button("Tuesday, June 10"));
		await user.press(button("Friday, June 13"));
		await user.press(button("Done"));

		expect(onChange).toHaveBeenCalledWith({ from: date(10), to: date(13) });
		expect(trigger()).toHaveAccessibilityValue({ text: "Jun 10 – Jun 13" });
	});

	test("a disabled trigger doesn't open", async () => {
		const user = userEvent.setup();
		await render(<Booking disabled />);

		await user.press(trigger());

		expect(trigger()).toBeDisabled();
		expect(screen.queryByRole("button", { name: "Done", includeHiddenElements: true })).toBeNull();
	});

	test("a required Field is announced first in the hint", async () => {
		await render(
			<Field required>
				<Field.Label>Date</Field.Label>
				<DatePicker>
					<DatePicker.Trigger />
				</DatePicker>
			</Field>,
		);

		expect(screen.getByRole("button", { name: "Date" })).toHaveProp("accessibilityHint", "Required. Opens a calendar");
	});

	test("parts outside a DatePicker throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<DatePicker.Done />)).rejects.toThrow("This part must be rendered inside <DatePicker>.");
	});
});

describe("formatDateValue", () => {
	test("a date, a range, an open range, and nothing", () => {
		expect(formatDateValue(date(11), "en-US")).toBe("Wed, Jun 11, 2025");
		expect(formatDateValue({ from: date(10), to: date(13) }, "en-US")).toBe("Jun 10 – Jun 13");
		expect(formatDateValue({ from: date(10) }, "en-US")).toBe("Jun 10");
		expect(formatDateValue(null)).toBe("");
	});
});
