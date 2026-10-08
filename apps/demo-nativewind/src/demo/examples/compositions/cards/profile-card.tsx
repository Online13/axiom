import { useState } from "react";

import { ProfileCard } from "@/components/compositions/profile-card";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars } from "../fixtures";
import { notify } from "../shared";

export default function ProfileCardScreen() {
	const [following, setFollowing] = useState(false);

	return (
		<Screen>
			<Section title="ProfileCard" description="Stats, follow and message.">
				<ProfileCard
					name="Maya Chen"
					handle="@mayachen"
					avatar={avatars.maya}
					bio="Product designer. Coffee, film cameras and long walks."
					stats={[
						{ value: "248", label: "Posts" },
						{ value: "12.4k", label: "Followers" },
						{ value: "310", label: "Following" },
					]}
					following={following}
					onFollow={() => setFollowing((value) => !value)}
					onMessage={notify("Message Maya")}
				/>
			</Section>
		</Screen>
	);
}
