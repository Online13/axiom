import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Icon, icons, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";

export default function Icons() {
	const { theme } = useUnistyles();
	const names = Object.keys(icons) as IconName[];

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Your registry in icons.tsx, at the icon size tokens.
			</Text>
			<Panel>
				<View style={styles.iconSizes}>
					{(["sm", "md", "lg"] as const).map((size) => (
						<View key={size} style={styles.iconSize}>
							<Icon name="settings" size={size} />
							<Label>
								{size} · {theme.tokens.sizes.icon[size]}
							</Label>
						</View>
					))}
				</View>
				<View style={styles.wrapGap}>
					{names.map((name) => (
						<View key={name} style={styles.iconCell}>
							<View style={styles.iconTile}>
								<Icon name={name} size="lg" />
							</View>
							<Label muted>{name}</Label>
						</View>
					))}
				</View>
				<View style={styles.iconColors}>
					{(["muted", "link", "success", "warning", "error"] as const).map(
						(color) => (
							<Icon key={color} name="info" color={color} />
						),
					)}
				</View>
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	wrapGap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[3],
	},
	iconSizes: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: theme.tokens.spacing[4],
	},
	iconSize: { alignItems: "center", gap: theme.tokens.spacing[1] },
	iconCell: {
		width: "22%",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	iconTile: {
		padding: theme.tokens.spacing[2],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.colors.background.subtle,
	},
	iconColors: { flexDirection: "row", gap: theme.tokens.spacing[3] },
}));
