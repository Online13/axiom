import {
	createContext,
	use,
	type ReactElement,
	type ReactNode,
	type Ref,
} from "react";
import {
	StyleSheet,
	View,
	type FlatListProps,
	type StyleProp,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from "react-native-reanimated";

import type { HapticKind } from "@/components/core/haptics";
import { useTheme, type Spacing } from "@/theme";

import {
	CarouselContext,
	useCarousel,
	useCarouselAutoPlay,
	useCarouselItemProgress,
	useCarouselRoot,
	type CarouselRef,
	type UseCarouselAutoPlayOptions,
} from "../use-carousel";

export {
	useCarousel,
	useCarouselAutoPlay,
	type CarouselRef,
} from "../use-carousel";

export type CarouselRenderInfo<T> = {
	item: T;
	index: number;
	/** −1 to 1 as the item moves through the center, for scale or parallax effects. */
	progress: SharedValue<number>;
};

/** `ref` is the imperative handle, not the root `View`. */
export type CarouselProps<T> = Omit<ViewProps, "children"> & {
	data: T[];
	renderItem: (info: CarouselRenderInfo<T>) => ReactElement;
	keyExtractor?: (item: T, index: number) => string;
	/** Smaller than the viewport, the next item peeks in. */
	itemWidth?: number;
	gap?: keyof Spacing;
	/** Padding at the start and end. Defaults to the screen margin. */
	contentInset?: keyof Spacing;
	snap?: "item" | "page" | "none";
	index?: number;
	onIndexChange?: (index: number) => void;
	/** Played when a swipe lands on another item. Off unless you pass a kind, e.g. `"selection"`. */
	haptic?: HapticKind | false;
	ref?: Ref<CarouselRef>;
	/** Carousel.List, and Carousel.Pagination or Carousel.AutoPlay where you want them. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

type ItemRenderer = (info: CarouselRenderInfo<unknown>) => ReactElement;
type KeyExtractor = (item: unknown, index: number) => string;

// The list reads the data and its renderer from the root, which needs the count for snapping.
type ListSource = {
	data: unknown[];
	renderItem: ItemRenderer;
	keyExtractor?: KeyExtractor;
};

const ListContext = createContext<ListSource | null>(null);

/** Holds the scroll position and the active item. Renders its children where you write them. */
function CarouselRoot<T>({
	data,
	renderItem,
	keyExtractor,
	itemWidth,
	gap = 3,
	contentInset,
	snap = "item",
	index,
	onIndexChange,
	haptic,
	ref,
	children,
	onLayout: onLayoutProp,
	...props
}: CarouselProps<T>) {
	const { tokens } = useTheme();
	const spacing = tokens.spacing[gap];
	const inset =
		contentInset === undefined
			? tokens.metrics.screenMargin
			: tokens.spacing[contentInset];
	const carousel = useCarouselRoot({
		count: data.length,
		itemWidth,
		gap: spacing,
		inset,
		snap,
		index,
		onIndexChange,
		haptic,
		ref,
	});
	const source: ListSource = {
		data,
		renderItem: renderItem as ItemRenderer,
		keyExtractor: keyExtractor as KeyExtractor | undefined,
	};

	return (
		<CarouselContext value={{ ...carousel, gap: spacing, inset }}>
			<ListContext value={source}>
				<View
					{...props}
					onLayout={(event) => {
						carousel.onLayout(event);
						onLayoutProp?.(event);
					}}
				>
					{children}
				</View>
			</ListContext>
		</CarouselContext>
	);
}

export type CarouselListProps = Pick<
	FlatListProps<unknown>,
	| "windowSize"
	| "initialNumToRender"
	| "accessibilityLabel"
	| "testID"
	| "style"
	| "contentContainerStyle"
>;

/** The horizontal list of items. */
function CarouselList({
	windowSize = 5,
	initialNumToRender = 3,
	contentContainerStyle,
	...props
}: CarouselListProps) {
	const {
		listRef,
		snapToOffsets,
		snap,
		scrollHandler,
		onMomentumScrollEnd,
		onTouchStart,
		onTouchEnd,
		inset,
		endPadding,
		gap,
		interval,
		itemWidth,
		scrollX,
	} = useCarousel();
	const source = use(ListContext);
	if (!source)
		throw new Error("Carousel.List must be rendered inside <Carousel>.");

	return (
		<Animated.FlatList
			{...props}
			ref={listRef}
			data={source.data}
			horizontal
			showsHorizontalScrollIndicator={false}
			decelerationRate={snapToOffsets ? "fast" : "normal"}
			snapToOffsets={snapToOffsets}
			snapToEnd={false}
			disableIntervalMomentum={snap === "item"}
			windowSize={windowSize}
			initialNumToRender={initialNumToRender}
			scrollEventThrottle={16}
			onScroll={scrollHandler}
			onMomentumScrollEnd={onMomentumScrollEnd}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchEnd}
			contentContainerStyle={[
				{
					paddingStart: inset,
					paddingEnd: endPadding,
					gap: gap,
				},
				contentContainerStyle,
			]}
			getItemLayout={(_, i) => ({
				length: interval,
				offset: inset + interval * i,
				index: i,
			})}
			keyExtractor={(item, i) =>
				source.keyExtractor ? source.keyExtractor(item, i) : String(i)
			}
			renderItem={({ item, index: i }) => (
				<CarouselItem
					width={itemWidth}
					index={i}
					interval={interval}
					scrollX={scrollX}
					render={(progress) =>
						source.renderItem({ item, index: i, progress })
					}
				/>
			)}
		/>
	);
}

function CarouselItem({
	width,
	index,
	interval,
	scrollX,
	render,
}: {
	width: number;
	index: number;
	interval: number;
	scrollX: SharedValue<number>;
	render: (progress: SharedValue<number>) => ReactElement;
}) {
	const progress = useCarouselItemProgress(scrollX, index, interval);
	return <View style={{ width }}>{render(progress)}</View>;
}

export type CarouselPaginationProps = Omit<ViewProps, "children"> & {
	style?: StyleProp<ViewStyle>;
};

/** One dot per item; the active one stretches into a pill as the list scrolls. */
function CarouselPagination({ style, ...props }: CarouselPaginationProps) {
	const { tokens } = useTheme();
	const carousel = useCarousel();

	if (carousel.count < 2) return null;

	return (
		<View
			accessible
			accessibilityLabel={`Page ${carousel.active + 1} of ${carousel.count}`}
			{...props}
			style={[
				styles.dots,
				{ gap: tokens.spacing[1] + 2, marginTop: tokens.spacing[3] },
				style,
			]}
		>
			{Array.from({ length: carousel.count }, (_, i) => (
				<Dot
					key={i}
					index={i}
					interval={carousel.interval}
					scrollX={carousel.scrollX}
				/>
			))}
		</View>
	);
}

function Dot({
	index,
	interval,
	scrollX,
}: {
	index: number;
	interval: number;
	scrollX: SharedValue<number>;
}) {
	const { colors } = useTheme();
	const progress = useCarouselItemProgress(scrollX, index, interval);

	// The active dot stretches into a pill.
	const animatedStyle = useAnimatedStyle(() => {
		const focus = 1 - Math.abs(progress.get());
		return {
			width: interpolate(focus, [0, 1], [6, 18]),
			opacity: interpolate(focus, [0, 1], [0.35, 1]),
		};
	});

	return (
		<Animated.View
			style={[
				styles.dot,
				{ backgroundColor: colors.content.default },
				animatedStyle,
			]}
		/>
	);
}

export type CarouselAutoPlayProps = UseCarouselAutoPlayOptions;

/** Moves to the next item on a timer. Renders nothing: it's `useCarouselAutoPlay` as a part. */
function CarouselAutoPlay(props: CarouselAutoPlayProps) {
	useCarouselAutoPlay(props);
	return null;
}

export const Carousel = Object.assign(CarouselRoot, {
	List: CarouselList,
	Pagination: CarouselPagination,
	AutoPlay: CarouselAutoPlay,
});

const styles = StyleSheet.create({
	dots: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	dot: {
		height: 6,
		borderRadius: 3,
	},
});
