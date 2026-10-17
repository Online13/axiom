import { render, screen, userEvent } from "@testing-library/react-native";

import { PricingCardTile } from "@/components/compositions/pricing-card-tile";
import { RadioGroup } from "@/components/ui/radio";

jest.useFakeTimers();

function Plans({ onValueChange, disabled }: { onValueChange?: (value: string) => void; disabled?: boolean }) {
	return (
		<RadioGroup accessibilityLabel="Plan" defaultValue="monthly" onValueChange={onValueChange}>
			<PricingCardTile value="monthly" name="Monthly" price="$12" period="/month" />
			<PricingCardTile
				value="yearly"
				name="Yearly"
				price="$99"
				period="/year"
				description="$8.25 a month, billed yearly"
				badge="Save 30%"
				disabled={disabled}
			/>
		</RadioGroup>
	);
}

describe("PricingCardTile", () => {
	test("each plan is a radio read as one sentence", async () => {
		await render(<Plans />);

		expect(screen.getByRole("radio", { name: "Monthly, $12 /month" })).toBeChecked();
		expect(screen.getByRole("radio", { name: "Save 30%, Yearly, $99 /year, $8.25 a month, billed yearly" })).not.toBeChecked();
	});

	test("picking a plan checks it and reports its value", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Plans onValueChange={onValueChange} />);

		await user.press(screen.getByRole("radio", { name: "Save 30%, Yearly, $99 /year, $8.25 a month, billed yearly" }));

		expect(onValueChange).toHaveBeenCalledWith("yearly");
		expect(screen.getByRole("radio", { name: "Save 30%, Yearly, $99 /year, $8.25 a month, billed yearly" })).toBeChecked();
		expect(screen.getByRole("radio", { name: "Monthly, $12 /month" })).not.toBeChecked();
	});

	test("a disabled plan can't be picked", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Plans disabled onValueChange={onValueChange} />);

		await user.press(screen.getByRole("radio", { name: "Save 30%, Yearly, $99 /year, $8.25 a month, billed yearly" }));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.getByRole("radio", { name: "Save 30%, Yearly, $99 /year, $8.25 a month, billed yearly" })).toBeDisabled();
	});
});
