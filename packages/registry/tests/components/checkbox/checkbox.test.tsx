import { useState } from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Checkbox } from "@/components/ui/checkbox";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

describe("Checkbox", () => {
	test("toggles on each press and reports the new value", async () => {
		const user = userEvent.setup();
		const onCheckedChange = jest.fn();
		await render(<Checkbox label="Remember me" onCheckedChange={onCheckedChange} />);
		const box = screen.getByRole("checkbox", { name: "Remember me" });

		await user.press(box);
		expect(box).toBeChecked();
		await user.press(box);
		expect(box).not.toBeChecked();

		expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
	});

	test("the whole row is pressable: pressing the label toggles it", async () => {
		const user = userEvent.setup();
		await render(<Checkbox label="Accept the terms" description="Required to continue" />);

		await user.press(screen.getByText("Required to continue"));

		expect(screen.getByRole("checkbox", { name: "Accept the terms" })).toBeChecked();
	});

	test("starts from defaultChecked", async () => {
		await render(<Checkbox label="Newsletter" defaultChecked />);

		expect(screen.getByRole("checkbox", { name: "Newsletter" })).toBeChecked();
	});

	test("indeterminate is announced as mixed, and a press checks it", async () => {
		const user = userEvent.setup();
		const onCheckedChange = jest.fn();
		function SelectAll() {
			const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
			return (
				<Checkbox
					label="Select all"
					checked={checked}
					onCheckedChange={(next) => {
						onCheckedChange(next);
						setChecked(next);
					}}
				/>
			);
		}
		await render(<SelectAll />);
		const box = screen.getByRole("checkbox", { name: "Select all" });

		expect(box).toBePartiallyChecked();
		await user.press(box);

		expect(onCheckedChange).toHaveBeenCalledWith(true);
		expect(box).toBeChecked();
	});

	test("controlled: stays as the owner says until the owner changes it", async () => {
		const user = userEvent.setup();
		const onCheckedChange = jest.fn();
		await render(<Checkbox label="Locked" checked={false} onCheckedChange={onCheckedChange} />);
		const box = screen.getByRole("checkbox", { name: "Locked" });

		await user.press(box);

		expect(onCheckedChange).toHaveBeenCalledWith(true);
		expect(box).not.toBeChecked();
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onCheckedChange = jest.fn();
		await render(<Checkbox label="Off" disabled onCheckedChange={onCheckedChange} />);
		const box = screen.getByRole("checkbox", { name: "Off" });

		await user.press(box);

		expect(onCheckedChange).not.toHaveBeenCalled();
		expect(box).not.toBeChecked();
		expect(box).toBeDisabled();
	});

	test("accessibilityLabel names a checkbox without a text label", async () => {
		await render(<Checkbox accessibilityLabel="Select row 3" />);

		expect(screen.getByRole("checkbox", { name: "Select row 3" })).toBeOnTheScreen();
	});

	test("plays a haptic only when asked, on a change", async () => {
		const user = userEvent.setup();
		const view = await render(<Checkbox label="Quiet" />);
		await user.press(screen.getByRole("checkbox", { name: "Quiet" }));
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();

		await view.rerender(<Checkbox label="Quiet" haptic="selection" />);
		await user.press(screen.getByRole("checkbox", { name: "Quiet" }));
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});
});
