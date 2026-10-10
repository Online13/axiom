import { StyleSheet } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { useTheme } from "@/theme";

import type { AccordionContentProps, AccordionTriggerProps } from "./accordion";

export function useAccordionStyles() {
	const { tokens } = useTheme();

	return {
		trigger: ({ style }: Pick<AccordionTriggerProps, "style">) => ({
			style: ({ pressed }: TappableState) => [
				styles.trigger,
				{
					minHeight: tokens.metrics.touchTarget + tokens.spacing[2],
					gap: tokens.spacing[3],
					paddingVertical: tokens.spacing[3],
					opacity: pressed ? 0.6 : 1,
				},
				style,
			],
		}),
		title: { style: styles.title },
		clip: styles.clip,
		measure: ({ style }: Pick<AccordionContentProps, "style">) => ({
			style: [styles.measure, { paddingBottom: tokens.spacing[4] }, style],
		}),
	};
}

const styles = StyleSheet.create({
	trigger: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		flex: 1,
	},
	clip: {
		overflow: "hidden",
	},
	measure: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
});
