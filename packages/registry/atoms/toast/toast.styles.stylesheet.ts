import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

import type { ToastType } from "./use-toast";
import { stateColors } from "@/theme/components/states";

function toastColors(components: Theme["components"], type: ToastType) {
	const states = components.toast.default;
	return stateColors(states, type !== "loading" && type);
}

// The icon takes its color as a prop.
export const ToastIcon = Icon;

export function useToastStyles() {
	const { tokens, components } = useTheme();
	const insets = useSafeAreaInsets();

	return {
		// The space between two toasts of an expanded stack: a number, the offsets are computed with it.
		gap: tokens.spacing[2],
		container: (offset: number) => ({
			style: [
				styles.container,
				{
					top: insets.top + offset,
					left: tokens.metrics.screenMargin,
					right: tokens.metrics.screenMargin,
				},
			],
		}),
		toast: (hidden: boolean) => [styles.toast, hidden && styles.hidden],
		surface: (type: ToastType, described: boolean) => ({
			style: [
				styles.surface,
				{
					gap: tokens.spacing[3],
					paddingVertical: tokens.spacing[3],
					paddingHorizontal: tokens.spacing[4],
					borderRadius: described ? tokens.radius.xl : tokens.radius.full,
					borderWidth: tokens.metrics.hairline,
					borderColor: toastColors(components, type).border,
					backgroundColor: toastColors(components, type).background,
				},
			],
		}),
		tint: (type: ToastType) => ({
			color: toastColors(components, type).icon,
		}),
		text: { style: styles.text },
	};
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		pointerEvents: "box-none",
	},
	toast: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	hidden: {
		pointerEvents: "none",
	},
	surface: {
		flexDirection: "row",
		alignItems: "center",
		maxWidth: "100%",
		boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.12)",
	},
	text: {
		flexShrink: 1,
		gap: 2,
	},
});
