import { useEffect, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
	cancelAnimation,
	Easing,
	interpolate,
	makeMutable,
	useAnimatedStyle,
	useReducedMotion,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

// One clock for every skeleton on screen, so shimmers and pulses stay in sync.
const clock = makeMutable(0);
let subscribers = 0;

function subscribe() {
	subscribers++;
	if (subscribers === 1) {
		clock.set(0);
		clock.set(
			withRepeat(
				withTiming(1, {
					duration: 1200,
					easing: Easing.inOut(Easing.ease),
				}),
				-1,
				false,
			),
		);
	}
	return () => {
		subscribers--;
		if (subscribers === 0) cancelAnimation(clock);
	};
}

/**
 * Starts the shared clock while the placeholder is shown and animated. Returns the animation
 * to render: Reduce Motion forces `none`. Shared by every styling variant.
 */
export function useSkeleton(
	animation: SkeletonAnimation,
	active: boolean,
): SkeletonAnimation {
	const reduceMotion = useReducedMotion();
	const effective: SkeletonAnimation = reduceMotion ? "none" : animation;
	const animated = active && effective !== "none";

	useEffect(() => (animated ? subscribe() : undefined), [animated]);

	return effective;
}

/** The `pulse` animation: the placeholder fades out and back. Only called by a pulsing placeholder. */
export function usePulseStyle() {
	return useAnimatedStyle(() => ({
		opacity: interpolate(clock.get(), [0, 0.5, 1], [1, 0.5, 1]),
	}));
}

/**
 * The `shimmer` animation: a highlight band crosses the placeholder from left to right.
 * `onLayout` goes on a view that fills the placeholder, to measure its width.
 */
export function useShimmer() {
	const [width, setWidth] = useState(0);

	const style = useAnimatedStyle(() => ({
		width: width * 0.6,
		transform: [
			{
				translateX: interpolate(clock.get(), [0, 1], [-width * 0.6, width]),
			},
		],
	}));

	const onLayout = (event: LayoutChangeEvent) => {
		const next = event.nativeEvent.layout.width;
		setWidth((previous) => (previous === next ? previous : next));
	};

	return { style, onLayout };
}
