import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { CheckboxIndicator } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Item, type ItemProps } from "@/components/ui/item";
import { RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import type { Hue } from "@/theme";

export type OptionItemIndicator = "check" | "radio" | "checkbox" | "none";

export type OptionItemProps = Pick<
	ItemProps,
	"size" | "divider" | "disabled" | "style" | "onLongPress"
> & {
	label: string;
	description?: string;
	/** A name renders the icon on a colored tile, like iOS settings. */
	icon?: IconName;
	/** Tile color from the palette. */
	iconColor?: Hue;
	selected?: boolean;
	/** How `selected` is drawn: a trailing check, a leading radio or a leading checkbox. */
	indicator?: OptionItemIndicator;
	/** Current value on the right, for rows that open a picker. */
	value?: ReactNode;
	/** Replaces the indicator: a Switch, a Badge… */
	trailing?: ReactNode;
	/** Adds a chevron, for rows that navigate. */
	chevron?: boolean;
	destructive?: boolean;
	onPress?: () => void;
};

const TILE = 30;

// The tile icon takes a raw palette color as a prop, not as a style. Wrapped once, here, so the
// instance only has to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function OptionItem({
	label,
	description,
	icon,
	iconColor = "gray",
	selected = false,
	indicator = "check",
	value,
	trailing,
	chevron = false,
	destructive = false,
	disabled = false,
	onPress,
	...props
}: OptionItemProps) {
	const leadingIndicator =
		indicator === "radio" ? (
			<RadioIndicator checked={selected} disabled={disabled} />
		) : indicator === "checkbox" ? (
			<CheckboxIndicator checked={selected} disabled={disabled} />
		) : null;

	const tile = icon ? (
		<View style={styles.tile(iconColor)}>
			<ThemedIcon
				name={icon}
				size={18}
				uniProps={(theme) => ({ color: theme.tokens.palette.gray[50] })}
			/>
		</View>
	) : null;

	const hasLeading = leadingIndicator !== null || tile !== null;
	const hasTrailing =
		trailing !== undefined ||
		value !== undefined ||
		chevron ||
		(selected && indicator === "check");

	return (
		<Item
			{...props}
			disabled={disabled}
			onPress={onPress}
			// The indicator shows the selection: the row itself isn't tinted.
			accessibilityRole={
				indicator === "radio"
					? "radio"
					: indicator === "checkbox"
						? "checkbox"
						: undefined
			}
			accessibilityState={
				indicator === "radio" || indicator === "checkbox"
					? { checked: selected }
					: { selected }
			}
			accessibilityLabel={description ? `${label}, ${description}` : label}
		>
			{hasLeading ? (
				<Item.Leading style={styles.leading}>
					{leadingIndicator}
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
					{trailing ??
						(selected && indicator === "check" ? (
							<Icon
								name="check"
								color={disabled ? "disabled" : "link"}
							/>
						) : null)}
					{chevron ? (
						<Icon name="chevron-right" size="sm" color="subtle" />
					) : null}
				</Item.Trailing>
			) : null}
		</Item>
	);
}

const styles = StyleSheet.create((theme) => ({
	tile: (hue: Hue) => ({
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.tokens.radius.sm,
		backgroundColor: theme.tokens.palette[hue][500],
	}),
	leading: {
		gap: theme.tokens.spacing[3],
	},
}));
