// Index — "Discover things worth keeping." The one app the theme is judged on:
// a reading and saving app, neutral enough that its identity comes from the
// theme. Every screen, in the order a reader meets them.

import type { ComponentType } from "react";
import { DeviceFrame } from "../DeviceFrame";
import {
	Appearance,
	EditProfile,
	NotificationCenter,
	NotificationSettings,
	Profile,
	Settings,
} from "./account";
import { CreateAccount, SignIn, Verify } from "./auth";
import { Explore, Home, Search } from "./discovery";
import { Interests, Personalize, Welcome } from "./onboarding";
import { Article, Author, CollectionDetail } from "./reading";
import { RemoveDialog, SaveSheet, Saved, SavedEmpty } from "./saved";
import { ErrorState, Loading, Success } from "./states";

const screens: {
	name: string;
	Screen: ComponentType;
	/** Settings-style screens sit on the subtle background. */
	grouped?: boolean;
}[] = [
	{ name: "Welcome", Screen: Welcome },
	{ name: "Choose interests", Screen: Interests },
	{ name: "Personalize", Screen: Personalize },
	{ name: "Sign in", Screen: SignIn },
	{ name: "Create account", Screen: CreateAccount },
	{ name: "Verification", Screen: Verify },
	{ name: "Home", Screen: Home },
	{ name: "Explore", Screen: Explore },
	{ name: "Search", Screen: Search },
	{ name: "Article", Screen: Article },
	{ name: "Collection", Screen: CollectionDetail },
	{ name: "Author", Screen: Author },
	{ name: "Saved", Screen: Saved },
	{ name: "Saved · empty", Screen: SavedEmpty },
	{ name: "Profile", Screen: Profile },
	{ name: "Edit profile", Screen: EditProfile },
	{ name: "Settings", Screen: Settings, grouped: true },
	{ name: "Appearance", Screen: Appearance, grouped: true },
	{ name: "Notifications", Screen: NotificationSettings, grouped: true },
	{ name: "Activity", Screen: NotificationCenter },
	{ name: "Save to collection", Screen: SaveSheet },
	{ name: "Remove dialog", Screen: RemoveDialog },
	{ name: "Success", Screen: Success },
	{ name: "Error", Screen: ErrorState },
	{ name: "Loading", Screen: Loading },
];

export function IndexApp() {
	return screens.map(({ name, Screen, grouped }, i) => (
		<DeviceFrame
			key={name}
			label={name}
			caption={`${String(i + 1).padStart(2, "0")} · ${name}`}
			grouped={grouped}
		>
			<Screen />
		</DeviceFrame>
	));
}
