import { useState } from "react";

import { SettingsItem } from "@/components/compositions/settings-item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { List, notify } from "../shared";

export default function SettingsItemScreen() {
	const [push, setPush] = useState(true);

	return (
		<Screen>
			<Section
				title="SettingsItem"
				description="Navigation, value and switch rows."
			>
				<List>
					<SettingsItem
						icon="notifications"
						title="Notifications"
						trailing="switch"
						checked={push}
						onCheckedChange={setPush}
					/>
					<SettingsItem
						icon="settings"
						title="Language"
						value="English"
						onPress={notify("Language")}
					/>
					<SettingsItem
						icon="info"
						title="About"
						description="Version 1.0.0"
						onPress={notify("About")}
					/>
					<SettingsItem
						icon="location"
						title="Location"
						description="Needs a newer version of the app"
						disabled
						onPress={notify("Location")}
					/>
				</List>
			</Section>
		</Screen>
	);
}
