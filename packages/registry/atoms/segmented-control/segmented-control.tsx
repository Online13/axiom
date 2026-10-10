import type { ComponentPropsWithRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Tappable } from "@/components/core/tappable";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import {
	SegmentedControlIcon,
	useSegmentedControlStyles,
} from "./segmented-control.styles";
import {
	useSegmentedControl,
	type UseSegmentedControlOptions,
} from "./use-segmented-control";

export type { SegmentOption } from "./use-segmented-control";

export type SegmentedControlSize = "md" | "lg";

export type SegmentedControlProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	Omit<UseSegmentedControlOptions, "inset"> & {
		/** Minimum height: 32 or 40pt. Grows with larger system text. */
		size?: SegmentedControlSize;
		/** Stretches to the parent width with equal segments. `false` sizes it to its content. */
		fullWidth?: boolean;
		style?: StyleProp<ViewStyle>;
	};

export function SegmentedControl({
	size = "md",
	fullWidth = true,
	disabled = false,
	options,
	value,
	defaultValue,
	onValueChange,
	haptic,
	onLayout,
	...props
}: SegmentedControlProps) {
	const styles = useSegmentedControlStyles(size, fullWidth);
	const {
		segments,
		selected,
		selectIndex,
		onTrackLayout,
		onSegmentLayout,
		gesture,
		indicatorStyle,
	} = useSegmentedControl({
		options,
		value,
		defaultValue,
		onValueChange,
		haptic,
		disabled,
		fullWidth,
		inset: styles.inset,
	});

	return (
		<GestureDetector gesture={gesture}>
			<View
				{...props}
				accessibilityRole="tablist"
				onLayout={(event) => {
					onTrackLayout(event);
					onLayout?.(event);
				}}
				{...styles.track(props)}
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
							{...styles.segment}
						>
							{segment.icon ? (
								<SegmentedControlIcon
									name={segment.icon}
									size="sm"
									{...styles.tint(isSelected, isDisabled)}
								/>
							) : null}
							{segment.label ? (
								<Text
									variant="bodySm"
									numberOfLines={1}
									maxFontSizeMultiplier={MAX_FONT_SCALE.control}
									{...styles.label(isSelected, isDisabled)}
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
