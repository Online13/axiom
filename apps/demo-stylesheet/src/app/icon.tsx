import { View } from "react-native";

import { Icon, type IconColor } from "@/components/ui/icon";
import { icons, type IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const COLORS: IconColor[] = [
	"default",
	"muted",
	"subtle",
	"disabled",
	"link",
	"info",
	"success",
	"warning",
	"error",
];

export default function IconScreen() {
	const { tokens, colors } = useTheme();
	const names = Object.keys(icons) as IconName[];

	return (
		<Screen>
			<Section
				title="Registry"
				description="Every icon of the app is declared once, in icons.tsx."
			>
				<Panel>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							gap: tokens.spacing[3],
						}}
					>
						{names.map((name) => (
							<View
								key={name}
								style={{
									width: "22%",
									alignItems: "center",
									gap: tokens.spacing[1],
								}}
							>
								<View
									style={{
										padding: tokens.spacing[3],
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
				</Panel>
			</Section>

			<Section
				title="Sizes"
				description="sm, md and lg come from the icon size tokens. A number sets the size directly."
			>
				<Panel>
					<View
						style={{
							flexDirection: "row",
							alignItems: "flex-end",
							gap: tokens.spacing[5],
						}}
					>
						{(["sm", "md", "lg", 32] as const).map((size) => (
							<View
								key={size}
								style={{ alignItems: "center", gap: tokens.spacing[1] }}
							>
								<Icon name="favorite" size={size} />
								<Label muted>{size}</Label>
							</View>
						))}
					</View>
				</Panel>
			</Section>

			<Section
				title="Colors"
				description="Theme colors follow light and dark."
			>
				<Panel>
					{COLORS.map((color) => (
						<Row key={color} label={color}>
							<Icon name="info" color={color} />
						</Row>
					))}
				</Panel>
			</Section>

			<Section title="Accessibility">
				<Panel>
					<Row
						label="Privacy"
						description="Decorative: the row label already says it all"
					>
						<Icon name="chevron-right" size="sm" color="subtle" />
					</Row>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: tokens.spacing[2],
						}}
					>
						<Text weight="semibold">Axiom</Text>
						<Icon
							name="check"
							size="sm"
							color="link"
							accessibilityLabel="Verified account"
						/>
					</View>
					<Label muted>
						The check carries meaning, so it has an accessibilityLabel.
					</Label>
				</Panel>
			</Section>
		</Screen>
	);
}
