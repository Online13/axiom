import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const SegmentedControlIcon = withUnistyles(Icon);

export function useSegmentedControlStyles(
	size: SegmentedControlSize,
	fullWidth: boolean,
) {
	return {
		// A number, for the control's hook: it places the indicator inside the track.
		inset: INSET,
		track: ({ style }: Pick<SegmentedControlProps, "style">) => ({
			style: [styles.track(size, fullWidth), style],
		}),
		indicator: styles.indicator,
		segment: { style: styles.segment(fullWidth) },
		tint: (selected: boolean, disabled: boolean) => ({
			uniProps: (theme: Theme) => ({
				color: segmentForeground(theme.components, selected, disabled),
			}),
		}),
		label: (selected: boolean, disabled: boolean) => ({
			style: styles.label(selected, disabled),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	track: (size: SegmentedControlSize, fullWidth: boolean) => ({
		flexDirection: "row",
		minHeight:
			size === "md"
				? theme.tokens.sizes.control.sm
				: theme.tokens.spacing[10],
		padding: INSET,
		borderRadius: theme.components.segmentedControl.radius,
		backgroundColor: theme.components.segmentedControl.default.default.track,
		...(!fullWidth && { alignSelf: "flex-start" }),
	}),
	indicator: {
		position: "absolute",
		left: 0,
		pointerEvents: "none",
		boxShadow: "0px 1px 3px hsla(0, 0%, 0%, 0.12)",
		top: INSET,
		bottom: INSET,
		borderRadius: theme.components.segmentedControl.radius - INSET,
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
