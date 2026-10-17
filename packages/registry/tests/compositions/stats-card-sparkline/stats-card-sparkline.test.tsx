import { render, screen, userEvent } from "@testing-library/react-native";

import { StatsCardSparkline } from "@/components/compositions/stats-card-sparkline";

import { layout } from "../../utils/events";
jest.useFakeTimers();

const METRIC = { label: "Revenue", value: "$12,480", change: "-3%", trend: "down" as const, caption: "vs last week", data: [4, 8, 6, 9, 3] };

describe("StatsCardSparkline", () => {
	test("shows the label, the value and the change", async () => {
		await render(<StatsCardSparkline {...METRIC} />);

		for (const text of [METRIC.label, METRIC.value, METRIC.change]) {
			expect(screen.getByText(text, { includeHiddenElements: true })).toBeOnTheScreen();
		}
	});

	test("is read as one sentence: 'Revenue: $12,480, -3%, vs last week'", async () => {
		await render(<StatsCardSparkline {...METRIC} />);

		expect(screen.getByLabelText("Revenue: $12,480, -3%, vs last week")).toBeOnTheScreen();
	});

	test("pressable, the whole card is that one button", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<StatsCardSparkline {...METRIC} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Revenue: $12,480, -3%, vs last week" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		// The inner block keeps its label but stops being an element: screen readers meet one stop.
		expect(screen.getAllByLabelText("Revenue: $12,480, -3%, vs last week").filter((node) => node.props.accessible === true)).toHaveLength(1);
	});

	test("without a change, only the label and the value are read", async () => {
		await render(<StatsCardSparkline {...METRIC} change={undefined} caption={undefined} />);

		expect(screen.getByLabelText("Revenue: $12,480")).toBeOnTheScreen();
	});

	test("draws the line once the card knows its width", async () => {
		await render(<StatsCardSparkline {...METRIC} />);
		const paths = () => screen.container.queryAll((node) => node.type === "RNSVGPath");

		const box = screen.container.queryAll((node) => typeof node.props.onLayout === "function").at(-1)!;
		await layout(box, { width: 200, height: 48 });

		expect(paths().length).toBeGreaterThan(0);
		expect(paths().some((path) => String(path.props.d).startsWith("M"))).toBe(true);
	});
});
