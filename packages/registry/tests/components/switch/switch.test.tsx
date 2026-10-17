import { render, screen, userEvent, fireEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Switch } from "@/components/ui/switch";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const toggle = () => screen.getByRole("switch", { name: "Wi-Fi" });

describe("Switch", () => {
	test("flips on press and reports the new value", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Switch onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />);

		expect(toggle()).not.toBeChecked();
		await user.press(toggle());
		expect(toggle()).toBeChecked();
		await user.press(toggle());
		expect(toggle()).not.toBeChecked();

		expect(onValueChange.mock.calls).toEqual([[true], [false]]);
	});

	test("starts from defaultValue", async () => {
		await render(<Switch defaultValue accessibilityLabel="Wi-Fi" />);

		expect(toggle()).toBeChecked();
	});

	test("controlled: only the owner moves it", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		const view = await render(
			<Switch value={false} onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />,
		);

		await user.press(toggle());
		expect(onValueChange).toHaveBeenCalledWith(true);
		expect(toggle()).not.toBeChecked();

		await view.rerender(<Switch value onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />);
		expect(toggle()).toBeChecked();
	});

	test("ignores presses when disabled", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Switch disabled onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />);

		await user.press(toggle());

		expect(onValueChange).not.toHaveBeenCalled();
		expect(toggle()).toBeDisabled();
		expect(Haptics.impactAsync).not.toHaveBeenCalled();
	});

	test("plays a light haptic on each flip by default, none with haptic={false}", async () => {
		const user = userEvent.setup();
		const view = await render(<Switch accessibilityLabel="Wi-Fi" />);
		await user.press(toggle());
		expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);

		jest.clearAllMocks();
		await view.rerender(<Switch haptic={false} accessibilityLabel="Wi-Fi" />);
		await user.press(toggle());
		expect(Haptics.impactAsync).not.toHaveBeenCalled();
	});

	test("screen readers flip it with the activate action, unless disabled", async () => {
		const onValueChange = jest.fn();
		const view = await render(<Switch onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />);

		await fireEvent(toggle(), "accessibilityAction", { nativeEvent: { actionName: "activate" } });
		expect(onValueChange).toHaveBeenCalledWith(true);
		expect(toggle()).toBeChecked();

		await view.rerender(<Switch disabled onValueChange={onValueChange} accessibilityLabel="Wi-Fi" />);
		await fireEvent(toggle(), "accessibilityAction", { nativeEvent: { actionName: "activate" } });
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});
});
