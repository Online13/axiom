import { Image, View, type ImageSourcePropType } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import type { IconName } from "@/components/ui/icons";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";

export type SearchResultAction = {
	icon: IconName;
	/** Read by screen readers, with the title: "Add, Blue Monday". */
	label: string;
	onPress: () => void;
};

export type SearchResultItemProps = {
	title: string;
	/** What the user typed. Its first match in the title is drawn in bold. */
	query?: string;
	subtitle?: string;
	/** Third line, smaller: "Playlist · 42 songs". */
	meta?: string;
	image?: ImageSourcePropType;
	/** `circle` for people and artists. */
	imageShape?: "square" | "circle";
	/** On a tile, when there is no image: a page, a setting, a recent search. */
	icon?: IconName;
	/** A button at the end of the row. Without it, a pressable row ends with a chevron. */
	action?: SearchResultAction;
	onPress?: () => void;
	disabled?: boolean;
};

const THUMB = 44;

/** Splits `text` around the first case-insensitive match of `query`. */
export function splitMatch(text: string, query?: string) {
	const needle = query?.trim().toLowerCase();
	const start = needle ? text.toLowerCase().indexOf(needle) : -1;
	if (!needle || start < 0) return null;
	const end = start + needle.length;
	return {
		before: text.slice(0, start),
		match: text.slice(start, end),
		after: text.slice(end),
	};
}

export function SearchResultItem({
	title,
	query,
	subtitle,
	meta,
	image,
	imageShape = "square",
	icon,
	action,
	onPress,
	disabled = false,
}: SearchResultItemProps) {
	const parts = splitMatch(title, query);

	return (
		<Item
			onPress={onPress}
			disabled={disabled}
			size={meta ? "lg" : "md"}
			accessibilityLabel={[title, subtitle, meta].filter(Boolean).join(", ")}
		>
			{image ? (
				<Item.Leading>
					<Image source={image} style={styles.thumb(imageShape)} />
				</Item.Leading>
			) : icon ? (
				<Item.Leading>
					<View style={[styles.thumb(imageShape), styles.tile]}>
						<Icon name={icon} color={disabled ? "disabled" : "muted"} />
					</View>
				</Item.Leading>
			) : null}
			<Item.Content>
				<Text numberOfLines={1} color={disabled ? "disabled" : "default"}>
					{parts ? (
						<>
							{parts.before}
							<Text weight="bold" color={disabled ? "disabled" : "default"}>
								{parts.match}
							</Text>
							{parts.after}
						</>
					) : (
						title
					)}
				</Text>
				{subtitle ? <Item.Description>{subtitle}</Item.Description> : null}
				{meta ? (
					<Text variant="caption" color={disabled ? "disabled" : "subtle"} numberOfLines={1}>
						{meta}
					</Text>
				) : null}
			</Item.Content>
			{action ? (
				<Item.Trailing>
					<IconButton
						icon={action.icon}
						size="sm"
						variant="tinted"
						onPress={action.onPress}
						disabled={disabled}
						accessibilityLabel={`${action.label}, ${title}`}
					/>
				</Item.Trailing>
			) : onPress ? (
				<Item.Trailing>
					<Icon name="chevron-right" size="sm" color="subtle" />
				</Item.Trailing>
			) : null}
		</Item>
	);
}

const styles = StyleSheet.create((theme) => ({
	thumb: (shape: "square" | "circle") => ({
		width: THUMB,
		height: THUMB,
		borderRadius:
			shape === "circle" ? theme.tokens.radius.full : theme.tokens.radius.sm,
	}),
	tile: {
		backgroundColor: theme.colors.background.subtle,
		alignItems: "center",
		justifyContent: "center",
	},
}));
