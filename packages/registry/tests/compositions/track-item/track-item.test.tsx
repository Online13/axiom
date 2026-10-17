import { render, screen, userEvent } from "@testing-library/react-native";

import { formatDuration, TrackItem } from "@/components/compositions/track-item";

jest.useFakeTimers();

describe("TrackItem", () => {
	test("is read as title, artist, explicit, length", async () => {
		await render(<TrackItem title="Blue Monday" artist="New Order" explicit duration={448} onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Blue Monday, New Order, Explicit, 7:28" })).toBeOnTheScreen();
	});

	test("the playing track says so and is selected", async () => {
		await render(<TrackItem title="Blue Monday" artist="New Order" playing onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Blue Monday, New Order, Now playing" })).toBeSelected();
	});

	test("without artwork it shows its position", async () => {
		await render(<TrackItem title="Ceremony" artist="New Order" index={3} />);

		expect(screen.getByText("3")).toBeOnTheScreen();
	});

	test("press plays, long press and 'More' open the menu", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onLongPress = jest.fn();
		const onMore = jest.fn();
		await render(<TrackItem title="Ceremony" artist="New Order" onPress={onPress} onLongPress={onLongPress} onMore={onMore} />);

		await user.press(screen.getByRole("button", { name: "More, Ceremony" }));
		expect(onMore).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();

		await user.press(screen.getByRole("button", { name: "Ceremony, New Order" }));
		await user.longPress(screen.getByRole("button", { name: "Ceremony, New Order" }), { duration: 600 });
		expect(onPress).toHaveBeenCalledTimes(1);
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	test("disabled: can't be played", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<TrackItem title="Unavailable" artist="New Order" disabled onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Unavailable, New Order" }));

		expect(onPress).not.toHaveBeenCalled();
	});
});

describe("formatDuration", () => {
	test.each([
		[0, "0:00"],
		[9, "0:09"],
		[225, "3:45"],
		[3725, "1:02:05"],
		[59.6, "1:00"],
		[-4, "0:00"],
	])("%d s → %s", (seconds, text) => {
		expect(formatDuration(seconds)).toBe(text);
	});
});
