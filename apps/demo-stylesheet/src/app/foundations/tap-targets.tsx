import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme } from "@/theme";

export default function TapTargets() {
	const { tokens, colors } = useTheme();
	const [count, setCount] = useState(0);
	const icon = tokens.sizes.icon.lg;
	const slop = (tokens.metrics.touchTarget - icon) / 2;

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Anything pressable gets at least {tokens.metrics.touchTarget}pt. A{" "}
				{icon}pt element gets {slop}pt of hitSlop on each side.
			</Text>
			<Panel>
				<View style={[styles.row, styles.center, { gap: tokens.spacing[6] }]}>
					<View
						style={[
							styles.center,
							styles.centerContent,
							{
								width: tokens.metrics.touchTarget,
								height: tokens.metrics.touchTarget,
								borderRadius: tokens.radius.sm,
								borderWidth: 1,
								borderStyle: "dashed",
								borderColor: colors.feedback.info,
								backgroundColor: colors.feedback.infoSubtle,
							},
						]}
					>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Increment"
							hitSlop={slop}
							onPress={() => setCount((value) => value + 1)}
							style={({ pressed }) => ({
								width: icon,
								height: icon,
								borderRadius: tokens.radius.full,
								backgroundColor: pressed
									? colors.content.muted
									: colors.content.default,
							})}
						/>
					</View>
					<View style={{ gap: tokens.spacing[1] }}>
						<Label>Tap around the dot, inside the dashed area.</Label>
						<Label muted>Taps: {count}</Label>
					</View>
				</View>
				<View
					style={{
						height: tokens.metrics.hairline,
						marginHorizontal: -tokens.spacing[4],
						backgroundColor: colors.border.default,
					}}
				/>
				<Label muted>
					screenMargin {tokens.metrics.screenMargin} · hairline{" "}
					{tokens.metrics.hairline.toFixed(2)}
				</Label>
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row" },
	center: { alignItems: "center" },
	centerContent: { justifyContent: "center" },
});
