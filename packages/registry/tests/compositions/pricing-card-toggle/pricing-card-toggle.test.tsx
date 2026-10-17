import { render, screen, userEvent } from "@testing-library/react-native";

import { PricingCardToggle } from "@/components/compositions/pricing-card-toggle";

jest.useFakeTimers();

const PLAN = {
	name: "Pro",
	monthlyPrice: "$12",
	yearlyPrice: "$9.60",
	discount: "-20%",
	yearlyCaption: "$115 billed yearly",
};

const price = (label: string) => screen.getByLabelText(label);

describe("PricingCardToggle", () => {
	test("starts on monthly, reading the monthly price", async () => {
		await render(<PricingCardToggle {...PLAN} />);

		expect(screen.getByRole("tab", { name: "Monthly" })).toBeSelected();
		expect(price("$12 /month")).toBeOnTheScreen();
	});

	test("switching to yearly shows the yearly price, read with what it replaces and the discount", async () => {
		const user = userEvent.setup();
		const onBillingChange = jest.fn();
		await render(<PricingCardToggle {...PLAN} onBillingChange={onBillingChange} />);

		await user.press(screen.getByRole("tab", { name: "Yearly" }));

		expect(onBillingChange).toHaveBeenCalledWith("yearly");
		expect(price("$9.60 /month, instead of $12, -20%")).toBeOnTheScreen();
		expect(screen.getByText("$115 billed yearly")).toBeOnTheScreen();
	});

	test("the action receives the billing shown, and names it", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		await render(<PricingCardToggle {...PLAN} defaultBilling="yearly" onAction={onAction} />);

		await user.press(screen.getByRole("button", { name: "Choose plan, Pro, Yearly" }));

		expect(onAction).toHaveBeenCalledWith("yearly");
	});

	test("controlled billing is shared: the card follows billing", async () => {
		const user = userEvent.setup();
		const view = await render(<PricingCardToggle {...PLAN} billing="monthly" />);

		await user.press(screen.getByRole("tab", { name: "Yearly" }));
		expect(price("$12 /month")).toBeOnTheScreen();

		await view.rerender(<PricingCardToggle {...PLAN} billing="yearly" />);
		expect(price("$9.60 /month, instead of $12, -20%")).toBeOnTheScreen();
	});
});
