import { Text, View } from "react-native";

import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme, type TypographyVariant } from "@/theme";

export default function Typography() {
	const { tokens, colors } = useTheme();
	const variants = Object.keys(tokens.typography) as TypographyVariant[];

	return (
		<Screen>
			<Panel>
				{variants.map((variant) => {
					const style = tokens.typography[variant];
					return (
						<View key={variant} style={{ gap: tokens.spacing[1] }}>
							<Text
								style={[style, { color: colors.content.default }]}
								numberOfLines={1}
							>
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
