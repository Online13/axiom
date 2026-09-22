import { useState, type ReactNode, type Ref } from "react";
import {
	Pressable,
	type Insets,
	type LayoutChangeEvent,
	type PressableProps,
	type StyleProp,
	type View,
	type ViewStyle,
} from "react-native";

import { metrics } from "@/theme/tokens";

export type TappableState = { pressed: boolean };

export type TappableProps = Omit<PressableProps, "children" | "style"> & {
	/** Computes `hitSlop` from `touchTarget` when `hitSlop` isn't set. */
	minTouchTarget?: boolean;
	/**
	 * Shrinks the target to this scale while it is held, e.g. `metrics.pressScale`.
	 * Left out, nothing moves: only button-like components opt in, because rows,
	 * cells and tab items look wrong when they shrink. A `transform` coming from
	 * `style` wins over it.
	 */
	pressScale?: number;
	children?: ReactNode | ((state: TappableState) => ReactNode);
	style?:
		StyleProp<ViewStyle> | ((state: TappableState) => StyleProp<ViewStyle>);
	ref?: Ref<View>;
};

type Size = { width: number; height: number };

/**
 * Headless press primitive: pressed state, disabled state, accessibility role and a minimum touch target.
 * It picks no colors: the component that renders it styles every state. The one thing it draws is the
 * press itself, and only when asked through `pressScale`.
 */
export function Tappable({
	disabled: disabledProp,
	hitSlop,
	minTouchTarget = true,
	pressScale,
	delayLongPress = 500,
	accessibilityRole = "button",
	accessibilityState,
	onLayout,
	children,
	style,
	...props
}: TappableProps) {
	const disabled = disabledProp === true;
	const [size, setSize] = useState<Size | null>(null);

	const handleLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setSize((previous) =>
			previous?.width === width && previous.height === height
				? previous
				: { width, height },
		);
		onLayout?.(event);
	};

	const computedHitSlop =
		hitSlop ?? (minTouchTarget && size ? touchTargetSlop(size) : undefined);

	// The scale goes first so a `transform` of its own in `style` replaces it rather than fighting it.
	const resolveStyle = (pressed: boolean): StyleProp<ViewStyle> => {
		const resolved = typeof style === "function" ? style({ pressed }) : style;
		return pressed && pressScale !== undefined
			? [{ transform: [{ scale: pressScale }] }, resolved]
			: resolved;
	};

	return (
		<Pressable
			{...props}
			disabled={disabled}
			hitSlop={computedHitSlop}
			delayLongPress={delayLongPress}
			accessibilityRole={accessibilityRole}
			accessibilityState={{ ...accessibilityState, disabled }}
			onLayout={handleLayout}
			style={({ pressed }) => resolveStyle(pressed && !disabled)}
		>
			{typeof children === "function"
				? ({ pressed }) => children({ pressed: pressed && !disabled })
				: children}
		</Pressable>
	);
}

/** Extra touch area on each axis where `size` is smaller than the touch target. */
export function touchTargetSlop(
	{ width, height }: Size,
	target: number = metrics.touchTarget,
): Insets {
	const horizontal = Math.max(0, (target - width) / 2);
	const vertical = Math.max(0, (target - height) / 2);
	return {
		top: vertical,
		bottom: vertical,
		left: horizontal,
		right: horizontal,
	};
}
