import { View } from "react-native";

import { Alert } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { Panel } from "@/demo/section";
import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();

	return (
		<ExperienceScreen>
			<View
				style={{
					padding: tokens.metrics.screenMargin,
					gap: tokens.spacing[6],
				}}
			>
				<Alert variant="info" title="Specified, not implemented">
					This behavior waits for the `useDragToReorder` hook. The screen
					describes what it will do, so the demo doesn&apos;t promise an
					interaction the registry can&apos;t install yet.
				</Alert>

				<View style={{ gap: tokens.spacing[3] }}>
					<Title variant="subheading">The four moments</Title>
					<Panel>
						{STEPS.map(([step, description], index) => (
							<View
								key={step}
								style={{ flexDirection: "row", gap: tokens.spacing[3] }}
							>
								<Text variant="bodySm" color="muted" weight="semibold">
									{index + 1}
								</Text>
								<View style={{ flex: 1, gap: 2 }}>
									<Text weight="medium">{step}</Text>
									<Text variant="bodySm" color="muted">
										{description}
									</Text>
								</View>
							</View>
						))}
					</Panel>
				</View>

				<View style={{ gap: tokens.spacing[3] }}>
					<Title variant="subheading">The list it applies to</Title>
					<View
						style={{
							overflow: "hidden",
							borderRadius: tokens.radius.lg,
							borderWidth: tokens.metrics.hairline,
							borderColor: colors.border.default,
							backgroundColor: colors.background.elevated,
						}}
					>
						{["Inbox", "Today", "Projects", "Archive"].map(
							(row, index) => (
								<View
									key={row}
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: tokens.spacing[3],
										paddingHorizontal: tokens.spacing[4],
										paddingVertical: tokens.spacing[3],
										borderTopWidth:
											index === 0 ? 0 : tokens.metrics.hairline,
										borderTopColor: colors.border.subtle,
									}}
								>
									<Text style={{ flex: 1 }}>{row}</Text>
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
