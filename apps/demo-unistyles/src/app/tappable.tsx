import { useState } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function TappableScreen() {
	// Tappable takes its style as a function of the press state, so the values are read here.
	const { theme } = useUnistyles();
	const [disabled, setDisabled] = useState(false);
	const [showAreas, setShowAreas] = useState(true);
	const [log, setLog] = useState<string[]>([]);

	const record = (entry: string) =>
		setLog((entries) => [entry, ...entries].slice(0, 5));
	const outline = theme.components.button.outline;

	return (
		<Screen>
			<Panel>
				<Row label="Disabled">
					<Switch
						value={disabled}
						onValueChange={setDisabled}
						accessibilityLabel="Disabled"
					/>
				</Row>
				<Row
					label="Touch areas"
					description="Outline the 44pt area of the small elements"
				>
					<Switch
						value={showAreas}
						onValueChange={setShowAreas}
						accessibilityLabel="Touch areas"
					/>
				</Row>
			</Panel>

			<Section
				title="Pressed state"
				description="Slide your finger off before releasing to cancel the press."
			>
				<Tappable
					disabled={disabled}
					onPress={() => record("onPress")}
					onLongPress={() => record("onLongPress")}
					style={({ pressed }) => {
						const state = {
							...outline.default,
							...(disabled
								? outline.disabled
								: pressed
									? outline.pressed
									: undefined),
						};
						return {
							padding: theme.tokens.spacing[4],
							borderRadius: theme.tokens.radius.lg,
							borderWidth: 1,
							borderColor: state.border,
							backgroundColor: state.background,
						};
					}}
				>
					{({ pressed }) => (
						<Text color={disabled ? "disabled" : "default"}>
							{pressed ? "Pressed" : "Press or long press me"}
						</Text>
					)}
				</Tappable>
				<Label muted>{log.length ? log.join(" · ") : "No press yet"}</Label>
			</Section>

			<Section
				title="Touch target"
				description={`Elements smaller than ${theme.tokens.metrics.touchTarget}pt get hitSlop up to ${theme.tokens.metrics.touchTarget}pt on each axis.`}
			>
				<Panel>
					<View style={styles.targets}>
						{[
							{ label: "20×20", width: 20, height: 20 },
							{ label: "64×28", width: 64, height: 28 },
							{ label: "44×44", width: 44, height: 44 },
						].map((item) => (
							<View key={item.label} style={styles.target}>
								<View style={styles.targetBox}>
									{showAreas ? (
										<View
											style={styles.touchArea(
												item.width,
												item.height,
											)}
										/>
									) : null}
									<Tappable
										disabled={disabled}
										accessibilityLabel={`Target ${item.label}`}
										onPress={() => record(item.label)}
										style={({ pressed }) => ({
											width: item.width,
											height: item.height,
											borderRadius: theme.tokens.radius.sm,
											backgroundColor: disabled
												? theme.colors.content.disabled
												: pressed
													? theme.colors.content.muted
													: theme.colors.content.default,
										})}
									/>
								</View>
								<Label>{item.label}</Label>
							</View>
						))}
					</View>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	targets: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	target: { alignItems: "center", gap: theme.tokens.spacing[3] },
	targetBox: {
		width: 72,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
	},
	touchArea: (width: number, height: number) => ({
		position: "absolute",
		width: Math.max(width, theme.tokens.metrics.touchTarget),
		height: Math.max(height, theme.tokens.metrics.touchTarget),
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: theme.colors.feedback.info,
		backgroundColor: theme.colors.feedback.infoSubtle,
		borderRadius: theme.tokens.radius.sm,
	}),
}));
