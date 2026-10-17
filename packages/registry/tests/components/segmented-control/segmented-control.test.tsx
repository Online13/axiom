import { View } from "react-native";
import { act, render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { GestureDetector } from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";

import { SegmentedControl } from "@/components/ui/segmented-control";
import {
	useSegmentedControl,
	type UseSegmentedControlOptions,
} from "@/components/ui/segmented-control/use-segmented-control";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const segment = (name: string) => screen.getByRole("tab", { name });

describe("SegmentedControl", () => {
	test("is a tablist with one selected tab, the first by default", async () => {
		await render(<SegmentedControl options={["Day", "Week", "Month"]} testID="control" />);

		expect(screen.getByTestId("control")).toHaveProp("accessibilityRole", "tablist");
		expect(segment("Day")).toBeSelected();
		expect(segment("Week")).not.toBeSelected();
	});

	test("pressing a segment selects it, reports it and plays a selection haptic", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<SegmentedControl options={["Day", "Week", "Month"]} onValueChange={onValueChange} />);

		await user.press(segment("Month"));

		expect(segment("Month")).toBeSelected();
		expect(segment("Day")).not.toBeSelected();
		expect(onValueChange).toHaveBeenCalledWith("Month");
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("pressing the selected segment again is not a change", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<SegmentedControl options={["Day", "Week"]} onValueChange={onValueChange} />);

		await user.press(segment("Day"));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});

	test("options can be objects with their own value, icon and accessible name", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(
			<SegmentedControl
				options={[
					{ value: "list", icon: "file", accessibilityLabel: "List view" },
					{ value: "map", icon: "location", accessibilityLabel: "Map view" },
				]}
				onValueChange={onValueChange}
			/>,
		);

		await user.press(segment("Map view"));

		expect(onValueChange).toHaveBeenCalledWith("map");
	});

	test("a disabled segment, or a disabled control, can't be selected", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		const view = await render(
			<SegmentedControl
				options={["Day", { value: "Week", label: "Week", disabled: true }]}
				onValueChange={onValueChange}
			/>,
		);

		await user.press(segment("Week"));
		expect(segment("Week")).toBeDisabled();

		await view.rerender(<SegmentedControl options={["Day", "Week"]} disabled onValueChange={onValueChange} />);
		await user.press(segment("Week"));

		expect(onValueChange).not.toHaveBeenCalled();
	});

	test("controlled: the selection follows value", async () => {
		const user = userEvent.setup();
		const view = await render(<SegmentedControl options={["Day", "Week"]} value="Day" />);

		await user.press(segment("Week"));
		expect(segment("Day")).toBeSelected();

		await view.rerender(<SegmentedControl options={["Day", "Week"]} value="Week" />);
		expect(segment("Week")).toBeSelected();
	});

	test("haptic={false} selects silently", async () => {
		const user = userEvent.setup();
		await render(<SegmentedControl options={["Day", "Week"]} haptic={false} />);

		await user.press(segment("Week"));

		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});
});

describe("useSegmentedControl: dragging the indicator", () => {
	type Control = ReturnType<typeof useSegmentedControl>;

	/** Runs the hook with its gesture attached, as the component does: gestures fire only once mounted. */
	function Harness({ onRender, ...options }: UseSegmentedControlOptions & { onRender: (c: Control) => void }) {
		const control = useSegmentedControl(options);
		onRender(control);
		return (
			<GestureDetector gesture={control.gesture}>
				<View />
			</GestureDetector>
		);
	}

	// A 302pt track with a 2pt inset: three segments of 99.33pt, centered at 51.7, 151 and 250.3.
	async function setup(options: Partial<UseSegmentedControlOptions> = {}) {
		const onValueChange = jest.fn();
		let control!: Control;
		await render(
			<Harness
				options={["a", "b", "c"]}
				onValueChange={onValueChange}
				inset={2}
				{...options}
				onRender={(c) => (control = c)}
			/>,
		);
		await act(() =>
			control.onTrackLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 302, height: 32 } } } as never),
		);
		/** Grabs the indicator, moves it to `x` and lets go. */
		const drag = async (x: number) => {
			fireGestureHandler(control.gesture, [{ x: 50 }, { x }, { x }]);
			await advance(0);
		};
		return { onValueChange, drag, selected: () => control.selected };
	}

	test("releasing over a segment selects it", async () => {
		const { drag, onValueChange, selected } = await setup();

		await drag(250);

		expect(onValueChange).toHaveBeenCalledWith("c");
		expect(selected()).toBe("c");
	});

	test("snaps to the nearest segment, never past the ends", async () => {
		const { drag, selected } = await setup();

		await drag(130);
		expect(selected()).toBe("b");

		await drag(-400);
		expect(selected()).toBe("a");

		await drag(5000);
		expect(selected()).toBe("c");
	});

	test("skips a disabled segment and lands on the nearest enabled one", async () => {
		const { drag, selected } = await setup({
			options: ["a", "b", { value: "c", label: "c", disabled: true }],
		});

		await drag(250);

		expect(selected()).toBe("b");
	});

	test("plays the haptic when a drag changes the segment, not when it ends where it began", async () => {
		const { drag, onValueChange } = await setup();

		await drag(40);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();

		await drag(160);
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("a disabled control can't be dragged", async () => {
		const { drag, onValueChange } = await setup({ disabled: true });

		await drag(250);

		expect(onValueChange).not.toHaveBeenCalled();
	});
});
