import { render, screen, userEvent } from "@testing-library/react-native";

import { EventCard } from "@/components/compositions/event-card";

jest.useFakeTimers();

const DATE = new Date(2025, 8, 27);
const FULL_DATE = DATE.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const EVENT = {
	title: "Night Market",
	image: { uri: "https://example.com/market.jpg" },
	date: DATE,
	details: [{ icon: "time" as const, label: "Sat · 7:00 PM" }, { label: "Brooklyn Steel" }],
};
const PEOPLE = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds"].map((name) => ({ name }));

describe("EventCard", () => {
	test("the date tile is read as the full date, and each detail is shown", async () => {
		await render(<EventCard {...EVENT} />);

		expect(screen.getByLabelText(FULL_DATE)).toHaveTextContent(/27/);
		expect(screen.getByText("Sat · 7:00 PM")).toBeOnTheScreen();
		expect(screen.getByText("Brooklyn Steel")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as title and date", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<EventCard {...EVENT} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: `Night Market, ${FULL_DATE}` }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("shows 3 attendee avatars and counts them all", async () => {
		await render(<EventCard {...EVENT} attendees={PEOPLE} />);

		expect(screen.getAllByRole("image")).toHaveLength(3);
		expect(screen.getByText(/4 going/)).toBeOnTheScreen();
	});

	test("attendeeCount covers people who aren't listed", async () => {
		await render(<EventCard {...EVENT} attendees={PEOPLE.slice(0, 2)} attendeeCount={124} attendeeLabel="interested" />);

		expect(screen.getByText(/124 interested/)).toBeOnTheScreen();
	});

	test("the action names the event and keeps its own press", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		const onPress = jest.fn();
		await render(<EventCard {...EVENT} onAction={onAction} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Get tickets, Night Market" }));

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});

	test("without attendees or an action there is no footer", async () => {
		await render(<EventCard {...EVENT} />);

		expect(screen.queryByText(/going/)).toBeNull();
		expect(screen.queryByRole("button")).toBeNull();
	});
});
