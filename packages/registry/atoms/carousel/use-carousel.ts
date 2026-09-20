import {
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
	loop?: boolean;
	/** Interval in ms. Paused while touched and with Reduce Motion. */
	autoPlay?: number;
	ref?: Ref<CarouselRef>;
};

/** Scroll position, active index, snapping, autoplay and the imperative API, shared by every styling variant. */
export function useCarousel({
	count,
	itemWidth: itemWidthProp,
	gap,
	inset,
	snap = "item",
	index: controlledIndex,
	onIndexChange,
	loop = false,
	autoPlay,
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
	const [touching, setTouching] = useState(false);
	const reduceMotion = useReducedMotion();
	// Read by the autoplay timer and the imperative API, which outlive a render.
	const activeRef = useRef(active);
	useEffect(() => {
		activeRef.current = active;
	}, [active]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		},
	});

	const scrollToIndex = (next: number, animated = true) => {
		const target = loop
			? (next + count) % count
			: Math.max(0, Math.min(next, count - 1));
		listRef.current?.scrollToOffset({
			offset: target * interval,
			animated: animated && !reduceMotion,
		});
		// Programmatic scrolls don't always end with a momentum event.
		settle(target * interval);
	};

	function settle(offset: number) {
		const next = Math.max(
			0,
			Math.min(Math.round(offset / interval), count - 1),
		);
		if (next === activeRef.current) return;
		activeRef.current = next;
		if (controlledIndex === undefined) setUncontrolledIndex(next);
		onIndexChange?.(next);
	}

	const onMomentumScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => settle(event.nativeEvent.contentOffset.x);

	// A controlled index moves the list.
	useEffect(() => {
		if (controlledIndex !== undefined) scrollToIndex(controlledIndex);
	}, [controlledIndex, interval]);

	useEffect(() => {
		if (!autoPlay || touching || reduceMotion || count < 2) return;
		const timer = setInterval(() => {
			if (!loop && activeRef.current >= count - 1) return;
			scrollToIndex(activeRef.current + 1);
		}, autoPlay);
		return () => clearInterval(timer);
	}, [autoPlay, touching, reduceMotion, count, loop, interval]);

	useImperativeHandle(ref, () => ({
		scrollToIndex,
		next: () => scrollToIndex(activeRef.current + 1),
		prev: () => scrollToIndex(activeRef.current - 1),
	}));

	const onLayout = (event: LayoutChangeEvent) => {
		const width = event.nativeEvent.layout.width;
		setViewport((previous) => (previous === width ? previous : width));
	};

	const snapToInterval =
		snap === "item"
			? interval
			: snap === "page"
				? Math.max(
						interval,
						Math.floor((viewport - inset) / interval) * interval,
					)
				: undefined;

	return {
		listRef,
		scrollX,
		scrollHandler,
		active,
		itemWidth,
		interval,
		snapToInterval,
		onLayout,
		onMomentumScrollEnd,
		onTouchStart: () => setTouching(true),
		onTouchEnd: () => setTouching(false),
	};
}

/** −1 before the center, 0 centered, 1 after. */
export function useCarouselItemProgress(
	scrollX: SharedValue<number>,
	index: number,
	interval: number,
) {
	return useDerivedValue(() =>
		interpolate(
			scrollX.value,
			[(index - 1) * interval, index * interval, (index + 1) * interval],
			[1, 0, -1],
			Extrapolation.CLAMP,
		),
	);
}
