import { Text as RNText, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import { Screen } from "@/demo/screen";
import { Label, Panel } from "@/demo/section";

type TokenStates = Record<string, Record<string, string> | undefined>;

export default function States() {
	const { theme } = useUnistyles();

	return (
		<Screen>
			<Text variant="bodySm" color="muted">
				Component tokens of the components in this project. Each state only
				lists what changes from default.
			</Text>
			{Object.entries(theme.components).map(([component, variants]) => (
				<Panel key={component}>
					<RNText style={styles.heading}>{component}</RNText>
					{Object.entries(variants as Record<string, TokenStates>).map(
						([variant, states]) => (
							<View key={variant} style={styles.variant}>
								<Label muted>{variant}</Label>
								{Object.entries(states).map(([state, properties]) => (
									<View key={state} style={styles.stateRow}>
										<View style={styles.stateName}>
											<Label>{state}</Label>
										</View>
										<View style={styles.stateValues}>
											{Object.entries(properties ?? {}).map(
												([property, value]) => (
													<View
														key={property}
														style={styles.stateValue}
													>
														<View
															style={styles.stateSwatch(
																value,
															)}
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

const styles = StyleSheet.create((theme) => ({
	heading: {
		...theme.tokens.typography.headline,
		color: theme.colors.content.default,
	},
	variant: { gap: theme.tokens.spacing[2] },
	stateRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	stateName: { width: 64 },
	stateValues: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[2],
	},
	stateValue: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	stateSwatch: (color: string) => ({
		width: theme.tokens.sizes.icon.md,
		height: theme.tokens.sizes.icon.md,
		borderRadius: theme.tokens.radius.sm,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.strong,
		backgroundColor: color,
	}),
}));
