import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const FILES = ["report.pdf", "budget.xlsx", "photo.jpg"];

export default function CheckboxScreen() {

	const [disabled, setDisabled] = useState(false);
	const [accepted, setAccepted] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [selected, setSelected] = useState<Set<string>>(
		new Set(["budget.xlsx"]),
	);
	const [delivery, setDelivery] = useState("standard");
	const [plan, setPlan] = useState("personal");

	const all = selected.size === FILES.length;
	const some = selected.size > 0 && !all;

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

			<Section title="Checkbox" description="The whole row is pressable.">
				<Panel>
					<Checkbox
						label="I agree to the Terms"
						description={
							submitted && !accepted
								? "Required to create an account."
								: "Read them before continuing."
						}
						checked={accepted}
						onCheckedChange={setAccepted}
						error={submitted && !accepted}
						disabled={disabled}
					/>
					<Button
						fullWidth
						disabled={disabled}
						onPress={() => setSubmitted(true)}
					>
						Create account
					</Button>
				</Panel>
			</Section>

			<Section
				title="Select all"
				description="The header checkbox is indeterminate when some rows are checked."
			>
				<Panel>
					<Checkbox
						label="Select all"
						checked={all ? true : some ? "indeterminate" : false}
						onCheckedChange={(value) =>
							setSelected(value ? new Set(FILES) : new Set())
						}
						disabled={disabled}
					/>
					{FILES.map((file) => (
						<Checkbox
							key={file}
							label={file}
							checked={selected.has(file)}
							disabled={disabled}
							onCheckedChange={(value) =>
								setSelected((previous) => {
									const next = new Set(previous);
									if (value) next.add(file);
									else next.delete(file);
									return next;
								})
							}
						/>
					))}
					<Checkbox
						label="Uncontrolled, on by default"
						defaultChecked
						disabled={disabled}
					/>
				</Panel>
			</Section>

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
