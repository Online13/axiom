import { StyleSheet } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";

import type { AccordionContentProps, AccordionTriggerProps } from "./accordion";

export function useAccordionStyles() {
	return {
		trigger: ({ style }: Pick<AccordionTriggerProps, "style">) => ({
			style: ({ pressed }: TappableState) => [
				styles.trigger(pressed),
				style,
			],
		}),
		title: { style: styles.title },
		clip: styles.clip,
		measure: ({ style }: Pick<AccordionContentProps, "style">) => ({
			style: [styles.measure, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	trigger: (pressed: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		minHeight: theme.tokens.metrics.touchTarget + theme.tokens.spacing[2],
		gap: theme.tokens.spacing[3],
		paddingVertical: theme.tokens.spacing[3],
		opacity: pressed ? 0.6 : 1,
	}),
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
		paddingBottom: theme.tokens.spacing[4],
	},
}));
