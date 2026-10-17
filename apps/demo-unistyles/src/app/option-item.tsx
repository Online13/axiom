import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { CheckboxIndicator } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { OptionItem } from "@/components/ui/option-item";
import { RadioIndicator } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

function Surface({ children }: { children: React.ReactNode }) {
	return (
		<View style={styles.surface}>
			{children}
		</View>
	);
}

export default function OptionItemScreen() {
	const [language, setLanguage] = useState("en");
	const [wifi, setWifi] = useState(true);
	const [notify, setNotify] = useState<Set<string>>(new Set(["mentions"]));

	return (
		<Screen>
			<Section title="OptionItem" description={`Language: ${language}`}>
				<Surface>
					{[
						["en", "English"],
						["fr", "Français"],
						["mg", "Malagasy"],
					].map(([value, label]) => (
						<OptionItem
							key={value}
							label={label}
							selected={language === value}
							divider
							onPress={() => setLanguage(value)}
							trailing={language === value ? <Icon name="check" color="link" /> : null}
						/>
					))}
				</Surface>
				<Surface>
					<OptionItem
						label="Wi-Fi"
						icon="settings"
						iconColor="blue"
						trailing={
							<Switch
								value={wifi}
								onValueChange={setWifi}
								accessibilityLabel="Wi-Fi"
							/>
						}
						divider="inset"
					/>
					<OptionItem
						label="Notifications"
						icon="warning"
						iconColor="red"
						value="Mentions"
						divider="inset"
						onPress={() => {}}
						trailing={<Icon name="chevron-right" size="sm" color="subtle" />}
					/>
					<OptionItem
						label="Favorites"
						icon="favorite"
						iconColor="pink"
						onPress={() => {}}
						trailing={<Icon name="chevron-right" size="sm" color="subtle" />}
					/>
				</Surface>
				<Surface>
					{["all", "mentions", "none"].map((value) => (
						<OptionItem
							key={value}
							label={
								value === "all"
									? "All messages"
									: value === "mentions"
										? "Mentions only"
										: "Nothing"
							}
							divider
							onPress={() =>
								setNotify((previous) => {
									const next = new Set(previous);
									if (next.has(value)) next.delete(value);
									else next.add(value);
									return next;
								})
							}
							leading={<CheckboxIndicator checked={notify.has(value)} />}
							accessibilityRole="checkbox"
							accessibilityState={{ checked: notify.has(value) }}
						/>
					))}
					<OptionItem
						label="Radio indicator"
						description="With a description"
						divider
						onPress={() => {}}
						leading={<RadioIndicator checked />}
						accessibilityRole="radio"
						accessibilityState={{ checked: true }}
					/>
					<OptionItem label="Sign out" destructive onPress={() => {}} />
				</Surface>
			</Section>
		</Screen>
	);
}

const styles = StyleSheet.create((theme) => ({
	surface: {
		overflow: "hidden",
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
}));
