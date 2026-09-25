import type { ReactElement, Ref } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { HapticKind } from "@/components/core/haptics";
import { Text } from "@/components/ui/text";
import type { Spacing } from "@/theme";

import {
	useCarousel,
	useCarouselItemProgress,
	type CarouselRef,
} from "../use-carousel";

export type { CarouselRef } from "../use-carousel";

export type CarouselRenderInfo<T> = {
	item: T;
	index: number;
	/** −1 to 1 as the item moves through the center, for scale or parallax effects. */
	progress: SharedValue<number>;
};

export type CarouselProps<T> = {
	data: T[];
	renderItem: (info: CarouselRenderInfo<T>) => ReactElement;
	keyExtractor?: (item: T, index: number) => string;
	/** Smaller than the viewport, the next item peeks in. */
	itemWidth?: number;
	gap?: keyof Spacing;
	/** Padding at the start and end. Defaults to the screen margin. */
	contentInset?: keyof Spacing;
	snap?: "item" | "page" | "none";
	pagination?: boolean | "dots" | "counter";
	index?: number;
	onIndexChange?: (index: number) => void;
	loop?: boolean;
	autoPlay?: number;
	/** Played when a swipe lands on another item. Off unless you pass a kind, e.g. `"selection"`. */
	haptic?: HapticKind | false;
	/** Items rendered around the visible ones, in viewport widths. */
	windowSize?: number;
	ref?: Ref<CarouselRef>;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

export function Carousel<T>({
	data,
	renderItem,
	keyExtractor,
	itemWidth,
	gap = 3,
	contentInset,
	snap = "item",
	pagination = false,
	index,
	onIndexChange,
	loop = false,
	autoPlay,
	haptic,
	windowSize = 5,
	ref,
	accessibilityLabel,
	style,
}: CarouselProps<T>) {
	// The hook and `getItemLayout` measure in plain numbers, so the spacing tokens are read here
	// rather than resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const spacing = theme.tokens.spacing[gap];
	const inset =
		contentInset === undefined
			? theme.tokens.metrics.screenMargin
			: theme.tokens.spacing[contentInset];
	const {
		listRef,
		scrollX,
		scrollHandler,
		active,
		itemWidth: width,
		interval,
		snapToInterval,
		onLayout,
		onMomentumScrollEnd,
		onTouchStart,
		onTouchEnd,
	} = useCarousel({
		count: data.length,
		itemWidth,
		gap: spacing,
		inset,
		snap,
		index,
		onIndexChange,
		loop,
		autoPlay,
		haptic,
		ref,
	});

	return (
		<View style={style} onLayout={onLayout}>
			<Animated.FlatList
				ref={listRef}
				data={data as unknown[]}
				horizontal
				showsHorizontalScrollIndicator={false}
				decelerationRate={snapToInterval ? "fast" : "normal"}
				snapToInterval={snapToInterval}
				disableIntervalMomentum={snap === "item"}
				windowSize={windowSize}
				initialNumToRender={3}
				scrollEventThrottle={16}
				onScroll={scrollHandler}
				onMomentumScrollEnd={onMomentumScrollEnd}
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				onTouchCancel={onTouchEnd}
				accessibilityLabel={accessibilityLabel}
				contentContainerStyle={styles.content(inset, spacing)}
				getItemLayout={(_, i) => ({
					length: interval,
					offset: inset + interval * i,
					index: i,
				})}
				keyExtractor={(item, i) =>
					keyExtractor ? keyExtractor(item as T, i) : String(i)
				}
				renderItem={({ item, index: i }) => (
					<CarouselItem
						width={width}
						index={i}
						interval={interval}
						scrollX={scrollX}
						render={(progress) =>
							renderItem({ item: item as T, index: i, progress })
						}
					/>
				)}
			/>
			{pagination && data.length > 1 ? (
				<View style={styles.pagination}>
					{pagination === "counter" ? (
						<Text variant="footnote" color="muted">
							{active + 1} / {data.length}
						</Text>
					) : (
						<View
							accessible
							accessibilityLabel={`Page ${active + 1} of ${data.length}`}
							style={styles.dots}
						>
							{data.map((_, i) => (
								<Dot
									key={i}
									index={i}
									interval={interval}
									scrollX={scrollX}
								/>
							))}
						</View>
					)}
				</View>
			) : null}
		</View>
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
	return <View style={styles.item(width)}>{render(progress)}</View>;
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
	const progress = useCarouselItemProgress(scrollX, index, interval);

	// The active dot stretches into a pill.
	const animatedStyle = useAnimatedStyle(() => {
		const focus = 1 - Math.abs(progress.value);
		return {
			width: interpolate(focus, [0, 1], [6, 18]),
			opacity: interpolate(focus, [0, 1], [0.35, 1]),
		};
	});

	return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create((theme) => ({
	content: (inset: number, gap: number) => ({
		paddingHorizontal: inset,
		gap,
	}),
	item: (width: number) => ({ width }),
	pagination: {
		alignItems: "center",
		marginTop: theme.tokens.spacing[3],
	},
	dots: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1] + 2,
	},
	dot: {
		height: 6,
		borderRadius: 3,
		backgroundColor: theme.colors.content.default,
	},
}));
