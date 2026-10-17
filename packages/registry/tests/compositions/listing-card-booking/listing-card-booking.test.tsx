import { render, screen, userEvent } from "@testing-library/react-native";

import { ListingCardBooking } from "@/components/compositions/listing-card-booking";

jest.useFakeTimers();

const LISTING = { ...{ title: "Cabin by the lake", price: "$620", priceUnit: "/night", subtitle: "Lake Tahoe", onAction: () => {} }, image: { uri: "https://example.com/home.jpg" } };
const SPECS = [
	{ icon: "bed" as const, value: "2", label: "Beds" },
	{ icon: "bath" as const, value: "1", label: "Bath" },
	{ value: "68 m²" },
];

describe("ListingCardBooking", () => {
	test("shows the title, the price, the subtitle and the badge", async () => {
		await render(<ListingCardBooking {...LISTING} badge="Guest favorite" />);

		for (const text of [LISTING.title, LISTING.subtitle]) expect(screen.getByText(new RegExp(text))).toBeOnTheScreen();
		expect(screen.getByText(new RegExp(LISTING.price.replace("$", "\\$")))).toBeOnTheScreen();
		expect(screen.getByText("Guest favorite")).toBeOnTheScreen();
	});

	test("shows each spec as its value and label", async () => {
		await render(<ListingCardBooking {...LISTING} specs={SPECS} />);

		expect(screen.getByText(/^2\s*Beds$/)).toBeOnTheScreen();
		expect(screen.getByText(/^1\s*Bath$/)).toBeOnTheScreen();
		expect(screen.getByText("68 m²")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as Cabin by the lake and its price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ListingCardBooking {...LISTING} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Cabin by the lake, $620/night" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("the action keeps its own press", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		const onPress = jest.fn();
		await render(<ListingCardBooking {...LISTING} onAction={onAction} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Reserve now, Cabin by the lake" }));

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});
});
