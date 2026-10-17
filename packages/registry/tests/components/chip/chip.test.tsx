import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Chip } from "@/components/ui/chip";

import { pressIn } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

describe("Chip", () => {
	test("without onPress, it is a plain tag: not a button", async () => {
		await render(<Chip>Design</Chip>);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByLabelText("Design")).toBeOnTheScreen();
	});

	test("with onPress, it is a button", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Chip onPress={onPress}>Nearby</Chip>);

		await user.press(screen.getByRole("button", { name: "Nearby" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("with selected, it is a toggle that reports its state", async () => {
		const view = await render(
			<Chip selected={false} onPress={() => {}}>
				Open now
			</Chip>,
		);
		// `toBeChecked` doesn't take a togglebutton: read the state screen readers get.
		expect(screen.getByRole("togglebutton", { name: "Open now" })).toHaveProp(
			"accessibilityState",
			expect.objectContaining({ checked: false }),
		);

		await view.rerender(
			<Chip selected onPress={() => {}}>
				Open now
			</Chip>,
		);
		expect(screen.getByRole("togglebutton", { name: "Open now" })).toHaveProp(
			"accessibilityState",
			expect.objectContaining({ checked: true }),
		);
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Chip disabled onPress={onPress}>
				Sold out
			</Chip>,
		);

		await user.press(screen.getByRole("button", { name: "Sold out" }));

		expect(onPress).not.toHaveBeenCalled();
	});

	describe("onRemove", () => {
		test("shows a remove button named after the chip", async () => {
			const user = userEvent.setup();
			const onRemove = jest.fn();
			await render(<Chip onRemove={onRemove}>Paris</Chip>);

			await user.press(screen.getByRole("button", { name: "Remove Paris" }));

			expect(onRemove).toHaveBeenCalledTimes(1);
		});

		test("a chip without a text label gets a generic 'Remove'", async () => {
			await render(<Chip onRemove={() => {}} leading="location" />);

			expect(screen.getByRole("button", { name: "Remove" })).toBeOnTheScreen();
		});

		test("removing doesn't press the chip itself", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			const onRemove = jest.fn();
			await render(
				<Chip onPress={onPress} onRemove={onRemove}>
					Paris
				</Chip>,
			);

			await user.press(screen.getByLabelText("Remove Paris"));

			expect(onRemove).toHaveBeenCalledTimes(1);
			expect(onPress).not.toHaveBeenCalled();
		});

		test("a disabled chip can't be removed", async () => {
			const user = userEvent.setup();
			const onRemove = jest.fn();
			await render(
				<Chip disabled onRemove={onRemove}>
					Paris
				</Chip>,
			);

			await user.press(screen.getByLabelText("Remove Paris"));

			expect(onRemove).not.toHaveBeenCalled();
		});
	});

	test("plays its haptic on touch only when pressable", async () => {
		await render(
			<Chip haptic="selection" onPress={() => {}}>
				Tap
			</Chip>,
		);

		await pressIn(screen.getByRole("button", { name: "Tap" }));

		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("Chip.Group renders its chips in order", async () => {
		await render(
			<Chip.Group testID="group">
				<Chip>One</Chip>
				<Chip>Two</Chip>
			</Chip.Group>,
		);

		expect(screen.getByTestId("group")).toHaveTextContent("OneTwo");
	});
});
