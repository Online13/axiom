import { View } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { GestureDetector } from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";

import { Slider } from "@/components/ui/slider";
import { useSlider, type SliderValue, type UseSliderOptions } from "@/components/ui/slider/use-slider";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const adjust = (name: string, actionName: "increment" | "decrement") =>
	fireEvent(screen.getByRole("adjustable", { name }), "accessibilityAction", { nativeEvent: { actionName } });

describe("Slider", () => {
	test("each thumb is adjustable, named after what it controls, with its range and value", async () => {
		await render(<Slider accessibilityLabel="Volume" defaultValue={30} />);

		const thumb = screen.getByRole("adjustable", { name: "Volume" });
		expect(thumb).toHaveAccessibilityValue({ min: 0, max: 100, now: 30 });
	});

	test("announces the value as text when asked", async () => {
		await render(
			<Slider accessibilityLabel="Distance" defaultValue={5} max={50} getAccessibilityValue={(v) => `${v} kilometers`} />,
		);

		expect(screen.getByRole("adjustable", { name: "Distance" })).toHaveAccessibilityValue({ text: "5 kilometers" });
	});

	describe("screen reader swipes", () => {
		test("change the value by one step and complete at once", async () => {
			const onValueChange = jest.fn();
			const onSlidingComplete = jest.fn();
			await render(
				<Slider
					accessibilityLabel="Volume"
					defaultValue={30}
					step={10}
					onValueChange={onValueChange}
					onSlidingComplete={onSlidingComplete}
				/>,
			);

			await adjust("Volume", "increment");
			expect(onValueChange).toHaveBeenLastCalledWith(40);
			expect(onSlidingComplete).toHaveBeenLastCalledWith(40);

			await adjust("Volume", "decrement");
			await adjust("Volume", "decrement");
			expect(onValueChange).toHaveBeenLastCalledWith(20);
			expect(screen.getByRole("adjustable", { name: "Volume" })).toHaveAccessibilityValue({ now: 20 });
		});

		test("stop at min and max", async () => {
			const onValueChange = jest.fn();
			await render(<Slider accessibilityLabel="Volume" defaultValue={95} step={10} onValueChange={onValueChange} />);

			await adjust("Volume", "increment");
			expect(onValueChange).toHaveBeenLastCalledWith(100);
			await adjust("Volume", "increment");
			expect(screen.getByRole("adjustable", { name: "Volume" })).toHaveAccessibilityValue({ now: 100 });
		});

		test("a continuous slider moves by a hundredth of its range", async () => {
			const onValueChange = jest.fn();
			await render(<Slider accessibilityLabel="Opacity" min={0} max={1} step={0} defaultValue={0.5} onValueChange={onValueChange} />);

			await adjust("Opacity", "increment");

			expect(onValueChange.mock.calls[0][0]).toBeCloseTo(0.51);
		});

		test("are ignored when disabled", async () => {
			const onValueChange = jest.fn();
			await render(<Slider accessibilityLabel="Volume" disabled onValueChange={onValueChange} />);

			await adjust("Volume", "increment");

			expect(onValueChange).not.toHaveBeenCalled();
			expect(screen.getByRole("adjustable", { name: "Volume" })).toBeDisabled();
		});
	});

	describe("range", () => {
		test("has a minimum and a maximum thumb", async () => {
			await render(<Slider accessibilityLabel="Price" defaultValue={[20, 80]} />);

			expect(screen.getByRole("adjustable", { name: "Price, minimum" })).toHaveAccessibilityValue({ now: 20 });
			expect(screen.getByRole("adjustable", { name: "Price, maximum" })).toHaveAccessibilityValue({ now: 80 });
		});

		test("a thumb never passes the other, minus minRange", async () => {
			const onValueChange = jest.fn();
			await render(
				<Slider accessibilityLabel="Price" defaultValue={[40, 60]} step={10} minRange={20} onValueChange={onValueChange} />,
			);

			await adjust("Price, minimum", "increment");
			expect(onValueChange).toHaveBeenLastCalledWith([40, 60]);

			await adjust("Price, maximum", "decrement");
			expect(onValueChange).toHaveBeenLastCalledWith([40, 60]);
		});
	});

	test("controlled: the thumb shows value", async () => {
		const view = await render(<Slider accessibilityLabel="Volume" value={10} />);

		await adjust("Volume", "increment");
		expect(screen.getByRole("adjustable", { name: "Volume" })).toHaveAccessibilityValue({ now: 10 });

		await view.rerender(<Slider accessibilityLabel="Volume" value={60} />);
		expect(screen.getByRole("adjustable", { name: "Volume" })).toHaveAccessibilityValue({ now: 60 });
	});
});

