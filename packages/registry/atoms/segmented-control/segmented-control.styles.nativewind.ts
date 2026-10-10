import type { ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import { cx, useTheme, type Theme } from "@/theme";

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

// The indicator is an animated view, which takes `style` only, and its radius is the track's minus
// the inset: this component reads its tokens from the theme.
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
		track: ({
			className,
			style,
		}: Pick<SegmentedControlProps, "className" | "style">) => ({
			className: cx("flex-row", !fullWidth && "self-start", className),
			style: [
				{
					minHeight:
						size === "md" ? tokens.sizes.control.sm : tokens.spacing[10],
					padding: INSET,
					borderRadius: radius,
					backgroundColor: states.default.track,
				},
				style,
			],
		}),
		indicator: {
			position: "absolute",
			left: 0,
			top: INSET,
			bottom: INSET,
			pointerEvents: "none",
			boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.12)",
			borderRadius: radius - INSET,
			borderWidth: tokens.metrics.hairline,
			borderColor: states.default.border,
			backgroundColor: states.default.indicator,
		} satisfies ViewStyle,
		segment: {
			className: cx(
				"flex-row items-center justify-center gap-1 px-3",
				fullWidth && "flex-1 basis-0",
			),
		},
		tint: (selected: boolean, disabled: boolean) => ({
			color: segmentForeground(components, selected, disabled),
		}),
		label: (selected: boolean, disabled: boolean) => ({
			className: selected ? "font-semibold" : "font-medium",
			style: { color: segmentForeground(components, selected, disabled) },
		}),
	};
}
