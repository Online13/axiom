import { render, screen, userEvent } from "@testing-library/react-native";

import { StatsCard } from "@/components/compositions/stats-card";

jest.useFakeTimers();

const METRIC = { label: "Revenue", value: "$12,480", change: "+12.4%", trend: "up" as const, caption: "vs last week" };

describe("StatsCard", () => {
	test("shows the label, the value and the change", async () => {
		await render(<StatsCard {...METRIC} />);

		for (const text of [METRIC.label, METRIC.value, METRIC.change]) {
			expect(screen.getByText(text, { includeHiddenElements: true })).toBeOnTheScreen();
		}
	});

	test("is read as one sentence: 'Revenue: $12,480, +12.4%, vs last week'", async () => {
		await render(<StatsCard {...METRIC} />);

		expect(screen.getByLabelText("Revenue: $12,480, +12.4%, vs last week")).toBeOnTheScreen();
	});

	test("pressable, the whole card is that one button", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<StatsCard {...METRIC} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Revenue: $12,480, +12.4%, vs last week" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		// The inner block keeps its label but stops being an element: screen readers meet one stop.
		expect(screen.getAllByLabelText("Revenue: $12,480, +12.4%, vs last week").filter((node) => node.props.accessible === true)).toHaveLength(1);
	});

	test("without a change, only the label and the value are read", async () => {
		await render(<StatsCard {...METRIC} change={undefined} caption={undefined} />);

		expect(screen.getByLabelText("Revenue: $12,480")).toBeOnTheScreen();
	});
});
