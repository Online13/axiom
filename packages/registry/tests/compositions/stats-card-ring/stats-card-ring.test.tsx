import { render, screen, userEvent } from "@testing-library/react-native";

import { StatsCardRing } from "@/components/compositions/stats-card-ring";

jest.useFakeTimers();

const METRIC = { label: "Steps", value: "8,204", progress: 0.8204, caption: "of 10,000" };

describe("StatsCardRing", () => {
	test("is a progressbar read as one sentence, with the percentage", async () => {
		await render(<StatsCardRing {...METRIC} />);

		const bar = screen.getByRole("progressbar", { name: "Steps: 8,204, of 10,000, 82%" });
		expect(bar).toHaveAccessibilityValue({ min: 0, max: 100, now: 82 });
		expect(screen.getByText("82%", { includeHiddenElements: true })).toBeOnTheScreen();
	});

	test("past the goal, says the real percentage but the bar stays full", async () => {
		await render(<StatsCardRing {...METRIC} progress={1.3} />);

		const bar = screen.getByRole("progressbar");
		expect(bar.props.accessibilityLabel).toContain("130%");
		expect(bar).toHaveAccessibilityValue({ now: 100 });
	});

	test("a negative progress counts as none", async () => {
		await render(<StatsCardRing {...METRIC} progress={-0.5} />);

		expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({ now: 0 });
	});

	test("pressable, the whole card is one button with the same sentence", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<StatsCardRing {...METRIC} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Steps: 8,204, of 10,000, 82%" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole("progressbar")).toBeNull();
	});
});
