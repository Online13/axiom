import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Tappable, touchTargetSlop } from "@/components/core/tappable";

import { layout, pressIn, pressOut } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

describe("Tappable", () => {
	test("is a button by default and calls onPress", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Tappable onPress={onPress} accessibilityLabel="Open">
				<Text>Open</Text>
			</Tappable>,
		);

		await user.press(screen.getByRole("button", { name: "Open" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("keeps a role the caller sets", async () => {
		await render(<Tappable accessibilityRole="link" accessibilityLabel="Terms" />);

		expect(screen.getByRole("link", { name: "Terms" })).toBeOnTheScreen();
	});

	test("disabled: ignores presses and long presses, and says so to screen readers", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onLongPress = jest.fn();
		await render(
			<Tappable
				disabled
				onPress={onPress}
				onLongPress={onLongPress}
				accessibilityLabel="Send"
			/>,
		);

		const target = screen.getByRole("button", { name: "Send" });
		await user.press(target);
		await user.longPress(target);

		expect(onPress).not.toHaveBeenCalled();
		expect(onLongPress).not.toHaveBeenCalled();
		expect(target).toBeDisabled();
	});

	test("merges its disabled state into the caller's accessibilityState", async () => {
		await render(
			<Tappable
				accessibilityRole="checkbox"
				accessibilityState={{ checked: true }}
				accessibilityLabel="Agree"
			/>,
		);

		const target = screen.getByRole("checkbox", { name: "Agree" });
		expect(target).toBeChecked();
		expect(target).toBeEnabled();
	});

	test("hands the pressed state to its children and its style while held", async () => {
		const style = jest.fn(({ pressed }: { pressed: boolean }) => ({
			opacity: pressed ? 0.5 : 1,
		}));
		await render(
			<Tappable style={style} accessibilityLabel="Hold">
				{({ pressed }) => <Text>{pressed ? "pressed" : "idle"}</Text>}
			</Tappable>,
		);
		const target = screen.getByRole("button", { name: "Hold" });

		expect(screen.getByText("idle")).toBeOnTheScreen();
		expect(target).toHaveStyle({ opacity: 1 });

		await pressIn(target);
		expect(screen.getByText("pressed")).toBeOnTheScreen();
		expect(target).toHaveStyle({ opacity: 0.5 });

		await pressOut(target);
		expect(screen.getByText("idle")).toBeOnTheScreen();
		expect(target).toHaveStyle({ opacity: 1 });
	});

	test("never reports pressed while disabled", async () => {
		await render(
			<Tappable disabled pressScale={0.9} accessibilityLabel="Hold">
				{({ pressed }) => <Text>{pressed ? "pressed" : "idle"}</Text>}
			</Tappable>,
		);

		await pressIn(screen.getByRole("button", { name: "Hold" }));

		expect(screen.getByText("idle")).toBeOnTheScreen();
		expect(screen.getByRole("button", { name: "Hold" })).not.toHaveStyle({
			transform: [{ scale: 0.9 }],
		});
	});

	test("pressScale shrinks the target only while held", async () => {
		await render(<Tappable pressScale={0.97} accessibilityLabel="Buy" />);
		const target = screen.getByRole("button", { name: "Buy" });

		expect(target).not.toHaveStyle({ transform: [{ scale: 0.97 }] });
		await pressIn(target);
		expect(target).toHaveStyle({ transform: [{ scale: 0.97 }] });
		await pressOut(target);
		expect(target).not.toHaveStyle({ transform: [{ scale: 0.97 }] });
	});

	test("a transform in the caller's style wins over pressScale", async () => {
		await render(
			<Tappable
				pressScale={0.97}
				style={{ transform: [{ rotate: "45deg" }] }}
				accessibilityLabel="Spin"
			/>,
		);
		const target = screen.getByRole("button", { name: "Spin" });

		await pressIn(target);

		expect(target).toHaveStyle({ transform: [{ rotate: "45deg" }] });
	});

	test("plays its haptic on touch, before the release", async () => {
		const onPressIn = jest.fn();
		await render(
			<Tappable haptic="medium" onPressIn={onPressIn} accessibilityLabel="Like" />,
		);

		await pressIn(screen.getByRole("button", { name: "Like" }));

		expect(Haptics.impactAsync).toHaveBeenCalledWith(
			Haptics.ImpactFeedbackStyle.Medium,
		);
		expect(onPressIn).toHaveBeenCalledTimes(1);
	});

	test("plays no haptic unless asked", async () => {
		const user = userEvent.setup();
		await render(<Tappable accessibilityLabel="Quiet" />);

		await user.press(screen.getByRole("button", { name: "Quiet" }));

		expect(Haptics.impactAsync).not.toHaveBeenCalled();
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});

	test("long press fires after delayLongPress, and not on a short press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onLongPress = jest.fn();
		await render(
			<Tappable onPress={onPress} onLongPress={onLongPress} accessibilityLabel="Row" />,
		);
		const target = screen.getByRole("button", { name: "Row" });

		await user.press(target);
		expect(onLongPress).not.toHaveBeenCalled();
		expect(onPress).toHaveBeenCalledTimes(1);

		await user.longPress(target, { duration: 600 });
		expect(onLongPress).toHaveBeenCalledTimes(1);
	});

	describe("minimum touch target", () => {
		test("grows the hit area of a small target to 44pt on each axis", async () => {
			await render(<Tappable accessibilityLabel="Close" />);
			const target = screen.getByRole("button", { name: "Close" });

			await layout(target, { width: 24, height: 30 });

			expect(target.props.hitSlop).toEqual({ top: 7, bottom: 7, left: 10, right: 10 });
		});

		test("adds nothing to a target that is already large enough", async () => {
			await render(<Tappable accessibilityLabel="Row" />);
			const target = screen.getByRole("button", { name: "Row" });

			await layout(target, { width: 24, height: 24 });
			await layout(target, { width: 320, height: 56 });

			expect(target.props.hitSlop).toBeUndefined();
		});

		test("an explicit hitSlop wins, and minTouchTarget={false} turns it off", async () => {
			await render(
				<>
					<Tappable hitSlop={4} accessibilityLabel="Explicit" />
					<Tappable minTouchTarget={false} accessibilityLabel="Off" />
				</>,
			);
			const explicit = screen.getByRole("button", { name: "Explicit" });
			const off = screen.getByRole("button", { name: "Off" });

			await layout(explicit, { width: 10, height: 10 });
			await layout(off, { width: 10, height: 10 });

			expect(explicit.props.hitSlop).toBe(4);
			expect(off.props.hitSlop).toBeUndefined();
		});

		test("still forwards onLayout to the caller", async () => {
			const onLayout = jest.fn();
			await render(<Tappable onLayout={onLayout} accessibilityLabel="Box" />);

			await layout(screen.getByRole("button", { name: "Box" }), { width: 10, height: 10 });

			expect(onLayout).toHaveBeenCalledWith(
				expect.objectContaining({
					nativeEvent: { layout: expect.objectContaining({ width: 10, height: 10 }) },
				}),
			);
		});
	});
});

describe("touchTargetSlop", () => {
	test("splits the missing size evenly on both sides", () => {
		expect(touchTargetSlop({ width: 20, height: 40 })).toEqual({
			top: 2,
			bottom: 2,
			left: 12,
			right: 12,
		});
	});

	test("never returns a negative inset", () => {
		expect(touchTargetSlop({ width: 100, height: 60 })).toEqual({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		});
	});

	test("accepts another target size", () => {
		expect(touchTargetSlop({ width: 40, height: 40 }, 48)).toEqual({
			top: 4,
			bottom: 4,
			left: 4,
			right: 4,
		});
	});
});
