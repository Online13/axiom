import { useState } from "react";
import { View } from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function TappableScreen() {
	const { tokens, colors, components } = useTheme();
	const [disabled, setDisabled] = useState(false);
	const [showAreas, setShowAreas] = useState(true);
	const [log, setLog] = useState<string[]>([]);

	const record = (entry: string) =>
		setLog((entries) => [entry, ...entries].slice(0, 5));
	const outline = components.button.outline;

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
							padding: tokens.spacing[4],
							borderRadius: tokens.radius.lg,
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
				description={`Elements smaller than ${tokens.metrics.touchTarget}pt get hitSlop up to ${tokens.metrics.touchTarget}pt on each axis.`}
			>
				<Panel>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-around",
						}}
					>
						{[
							{ label: "20×20", width: 20, height: 20 },
							{ label: "64×28", width: 64, height: 28 },
							{ label: "44×44", width: 44, height: 44 },
						].map((item) => (
							<View
								key={item.label}
								style={{ alignItems: "center", gap: tokens.spacing[3] }}
							>
								<View
									style={{
										width: 72,
										height: 56,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{showAreas ? (
										<View
											style={{
												position: "absolute",
												width: Math.max(
													item.width,
													tokens.metrics.touchTarget,
												),
												height: Math.max(
													item.height,
													tokens.metrics.touchTarget,
												),
												borderWidth: 1,
												borderStyle: "dashed",
												borderColor: colors.feedback.info,
												backgroundColor: colors.feedback.infoSubtle,
												borderRadius: tokens.radius.sm,
											}}
										/>
									) : null}
									<Tappable
										disabled={disabled}
										accessibilityLabel={`Target ${item.label}`}
										onPress={() => record(item.label)}
										style={({ pressed }) => ({
											width: item.width,
											height: item.height,
											borderRadius: tokens.radius.sm,
											backgroundColor: disabled
												? colors.content.disabled
												: pressed
													? colors.content.muted
													: colors.content.default,
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
