import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import type { ThemeColors } from "@/theme";

export default function Colors() {
	// This screen renders the theme itself, so it reads the values instead of only styling with them.
	const { theme } = useUnistyles();
	const roles = Object.keys(theme.colors) as (keyof ThemeColors)[];

	return (
		<Screen>
			{roles.map((role) => (
				<Panel key={role}>
					<Text style={styles.heading}>{role}</Text>
					<View style={styles.wrapGap}>
						{Object.entries(theme.colors[role]).map(([key, value]) => (
							<View key={key} style={styles.swatchItem}>
								<View style={styles.swatch(value)} />
								<Label>{key}</Label>
								<Label muted>{value}</Label>
							</View>
						))}
					</View>
				</Panel>
			))}
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	heading: {
		...theme.tokens.typography.headline,
		color: theme.colors.content.default,
	},
	wrapGap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[3],
	},
	swatchItem: { width: "30%", gap: theme.tokens.spacing[1] },
	swatch: (color: string) => ({
		height: theme.tokens.sizes.control.md,
		borderRadius: theme.tokens.radius.sm,
		backgroundColor: color,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
	}),
}));
