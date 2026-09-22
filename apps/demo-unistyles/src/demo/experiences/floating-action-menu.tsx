import { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Overlay } from "@/components/core/overlay";
import { Tappable } from "@/components/core/tappable";
import { FloatingButton } from "@/components/ui/floating-button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useOverlayBackHandler } from "@/hooks/use-overlay-back-handler";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

const ACTIONS: { icon: IconName; label: string }[] = [
	{ icon: "edit", label: "Text note" },
	{ icon: "check", label: "Checklist" },
	{ icon: "image", label: "Photo" },
];

export default function FloatingActionMenuScreen() {

	const [open, setOpen] = useState(false);
	const [log, setLog] = useState(
		"One entry point for creating; the choice comes after.",
	);

	// The back gesture closes the menu instead of leaving the screen.
	useOverlayBackHandler(open, () => setOpen(false));

	const pick = (label: string) => {
		setOpen(false);
		setLog(`${label} created.`);
	};

	return (
		<ExperienceScreen>
			<Note>{log}</Note>
			<View style={styles.fill}>
				<ScrollView
					contentContainerStyle={styles.content}
				>
					{fakeRows(10).map((row) => (
						<ListRow
							key={row.id}
							title={row.title}
							subtitle={row.subtitle}
						/>
					))}
				</ScrollView>

				<Overlay visible={open} onPress={() => setOpen(false)} />

				{open ? (
					<View style={styles.actions}>
						{ACTIONS.map((action) => (
							<Tappable
								key={action.label}
								accessibilityRole="button"
								accessibilityLabel={action.label}
								onPress={() => pick(action.label)}
								style={styles.action}
							>
								<Text weight="medium" style={styles.actionLabel}>
									{action.label}
								</Text>
								<View style={styles.bubble}>
									<Icon name={action.icon} size="sm" />
								</View>
							</Tappable>
						))}
					</View>
				) : null}

				<FloatingButton
					icon={open ? "close" : "add"}
					accessibilityLabel={open ? "Close the create menu" : "Create"}
					onPress={() => setOpen((current) => !current)}
				/>
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	fill: { flex: 1 },
	content: { paddingBottom: theme.tokens.spacing[12] * 2 },
	// The actions rise from the button, right above it.
	actions: {
		position: "absolute",
		right: 0,
		bottom: 72,
		alignItems: "flex-end",
		padding: theme.tokens.metrics.screenMargin,
		gap: theme.tokens.spacing[3],
	},
	action: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	// The labels read over the backdrop, not over a surface.
	actionLabel: { color: theme.colors.content.inverse },
	bubble: {
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.full,
		backgroundColor: theme.colors.background.elevated,
	},
}));
