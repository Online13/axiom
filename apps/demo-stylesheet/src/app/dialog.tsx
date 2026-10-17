import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function DialogScreen() {
	const { colors } = useTheme();
	const [events, setEvents] = useState<string[]>([]);
	const [signOutOpen, setSignOutOpen] = useState(false);
	const [signingOut, setSigningOut] = useState(false);
	const log = (event: string) =>
		setEvents((previous) => [event, ...previous].slice(0, 4));

	return (
		<Screen>
			<Section
				title="Dialog"
				description="Backdrop and Android back close it, unless it isn't dismissible."
			>
				<Panel>
					<Dialog.Root
						onOpenChange={(open) =>
							log(`delete: ${open ? "open" : "closed"}`)
						}
					>
						<Dialog.Trigger asChild>
							<Button variant="destructive" leadingIcon="delete">
								Delete draft
							</Button>
						</Dialog.Trigger>
						<Dialog.Content
							media={
								<View
									style={{
										width: 48,
										height: 48,
										borderRadius: 24,
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: colors.feedback.errorSubtle,
									}}
								>
									<Icon name="delete" color="error" />
								</View>
							}
							onDismiss={() => log("delete: dismissed")}
						>
							<Dialog.Title>Delete this draft?</Dialog.Title>
							<Dialog.Description>{`"Launch announcement" will be deleted. You can't undo this.`}</Dialog.Description>
							<Dialog.Actions>
								<Dialog.Cancel>Cancel</Dialog.Cancel>
								<Dialog.Action
									destructive
									onPress={() => log("delete: confirmed")}
								>
									Delete
								</Dialog.Action>
							</Dialog.Actions>
						</Dialog.Content>
					</Dialog.Root>

					<Dialog.Root>
						<Dialog.Trigger asChild>
							<Button variant="outline">Unsaved changes</Button>
						</Dialog.Trigger>
						<Dialog.Content dismissible={false}>
							<Dialog.Title>Save changes?</Dialog.Title>
							<Dialog.Description>
								You edited the event title and time.
							</Dialog.Description>
							<Dialog.Actions orientation="vertical">
								<Dialog.Action onPress={() => log("saved")}>
									Save
								</Dialog.Action>
								<Dialog.Action
									variant="ghost"
									destructive
									onPress={() => log("discarded")}
								>
									Discard
								</Dialog.Action>
								<Dialog.Cancel>Keep editing</Dialog.Cancel>
							</Dialog.Actions>
						</Dialog.Content>
					</Dialog.Root>

					<Dialog.Root open={signOutOpen} onOpenChange={setSignOutOpen}>
						<Dialog.Trigger asChild>
							<Button variant="ghost">
								Sign out everywhere (async)
							</Button>
						</Dialog.Trigger>
						<Dialog.Content dismissible={!signingOut}>
							<Dialog.Title>Sign out of all devices?</Dialog.Title>
							<Dialog.Description>
								{"You'll need to sign in again on each one."}
							</Dialog.Description>
							<Dialog.Actions>
								<Dialog.Cancel disabled={signingOut}>
									Cancel
								</Dialog.Cancel>
								<Dialog.Action
									closeOnPress={false}
									loading={signingOut}
									onPress={() => {
										setSigningOut(true);
										setTimeout(() => {
											setSigningOut(false);
											setSignOutOpen(false);
											log("signed out");
										}, 1500);
									}}
								>
									Sign out
								</Dialog.Action>
							</Dialog.Actions>
						</Dialog.Content>
					</Dialog.Root>

					<Label muted>
						{events.length ? events.join("\n") : "Events show up here."}
					</Label>
				</Panel>
			</Section>
		</Screen>
	);
}
