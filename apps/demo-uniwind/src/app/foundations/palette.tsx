import { Text as RNText, View } from "react-native";

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
							className="flex-row overflow-hidden"
							style={{ borderRadius: tokens.radius.sm }}
						>
							{paletteSteps.map((step) => (
								<View
									key={step}
									className="flex-1 h-[28px]"
									style={{
										backgroundColor: tokens.palette[hue][step],
									}}
								/>
							))}
						</View>
					</View>
				))}
				<View className="flex-row">
					{paletteSteps.map((step) => (
						<RNText
							key={step}
							className="flex-1 text-center text-[8px]"
							style={{ color: colors.content.subtle }}
						>
							{step}
						</RNText>
					))}
				</View>
			</Panel>
		</Screen>
	);
}
