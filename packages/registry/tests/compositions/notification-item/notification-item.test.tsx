import { render, screen, userEvent } from "@testing-library/react-native";

import { NotificationItem } from "@/components/compositions/notification-item";

jest.useFakeTimers();

describe("NotificationItem", () => {
	test("reads the actor and the message as one sentence, then the time", async () => {
		await render(<NotificationItem actor="Lena Moreau" message="liked your photo." time="2m" onPress={() => {}} />);

		const row = screen.getByRole("button", { name: "Lena Moreau liked your photo., 2m" });
		expect(row).toHaveTextContent(/Lena Moreau liked your photo\./);
	});

	test("unread is said first", async () => {
		await render(<NotificationItem message="Your order shipped." icon="notifications" unread onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Unread, Your order shipped." })).toBeOnTheScreen();
	});

	test("the action button names the actor and doesn't press the row", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		const onPress = jest.fn();
		await render(
			<NotificationItem actor="Lena" message="followed you." actionLabel="Follow back" onAction={onAction} onPress={onPress} />,
		);

		await user.press(screen.getByRole("button", { name: "Follow back, Lena" }));

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});

	test("an action label without onAction shows no button", async () => {
		await render(<NotificationItem message="Welcome" actionLabel="Start" />);

		expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
	});
});
