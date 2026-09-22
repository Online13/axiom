import { StyleSheet, Text as RNText, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { paletteSteps, useTheme, type Hue } from "@/theme";

export default function Palette() {
	const { tokens, colors } = useTheme();
	const hues = Object.keys(tokens.palette) as Hue[];

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Raw steps from 50 to 950. Components never read them.
			</Text>
			<Panel>
				{hues.map((hue) => (
					<View key={hue} style={{ gap: tokens.spacing[1] }}>
						<Label muted>{hue}</Label>
						<View
							style={[
								styles.row,
								{ borderRadius: tokens.radius.sm, overflow: "hidden" },
							]}
						>
							{paletteSteps.map((step) => (
								<View
									key={step}
									style={[
										styles.step,
										{ backgroundColor: tokens.palette[hue][step] },
									]}
								/>
							))}
						</View>
					</View>
				))}
				<View style={styles.row}>
					{paletteSteps.map((step) => (
						<RNText
							key={step}
							style={[styles.stepLabel, { color: colors.content.subtle }]}
						>
							{step}
						</RNText>
					))}
				</View>
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row" },
	step: { flex: 1, height: 28 },
	stepLabel: { flex: 1, fontSize: 8, textAlign: "center" },
});
