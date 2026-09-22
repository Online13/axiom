import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Screen } from "@/demo/screen";
import { Label } from "@/demo/section";

export default function Radius() {
	const { theme } = useUnistyles();

	return (
		<Screen>
			<View style={styles.wrapGap}>
				{Object.entries(theme.tokens.radius).map(([key, value]) => (
					<View key={key} style={styles.radiusCell}>
						<View style={styles.radiusTile(value)} />
						<Label>{key}</Label>
						<Label muted>{value}</Label>
					</View>
				))}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	wrapGap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[3],
	},
	radiusCell: { alignItems: "center", gap: theme.tokens.spacing[1] },
	radiusTile: (radius: number) => ({
		width: theme.tokens.spacing[12] + theme.tokens.spacing[6],
		height: theme.tokens.spacing[12] + theme.tokens.spacing[6],
		borderRadius: radius,
		backgroundColor: theme.colors.background.elevated,
		borderWidth: 1,
		borderColor: theme.colors.border.strong,
	}),
}));
