import type { ReactElement, Ref } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { useTheme, type Spacing } from "@/theme";

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
	windowSize = 5,
	ref,
	accessibilityLabel,
	style,
}: CarouselProps<T>) {
	const { tokens } = useTheme();
	const inset =
		contentInset === undefined
			? tokens.metrics.screenMargin
			: tokens.spacing[contentInset];
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
		gap: tokens.spacing[gap],
		inset,
		snap,
		index,
		onIndexChange,
		loop,
		autoPlay,
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
				contentContainerStyle={{
					paddingHorizontal: inset,
					gap: tokens.spacing[gap],
				}}
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
				<View style={[styles.pagination, { marginTop: tokens.spacing[3] }]}>
					{pagination === "counter" ? (
						<Text variant="footnote" color="muted">
							{active + 1} / {data.length}
						</Text>
					) : (
						<View
							accessible
							accessibilityLabel={`Page ${active + 1} of ${data.length}`}
							style={[styles.dots, { gap: tokens.spacing[1] + 2 }]}
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
	return <View style={{ width }}>{render(progress)}</View>;
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
		const focus = 1 - Math.abs(progress.value);
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

const styles = StyleSheet.create({
	pagination: {
		alignItems: "center",
	},
	dots: {
		flexDirection: "row",
		alignItems: "center",
	},
	dot: {
		height: 6,
		borderRadius: 3,
	},
});
