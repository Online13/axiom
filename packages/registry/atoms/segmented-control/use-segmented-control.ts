import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { haptic, type HapticKind } from "@/components/core/haptics";
import type { IconName } from "@/components/ui/icons";
import { useControllableState } from "@/hooks/use-controllable-state";

export type SegmentOption = {
	value: string;
	label?: string;
	icon?: IconName;
	accessibilityLabel?: string;
	disabled?: boolean;
};

export type UseSegmentedControlOptions = {
	/** A string is used as both value and label. */
	options: (string | SegmentOption)[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	/** Equal segments filling the track. Positions then come from the track width, not from each segment. */
	fullWidth?: boolean;
	/** Padding of the track around the segments. */
	inset?: number;
	/** Played when the user changes the segment, by tap or by drag. `false` turns it off. */
	haptic?: HapticKind | false;
};

type Layout = { x: number; width: number };

const TIMING = { duration: 220 };

/** A stable function that always calls the latest `fn`, for callbacks kept by gestures. */
function useLatestCallback<A extends unknown[], R>(fn: (...args: A) => R) {
	const latest = useRef(fn);
	useLayoutEffect(() => {
		latest.current = fn;
	});
	return useCallback((...args: A) => latest.current(...args), []);
}

/** Selection, segment measurement and the sliding, draggable indicator. Shared by every styling variant. */
export function useSegmentedControl({
	options,
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	fullWidth = true,
	inset = 0,
	haptic: hapticKind = "selection",
}: UseSegmentedControlOptions) {
	const segments = options.map((option) =>
		typeof option === "string" ? { value: option, label: option } : option,
	);
	const [selected, select] = useControllableState({
		value,
		defaultValue: defaultValue ?? segments[0]?.value ?? "",
		onChange: onValueChange,
	});

	const [measuredLayouts, setLayouts] = useState<(Layout | undefined)[]>([]);
	const [trackWidth, setTrackWidth] = useState(0);
	const selectedIndex = segments.findIndex(
		(segment) => segment.value === selected,
	);

	// Equal segments: computed from the track, which always has its final width when it reports it.
	const segmentWidth = (trackWidth - inset * 2) / segments.length;
	const layouts = fullWidth
		? trackWidth > 0
			? segments.map((_, i) => ({
					x: inset + i * segmentWidth,
					width: segmentWidth,
				}))
			: []
		: measuredLayouts;
	const measured =
		layouts.length === segments.length && layouts.every(Boolean);
	const layoutsKey = layouts
		.map((layout) => (layout ? `${layout.x}:${layout.width}` : ""))
		.join(",");

	const indicatorX = useSharedValue(0);
	const indicatorWidth = useSharedValue(0);
	const positions = useSharedValue<Layout[]>([]);
	const visible = useSharedValue(0);

	useEffect(() => {
		if (!measured) return;
		positions.set(layouts as Layout[]);
		const target = layouts[selectedIndex];
		if (!target) {
			visible.set(0);
			return;
		}
		// The first placement doesn't animate.
		const animate = visible.get() === 1;
		indicatorX.set(animate ? withTiming(target.x, TIMING) : target.x);
		indicatorWidth.set(
			animate ? withTiming(target.width, TIMING) : target.width,
		);
		visible.set(1);
		// `layoutsKey` stands for `layouts`, a new array on every render in full width.
	}, [
		measured,
		layoutsKey,
		selectedIndex,
		indicatorX,
		indicatorWidth,
		positions,
		visible,
	]);

	const onTrackLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		setTrackWidth((previous) => (previous === width ? previous : width));
	};

	const onSegmentLayout = (index: number) => (event: LayoutChangeEvent) => {
		if (fullWidth) return;
		const { x, width } = event.nativeEvent.layout;
		setLayouts((previous) => {
			if (previous[index]?.x === x && previous[index]?.width === width)
				return previous;
			const next = [...previous];
			next[index] = { x, width };
			return next.length > segments.length
				? next.slice(0, segments.length)
				: next;
		});
	};

	const selectIndex = (index: number) => {
		const segment = segments[index];
		if (!segment || segment.disabled) return;
		if (hapticKind && segment.value !== selected) haptic(hapticKind);
		select(segment.value);
	};

	// The gesture runs on the UI thread and keeps its first callbacks: it selects through a stable callback to the latest render.
	const drop = useLatestCallback(selectIndex);

	// Dragging the indicator: it follows the finger, then lands on the nearest enabled segment.
	const enabled = segments.map((segment) => !segment.disabled && !disabled);
	const enabledKey = enabled.join(",");
	const gesture = useMemo(
		() =>
			Gesture.Pan()
				.enabled(!disabled)
				.activeOffsetX([-6, 6])
				.onUpdate((event) => {
					const layout = positions.get();
					if (!layout.length) return;
					const first = layout[0];
					const last = layout[layout.length - 1];
					const x = event.x - indicatorWidth.get() / 2;
					indicatorX.set(
						Math.min(
							Math.max(x, first.x),
							last.x + last.width - indicatorWidth.get(),
						),
					);
				})
				.onEnd(() => {
					const layout = positions.get();
					const center = indicatorX.get() + indicatorWidth.get() / 2;
					let nearest = -1;
					layout.forEach((segment, i) => {
						if (!enabled[i]) return;
						const distance = Math.abs(
							segment.x + segment.width / 2 - center,
						);
						if (
							nearest === -1 ||
							distance <
								Math.abs(
									layout[nearest].x +
										layout[nearest].width / 2 -
										center,
								)
						) {
							nearest = i;
						}
					});
					if (nearest === -1) return;
					indicatorX.set(withTiming(layout[nearest].x, TIMING));
					indicatorWidth.set(withTiming(layout[nearest].width, TIMING));
					scheduleOnRN(drop, nearest);
				}),
		// Rebuilt when the enabled segments change; `enabledKey` stands for `enabled`.
		[disabled, enabledKey, drop],
	);

	const indicatorStyle = useAnimatedStyle(() => ({
		opacity: visible.get(),
		width: indicatorWidth.get(),
		transform: [{ translateX: indicatorX.get() }],
	}));

	return {
		segments,
		selected,
		selectIndex,
		onTrackLayout,
		onSegmentLayout,
		gesture,
		indicatorStyle,
	};
}
