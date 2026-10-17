import { Pressable, Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Button } from "@/components/ui/button";

import { pressIn } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

/** Spinners rendered by the button: `ActivityIndicator` is a host element in Jest. */
const spinners = () => screen.container.queryAll((node) => node.type === "ActivityIndicator");

describe("Button", () => {
	test("is a button named by its label, and calls onPress", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Button onPress={onPress}>Save</Button>);

		await user.press(screen.getByRole("button", { name: "Save" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("renders a number label, and any other children as given", async () => {
		await render(
			<>
				<Button>{42}</Button>
				<Button accessibilityLabel="Custom">
					<Text>Rich content</Text>
				</Button>
			</>,
		);

		expect(screen.getByRole("button", { name: "42" })).toBeOnTheScreen();
		expect(screen.getByRole("button", { name: "Custom" })).toHaveTextContent("Rich content");
	});

	test("disabled: ignores presses and is announced disabled", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Button disabled onPress={onPress}>
				Save
			</Button>,
		);

		const button = screen.getByRole("button", { name: "Save" });
		await user.press(button);

		expect(onPress).not.toHaveBeenCalled();
		expect(button).toBeDisabled();
	});

	describe("loading", () => {
		test("is busy, ignores presses, and keeps its name for screen readers", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			await render(
				<Button loading onPress={onPress}>
					Save
				</Button>,
			);

			const button = screen.getByRole("button", { name: "Save" });
			await user.press(button);

			expect(onPress).not.toHaveBeenCalled();
			expect(button).toBeBusy();
			expect(spinners()).toHaveLength(1);
		});

		test("the spinner takes the place of the leading icon", async () => {
			const view = await render(<Button leadingIcon="add">Add</Button>);
			expect(spinners()).toHaveLength(0);

			await view.rerender(
				<Button leadingIcon="add" loading>
					Add
				</Button>,
			);

			expect(spinners()).toHaveLength(1);
			expect(screen.getByText("Add")).toBeOnTheScreen();
		});

		test("ending the load makes it pressable again", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			const view = await render(
				<Button loading onPress={onPress}>
					Save
				</Button>,
			);

			await view.rerender(<Button onPress={onPress}>Save</Button>);
			await user.press(screen.getByRole("button", { name: "Save" }));

			expect(onPress).toHaveBeenCalledTimes(1);
			expect(screen.getByRole("button", { name: "Save" })).not.toBeBusy();
			expect(spinners()).toHaveLength(0);
		});
	});

	test("keeps the caller's accessibilityState next to busy", async () => {
		await render(
			<Button accessibilityState={{ expanded: true }} loading>
				Filters
			</Button>,
		);

		const button = screen.getByRole("button", { name: "Filters" });
		expect(button).toBeExpanded();
		expect(button).toBeBusy();
	});

	test("plays the haptic it is given, on touch", async () => {
		await render(<Button haptic="light">Like</Button>);

		await pressIn(screen.getByRole("button", { name: "Like" }));

		expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
	});

	describe("asChild", () => {
		test("renders the child as the button, both press handlers run", async () => {
			const user = userEvent.setup();
			const onButton = jest.fn();
			const onChild = jest.fn();
			await render(
				<Button asChild onPress={onButton}>
					<Pressable accessibilityRole="link" onPress={onChild}>
						<Text>Terms</Text>
					</Pressable>
				</Button>,
			);

			await user.press(screen.getByRole("link", { name: "Terms" }));

			expect(onChild).toHaveBeenCalledTimes(1);
			expect(onButton).toHaveBeenCalledTimes(1);
			expect(screen.queryByRole("button")).toBeNull();
		});
	});
});
