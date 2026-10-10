import {
	StyleSheet,
	useUnistyles,
	withUnistyles,
} from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

import type { ToastType } from "./use-toast";
import { stateColors } from "@/theme/components/states";

function toastColors(components: Theme["components"], type: ToastType) {
	const states = components.toast.default;
	return stateColors(states, type !== "loading" && type);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so the instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const ToastIcon = withUnistyles(Icon);

export function useToastStyles() {
	// The stack offsets are measured in plain numbers, so the spacing token is read here rather than
	// resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();

	return {
		gap: theme.tokens.spacing[2],
		container: (offset: number) => ({ style: styles.container(offset) }),
		toast: (hidden: boolean) => styles.toast(hidden),
		surface: (type: ToastType, described: boolean) => ({
			style: styles.surface(type, described),
		}),
		tint: (type: ToastType) => ({
			uniProps: (uniTheme: Theme) => ({
				color: toastColors(uniTheme.components, type).icon,
			}),
		}),
		text: { style: styles.text },
	};
}

const styles = StyleSheet.create((theme, rt) => ({
	container: (offset: number) => ({
		position: "absolute",
		pointerEvents: "box-none",
		top: rt.insets.top + offset,
		left: theme.tokens.metrics.screenMargin,
		right: theme.tokens.metrics.screenMargin,
	}),
	toast: (hidden: boolean) => ({
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		alignItems: "center",
		...(hidden && { pointerEvents: "none" }),
	}),
	surface: (type: ToastType, described: boolean) => {
		const colors = toastColors(theme.components, type);
		return {
			flexDirection: "row",
			alignItems: "center",
			maxWidth: "100%",
			boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.12)",
			gap: theme.tokens.spacing[3],
			paddingVertical: theme.tokens.spacing[3],
			paddingHorizontal: theme.tokens.spacing[4],
			borderRadius: described
				? theme.tokens.radius.xl
				: theme.tokens.radius.full,
			borderWidth: theme.tokens.metrics.hairline,
			borderColor: colors.border,
			backgroundColor: colors.background,
		};
	},
	text: {
		flexShrink: 1,
		gap: 2,
	},
}));
