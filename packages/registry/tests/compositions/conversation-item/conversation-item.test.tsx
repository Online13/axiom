import { render, screen, userEvent } from "@testing-library/react-native";

import { ConversationItem } from "@/components/compositions/conversation-item";

jest.useFakeTimers();

describe("ConversationItem", () => {
	test("is read as name, preview and time", async () => {
		await render(<ConversationItem name="Ada Lovelace" preview="See you at 6" time="9:41" onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Ada Lovelace, See you at 6, 9:41" })).toBeOnTheScreen();
	});

	test("unread: says how many, with the right plural, and shows a counter", async () => {
		const view = await render(<ConversationItem name="Ada" unreadCount={1} onPress={() => {}} />);
		expect(screen.getByRole("button", { name: "Ada, 1 unread message" })).toHaveTextContent(/1$/);

		await view.rerender(<ConversationItem name="Ada" unreadCount={3} onPress={() => {}} />);
		expect(screen.getByRole("button", { name: "Ada, 3 unread messages" })).toBeOnTheScreen();
	});

	test("a muted conversation still counts, capped at 99+", async () => {
		await render(<ConversationItem name="Team" unreadCount={250} muted onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Team, 250 unread messages" })).toHaveTextContent(/99\+$/);
	});

	test("press opens it; long press is for the menu", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onLongPress = jest.fn();
		await render(<ConversationItem name="Ada" onPress={onPress} onLongPress={onLongPress} />);
		const row = screen.getByRole("button", { name: "Ada" });

		await user.press(row);
		await user.longPress(row, { duration: 600 });

		expect(onPress).toHaveBeenCalledTimes(1);
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});
});
