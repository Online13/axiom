import { Pressable, Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Item } from "@/components/ui/item";

import { pressIn } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

function Row(props: Partial<React.ComponentProps<typeof Item>>) {
	return (
		<Item accessibilityLabel="Ada Lovelace" {...props}>
			<Item.Leading>
				<Text>AL</Text>
			</Item.Leading>
			<Item.Content>
				<Item.Title>Ada Lovelace</Item.Title>
				<Item.Description>Mathematician</Item.Description>
			</Item.Content>
			<Item.Trailing>
				<Text>›</Text>
			</Item.Trailing>
		</Item>
	);
}

describe("Item", () => {
	test("without a handler, it is not pressable", async () => {
		await render(<Row testID="row" />);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByTestId("row")).toHaveTextContent("ALAda LovelaceMathematician›");
	});

	test("with onPress, the row is a button", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Row onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Ada Lovelace" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("onLongPress alone also makes it pressable", async () => {
		const user = userEvent.setup();
		const onLongPress = jest.fn();
		await render(<Row onLongPress={onLongPress} />);

		await user.longPress(screen.getByRole("button", { name: "Ada Lovelace" }), { duration: 600 });

		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Row onPress={onPress} disabled />);

		const row = screen.getByRole("button", { name: "Ada Lovelace" });
		await user.press(row);

		expect(onPress).not.toHaveBeenCalled();
		expect(row).toBeDisabled();
	});

	test("reports selected, and lets the caller's state decide when it sets selected", async () => {
		const view = await render(<Row onPress={() => {}} selected />);
		expect(screen.getByRole("button", { name: "Ada Lovelace" })).toBeSelected();

		await view.rerender(
			<Row onPress={() => {}} selected accessibilityState={{ selected: false }} />,
		);
		expect(screen.getByRole("button", { name: "Ada Lovelace" })).not.toBeSelected();
	});

	test("keeps a role the caller gives, with its state", async () => {
		await render(
			<Row onPress={() => {}} accessibilityRole="radio" accessibilityState={{ checked: true }} />,
		);

		expect(screen.getByRole("radio", { name: "Ada Lovelace" })).toBeChecked();
	});

	test("a haptic plays only when asked", async () => {
		const view = await render(<Row onPress={() => {}} />);
		await pressIn(screen.getByRole("button", { name: "Ada Lovelace" }));
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();

		await view.rerender(<Row onPress={() => {}} haptic="selection" />);
		await pressIn(screen.getByRole("button", { name: "Ada Lovelace" }));
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("asChild merges the row into its child, a link for instance", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Item asChild accessibilityRole="link" accessibilityLabel="Profile" disabled={false}>
				<Pressable onPress={onPress}>
					<Item.Content>
						<Item.Title>Profile</Item.Title>
					</Item.Content>
				</Pressable>
			</Item>,
		);

		await user.press(screen.getByRole("link", { name: "Profile" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("asChild passes disabled to screen readers", async () => {
		await render(
			<Item asChild accessibilityRole="link" accessibilityLabel="Profile" disabled>
				<Pressable />
			</Item>,
		);

		expect(screen.getByRole("link", { name: "Profile" })).toBeDisabled();
	});
});
