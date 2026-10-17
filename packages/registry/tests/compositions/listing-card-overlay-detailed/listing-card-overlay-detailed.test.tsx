import { render, screen, userEvent } from "@testing-library/react-native";

import { ListingCardOverlayDetailed } from "@/components/compositions/listing-card-overlay-detailed";

jest.useFakeTimers();

const LISTING = { ...{ price: "$250,000", priceLabel: "List price", title: "Guillaume Briard", subtitle: "12 rue Oberkampf" }, image: { uri: "https://example.com/home.jpg" } };
const SPECS = [
	{ icon: "bed" as const, value: "2", label: "Beds" },
	{ icon: "bath" as const, value: "1", label: "Bath" },
	{ value: "68 m²" },
];

describe("ListingCardOverlayDetailed", () => {
	test("shows the title, the price, the subtitle and the badge", async () => {
		await render(<ListingCardOverlayDetailed {...LISTING} badge="Guest favorite" />);

		for (const text of [LISTING.title, LISTING.subtitle]) expect(screen.getByText(new RegExp(text))).toBeOnTheScreen();
		expect(screen.getByText(new RegExp(LISTING.price.replace("$", "\\$")))).toBeOnTheScreen();
		expect(screen.getByText("Guest favorite")).toBeOnTheScreen();
	});

	test("shows each spec as its value, with its label under it", async () => {
		await render(<ListingCardOverlayDetailed {...LISTING} specs={SPECS} />);

		for (const text of ["2", "Beds", "1", "Bath"]) expect(screen.getByText(text)).toBeOnTheScreen();
		expect(screen.getByText("68 m²")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as $250,000 and its price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ListingCardOverlayDetailed {...LISTING} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "$250,000, Guillaume Briard" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("without onPress it is no button", async () => {
		await render(<ListingCardOverlayDetailed {...LISTING} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
