import { render, screen, userEvent } from "@testing-library/react-native";

import { ListingCardOverlay } from "@/components/compositions/listing-card-overlay";

jest.useFakeTimers();

const LISTING = { ...{ title: "Townhouse", price: "$200k", subtitle: "Austin" }, image: { uri: "https://example.com/home.jpg" } };
const SPECS = [
	{ icon: "bed" as const, value: "2", label: "Beds" },
	{ icon: "bath" as const, value: "1", label: "Bath" },
	{ value: "68 m²" },
];

describe("ListingCardOverlay", () => {
	test("shows the title, the price, the subtitle and the badge", async () => {
		await render(<ListingCardOverlay {...LISTING} badge="Guest favorite" />);

		for (const text of [LISTING.title, LISTING.subtitle]) expect(screen.getByText(new RegExp(text))).toBeOnTheScreen();
		expect(screen.getByText(new RegExp(LISTING.price.replace("$", "\\$")))).toBeOnTheScreen();
		expect(screen.getByText("Guest favorite")).toBeOnTheScreen();
	});

	test("shows each spec as its value and label", async () => {
		await render(<ListingCardOverlay {...LISTING} specs={SPECS} />);

		expect(screen.getByText(/^2\s*Beds$/)).toBeOnTheScreen();
		expect(screen.getByText(/^1\s*Bath$/)).toBeOnTheScreen();
		expect(screen.getByText("68 m²")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as Townhouse and its price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ListingCardOverlay {...LISTING} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Townhouse, $200k" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("without onPress it is no button", async () => {
		await render(<ListingCardOverlay {...LISTING} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
