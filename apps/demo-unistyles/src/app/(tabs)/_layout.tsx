import { router, usePathname, type Href } from "expo-router";
import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { StyleSheet } from "react-native-unistyles";

import { BottomTabBar } from "@/components/ui/bottom-tab-bar";
import type { IconName } from "@/components/ui/icon";

type Destination = {
	name: string;
	href: string;
	label: string;
	icon: IconName;
};

const DESTINATIONS: Destination[] = [
	{ name: "components", href: "/", label: "Components", icon: "file" },
	{
		name: "experience",
		href: "/experience",
		label: "Experience",
		icon: "favorite",
	},
	{ name: "about", href: "/about", label: "About", icon: "info" },
];

/** The bar is ours: the navigator only keeps the routes, the look and the press come from BottomTabBar. */
function AppTabBar() {
	const pathname = usePathname();
	const active = DESTINATIONS.find(
		(destination) =>
			destination.href !== "/" && pathname.startsWith(destination.href),
	);

	return (
		<BottomTabBar
			// The demo screens sit on `subtle`: the bars take that background instead of the darker default.
			style={styles.bar}
			value={active?.name ?? "components"}
			onValueChange={(name) => {
				const destination = DESTINATIONS.find((item) => item.name === name);
				if (destination) router.navigate(destination.href as Href);
			}}
		>
			{DESTINATIONS.map((destination) => (
				<BottomTabBar.Item
					key={destination.name}
					value={destination.name}
					label={destination.label}
					icon={destination.icon}
				/>
			))}
		</BottomTabBar>
	);
}

export default function TabsLayout() {
	return (
		<Tabs style={styles.root}>
			<TabSlot />
			<AppTabBar />
			{/* Configuration only: the visible bar is `AppTabBar` above. */}
			<TabList style={styles.hidden}>
				{DESTINATIONS.map((destination) => (
					<TabTrigger
						key={destination.name}
						name={destination.name}
						href={destination.href as Href}
					/>
				))}
			</TabList>
		</Tabs>
	);
}

const styles = StyleSheet.create((theme) => ({
	root: { flex: 1 },
	hidden: { display: "none" },
	bar: { backgroundColor: theme.colors.background.subtle },
}));
