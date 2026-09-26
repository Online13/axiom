import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Item } from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";

export type SettingsItemTrailing = "chevron" | "switch";

export type SettingsItemProps = {
	title: string;
	description?: string;
	icon?: IconName;
	/** Current value, before the chevron: "English", "On". */
	value?: string;
	/** `chevron` for a row that opens a screen, `switch` for a setting toggled in place. */
	trailing?: SettingsItemTrailing;
	/** State of the switch. Without it, the switch manages its own. */
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	/** With a switch, replaces the toggle on row press. */
	onPress?: () => void;
	disabled?: boolean;
};

export function SettingsItem({
	title,
	description,
	icon,
	value,
	trailing = "chevron",
	checked,
	onCheckedChange,
	onPress,
	disabled = false,
}: SettingsItemProps) {
	const isSwitch = trailing === "switch";
	const [on, setOn] = useControllableState({
		value: checked,
		defaultValue: false,
		onChange: onCheckedChange,
	});

	return (
		<Item
			disabled={disabled}
			// A switch row toggles from anywhere on the row, like iOS settings.
			onPress={onPress ?? (isSwitch ? () => setOn(!on) : undefined)}
			haptic={isSwitch && !onPress ? "light" : undefined}
			accessibilityRole={isSwitch ? "switch" : undefined}
			accessibilityState={isSwitch ? { checked: on } : undefined}
			accessibilityLabel={description ? `${title}, ${description}` : title}
		>
			{icon ? (
				<Item.Leading>
					<Icon name={icon} color={disabled ? "disabled" : "muted"} />
				</Item.Leading>
			) : null}
			<Item.Content>
				<Item.Title>{title}</Item.Title>
				{description ? (
					<Item.Description numberOfLines={2}>
						{description}
					</Item.Description>
				) : null}
			</Item.Content>
			<Item.Trailing>
				{value !== undefined ? (
					<Text color={disabled ? "disabled" : "muted"} numberOfLines={1}>
						{value}
					</Text>
				) : null}
				{isSwitch ? (
					// The row carries the switch role and state: the switch itself is hidden from screen readers.
					<View
						accessibilityElementsHidden
						importantForAccessibility="no-hide-descendants"
					>
						<Switch
							value={on}
							onValueChange={setOn}
							disabled={disabled}
						/>
					</View>
				) : (
					<Icon name="chevron-right" size="sm" color="subtle" />
				)}
			</Item.Trailing>
		</Item>
	);
}
