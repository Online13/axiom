import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Alert } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { Panel } from "@/demo/section";

import { ExperienceScreen } from "./shared";

const STEPS = [
	[
		"Lift",
		"A drag on the handle lifts the row at once. Anywhere else, a 300ms hold lifts it.",
	],
	[
		"Follow",
		"The row follows the finger above the list, with a shadow and a slight scale.",
	],
	[
		"Make room",
		"The other rows slide out of the way as the lifted one crosses their middle.",
	],
	[
		"Drop",
		"Released, the row settles in the free slot and the new order is saved.",
	],
];

export default function DragToReorderScreen() {


	return (
		<ExperienceScreen>
			<View style={styles.content}>
				<Alert variant="info" title="Specified, not implemented">
					This behavior waits for the `useDragToReorder` hook. The screen
					describes what it will do, so the demo doesn&apos;t promise an
					interaction the registry can&apos;t install yet.
				</Alert>

				<View style={styles.block}>
					<Title variant="subheading">The four moments</Title>
					<Panel>
						{STEPS.map(([step, description], index) => (
							<View key={step} style={styles.step}>
								<Text variant="bodySm" color="muted" weight="semibold">
									{index + 1}
								</Text>
								<View style={styles.stepText}>
									<Text weight="medium">{step}</Text>
									<Text variant="bodySm" color="muted">
										{description}
									</Text>
								</View>
							</View>
						))}
					</Panel>
				</View>

				<View style={styles.block}>
					<Title variant="subheading">The list it applies to</Title>
					<View style={styles.panel}>
						{["Inbox", "Today", "Projects", "Archive"].map(
							(row, index) => (
								<View key={row} style={styles.row(index === 0)}>
									<Text style={styles.rowLabel}>{row}</Text>
									<Icon
										name="minus"
										size="sm"
										color="subtle"
										accessibilityLabel="Drag handle"
									/>
								</View>
							),
						)}
					</View>
					<Text variant="footnote" color="muted">
						The handle on the right is the part a drag can grab without
						waiting for the long press.
					</Text>
				</View>
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	content: {
		padding: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[6],
	},
	block: { gap: theme.tokens.spacing[3] },
	step: { flexDirection: "row", gap: theme.tokens.spacing[3] },
	stepText: { flex: 1, gap: 2 },
	panel: {
		overflow: "hidden",
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
	// The first row sits against the panel edge, so it draws no separator.
	row: (first: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.spacing[4],
		paddingVertical: theme.tokens.spacing[3],
		borderTopWidth: first ? 0 : theme.tokens.metrics.hairline,
		borderTopColor: theme.colors.border.subtle,
	}),
	rowLabel: { flex: 1 },
}));
