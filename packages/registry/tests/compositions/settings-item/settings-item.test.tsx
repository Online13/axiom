import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { SettingsItem } from "@/components/compositions/settings-item";

import { pressIn } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

describe("SettingsItem", () => {
	test("a chevron row is a button that opens its screen", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<SettingsItem title="Language" value="English" onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Language" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		expect(screen.getByText("English")).toBeOnTheScreen();
	});

	test("the description is read with the title", async () => {
		await render(<SettingsItem title="Storage" description="12 GB free" onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Storage, 12 GB free" })).toBeOnTheScreen();
	});

	describe("switch", () => {
		test("the whole row is one switch: a press anywhere flips it", async () => {
			const user = userEvent.setup();
			const onCheckedChange = jest.fn();
			await render(<SettingsItem title="Wi-Fi" trailing="switch" onCheckedChange={onCheckedChange} />);
			const row = screen.getByRole("switch", { name: "Wi-Fi" });

			await user.press(row);

			expect(row).toBeChecked();
			expect(onCheckedChange).toHaveBeenCalledWith(true);
			// The inner switch is hidden: screen readers find one control, not two.
			expect(screen.getAllByRole("switch")).toHaveLength(1);
		});

		test("plays a light haptic on touch", async () => {
			await render(<SettingsItem title="Wi-Fi" trailing="switch" />);

			await pressIn(screen.getByRole("switch", { name: "Wi-Fi" }));

			expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
		});

		test("controlled: follows checked", async () => {
			const user = userEvent.setup();
			const view = await render(<SettingsItem title="Wi-Fi" trailing="switch" checked={false} />);

			await user.press(screen.getByRole("switch", { name: "Wi-Fi" }));
			expect(screen.getByRole("switch", { name: "Wi-Fi" })).not.toBeChecked();

			await view.rerender(<SettingsItem title="Wi-Fi" trailing="switch" checked />);
			expect(screen.getByRole("switch", { name: "Wi-Fi" })).toBeChecked();
		});

		test("onPress replaces the toggle, for a row that asks first", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			await render(<SettingsItem title="Location" trailing="switch" onPress={onPress} />);

			await user.press(screen.getByRole("switch", { name: "Location" }));

			expect(onPress).toHaveBeenCalledTimes(1);
			expect(screen.getByRole("switch", { name: "Location" })).not.toBeChecked();
		});

		test("disabled: can't be flipped", async () => {
			const user = userEvent.setup();
			const onCheckedChange = jest.fn();
			await render(<SettingsItem title="Wi-Fi" trailing="switch" disabled onCheckedChange={onCheckedChange} />);

			await user.press(screen.getByRole("switch", { name: "Wi-Fi" }));

			expect(onCheckedChange).not.toHaveBeenCalled();
			expect(screen.getByRole("switch", { name: "Wi-Fi" })).toBeDisabled();
		});
	});
});
