import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { SettingsSection } from "@/components/blocks/settings-section";
import { SettingsItem } from "@/components/compositions/settings-item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { Bleed, notify } from "../compositions/shared";

export default function SettingsSectionScreen() {
	const {
		theme: { tokens },
	} = useUnistyles();
	const [dark, setDark] = useState(false);
	const [push, setPush] = useState(true);

	return (
		<Screen>
			<Section
				title="SettingsSection"
				description="Titled groups of settings rows, as on a settings screen."
			>
				<Bleed>
					<View
						style={{
							gap: tokens.spacing[6],
							paddingVertical: tokens.spacing[2],
						}}
					>
						<SettingsSection
							title="General"
							footer="Location shows listings near you."
						>
							<SettingsItem
								icon="theme-dark"
								title="Dark mode"
								trailing="switch"
								checked={dark}
								onCheckedChange={setDark}
							/>
							<SettingsItem
								icon="location"
								title="Location"
								value="While using"
								onPress={notify("Location")}
							/>
						</SettingsSection>
						<SettingsSection title="Notifications">
							<SettingsItem
								icon="notifications"
								title="Push notifications"
								trailing="switch"
								checked={push}
								onCheckedChange={setPush}
							/>
							<SettingsItem
								icon="calendar"
								title="Quiet hours"
								value="22:00 – 07:00"
								onPress={notify("Quiet hours")}
							/>
						</SettingsSection>
					</View>
				</Bleed>
			</Section>
		</Screen>
	);
}
