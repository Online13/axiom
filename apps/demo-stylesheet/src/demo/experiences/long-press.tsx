import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { ContextMenu } from "@/components/ui/context-menu";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import { ExperienceScreen, Note } from "./shared";

const FILES = [
	{ name: "Quarterly report.pdf", size: "2.4 MB" },
	{ name: "Contract – signed.pdf", size: "780 KB" },
	{ name: "Moodboard.png", size: "5.1 MB" },
	{ name: "Budget 2026.xlsx", size: "340 KB" },
];

export default function LongPressScreen() {
	const { tokens, colors } = useTheme();
	const [log, setLog] = useState("Hold a row for half a second.");

	return (
		<ExperienceScreen>
			<Note>{log}</Note>
			<ScrollView
				contentContainerStyle={{
					padding: tokens.metrics.screenMargin,
					gap: tokens.spacing[3],
				}}
			>
				{FILES.map((file) => (
					<ContextMenu.Root key={file.name}>
						{/* No `action`: the trigger opens on a long press, and a tap stays a tap. */}
						<ContextMenu.Trigger>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: tokens.spacing[3],
									padding: tokens.spacing[4],
									borderRadius: tokens.radius.lg,
									borderWidth: tokens.metrics.hairline,
									borderColor: colors.border.default,
									backgroundColor: colors.background.elevated,
								}}
							>
								<Icon name="file" color="muted" />
								<View style={{ flex: 1, gap: 2 }}>
									<Text weight="medium">{file.name}</Text>
									<Text variant="footnote" color="muted">
										{file.size}
									</Text>
								</View>
							</View>
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item
								icon="share"
								onPress={() => setLog(`Shared ${file.name}`)}
							>
								Share
							</ContextMenu.Item>
							<ContextMenu.Item
								icon="favorite"
								onPress={() =>
									setLog(`${file.name} added to favorites`)
								}
							>
								Add to favorites
							</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item
								icon="delete"
								destructive
								onPress={() => setLog(`Deleted ${file.name}`)}
							>
								Delete
							</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				))}
				<Text variant="footnote" color="muted">
					Release early and it&apos;s a tap. Move before the delay and the
					press is cancelled, like a finger that starts scrolling.
				</Text>
			</ScrollView>
		</ExperienceScreen>
	);
}
