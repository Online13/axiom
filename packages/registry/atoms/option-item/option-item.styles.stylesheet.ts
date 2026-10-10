import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Hue } from "@/theme";

const TILE = 30;

// The tile icon takes its color as a prop.
export const OptionItemIcon = Icon;

export function useOptionItemStyles() {
	const { tokens } = useTheme();

	return {
		tile: (iconColor: Hue) => ({
			style: [
				styles.tile,
				{
					borderRadius: tokens.radius.sm,
					backgroundColor: tokens.palette[iconColor][500],
				},
			],
		}),
		tileIcon: { color: tokens.palette.gray[50] },
		leading: { style: { gap: tokens.spacing[3] } },
	};
}

const styles = StyleSheet.create({
	tile: {
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
	},
});
