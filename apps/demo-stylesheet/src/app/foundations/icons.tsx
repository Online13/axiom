import { StyleSheet, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { icons, type IconName } from "@/components/ui/icons";
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
				<View style={[styles.row, styles.end, { gap: tokens.spacing[4] }]}>
					{(["sm", "md", "lg"] as const).map((size) => (
						<View
							key={size}
							style={[styles.center, { gap: tokens.spacing[1] }]}
						>
							<Icon name="settings" size={size} />
							<Label>
								{size} · {tokens.sizes.icon[size]}
							</Label>
						</View>
					))}
				</View>
				<View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
					{names.map((name) => (
						<View
							key={name}
							style={[styles.iconCell, { gap: tokens.spacing[1] }]}
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
				<View style={[styles.row, { gap: tokens.spacing[3] }]}>
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

const styles = StyleSheet.create({
	row: { flexDirection: "row" },
	wrap: { flexDirection: "row", flexWrap: "wrap" },
	center: { alignItems: "center" },
	end: { alignItems: "flex-end" },
	iconCell: { width: "22%", alignItems: "center" },
});
