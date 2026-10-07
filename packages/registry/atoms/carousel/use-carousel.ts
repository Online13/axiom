import {
	createContext,
	use,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type Ref,
} from "react";
import {
	useWindowDimensions,
	type LayoutChangeEvent,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useDerivedValue,
	useReducedMotion,
	useSharedValue,
	type SharedValue,
} from "react-native-reanimated";

import { haptic, type HapticKind } from "@/components/core/haptics";

export type CarouselRef = {
	scrollToIndex: (index: number, animated?: boolean) => void;
	next: () => void;
	prev: () => void;
};

export type UseCarouselOptions = {
	count: number;
	itemWidth?: number;
	gap: number;
	inset: number;
	snap?: "item" | "page" | "none";
	index?: number;
	onIndexChange?: (index: number) => void;
	/**
	 * Played when a swipe lands on another item. Autoplay and the imperative API don't play it.
	 * Off unless you pass a kind, e.g. `"selection"`.
	 */
	haptic?: HapticKind | false;
	ref?: Ref<CarouselRef>;
};

/** Scroll position, active index, snapping and the imperative API, shared by every styling variant. */
export function useCarouselRoot({
	count,
	itemWidth: itemWidthProp,
	gap,
	inset,
	snap = "item",
	index: controlledIndex,
	onIndexChange,
	haptic: hapticKind,
	ref,
}: UseCarouselOptions) {
	const { width: screenWidth } = useWindowDimensions();
	const [viewport, setViewport] = useState(screenWidth);
	const itemWidth = itemWidthProp ?? viewport - inset * 2;
	const interval = itemWidth + gap;

	const listRef = useAnimatedRef<Animated.FlatList<unknown>>();
	const scrollX = useSharedValue(0);
	const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
	const active = controlledIndex ?? uncontrolledIndex;
	// Read by Carousel.AutoPlay, which skips a tick while the list is touched. A ref: no render per touch.
	const touching = useRef(false);
	const reduceMotion = useReducedMotion();
	// Read by the autoplay timer and the imperative API, which outlive a render.
	const activeRef = useRef(active);
	useEffect(() => {
		activeRef.current = active;
	}, [active]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.set(event.contentOffset.x);
		},
	});

	const scrollToIndex = (next: number, animated = true) => {
		const target = Math.max(0, Math.min(next, count - 1));
		listRef.current?.scrollToOffset({
			offset: target * interval,
			animated: animated && !reduceMotion,
		});
		// Programmatic scrolls don't always end with a momentum event.
		settle(target * interval);
	};

	function settle(offset: number, bySwipe = false) {
		const next = Math.max(
			0,
			Math.min(Math.round(offset / interval), count - 1),
		);
		if (next === activeRef.current) return;
		if (bySwipe && hapticKind) haptic(hapticKind);
		activeRef.current = next;
		if (controlledIndex === undefined) setUncontrolledIndex(next);
		onIndexChange?.(next);
	}

	const onMomentumScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => settle(event.nativeEvent.contentOffset.x, true);

	// A controlled index moves the list.
	useEffect(() => {
		if (controlledIndex !== undefined) scrollToIndex(controlledIndex);
	}, [controlledIndex, interval]);

	useImperativeHandle(ref, () => ({
		scrollToIndex,
		next: () => scrollToIndex(activeRef.current + 1),
		prev: () => scrollToIndex(activeRef.current - 1),
	}));

	const onLayout = (event: LayoutChangeEvent) => {
		const width = event.nativeEvent.layout.width;
		setViewport((previous) => (previous === width ? previous : width));
	};

	// One stop per item (or page), and the last item always gets its own: with the
	// trailing space below, the end of the content is never a stop.
	const step =
		snap === "page"
			? Math.max(
					interval,
					Math.floor((viewport - inset) / interval) * interval,
				)
			: interval;
	const lastOffset = Math.max(0, count - 1) * interval;
	const snapToOffsets =
		snap === "none"
			? undefined
			: [
					...Array.from(
						{ length: Math.ceil(lastOffset / step) },
						(_, i) => i * step,
					),
					lastOffset,
				];
	// Room past the last item, so a swipe there doesn't hit a wall.
	const endPadding = inset + viewport / 2;

	return {
		listRef,
		scrollX,
		scrollHandler,
		active,
		activeRef,
		count,
		snap,
		scrollToIndex,
		touching,
		itemWidth,
		interval,
		snapToOffsets,
		endPadding,
		onLayout,
		onMomentumScrollEnd,
		onTouchStart: () => {
			touching.current = true;
		},
		onTouchEnd: () => {
			touching.current = false;
		},
	};
}

export type CarouselContextValue = ReturnType<typeof useCarouselRoot> & {
	/** Space between items and at the start, in points. */
	gap: number;
	inset: number;
};

export const CarouselContext = createContext<CarouselContextValue | null>(null);

/** The carousel around this component: active index, count, scroll position and `scrollToIndex`. */
export function useCarousel() {
	const context = use(CarouselContext);
	if (!context)
		throw new Error("This part must be rendered inside <Carousel>.");
	return context;
}

export type UseCarouselAutoPlayOptions = {
	/** Time on each item, in ms. */
	interval: number;
	/** Goes back to the first item after the last one. Without it, autoplay stops at the end. */
	loop?: boolean;
};

/**
 * Moves to the next item on a timer. Skips a tick while the list is touched, and stays off with
 * Reduce Motion. Call it inside a Carousel, or render `Carousel.AutoPlay`.
 */
export function useCarouselAutoPlay({
	interval,
	loop = false,
}: UseCarouselAutoPlayOptions) {
	const {
		count,
		interval: step,
		activeRef,
		touching,
		scrollToIndex,
	} = useCarousel();
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion || count < 2) return;
		const timer = setInterval(() => {
			if (touching.current) return;
			const last = activeRef.current >= count - 1;
			if (last && !loop) return;
			scrollToIndex(last ? 0 : activeRef.current + 1);
		}, interval);
		return () => clearInterval(timer);
		// `scrollToIndex` is a new function on each render but only changes meaning with the item
		// size: the timer restarts on `step`, not on every render.
	}, [interval, loop, reduceMotion, count, step]);
}

/** −1 before the center, 0 centered, 1 after. */
export function useCarouselItemProgress(
	scrollX: SharedValue<number>,
	index: number,
	interval: number,
) {
	return useDerivedValue(() =>
		interpolate(
			scrollX.get(),
			[(index - 1) * interval, index * interval, (index + 1) * interval],
			[1, 0, -1],
			Extrapolation.CLAMP,
		),
	);
}
