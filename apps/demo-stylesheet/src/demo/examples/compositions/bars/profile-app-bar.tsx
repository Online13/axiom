import { ProfileAppBar } from "@/components/compositions/profile-app-bar";
import { IconButton } from "@/components/ui/icon-button";
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
					>
						<IconButton
							icon="notifications"
							badge={3}
							accessibilityLabel="Notifications"
							onPress={notify("Notifications")}
						/>
						<IconButton
							icon="settings"
							accessibilityLabel="Settings"
							onPress={notify("Settings")}
						/>
					</ProfileAppBar>
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
					>
						<IconButton
							icon="notifications"
							badge
							accessibilityLabel="Notifications"
							onPress={notify("Notifications")}
						/>
					</ProfileAppBar>
				</Bleed>
			</Section>
		</Screen>
	);
}
