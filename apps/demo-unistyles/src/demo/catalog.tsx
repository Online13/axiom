import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";

/** A titled card of rows, the shape both catalogue tabs use. */
export function CatalogGroup({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<View style={styles.group}>
			<Text
				variant="footnote"
				color="muted"
				weight="semibold"
				style={styles.groupTitle}
			>
				{title.toUpperCase()}
			</Text>
			<View style={styles.panel}>{children}</View>
		</View>
	);
}

export type CatalogRowProps = {
	href: string;
	title: string;
	description: string;
	/** Short status next to the title, such as `Spec`. */
	badge?: string;
	/** `false` on the last row of a group. */
	divider?: boolean;
};

export function CatalogRow({
	href,
	title,
	description,
	badge,
	divider = true,
}: CatalogRowProps) {
	return (
		<Item
			accessibilityRole="link"
			accessibilityLabel={`${title}. ${description}`}
			size="lg"
			divider={divider}
			align="center"
			onPress={() => router.push(href as Href)}
		>
			<Item.Content>
				<View style={styles.titleRow}>
					<Item.Title>{title}</Item.Title>
					{badge ? <Badge size="sm">{badge}</Badge> : null}
				</View>
				<Item.Description numberOfLines={2}>{description}</Item.Description>
			</Item.Content>
			<Item.Trailing>
				<Icon name="chevron-right" size="sm" color="muted" />
			</Item.Trailing>
		</Item>
	);
}

const styles = StyleSheet.create((theme) => ({
	group: { gap: theme.tokens.spacing[2] },
	groupTitle: { paddingHorizontal: theme.tokens.spacing[4] },
	panel: {
		overflow: "hidden",
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
}));
