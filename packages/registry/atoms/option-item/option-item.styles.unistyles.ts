import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Hue, Theme } from "@/theme";

const TILE = 30;

// The tile icon takes a raw palette color as a prop, not as a style. Wrapped once, here, so the
// instance only has to map the theme to that prop through `uniProps`.
export const OptionItemIcon = withUnistyles(Icon);

export function useOptionItemStyles() {
	return {
		tile: (iconColor: Hue) => ({ style: styles.tile(iconColor) }),
		tileIcon: {
			uniProps: (theme: Theme) => ({ color: theme.tokens.palette.gray[50] }),
		},
		leading: { style: styles.leading },
	};
}

const styles = StyleSheet.create((theme) => ({
	tile: (hue: Hue) => ({
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.sm,
		backgroundColor: theme.tokens.palette[hue][500],
	}),
	leading: {
		gap: theme.tokens.spacing[3],
	},
}));
