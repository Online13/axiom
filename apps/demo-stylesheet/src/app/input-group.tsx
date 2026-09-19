import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import { InputGroup } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const COUNTRIES = [
	{ flag: "🇬🇧", dialCode: "+44" },
	{ flag: "🇫🇷", dialCode: "+33" },
	{ flag: "🇲🇬", dialCode: "+261" },
];

export default function InputGroupScreen() {
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState(false);
	const [country, setCountry] = useState(0);
	const [code, setCode] = useState("SPRING20");
	const [applied, setApplied] = useState<string | null>(null);

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
				<Row label="Error">
					<Switch
						value={error}
						onValueChange={setError}
						accessibilityLabel="Error"
					/>
				</Row>
			</Panel>

			<Section
				title="Addons"
				description="The group draws the border; it turns blue while any input has focus."
			>
				<Panel>
					<InputGroup error={error} disabled={disabled}>
						<InputGroup.Addon>https://</InputGroup.Addon>
						<InputGroup.Input
							placeholder="example.com"
							autoCapitalize="none"
							keyboardType="url"
						/>
					</InputGroup>
					<InputGroup error={error} disabled={disabled}>
						<InputGroup.Input
							placeholder="72"
							keyboardType="decimal-pad"
							accessibilityLabel="Weight"
						/>
						<InputGroup.Addon variant="plain">kg</InputGroup.Addon>
					</InputGroup>
					<InputGroup error={error} disabled={disabled} divided={false}>
						<InputGroup.Addon variant="plain">
							<Icon name="search" size="sm" color="muted" />
						</InputGroup.Addon>
						<InputGroup.Input
							placeholder="Search, not divided"
							style={{ paddingLeft: 0 }}
						/>
					</InputGroup>
				</Panel>
			</Section>

			<Section
				title="Pressable addon"
				description="Tap the country code to cycle through countries."
			>
				<Panel>
					<InputGroup size="lg" error={error} disabled={disabled}>
						<InputGroup.Addon
							accessibilityLabel={`Country code ${COUNTRIES[country].dialCode}`}
							onPress={() =>
								setCountry((country + 1) % COUNTRIES.length)
							}
						>
							<Label>
								{COUNTRIES[country].flag} {COUNTRIES[country].dialCode}
							</Label>
							<Icon name="chevron-down" size="sm" color="muted" />
						</InputGroup.Addon>
						<InputGroup.Input
							keyboardType="phone-pad"
							autoComplete="tel"
							placeholder="7700 900123"
						/>
					</InputGroup>
				</Panel>
			</Section>

			<Section
				title="Inline button"
				description={
					applied ? `Applied: ${applied}` : "Nothing applied yet."
				}
			>
				<Panel>
					<InputGroup error={error} disabled={disabled}>
						<InputGroup.Input
							autoCapitalize="characters"
							value={code}
							onChangeText={setCode}
							accessibilityLabel="Promo code"
						/>
						<InputGroup.Button
							variant="ghost"
							disabled={!code}
							onPress={() => setApplied(code)}
						>
							Apply
						</InputGroup.Button>
					</InputGroup>
				</Panel>
			</Section>

			<Section
				title="Two inputs as one field"
				description="flex splits the width: 2/3 and 1/3."
			>
				<Panel>
					<InputGroup error={error} disabled={disabled} size="sm">
						<InputGroup.Input
							flex={2}
							placeholder="MM / YY"
							keyboardType="number-pad"
						/>
						<InputGroup.Input
							placeholder="CVC"
							keyboardType="number-pad"
							secureTextEntry
						/>
					</InputGroup>
				</Panel>
			</Section>
		</Screen>
	);
}
