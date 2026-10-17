import { useState } from "react";
import { View } from "react-native";

import { ContextMenu } from "@/components/ui/context-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function MenuScreen() {
	const { tokens, colors } = useTheme();
	const [events, setEvents] = useState<string[]>([]);
	const [sort, setSort] = useState("date");
	const log = (event: string) =>
		setEvents((previous) => [event, ...previous].slice(0, 4));

	return (
		<Screen>
			<Section
				title="Menu"
				description={`Sort: ${sort}. Long press the card, or press the button.`}
			>
				<Panel>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Text weight="semibold">Documents</Text>
						<Menu.Root>
							<Menu.Trigger asChild>
								<IconButton
									icon="settings"
									variant="tinted"
									accessibilityLabel="More"
								/>
							</Menu.Trigger>
							<Menu.Content align="end">
								<Menu.Group label="Sort by">
									{["date", "name", "size"].map((value) => (
										<Menu.Item
											key={value}
											checked={sort === value}
											onPress={() => setSort(value)}
										>
											{value[0].toUpperCase() + value.slice(1)}
										</Menu.Item>
									))}
								</Menu.Group>
								<Menu.Separator />
								<Menu.Sub label="Share" icon="share">
									<Menu.Item onPress={() => log("copied link")}>
										Copy link
									</Menu.Item>
									<Menu.Item
										subtitle="Only people you invite"
										onPress={() => log("invited")}
									>
										Invite people
									</Menu.Item>
								</Menu.Sub>
								<Menu.Item disabled>Archive</Menu.Item>
							</Menu.Content>
						</Menu.Root>
					</View>
				</Panel>

				<ContextMenu.Root
					onOpenChange={(open) =>
						log(`context menu: ${open ? "open" : "closed"}`)
					}
				>
					<ContextMenu.Trigger>
						<View
							style={{
								padding: tokens.spacing[4],
								gap: tokens.spacing[1],
								borderRadius: tokens.radius.lg,
								backgroundColor: colors.background.elevated,
							}}
						>
							<Text weight="semibold">Launch announcement</Text>
							<Text variant="bodySm" color="muted">
								Long press for options. The card lifts above the
								backdrop.
							</Text>
						</View>
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item icon="share" onPress={() => log("share")}>
							Share
						</ContextMenu.Item>
						<ContextMenu.Item icon="favorite" onPress={() => log("favorite")}>
							Add to favorites
						</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item
							icon="delete"
							destructive
							onPress={() => log("delete")}
						>
							Delete
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
				<Label muted>
					{events.length ? events.join("\n") : "Events show up here."}
				</Label>
			</Section>
		</Screen>
	);
}
