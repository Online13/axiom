import { StyleSheet, View } from "react-native";

import { Screen } from "@/demo/screen";
import { Label } from "@/demo/section";
import { useTheme } from "@/theme";

export default function Radius() {
	const { tokens, colors } = useTheme();

	return (
		<Screen>
			<View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
				{Object.entries(tokens.radius).map(([key, value]) => (
					<View key={key} style={[styles.center, { gap: tokens.spacing[1] }]}>
						<View
							style={{
								width: tokens.spacing[12] + tokens.spacing[6],
								height: tokens.spacing[12] + tokens.spacing[6],
								borderRadius: value,
								backgroundColor: colors.background.elevated,
								borderWidth: 1,
								borderColor: colors.border.strong,
							}}
						/>
						<Label>{key}</Label>
						<Label muted>{value}</Label>
					</View>
				))}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	wrap: { flexDirection: "row", flexWrap: "wrap" },
	center: { alignItems: "center" },
});
