import { StyleSheet, View } from "react-native";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme } from "@/theme";

export default function Spacing() {
	const { tokens, colors } = useTheme();

	return (
		<Screen>
			<Panel>
				{Object.entries(tokens.spacing).map(([key, value]) => (
					<View
						key={key}
						style={[styles.row, styles.center, { gap: tokens.spacing[3] }]}
					>
						<View style={styles.scaleKey}>
							<Label>{key}</Label>
						</View>
						<View style={styles.scaleKey}>
							<Label muted>{value}</Label>
						</View>
						<View
							style={{
								width: value,
								height: tokens.spacing[4],
								borderRadius: 2,
								backgroundColor: colors.feedback.info,
							}}
						/>
					</View>
				))}
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row" },
	center: { alignItems: "center" },
	scaleKey: { width: 24 },
});
