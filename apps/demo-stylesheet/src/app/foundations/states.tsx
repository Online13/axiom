import { StyleSheet, Text as RNText, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";
import { useTheme } from "@/theme";

type TokenStates = Record<string, Record<string, string> | undefined>;

export default function States() {
	const { tokens, colors, components } = useTheme();

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Component tokens of the components in this project. Each state only
				lists what changes from default.
			</Text>
			{Object.entries(components).map(([component, variants]) => (
				<Panel key={component}>
					<RNText
						style={[
							tokens.typography.headline,
							{ color: colors.content.default },
						]}
					>
						{component}
					</RNText>
					{Object.entries(variants as Record<string, TokenStates>).map(
						([variant, states]) => (
							<View key={variant} style={{ gap: tokens.spacing[2] }}>
								<Label muted>{variant}</Label>
								{Object.entries(states).map(([state, properties]) => (
									<View
										key={state}
										style={[
											styles.row,
											styles.center,
											{ gap: tokens.spacing[2] },
										]}
									>
										<View style={styles.stateName}>
											<Label>{state}</Label>
										</View>
										<View
											style={[
												styles.wrap,
												styles.flex,
												{ gap: tokens.spacing[2] },
											]}
										>
											{Object.entries(properties ?? {}).map(
												([property, value]) => (
													<View
														key={property}
														style={[
															styles.row,
															styles.center,
															{ gap: tokens.spacing[1] },
														]}
													>
														<View
															style={{
																width: tokens.sizes.icon.md,
																height: tokens.sizes.icon.md,
																borderRadius:
																	tokens.radius.sm,
																borderWidth:
																	tokens.metrics.hairline,
																borderColor:
																	colors.border.strong,
																backgroundColor: value,
															}}
														/>
														<Label muted>{property}</Label>
													</View>
												),
											)}
										</View>
									</View>
								))}
							</View>
						),
					)}
				</Panel>
			))}
		</Screen>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1 },
	row: { flexDirection: "row" },
	wrap: { flexDirection: "row", flexWrap: "wrap" },
	center: { alignItems: "center" },
	stateName: { width: 64 },
});
