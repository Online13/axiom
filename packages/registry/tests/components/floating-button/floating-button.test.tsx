import { render, screen, userEvent } from "@testing-library/react-native";

import { FloatingButton } from "@/components/ui/floating-button";
import { metrics } from "@/theme/tokens";

import { withInsets } from "../../utils/safe-area";

jest.useFakeTimers();

describe("FloatingButton", () => {
	test("an extended button is named by its label", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<FloatingButton icon="add" label="Compose" onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Compose" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Compose")).toBeOnTheScreen();
	});

	test("an icon-only button is named by its accessibilityLabel", async () => {
		await render(<FloatingButton icon="add" accessibilityLabel="New note" />);

		expect(screen.getByRole("button", { name: "New note" })).toBeOnTheScreen();
	});

	test("hidden, it can't be pressed or reached by screen readers", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const view = await render(
			<FloatingButton icon="add" label="Compose" onPress={onPress} visible={false} />,
		);

		expect(screen.queryByRole("button", { name: "Compose" })).toBeNull();
		await user.press(screen.getByText("Compose", { includeHiddenElements: true }));
		expect(onPress).not.toHaveBeenCalled();

		await view.rerender(<FloatingButton icon="add" label="Compose" onPress={onPress} />);
		await user.press(screen.getByRole("button", { name: "Compose" }));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<FloatingButton icon="add" label="Compose" disabled onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Compose" }));

		expect(onPress).not.toHaveBeenCalled();
	});

	test("sits above the bottom safe area, the screen margin and the offset", async () => {
		await render(<FloatingButton icon="add" label="Compose" offset={56} />, {
			wrapper: withInsets({ bottom: 34, right: 10 }),
		});

		const anchor = screen.getByRole("button", { name: "Compose" }).parent!;
		expect(anchor).toHaveStyle({
			bottom: 34 + metrics.screenMargin + 56,
			right: 10 + metrics.screenMargin,
		});
	});

	test("placement moves it to the start or the center", async () => {
		const wrapper = withInsets({ left: 12 });
		const view = await render(<FloatingButton icon="add" label="Go" placement="bottom-start" />, {
			wrapper,
		});
		expect(screen.getByRole("button", { name: "Go" }).parent).toHaveStyle({
			left: 12 + metrics.screenMargin,
		});

		await view.rerender(<FloatingButton icon="add" label="Go" placement="bottom-center" />);
		expect(screen.getByRole("button", { name: "Go" }).parent).toHaveStyle({
			left: 0,
			right: 0,
			alignItems: "center",
		});
	});
});
