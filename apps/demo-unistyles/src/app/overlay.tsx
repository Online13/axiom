import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Overlay } from "@/components/core/overlay";
import { Portal, usePortal } from "@/components/core/portal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function OverlayScreen({
	focus = "overlay",
}: {
	focus?: "overlay" | "portal";
}) {
	const { isHostAvailable } = usePortal();
	const [open, setOpen] = useState(false);
	const [dismissible, setDismissible] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [events, setEvents] = useState<string[]>([]);

	if (open && !mounted) setMounted(true);
	const record = (entry: string) =>
		setEvents((list) => [entry, ...list].slice(0, 4));

	return (
		<Screen>
			<Section
				title={focus === "portal" ? "Portal" : "Overlay"}
				description={
					focus === "portal"
						? "This content is declared here and rendered in the root PortalHost."
						: "The backdrop fades, blocks touches and can close its content."
				}
			>
				<Panel>
					<Label muted>
						Root host mounted: {isHostAvailable ? "yes" : "no"}
					</Label>
					<Row
						label="Close on backdrop press"
						description="Off: the overlay blocks the screen but ignores presses"
					>
						<Switch
							value={dismissible}
							onValueChange={setDismissible}
							accessibilityLabel="Close on backdrop press"
						/>
					</Row>
					<Button fullWidth onPress={() => setOpen(true)}>
						Open dialog
					</Button>
					<Label muted>
						{events.length ? events.join(" · ") : "No event yet"}
					</Label>
				</Panel>
			</Section>

			<Portal>
				<Overlay
					visible={open}
					onPress={
						dismissible
							? () => {
									record("backdrop press");
									setOpen(false);
								}
							: undefined
					}
					onExited={() => {
						record("onExited");
						setMounted(false);
					}}
				/>
				{mounted ? (
					<View accessibilityViewIsModal style={styles.dialog(open)}>
						<Title variant="headingSm">Dialog</Title>
						<Text color="muted">
							{dismissible
								? "Press the backdrop or the button to close."
								: "Only the button closes it."}
						</Text>
						<Button
							fullWidth
							onPress={() => {
								record("button");
								setOpen(false);
							}}
						>
							Close
						</Button>
					</View>
				) : null}
			</Portal>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	// Dims while the overlay plays its exit animation.
	dialog: (open: boolean) => ({
		position: "absolute",
		left: theme.tokens.spacing[8],
		right: theme.tokens.spacing[8],
		top: "35%",
		padding: theme.tokens.spacing[5],
		gap: theme.tokens.spacing[3],
		borderRadius: theme.tokens.radius.xl,
		backgroundColor: theme.colors.background.elevated,
		opacity: open ? 1 : 0.6,
	}),
}));
