import { Text as RNText, View } from "react-native";

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
										className="flex-row items-center"
										style={{ gap: tokens.spacing[2] }}
									>
										<View className="w-[64px]">
											<Label>{state}</Label>
										</View>
										<View
											className="flex-row flex-wrap flex-1"
											style={{ gap: tokens.spacing[2] }}
										>
											{Object.entries(properties ?? {}).map(
												([property, value]) => (
													<View
														key={property}
														className="flex-row items-center"
														style={{ gap: tokens.spacing[1] }}
													>
														<View
															style={{
																width: tokens.sizes.icon.md,
																height: tokens.sizes.icon.md,
																borderRadius: tokens.radius.sm,
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