describe("useSlider: gestures", () => {
	type Control = ReturnType<typeof useSlider>;

	/** Runs the hook with its gestures attached, as Slider does: gestures fire only once mounted. */
	function Harness<T extends SliderValue>({ onRender, ...options }: UseSliderOptions<T> & { onRender: (c: Control) => void }) {
		const slider = useSlider(options);
		onRender(slider as Control);
		return (
			<GestureDetector gesture={slider.gestures.tap}>
				<View>
					{slider.values.map((_, index) => (
						<GestureDetector key={index} gesture={slider.gestures.thumbs[index]}>
							<View />
						</GestureDetector>
					))}
				</View>
			</GestureDetector>
		);
	}

	// A 200pt track: 1pt is half a unit of a 0–100 slider.
	async function setup<T extends SliderValue>(options: UseSliderOptions<T> = {}) {
		const onValueChange = jest.fn();
		const onSlidingComplete = jest.fn();
		let slider!: Control;
		await render(
			<Harness
				onValueChange={onValueChange}
				onSlidingComplete={onSlidingComplete}
				{...options}
				onRender={(s) => (slider = s)}
			/>,
		);
		await act(() => slider.onTrackLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 44 } } } as never));
		return {
			onValueChange,
			onSlidingComplete,
			values: () => slider.values,
			/** A tap on the track at `x`. */
			tap: async (x: number) => {
				fireGestureHandler(slider.gestures.tap, [{ x }, { x }]);
				await advance(0);
			},
			/** Drags thumb `index` by `dx` points, through each point in `path`, then lets go. */
			drag: async (index: number, ...path: number[]) => {
				fireGestureHandler(slider.gestures.thumbs[index], [
					{ translationX: 0 },
					...path.map((translationX) => ({ translationX })),
					{ translationX: path[path.length - 1] },
				]);
				await advance(200);
			},
		};
	}

	test("a tap moves the thumb there, snapped to the step, and completes", async () => {
		const { tap, onSlidingComplete, values } = await setup({ step: 10 });

		await tap(130);

		expect(onSlidingComplete).toHaveBeenCalledWith(70);
		expect(values()).toEqual([70]);
	});

	test("dragging reports each new stepped value, then completes once on release", async () => {
		const { drag, onValueChange, onSlidingComplete } = await setup({ step: 10, defaultValue: 0 });

		await drag(0, 20, 22, 60);

		expect(onValueChange.mock.calls).toEqual([[10], [30]]);
		expect(onSlidingComplete).toHaveBeenCalledTimes(1);
		expect(onSlidingComplete).toHaveBeenCalledWith(30);
	});

	test("never goes past the ends of the track", async () => {
		const { drag, onSlidingComplete } = await setup({ defaultValue: 50 });

		await drag(0, 500);
		expect(onSlidingComplete).toHaveBeenLastCalledWith(100);

		await drag(0, -900);
		expect(onSlidingComplete).toHaveBeenLastCalledWith(0);
	});

	test("with few steps, plays a haptic on each step", async () => {
		const { drag } = await setup({ step: 10, defaultValue: 0 });

		await drag(0, 20, 40, 60);

		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(3);
	});

	test("with too many steps to feel, plays it only at the ends", async () => {
		const { drag } = await setup({ step: 1, max: 1000, defaultValue: 500 });

		// 500 → 600 → 700 → 800: steps, but no haptic.
		await drag(0, 20, 40, 60);
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();

		await drag(0, 400);
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("range: the low thumb stops before the high one, minus minRange", async () => {
		const { drag, onSlidingComplete } = await setup({ defaultValue: [20, 60], step: 10, minRange: 10 });

		await drag(0, 200);

		expect(onSlidingComplete).toHaveBeenLastCalledWith([50, 60]);
	});

	test("range: a tap moves the nearest thumb", async () => {
		const { tap, values } = await setup({ defaultValue: [20, 80], step: 10 });

		await tap(140);
		expect(values()).toEqual([20, 70]);

		await tap(20);
		expect(values()).toEqual([10, 70]);
	});
});
