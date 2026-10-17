import { render, screen, userEvent } from "@testing-library/react-native";

import { OptionItem } from "@/components/ui/option-item";
import { RadioIndicator } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";

jest.useFakeTimers();

describe("OptionItem", () => {
	test("is named by its label, and its description when there is one", async () => {
		await render(
			<>
				<OptionItem label="Wi-Fi" onPress={() => {}} />
				<OptionItem label="Storage" description="12 GB free" onPress={() => {}} />
			</>,
		);

		expect(screen.getByRole("button", { name: "Wi-Fi" })).toBeOnTheScreen();
		expect(screen.getByRole("button", { name: "Storage, 12 GB free" })).toBeOnTheScreen();
	});

	test("shows the current value on the right", async () => {
		await render(<OptionItem label="Language" value="English" onPress={() => {}} />);

		expect(screen.getByText("English")).toBeOnTheScreen();
	});

	test("a press calls onPress; disabled ignores it", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const view = await render(<OptionItem label="Sign out" destructive onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Sign out" }));
		expect(onPress).toHaveBeenCalledTimes(1);

		await view.rerender(<OptionItem label="Sign out" destructive disabled onPress={onPress} />);
		await user.press(screen.getByRole("button", { name: "Sign out" }));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("announces selected without tinting: what shows it is the caller's", async () => {
		await render(<OptionItem label="Dark" selected onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Dark" })).toBeSelected();
	});

	test("a list of choices passes its own role and checked state", async () => {
		await render(
			<OptionItem
				label="Monthly"
				leading={<RadioIndicator checked />}
				accessibilityRole="radio"
				accessibilityState={{ checked: true }}
				onPress={() => {}}
			/>,
		);

		expect(screen.getByRole("radio", { name: "Monthly" })).toBeChecked();
	});

	test("without onPress the row isn't a button; a trailing control stays usable", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(
			<OptionItem
				label="Notifications"
				trailing={<Switch accessibilityLabel="Notifications" onValueChange={onValueChange} />}
			/>,
		);

		expect(screen.queryByRole("button")).toBeNull();
		await user.press(screen.getByRole("switch", { name: "Notifications" }));
		expect(onValueChange).toHaveBeenCalledWith(true);
	});
});
