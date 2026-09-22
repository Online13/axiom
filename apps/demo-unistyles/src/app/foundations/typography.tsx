import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import type { TypographyVariant } from "@/theme";

export default function Typography() {
	const { theme } = useUnistyles();
	const variants = Object.keys(theme.tokens.typography) as TypographyVariant[];

	return (
		<Screen>
			<Panel>
				{variants.map((variant) => {
					const style = theme.tokens.typography[variant];
					return (
						<View key={variant} style={styles.variant}>
							<Text style={[style, styles.onSurface]} numberOfLines={1}>
								{variant}
							</Text>
							<Label muted>
								{style.fontSize} / {style.lineHeight} ·{" "}
								{style.fontWeight}
							</Label>
						</View>
					);
				})}
			</Panel>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	onSurface: { color: theme.colors.content.default },
	variant: { gap: theme.tokens.spacing[1] },
}));
