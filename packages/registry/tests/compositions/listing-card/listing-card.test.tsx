import { render, screen, userEvent } from "@testing-library/react-native";

import { ListingCard } from "@/components/compositions/listing-card";

jest.useFakeTimers();

const LISTING = { ...{ title: "Loft in Brooklyn", price: "$3,679", priceUnit: "/mo", subtitle: "Williamsburg" }, image: { uri: "https://example.com/home.jpg" } };
const SPECS = [
	{ icon: "bed" as const, value: "2", label: "Beds" },
	{ icon: "bath" as const, value: "1", label: "Bath" },
	{ value: "68 m²" },
];

describe("ListingCard", () => {
	test("shows the title, the price, the subtitle and the badge", async () => {
		await render(<ListingCard {...LISTING} badge="Guest favorite" />);

		for (const text of [LISTING.title, LISTING.subtitle]) expect(screen.getByText(new RegExp(text))).toBeOnTheScreen();
		expect(screen.getByText(new RegExp(LISTING.price.replace("$", "\\$")))).toBeOnTheScreen();
		expect(screen.getByText("Guest favorite")).toBeOnTheScreen();
	});

	test("shows each spec as its value and label", async () => {
		await render(<ListingCard {...LISTING} specs={SPECS} />);

		expect(screen.getByText(/^2\s*Beds$/)).toBeOnTheScreen();
		expect(screen.getByText(/^1\s*Bath$/)).toBeOnTheScreen();
		expect(screen.getByText("68 m²")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as Loft in Brooklyn and its price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ListingCard {...LISTING} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Loft in Brooklyn, $3,679/mo" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("without onPress it is no button", async () => {
		await render(<ListingCard {...LISTING} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
