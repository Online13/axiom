import { render, screen, userEvent } from "@testing-library/react-native";

import { OfferCard } from "@/components/compositions/offer-card";

jest.useFakeTimers();

const OFFER = {
	title: "Sapphire Travel card",
	benefit: "5% back on travel",
	badge: "Limited offer",
	highlights: ["No foreign fees", "Lounge access"],
	fee: "$0 the first year",
};

describe("OfferCard", () => {
	test("shows the badge, title, benefit and each highlight", async () => {
		await render(<OfferCard {...OFFER} />);

		for (const text of ["Limited offer", "Sapphire Travel card", "5% back on travel", "No foreign fees", "Lounge access"]) {
			expect(screen.getByText(text)).toBeOnTheScreen();
		}
	});

	test("the fee and its label are read together", async () => {
		await render(<OfferCard {...OFFER} />);

		expect(screen.getByText("$0 the first year").parent).toHaveTextContent("Annual fee$0 the first year");
	});

	test("pressable, it is one button read as title and benefit; the action keeps its own press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onAction = jest.fn();
		await render(<OfferCard {...OFFER} onPress={onPress} onAction={onAction} />);

		await user.press(screen.getByRole("button", { name: "Apply now, Sapphire Travel card" }));
		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();

		await user.press(screen.getByRole("button", { name: "Sapphire Travel card, 5% back on travel" }));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("without a fee or an action there is no footer", async () => {
		await render(<OfferCard title="Card" benefit="1% back" />);

		expect(screen.queryByText("Annual fee")).toBeNull();
		expect(screen.queryByRole("button")).toBeNull();
	});
});
