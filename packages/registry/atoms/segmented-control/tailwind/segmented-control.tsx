import type { ComponentPropsWithRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { cx, useTheme } from "@/theme";

import {
	useSegmentedControl,
	type UseSegmentedControlOptions,
} from "../use-segmented-control";

export type { SegmentOption } from "../use-segmented-control";

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

const INSET = 2;

export function SegmentedControl({
	size = "md",
	fullWidth = true,
	disabled = false,
	className,
	style,
	options,
	value,
	defaultValue,
	onValueChange,
	haptic,
	onLayout,
	...props
}: SegmentedControlProps) {
	const { tokens, components } = useTheme();
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
		inset: INSET,
	});

	const states = components.segmentedControl.default;
	const height = size === "md" ? tokens.sizes.control.sm : tokens.spacing[10];
	const radius = components.segmentedControl.radius;

	return (
		<GestureDetector gesture={gesture}>
			<View
				{...props}
				accessibilityRole="tablist"
				onLayout={(event) => {
					onTrackLayout(event);
					onLayout?.(event);
				}}
				className={cx("flex-row", !fullWidth && "self-start", className)}
				style={[
					{
						minHeight: height,
						padding: INSET,
						borderRadius: radius,
						backgroundColor: states.default.track,
					},
					style,
				]}
			>
				<Animated.View
					style={[
						{
							position: "absolute",
							left: 0,
							pointerEvents: "none",
							boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.12)",
							top: INSET,
							bottom: INSET,
							borderRadius: radius - INSET,
							borderWidth: tokens.metrics.hairline,
							borderColor: states.default.border,
							backgroundColor: states.default.indicator,
						},
						indicatorStyle,
					]}
				/>
				{segments.map((segment, index) => {
					const isSelected = segment.value === selected;
					const isDisabled = disabled || segment.disabled === true;
					const foreground = isDisabled
						? { ...states.default, ...states.disabled }.foreground
						: isSelected
							? { ...states.default, ...states.selected }.foreground
							: states.default.foreground;

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
							style={[
								{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									gap: tokens.spacing[1],
									paddingHorizontal: tokens.spacing[3],
								},
								fullWidth && { flex: 1, flexBasis: 0 },
							]}
						>
							{segment.icon ? (
								<Icon
									name={segment.icon}
									size="sm"
									color={foreground}
								/>
							) : null}
							{segment.label ? (
								<Text
									variant="bodySm"
									numberOfLines={1}
									maxFontSizeMultiplier={MAX_FONT_SCALE.control}
									style={{
										color: foreground,
										fontWeight: isSelected
											? FONT_WEIGHT.semibold
											: FONT_WEIGHT.medium,
									}}
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
