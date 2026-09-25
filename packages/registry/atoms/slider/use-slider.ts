import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { AccessibilityActionEvent, LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { useControllableState } from "@/hooks/use-controllable-state";

/** A number for one thumb, a tuple for a range with two thumbs. */
export type SliderValue = number | [number, number];

export type UseSliderOptions<T extends SliderValue> = {
	value?: T;
	defaultValue?: T;
	/** Called while dragging, on each new stepped value. Keep it cheap. */
	onValueChange?: (value: T) => void;
	/** Called once when the finger lifts, or after a tap or an accessibility action. */
	onSlidingComplete?: (value: T) => void;
	min?: number;
	max?: number;
	/** Increment the value snaps to. `0` means continuous. */
	step?: number;
	/** Smallest gap between the two thumbs of a range. */
	minRange?: number;
	disabled?: boolean;
	/** Text announced for a value, such as "5 kilometers". */
	getAccessibilityValue?: (value: number) => string;
	/**
	 * Played while dragging or on a tap: on each step when the steps are drawn, otherwise when a thumb
	 * reaches `min` or `max`. `false` turns it off.
	 */
	haptic?: HapticKind | false;
};

const SETTLE = { duration: 120 };

/** Value math, drag and tap gestures, and thumb positions. Shared by every styling variant. */
export function useSlider<T extends SliderValue>({
	value,
	defaultValue,
	onValueChange,
	onSlidingComplete,
	min = 0,
	max = 100,
	step = 1,
	minRange = 0,
	disabled = false,
	getAccessibilityValue,
	haptic: hapticKind = "selection",
}: UseSliderOptions<T>) {
	const [current, setCurrent] = useControllableState<T>({
		value,
		defaultValue: defaultValue ?? (min as T),
		onChange: onValueChange,
	});

	const range = Array.isArray(current);
	const values = range ? (current as [number, number]) : [current as number];
	const valuesKey = values.join(",");

	const [width, setWidth] = useState(0);
	const trackWidth = useSharedValue(0);
	const thumbs = useSharedValue<number[]>([]);
	const emitted = useSharedValue<number[]>(values);
	const active = useSharedValue(-1);
	const start = useSharedValue(0);

	const toPixels = (v: number) =>
		max === min ? 0 : ((v - min) / (max - min)) * width;

	// Follows the value when nobody is dragging: the first layout, a controlled change, an accessibility action.
	useEffect(() => {
		if (!width || active.value !== -1) return;
		thumbs.value = values.map(toPixels);
		emitted.value = values;
		trackWidth.value = width;
		// `valuesKey` stands for `values`.
	}, [valuesKey, width, min, max]);

	const ticks =
		step > 0 && (max - min) / step <= 50
			? Math.floor((max - min) / step) + 1
			: 0;

	// One haptic per step when the steps are drawn: past 50 they would buzz. Otherwise only at the ends.
	const stepHaptic = (v: number) => {
		if (hapticKind && (ticks > 0 || v === min || v === max)) haptic(hapticKind);
	};

	// Gestures run on the UI thread and keep their first callbacks: they reach the latest render through a ref.
	const latest = useRef({ setCurrent, onSlidingComplete, range, stepHaptic });
	useLayoutEffect(() => {
		latest.current = { setCurrent, onSlidingComplete, range, stepHaptic };
	});
	const emit = useCallback((next: number[]) => {
		const { setCurrent: set, range: isRange } = latest.current;
		set((isRange ? [next[0], next[1]] : next[0]) as T);
	}, []);
	// A new stepped value from a gesture. Accessibility actions skip it: the screen reader already speaks the value.
	const drag = useCallback((next: number[], index: number) => {
		latest.current.stepHaptic(next[index]);
		emit(next);
	}, [emit]);
	const complete = useCallback((next: number[]) => {
		const { onSlidingComplete: done, range: isRange } = latest.current;
		done?.((isRange ? [next[0], next[1]] : next[0]) as T);
	}, []);

	const gestures = useMemo(() => {
		const toValue = (px: number, total: number) => {
			"worklet";
			if (total <= 0) return min;
			const raw = min + (px / total) * (max - min);
			const stepped =
				step > 0 ? min + Math.round((raw - min) / step) * step : raw;
			return Math.min(Math.max(stepped, min), max);
		};

		// Moves thumb `index` to `px`, keeping `minRange` between thumbs, and emits a new stepped value.
		const moveTo = (index: number, px: number) => {
			"worklet";
			const total = trackWidth.value;
			const gap = max === min ? 0 : (minRange / (max - min)) * total;
			const next = [...thumbs.value];
			let clamped = Math.min(Math.max(px, 0), total);
			if (next.length === 2) {
				clamped =
					index === 0
						? Math.min(clamped, next[1] - gap)
						: Math.max(clamped, next[0] + gap);
			}
			next[index] = clamped;
			thumbs.value = next;

			const stepped = next.map((position) => toValue(position, total));
			if (stepped.some((v, i) => v !== emitted.value[i])) {
				emitted.value = stepped;
				scheduleOnRN(drag, stepped, index);
			}
		};

		// Lands the thumbs on their stepped positions.
		const settle = () => {
			"worklet";
			const total = trackWidth.value;
			thumbs.value = withTiming(
				emitted.value.map((v) =>
					max === min ? 0 : ((v - min) / (max - min)) * total,
				),
				SETTLE,
			);
			scheduleOnRN(complete, emitted.value);
		};

		const thumb = (index: number) =>
			Gesture.Pan()
				.enabled(!disabled)
				// 20pt thumb, 44pt touch area.
				.hitSlop({ horizontal: 12, vertical: 12 })
				.onBegin(() => {
					active.value = index;
					start.value = thumbs.value[index] ?? 0;
				})
				.onUpdate((event) =>
					moveTo(index, start.value + event.translationX),
				)
				.onFinalize(() => {
					if (active.value !== index) return;
					settle();
					active.value = -1;
				});

		const tap = Gesture.Tap()
			.enabled(!disabled)
			.onEnd((event) => {
				const positions = thumbs.value;
				const nearest =
					positions.length === 2 &&
					Math.abs(positions[1] - event.x) <
						Math.abs(positions[0] - event.x)
						? 1
						: 0;
				moveTo(nearest, event.x);
				settle();
			});

		return { thumbs: [thumb(0), thumb(1)], tap };
	}, [
		disabled,
		min,
		max,
		step,
		minRange,
		active,
		start,
		thumbs,
		trackWidth,
		emitted,
		drag,
		complete,
	]);

	const onTrackLayout = (event: LayoutChangeEvent) => {
		const next = event.nativeEvent.layout.width;
		setWidth((previous) => (previous === next ? previous : next));
	};

	const firstThumbStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: thumbs.value[0] ?? 0 }],
	}));
	const secondThumbStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: thumbs.value[1] ?? 0 }],
	}));
	const fillStyle = useAnimatedStyle(() => {
		const [first = 0, second] = thumbs.value;
		return second === undefined
			? { left: 0, width: first }
			: { left: first, width: second - first };
	});

	const increment = step > 0 ? step : (max - min) / 100;

	/** Props for thumb `index`: screen reader users swipe up and down to change it by one step. */
	const thumbAccessibility = (index: number) => {
		const v = values[index];
		return {
			accessible: true,
			accessibilityRole: "adjustable" as const,
			accessibilityState: { disabled },
			accessibilityValue: {
				min,
				max,
				now: v,
				text: getAccessibilityValue?.(v),
			},
			accessibilityActions: [
				{ name: "increment" as const },
				{ name: "decrement" as const },
			],
			onAccessibilityAction: (event: AccessibilityActionEvent) => {
				if (disabled) return;
				const direction =
					event.nativeEvent.actionName === "increment" ? 1 : -1;
				const next = [...values];
				let target = Math.min(
					Math.max(v + direction * increment, min),
					max,
				);
				if (range) {
					target =
						index === 0
							? Math.min(target, values[1] - minRange)
							: Math.max(target, values[0] + minRange);
				}
				next[index] = target;
				emit(next);
				complete(next);
			},
		};
	};

	return {
		range,
		values,
		ticks,
		gestures,
		onTrackLayout,
		thumbStyles: [firstThumbStyle, secondThumbStyle],
		fillStyle,
		thumbAccessibility,
	};
}
