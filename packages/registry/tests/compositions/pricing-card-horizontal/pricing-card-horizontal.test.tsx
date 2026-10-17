import { render, screen, userEvent } from "@testing-library/react-native";

import { PricingCardHorizontal } from "@/components/compositions/pricing-card-horizontal";

jest.useFakeTimers();

const PLAN = {
	name: "Pro",
	price: "$12",
	period: "/month",
	description: "For growing teams",
	features: ["Unlimited projects", "Priority support"],
	badge: "Most popular",
};

describe("PricingCardHorizontal", () => {
	test("shows the name, badge, description and each feature", async () => {
		await render(<PricingCardHorizontal {...PLAN} />);

		for (const text of ["Pro", "Most popular", "For growing teams", "Unlimited projects", "Priority support"]) {
			expect(screen.getByText(text)).toBeOnTheScreen();
		}
	});

	test("the price and its period are read as one: '$12 /month'", async () => {
		await render(<PricingCardHorizontal {...PLAN} />);

		expect(screen.getByLabelText("$12 /month")).toBeOnTheScreen();
	});

	test("the action names the plan", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		await render(<PricingCardHorizontal {...PLAN} onAction={onAction} />);

		await user.press(screen.getByRole("button", { name: "Choose plan, Pro" }));

		expect(onAction).toHaveBeenCalledTimes(1);
	});

	test("the current plan's button is disabled and says so", async () => {
		const user = userEvent.setup();
		const onAction = jest.fn();
		await render(<PricingCardHorizontal {...PLAN} current onAction={onAction} />);

		const button = screen.getByRole("button", { name: "Current plan, Pro" });
		await user.press(button);

		expect(button).toBeDisabled();
		expect(onAction).not.toHaveBeenCalled();
	});

	test("without onAction and not current, there is no button", async () => {
		await render(<PricingCardHorizontal {...PLAN} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
