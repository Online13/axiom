import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Icon, icons, type IconColor, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

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
	const names = Object.keys(icons) as IconName[];

	return (
		<Screen>
			<Section
				title="Registry"
				description="Every icon of the app is declared once, in icons.tsx."
			>
				<Panel>
					<View style={styles.grid}>
						{names.map((name) => (
							<View key={name} style={styles.cell}>
								<View style={styles.tile}>
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
					<View style={styles.sizes}>
						{(["sm", "md", "lg", 32] as const).map((size) => (
							<View key={size} style={styles.size}>
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
					<View style={styles.verified}>
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

const styles = StyleSheet.create((theme) => ({
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[3],
	},
	cell: {
		width: "22%",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	tile: {
		padding: theme.tokens.spacing[3],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.colors.background.subtle,
	},
	sizes: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: theme.tokens.spacing[5],
	},
	size: { alignItems: "center", gap: theme.tokens.spacing[1] },
	verified: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
}));
