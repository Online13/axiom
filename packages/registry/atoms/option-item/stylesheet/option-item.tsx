import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Item, type ItemProps } from "@/components/ui/item";
import { Text } from "@/components/ui/text";
import { useTheme, type Hue } from "@/theme";

export type OptionItemProps = Omit<
	ItemProps,
	"children" | "selected" | "asChild" | "onPress"
> & {
	label: string;
	description?: string;
	/** A name renders the icon on a colored tile, like iOS settings. */
	icon?: IconName;
	/** Tile color from the palette. */
	iconColor?: Hue;
	/** Announced to screen readers. What shows it on screen is yours: a check in `trailing`, a radio in `leading`. */
	selected?: boolean;
	/** Before the icon: a RadioIndicator or a CheckboxIndicator for a list of choices. */
	leading?: ReactNode;
	/** Current value on the right, for rows that open a picker. */
	value?: ReactNode;
	/** After the value: a check, a chevron, a Switch, a Badge. */
	trailing?: ReactNode;
	destructive?: boolean;
	onPress?: ItemProps["onPress"];
};

const TILE = 30;

export function OptionItem({
	label,
	description,
	icon,
	iconColor = "gray",
	selected = false,
	leading,
	value,
	trailing,
	destructive = false,
	disabled = false,
	onPress,
	...props
}: OptionItemProps) {
	const { tokens } = useTheme();

	const tile = icon ? (
		<View
			style={[
				styles.tile,
				{
					borderRadius: tokens.radius.sm,
					backgroundColor: tokens.palette[iconColor][500],
				},
			]}
		>
			<Icon name={icon} size={18} color={tokens.palette.gray[50]} />
		</View>
	) : null;

	const hasLeading = leading !== undefined || tile !== null;
	const hasTrailing = trailing !== undefined || value !== undefined;

	return (
		<Item
			disabled={disabled}
			onPress={onPress}
			// What you put in `leading` or `trailing` shows the selection: the row itself isn't tinted.
			// A radio or checkbox list passes its own role and `{ checked }` state.
			accessibilityState={{ selected }}
			accessibilityLabel={description ? `${label}, ${description}` : label}
			{...props}
		>
			{hasLeading ? (
				<Item.Leading style={{ gap: tokens.spacing[3] }}>
					{leading}
					{tile}
				</Item.Leading>
			) : null}
			<Item.Content>
				<Text
					numberOfLines={1}
					color={disabled ? "disabled" : destructive ? "error" : "default"}
				>
					{label}
				</Text>
				{description ? (
					<Item.Description>{description}</Item.Description>
				) : null}
			</Item.Content>
			{hasTrailing ? (
				<Item.Trailing>
					{typeof value === "string" || typeof value === "number" ? (
						<Text
							color={disabled ? "disabled" : "muted"}
							numberOfLines={1}
						>
							{value}
						</Text>
					) : (
						value
					)}
					{trailing}
				</Item.Trailing>
			) : null}
		</Item>
	);
}

const styles = StyleSheet.create({
	tile: {
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
	},
});
