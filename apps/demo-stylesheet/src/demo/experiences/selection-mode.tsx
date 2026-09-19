import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ToolBar } from "@/components/ui/tool-bar";
import { useTheme } from "@/theme";

import { ExperienceScreen, Note } from "./shared";

const PHOTOS = Array.from({ length: 12 }, (_, index) => ({
	id: index,
	label: `Photo ${index + 1}`,
}));

export default function SelectionModeScreen() {
	const { tokens, colors } = useTheme();
	const [photos, setPhotos] = useState(PHOTOS);
	const [selecting, setSelecting] = useState(false);
	const [selected, setSelected] = useState<number[]>([]);
	const [announce, setAnnounce] = useState(
		"Hold a photo to enter the mode with it selected.",
	);

	const enter = (id: number) => {
		setSelecting(true);
		setSelected([id]);
		setAnnounce("Selection mode on. 1 photo selected.");
	};

	const toggle = (id: number) => {
		const next = selected.includes(id)
			? selected.filter((item) => item !== id)
			: [...selected, id];
		setSelected(next);
		// Deselecting everything doesn't leave the mode: only Done and Delete do.
		setAnnounce(
			next.length === 0
				? "Nothing selected. Still in selection mode."
				: `${next.length} photos selected.`,
		);
	};

	const leave = (message: string) => {
		setSelecting(false);
		setSelected([]);
		setAnnounce(message);
	};

	return (
		<ExperienceScreen
			actions={
				<Button
					variant="ghost"
					size="sm"
					onPress={() =>
						selecting
							? leave("Selection mode off.")
							: (setSelecting(true),
								setAnnounce("Selection mode on. Nothing selected."))
					}
				>
					{selecting ? "Done" : "Select"}
				</Button>
			}
		>
			<Note>{announce}</Note>
			<View style={styles.fill}>
				<View
					style={[
						styles.grid,
						{ padding: tokens.spacing[2], gap: tokens.spacing[2] },
					]}
				>
					{photos.map((photo) => {
						const isSelected = selected.includes(photo.id);

						return (
							<Tappable
								key={photo.id}
								accessibilityRole="imagebutton"
								accessibilityLabel={photo.label}
								accessibilityState={{ selected: isSelected }}
								onPress={() =>
									selecting
										? toggle(photo.id)
										: setAnnounce(`${photo.label} opened.`)
								}
								onLongPress={() =>
									selecting ? toggle(photo.id) : enter(photo.id)
								}
								style={[
									styles.tile,
									{
										borderRadius: tokens.radius.md,
										backgroundColor: colors.background.elevated,
										borderWidth: isSelected
											? 2
											: tokens.metrics.hairline,
										borderColor: isSelected
											? colors.content.link
											: colors.border.default,
									},
								]}
							>
								<Text variant="caption" color="muted">
									{photo.id + 1}
								</Text>
								{isSelected ? (
									<View
										style={[
											styles.check,
											{ backgroundColor: colors.content.link },
										]}
									>
										<Icon name="check" size={14} color="inverse" />
									</View>
								) : null}
							</Tappable>
						);
					})}
				</View>
				<View style={styles.bottom}>
					<ToolBar
						visible={selecting}
						accessibilityLabel="Selection actions"
						style={{ backgroundColor: colors.background.subtle }}
					>
						<ToolBar.Action
							icon="share"
							label="Share"
							disabled={selected.length === 0}
						/>
						<ToolBar.Action
							icon="favorite"
							label="Favorite"
							disabled={selected.length === 0}
						/>
						<ToolBar.Separator />
						<ToolBar.Action
							icon="delete"
							label="Delete"
							destructive
							disabled={selected.length === 0}
							onPress={() => {
								const count = selected.length;
								setPhotos((current) =>
									current.filter(
										(photo) => !selected.includes(photo.id),
									),
								);
								leave(
									`${count} photo${count > 1 ? "s" : ""} deleted. Selection mode off.`,
								);
							}}
						/>
					</ToolBar>
				</View>
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create({
	fill: { flex: 1 },
	grid: { flexDirection: "row", flexWrap: "wrap" },
	tile: {
		width: "31%",
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	check: {
		position: "absolute",
		top: 4,
		right: 4,
		width: 20,
		height: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	bottom: { position: "absolute", left: 0, right: 0, bottom: 0 },
});
