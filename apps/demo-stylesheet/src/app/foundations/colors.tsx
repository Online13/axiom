import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme, type ThemeColors } from "@/theme";

export default function Colors() {
	const { tokens, colors } = useTheme();
	const roles = Object.keys(colors) as (keyof ThemeColors)[];

	return (
		<Screen>
			{roles.map((role) => (
				<Panel key={role}>
					<Text
						style={[
							tokens.typography.headline,
							{ color: colors.content.default },
						]}
					>
						{role}
					</Text>
					<View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
						{Object.entries(colors[role]).map(([key, value]) => (
							<View
								key={key}
								style={[styles.swatchItem, { gap: tokens.spacing[1] }]}
							>
								<View
									style={{
										height: tokens.sizes.control.md,
										borderRadius: tokens.radius.sm,
										backgroundColor: value,
										borderWidth: tokens.metrics.hairline,
										borderColor: colors.border.default,
									}}
								/>
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

const styles = StyleSheet.create({
	wrap: { flexDirection: "row", flexWrap: "wrap" },
	swatchItem: { width: "30%" },
});
