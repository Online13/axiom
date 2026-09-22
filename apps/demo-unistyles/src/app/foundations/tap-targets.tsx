import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";

export default function TapTargets() {
	const { theme } = useUnistyles();
	const [count, setCount] = useState(0);
	const icon = theme.tokens.sizes.icon.lg;
	const slop = (theme.tokens.metrics.touchTarget - icon) / 2;

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Anything pressable gets at least{" "}
				{theme.tokens.metrics.touchTarget}pt. A {icon}pt element gets {slop}
				pt of hitSlop on each side.
			</Text>
			<Panel>
				<View style={styles.targetRow}>
					<View style={styles.touchArea}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Increment"
							hitSlop={slop}
							onPress={() => setCount((value) => value + 1)}
							style={({ pressed }) => ({
								width: icon,
								height: icon,
								borderRadius: theme.tokens.radius.full,
								backgroundColor: pressed
									? theme.colors.content.muted
									: theme.colors.content.default,
							})}
						/>
					</View>
					<View style={styles.caption}>
						<Label>Tap around the dot, inside the dashed area.</Label>
						<Label muted>Taps: {count}</Label>
					</View>
				</View>
				<View style={styles.rule} />
				<Label muted>
					screenMargin {theme.tokens.metrics.screenMargin} · hairline{" "}
					{theme.tokens.metrics.hairline.toFixed(2)}
				</Label>
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	caption: { gap: theme.tokens.spacing[1] },
	targetRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[6],
	},
	touchArea: {
		width: theme.tokens.metrics.touchTarget,
		height: theme.tokens.metrics.touchTarget,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.sm,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: theme.colors.feedback.info,
		backgroundColor: theme.colors.feedback.infoSubtle,
	},
	rule: {
		height: theme.tokens.metrics.hairline,
		marginHorizontal: -theme.tokens.spacing[4],
		backgroundColor: theme.colors.border.default,
	},
}));
