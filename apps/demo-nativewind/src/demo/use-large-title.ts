import type { LayoutChangeEvent } from "react-native";
import {
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";

/**
 * Folds a large title into the bar row as its list scrolls, and brings it back at the top.
 *
 * The bar stays static: wrap `AppBar.Expanded` in an `Animated.View` with `expandedStyle`, and the
 * row title in one with `rowTitleStyle`. The list has to be an `Animated` one, since `onScroll` is a
 * Reanimated handler.
 */
export function useLargeTitle() {
	const offset = useSharedValue(0);
	// Measured, so a subtitle or a larger font still folds all the way.
	const expandedHeight = useSharedValue(0);

	// 0 at the top of the list, 1 once it has scrolled by the height of the large title.
	const collapse = useDerivedValue(() => {
		const height = expandedHeight.get();
		if (height === 0) return 0;
		return Math.min(Math.max(offset.get() / height, 0), 1);
	});

	const onScroll = useAnimatedScrollHandler((event) => {
		offset.set(event.contentOffset.y);
	});

	const onExpandedLayout = (event: LayoutChangeEvent) => {
		expandedHeight.set(event.nativeEvent.layout.height);
	};

	const expandedStyle = useAnimatedStyle(() => {
		const height = expandedHeight.get();
		if (height === 0) return {};
		return {
			height: interpolate(collapse.get(), [0, 1], [height, 0]),
			opacity: interpolate(collapse.get(), [0, 0.6], [1, 0], "clamp"),
		};
	});

	// The row title waits for the large one to fade, so the two never show at full opacity.
	const rowTitleStyle = useAnimatedStyle(() => ({
		opacity: interpolate(collapse.get(), [0.6, 1], [0, 1], "clamp"),
	}));

	return { onScroll, onExpandedLayout, expandedStyle, rowTitleStyle };
}
