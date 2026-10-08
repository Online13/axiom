import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { icons, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme } from "@/theme";

export default function Icons() {
	const { tokens, colors } = useTheme();
	const names = Object.keys(icons) as IconName[];

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Your registry in icons.tsx, at the icon size tokens.
			</Text>
			<Panel>
				<View
					className="flex-row items-end"
					style={{ gap: tokens.spacing[4] }}
				>
					{(["sm", "md", "lg"] as const).map((size) => (
						<View
							key={size}
							className="items-center"
							style={{ gap: tokens.spacing[1] }}
						>
							<Icon name="settings" size={size} />
							<Label>
								{size} · {tokens.sizes.icon[size]}
							</Label>
						</View>
					))}
				</View>
				<View
					className="flex-row flex-wrap"
					style={{ gap: tokens.spacing[3] }}
				>
					{names.map((name) => (
						<View
							key={name}
							className="w-[22%] items-center"
							style={{ gap: tokens.spacing[1] }}
						>
							<View
								style={{
									padding: tokens.spacing[2],
									borderRadius: tokens.radius.md,
									backgroundColor: colors.background.subtle,
								}}
							>
								<Icon name={name} size="lg" />
							</View>
							<Label muted>{name}</Label>
						</View>
					))}
				</View>
				<View className="flex-row" style={{ gap: tokens.spacing[3] }}>
					{(["muted", "link", "success", "warning", "error"] as const).map(
						(color) => (
							<Icon key={color} name="info" color={color} />
						),
					)}
				</View>
			</Panel>
		</Screen>
	);
}
