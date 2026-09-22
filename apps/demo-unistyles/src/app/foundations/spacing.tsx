import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";

export default function Spacing() {
	const { theme } = useUnistyles();

	return (
		<Screen>
			<Panel>
				{Object.entries(theme.tokens.spacing).map(([key, value]) => (
					<View key={key} style={styles.scaleRow}>
						<View style={styles.scaleKey}>
							<Label>{key}</Label>
						</View>
						<View style={styles.scaleKey}>
							<Label muted>{value}</Label>
						</View>
						<View style={styles.bar(value)} />
					</View>
				))}
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	scaleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	scaleKey: { width: 24 },
	bar: (width: number) => ({
		width,
		height: theme.tokens.spacing[4],
		borderRadius: 2,
		backgroundColor: theme.colors.feedback.info,
	}),
}));
