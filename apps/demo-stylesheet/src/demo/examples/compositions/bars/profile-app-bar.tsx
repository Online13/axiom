import { ProfileAppBar } from "@/components/compositions/profile-app-bar";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars } from "../fixtures";
import { Bleed, notify } from "../shared";

export default function ProfileAppBarScreen() {
	return (
		<Screen>
			<Section
				title="ProfileAppBar"
				description="Greeting, avatar and actions, for a home screen."
			>
				<Bleed>
					<ProfileAppBar
						name="Maya"
						avatar={avatars.maya}
						greeting="Good morning"
						safeArea={false}
						onProfilePress={notify("Account")}
						actions={[
							{
								icon: "notifications",
								label: "Notifications",
								badge: 3,
								onPress: notify("Notifications"),
							},
							{
								icon: "settings",
								label: "Settings",
								onPress: notify("Settings"),
							},
						]}
					/>
				</Bleed>
			</Section>

			<Section
				title="Minimal"
				description="No greeting, a dot badge, bordered."
			>
				<Bleed>
					<ProfileAppBar
						name="Sam Park"
						avatar={avatars.sam}
						safeArea={false}
						bordered
						onProfilePress={notify("Account")}
						actions={[
							{
								icon: "notifications",
								label: "Notifications",
								badge: true,
								onPress: notify("Notifications"),
							},
						]}
					/>
				</Bleed>
			</Section>
		</Screen>
	);
}
