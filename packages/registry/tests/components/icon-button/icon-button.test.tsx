import { render, screen, userEvent } from "@testing-library/react-native";

import { IconButton } from "@/components/ui/icon-button";

jest.useFakeTimers();

describe("IconButton", () => {
	test("is a button named by its accessibilityLabel, and calls onPress", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<IconButton icon="close" accessibilityLabel="Close" onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Close" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("the icon itself is decorative: only the button is announced", async () => {
		await render(<IconButton icon="search" accessibilityLabel="Search" />);

		expect(screen.queryByRole("image")).toBeNull();
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<IconButton icon="delete" accessibilityLabel="Delete" disabled onPress={onPress} />,
		);

		const button = screen.getByRole("button", { name: "Delete" });
		await user.press(button);

		expect(onPress).not.toHaveBeenCalled();
		expect(button).toBeDisabled();
	});

	test("a toggle reports whether it is on", async () => {
		const view = await render(<IconButton icon="favorite" accessibilityLabel="Favorite" />);
		expect(screen.getByRole("button", { name: "Favorite" })).not.toBeSelected();

		await view.rerender(<IconButton icon="favorite" accessibilityLabel="Favorite" selected />);

		expect(screen.getByRole("button", { name: "Favorite" })).toBeSelected();
	});

	describe("badge", () => {
		test("a counter is shown on the icon and read with the label", async () => {
			await render(<IconButton icon="notifications" accessibilityLabel="Notifications" badge={3} />);

			const button = screen.getByRole("button", { name: "Notifications, 3" });
			expect(button).toHaveTextContent("3");
		});

		test("a large counter is capped at 99+", async () => {
			await render(<IconButton icon="notifications" accessibilityLabel="Inbox" badge={250} />);

			expect(screen.getByRole("button", { name: "Inbox, 250" })).toHaveTextContent("99+");
		});

		test("0 and false show nothing, and leave the label alone", async () => {
			const view = await render(
				<IconButton icon="notifications" accessibilityLabel="Inbox" badge={0} />,
			);
			expect(screen.getByRole("button", { name: "Inbox" })).toHaveTextContent("");

			await view.rerender(<IconButton icon="notifications" accessibilityLabel="Inbox" badge={false} />);
			expect(screen.getByRole("button", { name: "Inbox" })).toHaveTextContent("");
		});

		test("a dot adds no number to the label", async () => {
			await render(<IconButton icon="notifications" accessibilityLabel="Inbox" badge />);

			const button = screen.getByRole("button", { name: "Inbox" });
			expect(button).toHaveTextContent("");
		});
	});
});
