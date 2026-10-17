import { render, screen, userEvent } from "@testing-library/react-native";

import { PricingCardHero } from "@/components/compositions/pricing-card-hero";

jest.useFakeTimers();

const PLAN = { name: "Pro", price: "$12", period: "/month", features: ["Unlimited projects"], badge: "Most popular" };

describe("PricingCardHero", () => {
	test("shows the plan and reads the price with its period", async () => {
		await render(<PricingCardHero {...PLAN} />);

		expect(screen.getByText("Pro")).toBeOnTheScreen();
		expect(screen.getByText("Unlimited projects")).toBeOnTheScreen();
		expect(screen.getByLabelText("$12 /month")).toBeOnTheScreen();
	});

	test("the action names the plan", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		await render(<PricingCardHero {...PLAN} actionLabel="Start trial" onAction={onAction} />);

		await user.press(screen.getByRole("button", { name: "Start trial, Pro" }));

		expect(onAction).toHaveBeenCalledTimes(1);
	});

	test("without onAction, no button", async () => {
		await render(<PricingCardHero {...PLAN} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
