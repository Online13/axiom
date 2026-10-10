import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

import type {
	SegmentedControlProps,
	SegmentedControlSize,
} from "./segmented-control";
import { stateColors } from "@/theme/components/states";

/** The gap between the track and the indicator. */
const INSET = 2;

function segmentForeground(
	components: Theme["components"],
	selected: boolean,
	disabled: boolean,
) {
	const states = components.segmentedControl.default;
	if (disabled) return stateColors(states, "disabled").foreground;
	if (selected) return stateColors(states, "selected").foreground;
	return states.default.foreground;
}

// The icon takes its color as a prop.
export const SegmentedControlIcon = Icon;

export function useSegmentedControlStyles(
	size: SegmentedControlSize,
	fullWidth: boolean,
) {
	const { tokens, components } = useTheme();
	const states = components.segmentedControl.default;
	const radius = components.segmentedControl.radius;

	return {
		// A number, for the control's hook: it places the indicator inside the track.
		inset: INSET,
		track: ({ style }: Pick<SegmentedControlProps, "style">) => ({
			style: [
				styles.track,
				{
					minHeight:
						size === "md" ? tokens.sizes.control.sm : tokens.spacing[10],
					padding: INSET,
					borderRadius: radius,
					backgroundColor: states.default.track,
				},
				!fullWidth && styles.hug,
				style,
			],
		}),
		indicator: [
			styles.indicator,
			{
				top: INSET,
				bottom: INSET,
				borderRadius: radius - INSET,
				borderWidth: tokens.metrics.hairline,
				borderColor: states.default.border,
				backgroundColor: states.default.indicator,
			},
		],
		segment: {
			style: [
				styles.segment,
				{ gap: tokens.spacing[1], paddingHorizontal: tokens.spacing[3] },
				fullWidth && styles.equal,
			],
		},
		tint: (selected: boolean, disabled: boolean) => ({
			color: segmentForeground(components, selected, disabled),
		}),
		label: (selected: boolean, disabled: boolean) => ({
			style: {
				color: segmentForeground(components, selected, disabled),
				fontWeight: selected ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
			},
		}),
	};
}

const styles = StyleSheet.create({
	track: {
		flexDirection: "row",
	},
	hug: {
		alignSelf: "flex-start",
	},
	indicator: {
		position: "absolute",
		left: 0,
		pointerEvents: "none",
		boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.12)",
	},
	segment: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	equal: {
		flex: 1,
		flexBasis: 0,
	},
});
