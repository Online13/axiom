import { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { ContextMenu } from "@/components/ui/context-menu";
import { Text } from "@/components/ui/text";

import { ExperienceScreen, Note } from "./shared";

const FILES = [
	{ name: "Quarterly report.pdf", size: "2.4 MB" },
	{ name: "Contract – signed.pdf", size: "780 KB" },
	{ name: "Moodboard.png", size: "5.1 MB" },
	{ name: "Budget 2026.xlsx", size: "340 KB" },
];

export default function LongPressScreen() {
	const [log, setLog] = useState("Hold a row for half a second.");

	return (
		<ExperienceScreen>
			<Note>{log}</Note>
			<ScrollView contentContainerStyle={styles.content}>
				{FILES.map((file) => (
					<ContextMenu.Root key={file.name}>
						{/* No `action`: the trigger opens on a long press, and a tap stays a tap. */}
						<ContextMenu.Trigger>
							<View style={styles.file}>
								<Icon name="file" color="muted" />
								<View style={styles.fileText}>
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

const styles = StyleSheet.create((theme) => ({
	content: {
		padding: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[3],
	},
	file: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		padding: theme.tokens.spacing[4],
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
	fileText: { flex: 1, gap: 2 },
}));
