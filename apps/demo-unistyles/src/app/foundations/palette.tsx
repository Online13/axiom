import { Text as RNText, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { paletteSteps, type Hue } from "@/theme";

export default function Palette() {
	const { theme } = useUnistyles();
	const hues = Object.keys(theme.tokens.palette) as Hue[];

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Raw steps from 50 to 950. Components never read them.
			</Text>
			<Panel>
				{hues.map((hue) => (
					<View key={hue} style={styles.hue}>
						<Label muted>{hue}</Label>
						<View style={styles.steps}>
							{paletteSteps.map((step) => (
								<View
									key={step}
									style={styles.step(theme.tokens.palette[hue][step])}
								/>
							))}
						</View>
					</View>
				))}
				<View style={styles.row}>
					{paletteSteps.map((step) => (
						<RNText key={step} style={styles.stepLabel}>
							{step}
						</RNText>
					))}
				</View>
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	row: { flexDirection: "row" },
	hue: { gap: theme.tokens.spacing[1] },
	steps: {
		flexDirection: "row",
		borderRadius: theme.tokens.radius.sm,
		overflow: "hidden",
	},
	step: (color: string) => ({ flex: 1, height: 28, backgroundColor: color }),
	stepLabel: {
		flex: 1,
		fontSize: 8,
		textAlign: "center",
		color: theme.colors.content.subtle,
	},
}));
