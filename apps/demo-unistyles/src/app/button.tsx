import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
	Button,
	type ButtonSize,
	type ButtonVariant,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const VARIANTS: ButtonVariant[] = ["solid", "outline", "ghost"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

export default function ButtonScreen() {
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [presses, setPresses] = useState(0);
	const [paying, setPaying] = useState(false);
	const [formValid, setFormValid] = useState(false);

	const pay = () => {
		setPaying(true);
		setTimeout(() => setPaying(false), 2000);
	};

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
				<Row label="Loading">
					<Switch
						value={loading}
						onValueChange={setLoading}
						accessibilityLabel="Loading"
					/>
				</Row>
				<Label muted>Presses: {presses}</Label>
			</Panel>

			<Section
				title="Variants and sizes"
				description="sm is 32pt tall but keeps a 44pt touch area."
			>
				<Panel>
					{VARIANTS.map((variant) => (
						<View key={variant} style={styles.variant}>
							<Label muted>{variant}</Label>
							<View style={styles.variantRow}>
								{SIZES.map((size) => (
									<Button
										key={size}
										variant={variant}
										size={size}
										disabled={disabled}
										loading={loading}
										onPress={() => setPresses((value) => value + 1)}
									>
										{size}
									</Button>
								))}
							</View>
						</View>
					))}
				</Panel>
			</Section>

			<Section title="Icons">
				<Panel>
					<Button
						leadingIcon="add"
						disabled={disabled}
						loading={loading}
						onPress={() => setPresses((value) => value + 1)}
					>
						Leading icon
					</Button>
					<Button
						variant="outline"
						trailingIcon="chevron-right"
						disabled={disabled}
						onPress={() => setPresses((value) => value + 1)}
					>
						Trailing icon
					</Button>
				</Panel>
			</Section>

			<Section title="Main action at the bottom of a form">
				<Panel>
					<Button
						size="lg"
						fullWidth
						onPress={() => setPresses((value) => value + 1)}
					>
						Sign in
					</Button>
					<Button variant="ghost" fullWidth>
						Create an account
					</Button>
				</Panel>
			</Section>

			<Section title="Waiting for a request">
				<Panel>
					<Button size="lg" fullWidth loading={paying} onPress={pay}>
						{paying ? "Paying" : "Pay $88.90"}
					</Button>
				</Panel>
			</Section>

			<Section title="Disabled until the form is valid">
				<Panel>
					<Row label="Form is valid">
						<Switch
							value={formValid}
							onValueChange={setFormValid}
							accessibilityLabel="Form is valid"
						/>
					</Row>
					<Button
						fullWidth
						disabled={!formValid}
						onPress={() => setPresses((value) => value + 1)}
					>
						Save
					</Button>
				</Panel>
			</Section>

			<Section title="Primary and secondary side by side">
				<Card variant="outlined">
					<Card.Header>
						<Card.Title>Team offsite</Card.Title>
						<Card.Description>Friday, 10:00 · Lisbon</Card.Description>
					</Card.Header>
					<Card.Footer>
						<Button
							variant="outline"
							style={styles.grow}
							onPress={() => setPresses((value) => value + 1)}
						>
							Decline
						</Button>
						<Button
							style={styles.grow}
							onPress={() => setPresses((value) => value + 1)}
						>
							Accept
						</Button>
					</Card.Footer>
				</Card>
			</Section>

			<Section title="Label with an icon">
				<Panel>
					<Button
						size="lg"
						leadingIcon="add"
						style={styles.grow}
						onPress={() => setPresses((value) => value + 1)}
					>
						Add to cart
					</Button>
				</Panel>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	variant: { gap: theme.tokens.spacing[2] },
	variantRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	grow: { flex: 1 },
}));
