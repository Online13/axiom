import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Radio, RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function RadioScreen() {
	const [disabled, setDisabled] = useState(false);
	const [delivery, setDelivery] = useState("standard");
	const [plan, setPlan] = useState("personal");

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
			</Panel>

			<Section title="Radio" description={`Selected: ${delivery}`}>
				<Panel>
					<RadioGroup
						value={delivery}
						onValueChange={setDelivery}
						disabled={disabled}
						accessibilityLabel="Delivery"
					>
						<Radio
							value="standard"
							label="Standard"
							description="3–5 business days"
						/>
						<Radio
							value="express"
							label="Express"
							description="Tomorrow before 12:00"
						/>
						<Radio
							value="pickup"
							label="Pick up in store"
							description="Unavailable today"
							disabled
						/>
					</RadioGroup>
				</Panel>
			</Section>

			<Section title="Horizontal and custom rows">
				<Panel>
					<RadioGroup
						orientation="horizontal"
						gap={6}
						defaultValue="maybe"
						disabled={disabled}
						accessibilityLabel="Attending"
					>
						<Radio value="yes" label="Yes" />
						<Radio value="maybe" label="Maybe" />
						<Radio value="no" label="No" />
					</RadioGroup>
					<RadioGroup
						value={plan}
						onValueChange={setPlan}
						disabled={disabled}
						accessibilityLabel="Plan"
					>
						{["personal", "team"].map((value) => (
							<Radio
								key={value}
								value={value}
								accessibilityLabel={value}
							>
								{({ checked }) => (
									<View style={styles.card(checked)}>
										<Text weight="semibold">
											{value === "personal" ? "Personal" : "Team"}
										</Text>
										<Label muted>
											{value === "personal"
												? "For one person"
												: "Up to 10 people"}
										</Label>
									</View>
								)}
							</Radio>
						))}
					</RadioGroup>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	// The whole card reads as the control, so it carries the checked state.
	card: (checked: boolean) => ({
		padding: theme.tokens.spacing[4],
		gap: theme.tokens.spacing[1],
		borderRadius: theme.tokens.radius.lg,
		borderWidth: checked ? 2 : 1,
		borderColor: checked
			? theme.colors.border.focus
			: theme.colors.border.default,
	}),
}));
