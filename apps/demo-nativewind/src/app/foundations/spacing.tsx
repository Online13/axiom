import { View } from "react-native";

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
						className="flex-row items-center"
						style={{ gap: tokens.spacing[3] }}
					>
						<View className="w-[24px]">
							<Label>{key}</Label>
						</View>
						<View className="w-[24px]">
							<Label muted>{value}</Label>
						</View>
						<View
							className="rounded-[2px]"
							style={{
								width: value,
								height: tokens.spacing[4],
								backgroundColor: colors.feedback.info,
							}}
						/>
					</View>
				))}
			</Panel>
		</Screen>
	);
}
