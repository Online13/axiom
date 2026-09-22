import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Theme } from "@/theme";

import {
	useSegmentedControl,
	type UseSegmentedControlOptions,
} from "../use-segmented-control";

export type { SegmentOption } from "../use-segmented-control";

export type SegmentedControlSize = "md" | "lg";

export type SegmentedControlProps = UseSegmentedControlOptions & {
	/** Minimum height: 32 or 40pt. Grows with larger system text. */
	size?: SegmentedControlSize;
	/** Stretches to the parent width with equal segments. `false` sizes it to its content. */
	fullWidth?: boolean;
	style?: StyleProp<ViewStyle>;
};

const INSET = 2;

function segmentForeground(
	components: Theme["components"],
	selected: boolean,
	disabled: boolean,
) {
	const states = components.segmentedControl.default;
	if (disabled) return { ...states.default, ...states.disabled }.foreground;
	if (selected) return { ...states.default, ...states.selected }.foreground;
	return states.default.foreground;
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function SegmentedControl({
	size = "md",
	fullWidth = true,
	disabled = false,
	style,
	...options
}: SegmentedControlProps) {
	const {
		segments,
		selected,
		selectIndex,
		onTrackLayout,
		onSegmentLayout,
		gesture,
		indicatorStyle,
	} = useSegmentedControl({ ...options, disabled, fullWidth, inset: INSET });

	return (
		<GestureDetector gesture={gesture}>
			<View
				accessibilityRole="tablist"
				onLayout={onTrackLayout}
				style={[styles.track(size, fullWidth), style]}
			>
				<Animated.View style={[styles.indicator, indicatorStyle]} />
				{segments.map((segment, index) => {
					const isSelected = segment.value === selected;
					const isDisabled = disabled || segment.disabled === true;

					return (
						<Tappable
							key={segment.value}
							minTouchTarget={false}
							disabled={isDisabled}
							accessibilityRole="tab"
							accessibilityLabel={
								segment.accessibilityLabel ?? segment.label
							}
							accessibilityState={{ selected: isSelected }}
							onLayout={onSegmentLayout(index)}
							onPress={() => selectIndex(index)}
							style={styles.segment(fullWidth)}
						>
							{segment.icon ? (
								<ThemedIcon
									name={segment.icon}
									size="sm"
									uniProps={(theme) => ({
										color: segmentForeground(
											theme.components,
											isSelected,
											isDisabled,
										),
									})}
								/>
							) : null}
							{segment.label ? (
								<Text
									variant="bodySm"
									numberOfLines={1}
									maxFontSizeMultiplier={MAX_FONT_SCALE.control}
									style={styles.label(isSelected, isDisabled)}
								>
									{segment.label}
								</Text>
							) : null}
						</Tappable>
					);
				})}
			</View>
		</GestureDetector>
	);
}

const styles = StyleSheet.create((theme) => ({
	track: (size: SegmentedControlSize, fullWidth: boolean) => ({
		flexDirection: "row",
		minHeight:
			size === "md"
				? theme.tokens.sizes.control.sm
				: theme.tokens.spacing[10],
		padding: INSET,
		borderRadius: theme.tokens.radius.md,
		backgroundColor:
			theme.components.segmentedControl.default.default.track,
		...(!fullWidth && { alignSelf: "flex-start" }),
	}),
	indicator: {
		position: "absolute",
		left: 0,
		pointerEvents: "none",
		boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.12)",
		top: INSET,
		bottom: INSET,
		borderRadius: theme.tokens.radius.md - INSET,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.components.segmentedControl.default.default.border,
		backgroundColor:
			theme.components.segmentedControl.default.default.indicator,
	},
	segment: (fullWidth: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.tokens.spacing[1],
		paddingHorizontal: theme.tokens.spacing[3],
		...(fullWidth && { flex: 1, flexBasis: 0 }),
	}),
	label: (selected: boolean, disabled: boolean) => ({
		color: segmentForeground(theme.components, selected, disabled),
		fontWeight: selected ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
	}),
}));
